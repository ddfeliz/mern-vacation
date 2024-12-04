const Vacation = require("../modelisation/vacation");
const CreateError = require("../utils/appError");

exports.ajoutVacation = async (req, res, next) => {
  try {
    const {
      idCorrecteur,
      immatricule,
      nom,
      prenom,
      cin,
      telephone,
      pochette,
      specialite,
      secteur,
      option,
      matiere,
      nbcopie,
      session,
    } = req.body;

    const currentYear = new Date().getFullYear();

    if (
      !idCorrecteur ||
      !immatricule ||
      !nom ||
      !prenom ||
      !cin ||
      !telephone ||
      !pochette ||
      !specialite ||
      !secteur ||
      !option ||
      !matiere ||
      !nbcopie
    ) {
      return next(
        new CreateError(
          400,
          "Tous les champs obligatoires doivent être fournis."
        )
      ); // Ajout de 'new'
    }

    const vacationExist = await Vacation.findOne({
      idCorrecteur,
      specialite,
      secteur,
      option,
      matiere,
      session: currentYear,
    });
    if (vacationExist) {
      return next(
        new CreateError(
          409,
          `Un correcteur avec cet id ${idCorrecteur} existe déjà dans la session: ${session}.`
        )
      ); // Ajout de 'new'
    }

    const newVacation = new Vacation({
      idVacation: `VAC-${Math.floor(1000 + Math.random() * 9000)}`,
      idCorrecteur,
      immatricule,
      nom,
      prenom,
      cin,
      telephone,
      pochette,
      specialite,
      secteur,
      option,
      matiere,
      session: currentYear,
      nbcopie,
    });

    await newVacation.save();

    res.status(201).json({
      message: "Vacation du correcteur ajouté avec succès.",
      vacation: {
        idVacation: newVacation.idVacation,
        idCorrecteur: newVacation.idCorrecteur,
        immatricule: newVacation.immatricule,
        nom: newVacation.nom,
        prenom: newVacation.prenom,
        cin: newVacation.cin,
        telephone: newVacation.telephone,
        pochette: newVacation.pochette,
        specialite: newVacation.specialite,
        secteur: newVacation.secteur,
        option: newVacation.option,
        matiere: newVacation.matiere,
        session: newVacation.session,
        nbcopie: newVacation.nbcopie,
        statut_paiement: newVacation.statut_paiement, 
      },
    });
  } catch (error) {
    next(new CreateError(500, "Erreur lors de l'ajout du vacation.", error));
    console.log(error);
  }
};

exports.avoirTousVacations = async (req, res, next) => {
  try {
    const vacations = await Vacation.find();

    if (!vacations || vacations.length === 0) {
      return next(new CreateError(404, "Aucun vacation trouvé."));
    }

    res.status(200).json(vacations);
  } catch (error) {
    next(
      new CreateError(
        500,
        "Erreur lors de la récupération de la liste des vacations.",
        error
      )
    ); // Ajout de 'new'
  }
};

