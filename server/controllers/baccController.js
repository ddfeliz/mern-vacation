const Bacc = require('../models/baccModel');
const CreateError = require('../utils/appError'); // Assurez-vous que l'import est correct


// Fonction pour ajouter une ou plusieurs matières baccalauréat
exports.createBacc = async (req, res, next) => {
    try {
        let matières = req.body; // Récupérer les données

        // Si ce n'est pas un tableau, le convertir en tableau contenant un seul objet
        if (!Array.isArray(matières)) {
            matières = [matières];
        }

        // Vérifier que le tableau de matières n'est pas vide
        if (matières.length === 0) {
            return next(new CreateError(400, 'Un tableau de matières doit être fourni.'));
        }

        const addedMatieres = [];

        for (const matière of matières) {
            const {
                libelleSpecialite,
                libelleSecteur,
                codeSerieOption,
                libelleCourt,
                libelleOption,
                libCourtMatiere,
                nomMatiere
            } = matière;

            // Vérifier que les champs obligatoires sont fournis
            if (!libelleSpecialite ||
                !libelleSecteur ||
                !codeSerieOption ||
                !libelleCourt ||
                !libelleOption ||
                !libCourtMatiere ||
                !nomMatiere) {
                return next(new CreateError(400, 'Tous les champs obligatoires doivent être fournis pour chaque matière.'));
            }

            // Vérifier si un matière baccalauréat avec cet code et nom de matière existe déjà
            const matiereBaccExist = await Bacc.findOne({ codeSerieOption, nomMatiere });
            if (matiereBaccExist) {
                return next(new CreateError(409, `Un matière baccalauréat avec le code ${codeSerieOption} et le nom ${nomMatiere} existe déjà.`));
            }

            // Créer un nouvel objet matière baccalauréat avec les informations fournies
            const newBacc = new Bacc({
                libelleSpecialite,
                libelleSecteur,
                codeSerieOption,
                libelleCourt,
                libelleOption,
                libCourtMatiere,
                nomMatiere,
                idMatiere: `LBMAT-${Math.floor(1000 + Math.random() * 9000)}` // Générer un identifiant unique
            });

            // Enregistrer le matière baccalauréat dans la base de données
            await newBacc.save();
            addedMatieres.push(newBacc); // Ajouter à la liste des matières ajoutées
        }

        res.status(201).json({
            message: 'Matières baccalauréat ajoutées avec succès.',
            matieres: addedMatieres.map(matiere => ({
                idMatiere: matiere.idMatiere,
                libelleSpecialite: matiere.libelleSpecialite,
                libelleSecteur: matiere.libelleSecteur,
                codeSerieOption: matiere.codeSerieOption,
                libelleCourt: matiere.libelleCourt,
                libelleOption: matiere.libelleOption,
                libCourtMatiere: matiere.libCourtMatiere,
                nomMatiere: matiere.nomMatiere
            }))
        });
    } catch (error) {
        console.error(error);
        next(new CreateError(500, 'Erreur lors de l\'ajout des matières baccalauréat.', error));
    }
};


// Fonction pour obtenir la liste de tous les matière baccalauréat
exports.getAllPBaccs = async (req, res, next) => {
    try {
        // Chercher tous les matière baccalauréat dans la base de données
        const baccs = await Bacc.find();

        // Vérifier si des matières existent
        if (!baccs || baccs.length === 0) {
            return next(new CreateError(404, 'Aucun matière baccalauréat trouvé.'));
        }

        res.status(200).json(baccs);
    } catch (error) {
        next(new CreateError(500, 'Erreur lors de la récupération de la liste des matières baccalauréats.', error));
    }
};

// Fonction pour obtenir les informations d'un matière baccalauréat par son identifiant
exports.getBaccById = async (req, res, next) => {
    try {
        const { idMatiere } = req.params;

        // Rechercher le matière par son idPersonnel
        const matiere = await Bacc.findOne({ idMatiere });
        if (!matiere) {
            return next(new CreateError(404, 'Matière baccalauréat non trouvé.'));
        }

        res.status(200).json(matiere);
    } catch (error) {
        next(new CreateError(500, 'Erreur lors de la récupération du matière baccalauréat.', error));
    }
};

