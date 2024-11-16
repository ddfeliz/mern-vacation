const Correcteur = require("../models/correcteurModel"); // Import du modèle Correcteur
const Vacation = require('../models/vacationModel');
const CreateError = require("../utils/appError"); // Import de la fonction CreateError

// Fonction pour ajouter un nouveau correcteur
exports.addCorrecteur = async (req, res, next) => {
  try {
    const {
      nom,
      prenom,
      cin,
      telephone,
      adresse,
      adresseProfession,
      grade,
      specialite,
      secteur,
      option,
      matiere,
    } = req.body;

    // Vérifier que les champs obligatoires sont fournis
    if (
      !nom ||
      !prenom ||
      !cin ||
      !adresse ||
      !adresseProfession ||
      !telephone ||
      !specialite ||
      !secteur ||
      !option ||
      !matiere ||
      !grade
    ) {
      return next(new CreateError(400, "Tous les champs obligatoires doivent être fournis."));
    }

    // Vérifier si un correcteur avec le cin existe déjà
    const correcteurExist = await Correcteur.findOne({ cin });
    if (correcteurExist) {
      return next(new CreateError(409, "Un correcteur avec ce CIN existe déjà."));
    }

    // Créer un nouvel objet correcteur avec les informations fournies
    const newCorrecteur = new Correcteur({
      idCorrecteur: `COR-${Math.floor(1000 + Math.random() * 9000)}`, // Générer un identifiant unique
      nom,
      prenom,
      cin,
      adresse,
      adresseProfession,
      grade,
      telephone,
      specialite,
      secteur,
      option,
      matiere,
    });

    // Enregistrer le correcteur dans la base de données
    await newCorrecteur.save();

    res.status(201).json({
      message: "Correcteur ajouté avec succès.",
      correcteur: {
        idCorrecteur: newCorrecteur.idCorrecteur, // Généré par le middleware
        nom: newCorrecteur.nom,
        prenom: newCorrecteur.prenom,
        cin: newCorrecteur.cin,
        adresse: newCorrecteur.adresse,
        adresseProfession: newCorrecteur.adresseProfession,
        telephone: newCorrecteur.telephone,
        specialite: newCorrecteur.specialite,
        secteur: newCorrecteur.secteur,
        option: newCorrecteur.option,
        matiere: newCorrecteur.matiere,
        statut: newCorrecteur.statut, // Le statut par défaut "Non actif"
      },
    });
  } catch (error) {
    next(new CreateError(500, "Erreur lors de l'ajout du correcteur.", error));
    console.log(error);
  }
};


// Fonction pour obtenir la liste de tous les correcteurs
exports.getAllCorrecteurs = async (req, res, next) => {
  try {
    // Chercher tous les correcteurs dans la base de données
    const correcteurs = await Correcteur.find();

    // Vérifier si des correcteurs existent
    if (!correcteurs || correcteurs.length === 0) {
      return next(new CreateError(404, "Aucun correcteur trouvé.")); // Ajout de 'new'
    }

    res.status(200).json(correcteurs);
  } catch (error) {
    next(
      new CreateError(
        500,
        "Erreur lors de la récupération de la liste des correcteurs.",
        error
      )
    ); // Ajout de 'new'
  }
};