exports.avoirPochette = async (req, res) => {
  try {
    const session = req.params.session;
    const pochette = req.params.pochette;
    const vacation = await Vacation.findOne({ pochette, session });

    if (vacation) {
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

exports.avoirTotalesCopies = async (req, res, next) => {
  try {
    const result = await Vacation.aggregate([
      {
        $group: {
          _id: null,
          totalCopies: { $sum: "$nbcopie" },
        },
      },
    ]);

    if (!result || result.length === 0) {
      return next(new CreateError(404, "Aucune copie trouvée."));
    }

    const totalCopies = result[0].totalCopies;

    res.status(200).json({
      message: "Le total des copies corrigées a été calculé avec succès.",
      totalCopies,
    });
  } catch (error) {
    next(
      new CreateError(500, "Erreur lors du calcul du total des copies.", error)
    );
  }
};

exports.avoirTotalesCopiesEnAnnee = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();
    const result = await Vacation.aggregate([
      {
        $group: {
          _id: "$session",
          totalCopies: { $sum: "$nbcopie" },
        },
      },
      {
        $match: {
          _id: { $gte: currentYear - 2 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    if (!result || result.length === 0) {
      return next(new CreateError(404, "Aucune copie trouvée."));
    }

    res.status(200).json({
      message: "Données récupérées avec succès.",
      data: result,
    });
  } catch (error) {
    next(new CreateError(500, "Erreur lors du calcul des copies.", error));
  }
};

exports.avoirIdVacation = async (req, res, next) => {
  try {
    const { immatricule } = req.params;

    const vacation = await Vacation.find({ immatricule });
    if (!vacation.length) {
      return next(new CreateError(404, "Vacation non trouvé."));
    }

    res.status(200).json(vacation);
  } catch (error) {
    next(
      new CreateError(500, "Erreur lors de la récupération du vacation.", error)
    );
  }
};

exports.avoirIMVacation = async (req, res, next) => {
  try {
    const { idVacation } = req.params;

    // Vérification que l'idVacation est bien présent
    if (!idVacation) {
      return next(new CreateError(400, "L'ID de la vacation est requis."));
    }

    const vacation = await Vacation.findOne({ idVacation });

    if (!vacation) {
      return next(new CreateError(404, "Vacation non trouvée."));
    }

    res.status(200).json(vacation);
  } catch (error) {
    console.error(error); // Il est utile de loguer l'erreur pour déboguer
    next(new CreateError(500, "Erreur lors de la récupération de la vacation.", error));
  }
};

exports.modificationVacation = async (req, res, next) => {
  try {
    const { idVacation } = req.params;
    const updates = req.body;

    const vacation = await Vacation.findOneAndUpdate({ idVacation }, updates, {
      new: true,
      runValidators: true,
    });
    if (!vacation) {
      return next(new CreateError(404, "Vacation non trouvé."));
    }

    res.status(200).json({
      message: "Vacation mis à jour avec succès.",
      vacation,
    });
  } catch (error) {
    next(
      new CreateError(500, "Erreur lors de la mise à jour du vacation.", error)
    );
  }
};

exports.avoirVacationCompte = async (req, res, next) => {
  try {
    const vacationsCount = await Vacation.countDocuments();
    res.status(200).json({ totalVacation: vacationsCount });
  } catch (error) {
    next(
      new CreateError(500, "Erreur lors de la compte des correcteurs.", error)
    );
  }
};
exports.avoirVacationCompteByCorrecteur = async (req, res, next) => {
  try {
    const vacationCounts = await Vacation.aggregate([
      {
        $group: {
          _id: "$idCorrecteur", // Regroupe par ID du correcteur
          immatricule: {$first: "$immatricule"},
          nom: {$first: "$nom"},
          prenom: {$first: "$prenom"},
          totalVacations: { $sum: 1 }, // Compte le nombre de vacations pour chaque correcteur
          idVacations: {$first: "$idVacation"},
        },
      },
      {
        $project: {
          _id: 0,
          immatricule: 1,
          nom: 1,
          prenom: 1,
          totalVacations: 1, 
          idVacations: 1,
        },
      },
    ]);

    res.status(200).json(vacationCounts);
  } catch (error) {
    next(
      new CreateError(
        500,
        "Erreur lors du comptage des vacations par correcteur.",
        error
      )
    );
  }
};

exports.suppressionVacation = async (req, res, next) => {
  try {
    const { idVacation } = req.params;

    const vacation = await Vacation.findOneAndDelete({ idVacation });
    if (!vacation) {
      return next(new CreateError(404, "Vacation non trouvé."));
    }

    res.status(200).json({
      message: "Vacation supprimé avec succès.",
    });
  } catch (error) {
    next(
      new CreateError(500, "Erreur lors de la suppression du vacation.", error)
    );
  }
};