// Fonction pour mettre à jour les informations d'un matière baccalauréat
exports.updateBacc = async (req, res, next) => {
    try {
        const { idMatiere } = req.params;
        const updates = req.body;

        // Trouver le matière baccalauréat et mettre à jour ses informations
        const matiere = await Bacc.findOneAndUpdate(
            { idMatiere },
            updates,
            { new: true, runValidators: true }
        );
        if (!matiere) {
            return next(new CreateError(404, 'Matière baccalauréat non trouvé.'));
        }

        res.status(200).json({
            message: 'Matière baccalauréat mis à jour avec succès.',
            matiere
        });
    } catch (error) {
        next(new CreateError(500, 'Erreur lors de la mise à jour du matière baccalauréat.', error));
    }
};

// Fonction pour supprimer un matière baccalauréat par son identifiant
exports.deleteBacc = async (req, res, next) => {
    try {
        const { idMatiere } = req.params;

        // Supprimer le matière baccalauréat de la base de données
        const matiere = await Bacc.findOneAndDelete({ idMatiere });
        if (!matiere) {
            return next(new CreateError(404, 'Matière baccalauréat non trouvé.'));
        }

        res.status(200).json({
            message: 'Matière baccalauréat supprimé avec succès.'
        });
    } catch (error) {
        next(new CreateError(500, 'Erreur lors de la suppression du matière baccalauréat.', error));
    }
};

// Fonction pour récupérer les spécialités
exports.getLibelleSpecialite = async (req, res, next) => {
    try {
        // Récupère toutes les spécialités distinctes depuis la collection Bacc
        const specialites = await Bacc.distinct('libelleSpecialite');

        res.status(200).json({
            message: 'Spécialités récupérées avec succès.',
            specialites
        });
    } catch (err) {
        next(new CreateError(500, 'Erreur lors de la récupération des spécialités', err));
    }
};


// Récupérer les secteurs basés sur la spécialité choisie
exports.getSecteurs = async (req, res, next) => {
    const { specialite } = req.query;

    if (!specialite) {
        return res.status(400).json({ message: 'Spécialité non fournie.' });
    }

    try {
        // Rechercher tous les secteurs uniques correspondant à la spécialité
        const secteurs = await Bacc.find({ libelleSpecialite: specialite }).distinct('libelleSecteur');
        res.status(200).json({
            message: `Secteurs pour la spécialité ${specialite} récupérés avec succès.`,
            secteurs
        });
    } catch (err) {
        next(new CreateError(500, 'Erreur lors de la récupération des spécialités', err));
    }
};

// Récupérer les options basées sur le secteur choisi
exports.getLibelleOption = async (req, res, next) => {
    const { secteur } = req.query;

    if (!secteur) {
        return res.status(400).json({ message: 'Secteur non fourni.' });
    }

    try {
        // Rechercher toutes les matières uniques correspondant au secteur
        const options = await Bacc.find({ libelleSecteur: secteur }).distinct('libelleOption');
        res.status(200).json({
            message: `Matières pour le secteur ${secteur} récupérées avec succès.`,
            options
        });
    } catch (err) {
        next(new CreateError(500, 'Erreur lors de la récupération des spécialités', err));
    }
};


// Récupérer les matières basées sur l'option choisi
exports.getMatieres = async (req, res, next) => {
    const { option } = req.query;

    if (!option) {
        return res.status(400).json({ message: 'Secteur non fourni.' });
    }

    try {
        // Rechercher toutes les matières uniques correspondant au secteur
        const matieres = await Bacc.find({ libelleOption: option }).distinct('nomMatiere');
        res.status(200).json({
            message: `Matières pour le secteur ${option} récupérées avec succès.`,
            matieres
        });
    } catch (err) {
        next(new CreateError(500, 'Erreur lors de la récupération des spécialités', err));
    }
};



