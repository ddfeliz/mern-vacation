const Correcteur = require("../modelisation/correcteur"); 
const Vacation = require('../modelisation/vacation');
const CreateError = require("../utils/appError"); 

exports.ajoutCorrecteur = async (req, res, next) => {
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

    const correcteurExist = await Correcteur.findOne({ cin });
    if (correcteurExist) {
      return next(new CreateError(409, "Un correcteur avec ce CIN existe déjà."));
    }

    const newCorrecteur = new Correcteur({
      idCorrecteur: `COR-${Math.floor(1000 + Math.random() * 9000)}`, 
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
    await newCorrecteur.save();

    res.status(201).json({
      message: "Correcteur ajouté avec succès.",
      correcteur: {
        idCorrecteur: newCorrecteur.idCorrecteur, 
        immatricule: newCorrecteur.immatricule,
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
        statut: newCorrecteur.statut, 
      },
    });
  } catch (error) {
    next(new CreateError(500, "Erreur lors de l'ajout du correcteur.", error));
    console.log(error);
  }
};

exports.avoirTousCorrecteurs = async (req, res, next) => {
  try {
    const correcteurs = await Correcteur.find();
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
    ); 
  }
};

exports.avoirCINCorrecteur = async (req, res) => {
  try {
    const cin = req.params.cin;
    const correcteur = await Correcteur.findOne({ cin });
    if (correcteur) {
      return res.json({ exists: true });
    }
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

exports.avoirIdCorrecteur = async (req, res) => {
  try {
      const { idCorrecteur } = req.params;
      const correcteur = await Correcteur.findOne({idCorrecteur});

      if (!correcteur) {
          return next(new CreateError(404, 'correcteur non trouvé.'));
      }

      res.status(200).json(correcteur);
  } catch (error) {
      next(new CreateError(500, 'Erreur lors de la récupération du correcteur.', error));
  }
};

exports.avoirIMCorrecteur = async (req, res, next) => {
  try {
    const { identifiant } = req.params;

    // Vérifie si c'est un immatricule ou un CIN
    let query = {};
    if (/^\d{3}\.\d{3}$/.test(identifiant)) {
      // Si l'identifiant correspond au format "453.163" (immatricule)
      query = { immatricule: identifiant };
    } else if (/^\d{12}$/.test(identifiant)) {
      // Si l'identifiant correspond à un numéro de 12 chiffres (CIN)
      query = { cin: identifiant };
    } else {
      return res.status(400).json({ error: "Identifiant invalide. Fournissez un immatricule ou un CIN." });
    }

    // Recherche dans la base de données
    const correcteur = await Correcteur.findOne(query);
    if (!correcteur) {
      return res.status(404).json({ error: "Aucune Correcteur trouvée pour cet identifiant." });
    }

    res.status(200).json(correcteur);
  } catch (error) {
    next(
      new CreateError(
        500,
        "Erreur lors de la récupération du correcteur.",
        error
      )
    );
  }
};

exports.CompterCorrecteursStatut = async (req, res, next) => {
  const { session } = req.body; 

  try {
    const correcteursStatut = await Correcteur.aggregate([
      {
        $lookup: {
          from: 'vacations', 
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

exports.modificationCorrecteur = async (req, res, next) => {
  try {
    const { idCorrecteur } = req.params;
    const updates = req.body;
    const correcteur = await Correcteur.findOneAndUpdate(
      { idCorrecteur },
      updates,
      { new: true, runValidators: true }
    );
    if (!correcteur) {
      return next(new CreateError(404, "Correcteur non trouvé."));
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
    );
  }
};

exports.modificationStatutCorrecteur = async (req, res, next) => {
  const { session } = req.body; 

  if (!session) {
    return next(new CreateError(400, "L'année de la session doit être spécifiée."));
  }

  try {
    const correcteurs = await Correcteur.find();

    for (const correcteur of correcteurs) {
      const vacationCount = await Vacation.countDocuments({
        idCorrecteur: correcteur.idCorrecteur,
        session: session,
      });

      if (vacationCount > 0) {
        await Correcteur.findOneAndUpdate(
          { idCorrecteur: correcteur.idCorrecteur }, 
          { statut: 'Actif' } 
        );
      } else {
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

exports.CompterCorrecteur = async (req, res, next) => {
  try {
    const correcteursCount = await Correcteur.countDocuments();
    res.status(200).json({ totalCorrecteurs: correcteursCount });
  } catch (error) {
    next(
      new CreateError(500, "Erreur lors de la compte des correcteurs.", error)
    );
  }
};

exports.suppressionCorrecteur = async (req, res, next) => {
  try {
    const { idCorrecteur } = req.params;

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
    ); 
  }
};
