const Utilisateur = require("../modelisation/utilisateur");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const CreateError = require("../utils/appError");
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

exports.ajoutUtilisateur = async (req, res, next) => {
  try {
    const {
      nom,
      prenom,
      email,
      telephone,
      motDePasse,
      adresse,
      dateDeNaissance,
    } = req.body;

    console.log("Request body: ", req.body);

    if (!nom || !prenom || !email || !telephone || !motDePasse) {
      console.error("Champs obligatoires manquants");
      return next(
        new CreateError(
          400,
          "Tous les champs obligatoires doivent être fournis."
        )
      );
    }

    const adminExist = await Utilisateur.findOne({ email });
    if (adminExist) {
      console.error("Utilisateur existe déjà avec cet email");
      return next(
        new CreateError(409, "Un utilisateur avec cet email existe déjà.")
      );
    }

    console.log("Hachage du mot de passe");
    const hashedPassword = await bcrypt.hash(motDePasse, SALT_ROUNDS);
    console.log("Mot de passe haché: ", hashedPassword);

    const newUtilisateur = new Utilisateur({
      nom,
      prenom,
      email,
      telephone,
      motDePasse: hashedPassword,
      adresse,
      dateDeNaissance,
      idUtilisateur: `UTIL-${Math.floor(1000 + Math.random() * 9000)}`,
    });

    console.log("Enregistrement de l'utilisateur");

    await newUtilisateur.save();

    res.status(201).json({
      message: "Utilisateur ajouté avec succès.",
      utilisateur: {
        idUtilisateur: newUtilisateur.idUtilisateur,
        nom: newUtilisateur.nom,
        prenom: newUtilisateur.prenom,
        email: newUtilisateur.email,
        telephone: newUtilisateur.telephone,
        adresse: newUtilisateur.adresse,
        dateDeNaissance: newUtilisateur.dateDeNaissance,
        statut: newUtilisateur.statut
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur: ", error);
    next(
      new CreateError(500, "Erreur lors de l'ajout de l'utilisateur.", error)
    );
  }
};

exports.connexionUtilisateur = async (req, res, next) => {
  try {
    const { email, motDePasse } = req.body;

    if (!email || !motDePasse) {
      return next(
        new CreateError(400, "L'email et le mot de passe sont requis.")
      );
    }

    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) {
      return next(new CreateError(404, "L'utilisateur n'existe pas."));
    }

    const isMatch = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    if (!isMatch) {
      return next(new CreateError(401, "Mot de passe incorrect."));
    }

    const token = jwt.sign(
      { idUtilisateur: utilisateur.idUtilisateur },
      JWT_SECRET,
      { expiresIn: "98d" }
    );

    res.status(200).json({
      message: "Connexion réussie.",
      token,
      utilisateur: {
        idUtilisateur: utilisateur.idUtilisateur,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
      },
    });
  } catch (error) {
    next(
      new CreateError(
        500,
        "Erreur lors de la connexion de l'idUtilisateur.",
        error
      )
    );
  }
};


exports.avoirUtilisateurProfile = async (req, res, next) => {
  try {
    // Vérification du header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(new CreateError(401, "Authorization header manquant."));
    }

    // Extraction du token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(new CreateError(401, "Token manquant."));
    }

    // Vérification du token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return next(new CreateError(401, "Token invalide ou expiré."));
    }

    // Recherche de l'utilisateur par idUtilisateur
    const utilisateur = await Utilisateur.findOne({ idUtilisateur: decoded.idUtilisateur });
    if (!utilisateur) {
      return next(new CreateError(404, "Utilisateur non trouvé."));
    }

    // Réponse avec les données utilisateur
    res.status(200).json({
      idUtilisateur: utilisateur.idUtilisateur,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      email: utilisateur.email,
      telephone: utilisateur.telephone,
      adresse: utilisateur.adresse,
      dateDeNaissance: utilisateur.dateDeNaissance,
    });
  } catch (error) {
    // Gestion globale des erreurs
    next(
      new CreateError(
        500,
        "Erreur lors de la récupération du profil de l'utilisateur."
      )
    );
  }
};

exports.avoirTousUtilisateurs = async (req, res, next) => {
  try {
    const utilisateurs = await Utilisateur.find();

    if (!utilisateurs || utilisateurs.length === 0) {
      return next(new CreateError(404, "Aucun administrateur trouvé."));
    }

    res.status(200).json(utilisateurs);
  } catch (error) {
    next(
      new CreateError(
        500,
        "Erreur lors de la récupération de la liste des utilisateurs.",
        error
      )
    );
  }
};

exports.avoirIdUtilisateur = async (req, res, next) => {
  try {
    const { idUtilisateur } = req.params;

    const utilisateur = await Utilisateur.findOne({ idAdmin });
    if (!utilisateur) {
      return next(new CreateError(404, "Utilisateur non trouvé."));
    }

    res.status(200).json(utilisateur);
  } catch (error) {
    next(
      new CreateError(
        500,
        "Erreur lors de la récupération de l'utilisateur.",
        error
      )
    );
  }
};

exports.modificationUtilisateur = async (req, res, next) => {
  try {
    const { idUtilisateur } = req.params;
    const updates = req.body;

    // Trouver l'administrateur et mettre à jour ses informations
    const utilisateur = await Utilisateur.findOneAndUpdate(
      { idUtilisateur },
      updates,
      { new: true, runValidators: true }
    );
    if (!utilisateur) {
      return next(new CreateError(404, "Administrateur non trouvé."));
    }

    res.status(200).json({
      message: "Utilisateur mis à jour avec succès.",
      utilisateur,
    });
  } catch (error) {
    next(
      new CreateError(
        500,
        "Erreur lors de la mise à jour de l'utilisateur.",
        error
      )
    );
  }
};

exports.suppressionUtilisateur = async (req, res, next) => {
  try {
    const { idUtilisateur } = req.params;

    const utilisateur = await Utilisateur.findOneAndDelete({ idUtilisateur });
    if (!utilisateur) {
      return next(new CreateError(404, "Utilisateur non trouvé."));
    }

    res.status(200).json({
      message: "Utilisateur supprimé avec succès.",
    });
  } catch (error) {
    next(
      new CreateError(
        500,
        "Erreur lors de la suppression de l'utilisateur.",
        error
      )
    );
  }
};
