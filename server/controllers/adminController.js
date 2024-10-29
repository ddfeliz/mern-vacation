const Administrateur = require('../models/adminModel'); // Import du modèle Administrateur
const bcrypt = require('bcryptjs'); // Pour le hachage de mot de passe
const jwt = require('jsonwebtoken'); // Pour la gestion des tokens JWT
const CreateError = require('../utils/appError'); // Import de la fonction CreateError

// Variables de configuration
const SALT_ROUNDS = 10; // Nombre de tours pour le sel bcrypt
const JWT_SECRET = process.env.JWT_SECRET; // Clé secrète pour JWT (à définir dans .env)

// Fonction pour ajouter un nouvel administrateur
exports.addAdministrateur = async (req, res, next) => {
    try {
        const { nom, prenom, email, telephone, motDePasse, adresse, dateDeNaissance } = req.body;

        console.log("Request body: ", req.body); // Affiche le corps de la requête

        // Vérifier que les champs obligatoires sont fournis
        if (!nom || !prenom || !email || !telephone || !motDePasse) {
            console.error("Champs obligatoires manquants");
            return next(new CreateError(400, 'Tous les champs obligatoires doivent être fournis.'));
        }

        // Vérifier si un administrateur avec cet email existe déjà
        const adminExist = await Administrateur.findOne({ email });
        if (adminExist) {
            console.error("Administrateur existe déjà avec cet email");
            return next(new CreateError(409, 'Un administrateur avec cet email existe déjà.'));
        }

        // Hacher le mot de passe avant de sauvegarder
        console.log("Hachage du mot de passe");
        const hashedPassword = await bcrypt.hash(motDePasse, SALT_ROUNDS);
        console.log("Mot de passe haché: ", hashedPassword);

        // Créer un nouvel administrateur avec les informations fournies
        const newAdmin = new Administrateur({
            nom,
            prenom,
            email,
            telephone,
            motDePasse: hashedPassword, // Enregistrer le mot de passe haché
            adresse,
            dateDeNaissance,
            idAdmin: `ADM-${Math.floor(1000 + Math.random() * 9000)}` // Générer un identifiant unique// idAdmin sera généré par le middleware
        });

        console.log("Enregistrement de l'administrateur");
        // Enregistrer l'administrateur dans la base de données
        await newAdmin.save();

        res.status(201).json({
            message: 'Administrateur ajouté avec succès.',
            administrateur: {
                idAdmin: newAdmin.idAdmin, // idAdmin est généré par le modèle
                nom: newAdmin.nom,
                prenom: newAdmin.prenom,
                email: newAdmin.email,
                telephone: newAdmin.telephone,
                adresse: newAdmin.adresse,
                dateDeNaissance: newAdmin.dateDeNaissance
            }
        });
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'administrateur: ", error);
        next(new CreateError(500, 'Erreur lors de l\'ajout de l\'administrateur.', error));
    }
};


// Fonction pour se connecter en tant qu'administrateur
exports.loginAdministrateur = async (req, res, next) => {
    try {
        const { email, motDePasse } = req.body;

        // Vérifier que les informations de connexion sont fournies
        if (!email || !motDePasse) {
            return next(new CreateError(400, 'L\'email et le mot de passe sont requis.'));
        }

        // Chercher l'administrateur avec l'email fourni
        const admin = await Administrateur.findOne({ email });
        if (!admin) {
            return next(new CreateError(404, 'L\'administrateur n\'existe pas.'));
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(motDePasse, admin.motDePasse);
        if (!isMatch) {
            return next(new CreateError(401, 'Mot de passe incorrect.'));
        }

        // Générer un token JWT pour l'administrateur
        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            JWT_SECRET,
            { expiresIn: '1h' } // Le token expirera dans 1 heure
        );

        res.status(200).json({
            message: 'Connexion réussie.',
            token,
            administrateur: {
                idAdmin: admin.idAdmin, // Récupérer l'idAdmin
                nom: admin.nom,
                prenom: admin.prenom,
                email: admin.email
            }
        });
    } catch (error) {
        next(new CreateError(500, 'Erreur lors de la connexion de l\'administrateur.', error));
    }
};