// Fonction pour obtenir le CIN d'un correcteur
exports.getCINCorrecteur = async (req, res) => {
  try {
    const cin = req.params.cin;
    const correcteur = await Correcteur.findOne({ cin });

    // Si le correcteur avec ce CIN existe déjà, renvoyer un objet avec exists: true
    if (correcteur) {
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

// Fonction pour obtenir les informations d'un correcteur par son identifiant
exports.getCorrecteurById = async (req, res, next) => {
  try {
    const { idCorrecteur } = req.params;

    // Rechercher le correcteur par son idCorrecteur
    const correcteur = await Correcteur.findOne({ idCorrecteur });
    if (!correcteur) {
      return next(new CreateError(404, "Correcteur non trouvé.")); // Ajout de 'new'
    }

    res.status(200).json(correcteur);
  } catch (error) {
    next(
      new CreateError(
        500,
        "Erreur lors de la récupération du correcteur.",
        error
      )
    ); // Ajout de 'new'
  }
};

exports.CompterCorrecteursStatut = async (req, res, next) => {
  const { session } = req.body; // Supposons que tu envoies l'année via le corps de la requête

  try {
    // Compter les correcteurs actifs et non actifs pour la session donnée
    const correcteursStatut = await Correcteur.aggregate([
      {
        $lookup: {
          from: 'vacations', // Nom de la collection des vacations
          localField: 'idCorrecteur',
          foreignField: 'idCorrecteur',
          as: 'vacations'
        }
      },
      {
        $group: {
          _id: null,
          actifs: {
            $sum: {
              $cond: [{ $gt: [{ $size: { $filter: { input: '$vacations', as: 'vacation', cond: { $eq: ['$$vacation.session', session] } } } }, 0] }, 1, 0]
            }
          },
          nonActifs: {
            $sum: {
              $cond: [{ $eq: [{ $size: { $filter: { input: '$vacations', as: 'vacation', cond: { $eq: ['$$vacation.session', session] } } } }, 0] }, 1, 0]
            }
          }
        }
      }
    ]);

    const result = correcteursStatut[0] || { actifs: 0, nonActifs: 0 };

    res.status(200).json({
      message: 'Comptage des correcteurs effectué avec succès.',
      actifs: result.actifs,
      nonActifs: result.nonActifs,
    });
  } catch (error) {
    next(new CreateError(500, "Erreur lors du comptage des correcteurs.", error));
  }
};


// Fonction pour mettre à jour les informations d'un correcteur
exports.updateCorrecteur = async (req, res, next) => {
  try {
    const { idCorrecteur } = req.params;
    const updates = req.body;

    // Trouver le correcteur et mettre à jour ses informations
    const correcteur = await Correcteur.findOneAndUpdate(
      { idCorrecteur },
      updates,
      { new: true, runValidators: true }
    );
    if (!correcteur) {
      return next(new CreateError(404, "Correcteur non trouvé.")); // Ajout de 'new'
    }

    res.status(200).json({
      message: "Correcteur mis à jour avec succès.",
      correcteur,
    });
  } catch (error) {
    next(
      new CreateError(
        500,
        "Erreur lors de la mise à jour du correcteur.",
        error
      )
    ); // Ajout de 'new'
  }
};

// Mise à jour des statuts des correcteurs pour une année spécifiée
exports.UpdateStatutCorrecteur = async (req, res, next) => {
  const { session } = req.body; // Récupérer l'année de la requête

  // Vérifier que la session est fournie
  if (!session) {
    return next(new CreateError(400, "L'année de la session doit être spécifiée."));
  }

  try {
    const correcteurs = await Correcteur.find(); // Récupère tous les correcteurs

    for (const correcteur of correcteurs) {
      // Compte le nombre de vacations associées au correcteur pour la session spécifiée
      const vacationCount = await Vacation.countDocuments({
        idCorrecteur: correcteur.idCorrecteur,
        session: session, // Filtrer par session
      });

      if (vacationCount > 0) {
        // Met à jour le statut à 'Actif' si des vacations existent pour la session
        await Correcteur.findOneAndUpdate(
          { idCorrecteur: correcteur.idCorrecteur }, 
          { statut: 'Actif' } 
        );
      } else {
        // Met à jour le statut à 'Non actif' si aucune vacation n'existe pour la session
        await Correcteur.findOneAndUpdate(
          { idCorrecteur: correcteur.idCorrecteur }, 
          { statut: 'Non actif' } 
        );
      }
    }

    res.status(200).json({ message: 'Statuts des correcteurs mis à jour.' });
  } catch (error) {
    next(new CreateError(500, "Erreur lors de la mise à jour des statuts.", error));
  }
};





// Fonction pour compter les totales des correcteurs
exports.CountCorrecteur = async (req, res, next) => {
  try {
    const correcteursCount = await Correcteur.countDocuments();
    res.status(200).json({ totalCorrecteurs: correcteursCount });
  } catch (error) {
    next(
      new CreateError(500, "Erreur lors de la compte des correcteurs.", error)
    );
  }
};

// Fonction pour supprimer un correcteur par son identifiant
exports.deleteCorrecteur = async (req, res, next) => {
  try {
    const { idCorrecteur } = req.params;

    // Supprimer le correcteur de la base de données
    const correcteur = await Correcteur.findOneAndDelete({ idCorrecteur });
    if (!correcteur) {
      return next(new CreateError(404, "Correcteur non trouvé.")); // Ajout de 'new'
    }

    res.status(200).json({
      message: "Correcteur supprimé avec succès.",
    });
  } catch (error) {
    next(
      new CreateError(
        500,
        "Erreur lors de la suppression du correcteur.",
        error
      )
    ); // Ajout de 'new'
  }
};
