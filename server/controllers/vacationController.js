
const Vacation = require('../models/vacationModel');
const CreateError = require('../utils/appError'); // Import de la fonction CreateError


// Fonction pour ajouter un nouveau vacation
exports.addVacation = async (req, res, next) => {
  try {
    const {  idCorrecteur, nom, prenom, cin, telephone, specialite, secteur, option, matiere, nbcopie, session } = req.body;

    const currentYear = new Date().getFullYear();

    // Vérifier que les champs obligatoires sont fournis
    if ( !idCorrecteur|| !nom || !prenom || !cin || !telephone || !specialite || !secteur || !option || !matiere || !nbcopie) {
      return next(new CreateError(400, 'Tous les champs obligatoires doivent être fournis.')); // Ajout de 'new'
    }

    // Vérifier si un correcteur avec l'email existe déjà
    const vacationExist = await Vacation.findOne({ idCorrecteur, session: currentYear });
    if (vacationExist) {
      return next(new CreateError(409, `Un correcteur avec cet id ${idCorrecteur} existe déjà dans la session: ${session}.`)); // Ajout de 'new'
    }


    // Créer un nouvel objet correcteur avec les informations fournies
    const newVacation = new Vacation({
      idVacation: `VAC-${Math.floor(1000 + Math.random() * 9000)}`, // Générer un identifiant unique
      idCorrecteur,
      nom,
      prenom,
      cin,
      telephone,
      specialite,
      secteur,
      option,
      matiere,
      session: currentYear,
      nbcopie
    });

    // Enregistrer le correcteur dans la base de données
    await newVacation.save();

    res.status(201).json({
      message: 'Vacation du correcteur ajouté avec succès.',
      vacation: {
        idVacation: newVacation.idVacation,
        idCorrecteur: newVacation.idCorrecteur,
        nom: newVacation.nom,
        prenom: newVacation.prenom,
        cin: newVacation.cin,
        telephone: newVacation.telephone,
        specialite: newVacation.specialite,
        secteur: newVacation.secteur,
        option: newVacation.option,
        matiere: newVacation.matiere,
        session: newVacation.session,
        nbcopie: newVacation.nbcopie,
      }
    });
  } catch (error) {
    next(new CreateError(500, 'Erreur lors de l\'ajout du vacation.', error)); // Ajout de 'new'
    console.log(error);
    
  }
};


// Fonction pour obtenir la liste de tous les correcteurs
exports.getAllVacations = async (req, res, next) => {
  try {
    // Chercher tous les correcteurs dans la base de données
    const vacations = await Vacation.find();

    // Vérifier si des correcteurs existent
    if (!vacations || vacations.length === 0) {
      return next(new CreateError(404, 'Aucun vacation trouvé.')); // Ajout de 'new'
    }

    res.status(200).json(vacations);
  } catch (error) {
    next(new CreateError(500, 'Erreur lors de la récupération de la liste des vacations.', error)); // Ajout de 'new'
  }
};


// Fonction pour obtenir le CIN d'un correcteur
exports.getSession = async (req, res) => {
  try {
    const session = req.params.session;
    const idCorrecteur = req.params.idCorrecteur;
    const vacation = await Vacation.findOne({ idCorrecteur, session });

    // Si le correcteur avec ce CIN existe déjà, renvoyer un objet avec exists: true
    if (vacation) {
      return res.json({ exists: true });
    }

    // Sinon, renvoyer exists: false
    res.json({ exists: false });
  } catch (error) {
    next(
      new CreateError(
        500,
        "Erreur lors de la récupération de la CIN du correcteur.",
        error
      )
    );
  }
};


// Fonction pour calculer le total des copies corrigées par tous les correcteurs
exports.getTotalCopies = async (req, res, next) => {
  try {
    // Utilisation de l'agrégation pour calculer la somme des "nbcopie"
    const result = await Vacation.aggregate([
      {
        $group: {
          _id: null, // Pas de groupement particulier
          totalCopies: { $sum: "$nbcopie" } // Calculer la somme des copies
        }
      }
    ]);

    // Vérifier si un résultat a été trouvé
    if (!result || result.length === 0) {
      return next(new CreateError(404, 'Aucune copie trouvée.'));
    }

    const totalCopies = result[0].totalCopies;

    res.status(200).json({
      message: 'Le total des copies corrigées a été calculé avec succès.',
      totalCopies
    });
  } catch (error) {
    next(new CreateError(500, 'Erreur lors du calcul du total des copies.', error));
  }
};

// Fonction pour calculer le total des copies corrigées par année
exports.getTotalCopiesByYear = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();
    const result = await Vacation.aggregate([
      {
        $group: {
          _id: "$session", // Regroupement par année (session)
          totalCopies: { $sum: "$nbcopie" } // Somme des copies
        }
      },
      {
        $match: {
          _id: { $gte: currentYear - 2 } // Filtre pour les 3 dernières années
        }
      },
      {
        $sort: { _id: 1 } // Tri par année
      }
    ]);

    if (!result || result.length === 0) {
      return next(new CreateError(404, 'Aucune copie trouvée.'));
    }

    res.status(200).json({
      message: 'Données récupérées avec succès.',
      data: result,
    });
  } catch (error) {
    next(new CreateError(500, 'Erreur lors du calcul des copies.', error));
  }
};





// Fonction pour obtenir les informations d'un correcteur par son identifiant
exports.getVacationById = async (req, res, next) => {
  try {
    const { idVacation } = req.params;

    // Rechercher le correcteur par son idCorrecteur
    const vacation = await Vacation.findOne({ idVacation });
    if (!vacation) {
      return next(new CreateError(404, 'Vacation non trouvé.')); // Ajout de 'new'
    }

    res.status(200).json(vacation);
  } catch (error) {
    next(new CreateError(500, 'Erreur lors de la récupération du vacation.', error)); // Ajout de 'new'
  }
};

// Fonction pour mettre à jour les informations d'un correcteur
exports.updateVacation = async (req, res, next) => {
  try {
    const { idVacation } = req.params;
    const updates = req.body;

    // Trouver le correcteur et mettre à jour ses informations
    const vacation = await Vacation.findOneAndUpdate(
      { idVacation },
      updates,
      { new: true, runValidators: true }
    );
    if (!vacation) {
      return next(new CreateError(404, 'Vacation non trouvé.')); // Ajout de 'new'
    }

    res.status(200).json({
      message: 'Vacation mis à jour avec succès.',
      vacation
    });
  } catch (error) {
    next(new CreateError(500, 'Erreur lors de la mise à jour du vacation.', error)); // Ajout de 'new'
  }
};

// Fonction pour compter les totales des correcteurs
exports.getVacationCount = async (req, res, next) => {
  try {
    const vacationsCount = await Vacation.countDocuments();
    res.status(200).json({ totalVacation: vacationsCount });
  } catch (error) {
    next(
      new CreateError(500, "Erreur lors de la compte des correcteurs.", error)
    );
  }
};

// Fonction pour supprimer un correcteur par son identifiant
exports.deleteVacation = async (req, res, next) => {
  try {
    const { idVacation } = req.params;

    // Supprimer le correcteur de la base de données
    const vacation = await Vacation.findOneAndDelete({ idVacation });
    if (!vacation) {
      return next(new CreateError(404, 'Vacation non trouvé.')); // Ajout de 'new'
    }

    res.status(200).json({
      message: 'Vacation supprimé avec succès.'
    });
  } catch (error) {
    next(new CreateError(500, 'Erreur lors de la suppression du vacation.', error)); // Ajout de 'new'
  }
};