// Fonction pour récupérer le profil de l'administrateur connecté
exports.getAdminProfile = async (req, res, next) => {
    try {
        // Récupérer le token JWT depuis l'en-tête Authorization
        const token = req.headers.authorization?.split(' ')[1]; // Le token est sous la forme "Bearer TOKEN"

        if (!token) {
            return next(new CreateError(401, 'Token manquant.'));
        }

        // Vérifier et décoder le token avec la clé secrète
        jwt.verify(token, JWT_SECRET, async (err, decoded) => {
            if (err) {
                return next(new CreateError(401, 'Token invalide ou expiré.'));
            }

            // Récupérer l'admin correspondant à l'ID décodé
            const admin = await Administrateur.findById(decoded.id);

            if (!admin) {
                return next(new CreateError(404, 'Administrateur non trouvé.'));
            }

            // Renvoyer les informations de l'administrateur
            res.status(200).json({
                idAdmin: admin.idAdmin,
                nom: admin.nom,
                prenom: admin.prenom,
                email: admin.email,
                telephone: admin.telephone,
                adresse: admin.adresse,
                dateDeNaissance: admin.dateDeNaissance,
                role: admin.role
            });
        });
    } catch (error) {
        next(new CreateError(500, 'Erreur lors de la récupération du profil de l\'administrateur.', error));
    }
};


// Fonction pour obtenir la liste de tous les administrateurs
exports.getAllAdministrateurs = async (req, res, next) => {
    try {
        // Chercher tous les administrateurs dans la base de données
        const administrateurs = await Administrateur.find();

        // Vérifier si des administrateurs existent
        if (!administrateurs || administrateurs.length === 0) {
            return next(new CreateError(404, 'Aucun administrateur trouvé.'));
        }

        res.status(200).json(administrateurs);
    } catch (error) {
        next(new CreateError(500, 'Erreur lors de la récupération de la liste des administrateurs.', error));
    }
};

// Fonction pour obtenir les informations d'un administrateur par son identifiant
exports.getAdministrateurById = async (req, res, next) => {
    try {
        const { idAdmin } = req.params;

        // Rechercher l'administrateur par son idAdmin
        const administrateur = await Administrateur.findOne({ idAdmin });
        if (!administrateur) {
            return next(new CreateError(404, 'Administrateur non trouvé.'));
        }

        res.status(200).json(administrateur);
    } catch (error) {
        next(new CreateError(500, 'Erreur lors de la récupération de l\'administrateur.', error));
    }
};

// Fonction pour mettre à jour les informations d'un administrateur
exports.updateAdministrateur = async (req, res, next) => {
    try {
        const { idAdmin } = req.params;
        const updates = req.body;

        // Trouver l'administrateur et mettre à jour ses informations
        const administrateur = await Administrateur.findOneAndUpdate(
            { idAdmin },
            updates,
            { new: true, runValidators: true }
        );
        if (!administrateur) {
            return next(new CreateError(404, 'Administrateur non trouvé.'));
        }

        res.status(200).json({
            message: 'Administrateur mis à jour avec succès.',
            administrateur
        });
    } catch (error) {
        next(new CreateError(500, 'Erreur lors de la mise à jour de l\'administrateur.', error));
    }
};

// Fonction pour supprimer un administrateur par son identifiant
exports.deleteAdministrateur = async (req, res, next) => {
    try {
        const { idAdmin } = req.params;

        // Supprimer l'administrateur de la base de données
        const administrateur = await Administrateur.findOneAndDelete({ idAdmin });
        if (!administrateur) {
            return next(new CreateError(404, 'Administrateur non trouvé.'));
        }

        res.status(200).json({
            message: 'Administrateur supprimé avec succès.'
        });
    } catch (error) {
        next(new CreateError(500, 'Erreur lors de la suppression de l\'administrateur.', error));
    }
};
