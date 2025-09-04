const Vacation = require("../modelisation/vacation");
const CreateError = require("../utils/appError");

const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.vfs;


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
      pochette,
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
    const idCorrecteur = req.params.idCorrecteur;
    const pochette = req.query.pochette;
    const vacation = await Vacation.findOne({ pochette, session, idCorrecteur });

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
    const { idCorrecteur } = req.params;

    const vacation = await Vacation.find({ idCorrecteur });
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
          idCorrecteur: {$first: "$idCorrecteur"},
          nom: {$first: "$nom"},
          prenom: {$first: "$prenom"},
          cin: {$first: "$cin"},
          totalVacations: { $sum: 1 }, // Compte le nombre de vacations pour chaque correcteur
          idVacations: {$first: "$idVacation"},
        },
      },
      {
        $project: {
          _id: 0,
          immatricule: 1,
          idCorrecteur:1,
          nom: 1,
          prenom: 1,
          cin: 1,
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

exports.avoirNombreCorrecteursAvecVacations = async (req, res, next) => {
  try {
    const result = await Vacation.aggregate([
      {
        $group: {
          _id: "$idCorrecteur", // Grouper par idCorrecteur unique (seuls ceux avec au moins une vacation)
        },
      },
      {
        $count: "totalCorrecteurs", // Compter le nombre de groupes (correcteurs uniques)
      },
    ]);

    const totalCorrecteurs = result.length > 0 ? result[0].totalCorrecteurs : 0;

    res.status(200).json({
      message: "Nombre de correcteurs ayant des vacations calculé avec succès.",
      totalCorrecteurs,
    });
  } catch (error) {
    next(
      new CreateError(500, "Erreur lors du comptage des correcteurs avec vacations.", error)
    );
  }
};



exports.genererPDFCorrecteursParSpecialite = async (req, res, next) => {
  try {
    const { specialite } = req.params;

    if (!specialite) {
      return next(new CreateError(400, "La spécialité est requise."));
    }

    const vacations = await Vacation.find({ specialite });

    if (!vacations || vacations.length === 0) {
      return next(new CreateError(404, "Aucun correcteur trouvé pour cette spécialité."));
    }

    // Calculate total unique correctors for the specialty
    const totalCorrecteurs = [...new Set(vacations.map(vac => vac.idCorrecteur))].length;

    // Group by secteur and idCorrecteur, aggregating relevant fields
    const groupedBySecteur = vacations.reduce((acc, vac) => {
      if (!acc[vac.secteur]) {
        acc[vac.secteur] = {};
      }

      const corrKey = vac.idCorrecteur;
      if (!acc[vac.secteur][corrKey]) {
        acc[vac.secteur][corrKey] = {
          immatricule: vac.immatricule,
          nom: vac.nom,
          prenom: vac.prenom,
          cin: vac.cin,
          telephone: vac.telephone,
          pochette: vac.pochette,
          option: vac.option,
          matiere: vac.matiere,
          session: vac.session,
          totalCopies: 0,
        };
      }

      acc[vac.secteur][corrKey].totalCopies += vac.nbcopie;

      return acc;
    }, {});

    // Define PDF document with A4 page size
    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      content: [
        { text: `Liste des correcteurs pour la spécialité: ${specialite}`, style: 'title' },
        { text: `Nombre total de correcteurs: ${totalCorrecteurs}`, style: 'subtitle' },
        { text: '', margin: [0, 10, 0, 10] }, // Spacer
      ],
      styles: {
        title: { fontSize: 20, bold: true, margin: [0, 0, 0, 10], alignment: 'center' },
        subtitle: { fontSize: 14, bold: true, margin: [0, 5, 0, 10], alignment: 'center' },
        header: { fontSize: 16, bold: true, margin: [0, 20, 0, 10], alignment: 'left' },
        subheader: { fontSize: 12, bold: true, margin: [0, 5, 0, 10], alignment: 'left' },
        tableHeader: { bold: true, fontSize: 12, color: 'black', alignment: 'center' },
        tableCell: { fontSize: 10, alignment: 'center' },
      },
      defaultStyle: { fontSize: 10 },
    };

    // Add tables for each secteur
    for (const [secteur, correcteurs] of Object.entries(groupedBySecteur)) {
      // Calculate total correctors for this sector
      const sectorCorrecteursCount = Object.keys(correcteurs).length;

      docDefinition.content.push({ text: `Secteur: ${secteur}`, style: 'header' });

      const tableBody = [
        [
          { text: 'Immatricule', style: 'tableHeader' },
          { text: 'Nom', style: 'tableHeader' },
          { text: 'Prénom', style: 'tableHeader' },
          { text: 'CIN', style: 'tableHeader' },
          { text: 'Téléphone', style: 'tableHeader' },
          { text: 'Option', style: 'tableHeader' },
          { text: 'Matière', style: 'tableHeader' },
        ],
      ];

      Object.values(correcteurs).forEach((c) => {
        tableBody.push([
          { text: c.immatricule, style: 'tableCell' },
          { text: c.nom, style: 'tableCell' },
          { text: c.prenom, style: 'tableCell' },
          { text: c.cin, style: 'tableCell' },
          { text: c.telephone, style: 'tableCell' },
          { text: c.option, style: 'tableCell' },
          { text: c.matiere, style: 'tableCell' }
        ]);
      });

      docDefinition.content.push({
        table: {
          headerRows: 1,
          widths: [60, 60, 60, 60, 60, 50, 50,],
          body: tableBody,
          dontBreakRows: true,
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#aaa',
          vLineColor: () => '#aaa',
          paddingLeft: () => 4,
          paddingRight: () => 4,
          paddingTop: () => 2,
          paddingBottom: () => 2,
          fillColor: (rowIndex) => (rowIndex === 0 ? '#f0f0f0' : null),
        },
      });

      docDefinition.content.push({
        text: `Nombre de correcteurs dans ce secteur: ${sectorCorrecteursCount}`,
        style: 'subheader',
      });
    }

    const pdfDoc = pdfMake.createPdf(docDefinition);

    pdfDoc.getBuffer((buffer) => {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=correcteurs_${specialite}.pdf`);
      res.end(buffer);
    });
  } catch (error) {
    next(new CreateError(500, "Erreur lors de la génération du PDF.", error));
  }
};


exports.avoirSpecialites = async (req, res, next) => {
  try {
    const specialites = await Vacation.distinct("specialite");
    if (!specialites || specialites.length === 0) {
      return next(new CreateError(404, "Aucune spécialité trouvée."));
    }
    res.status(200).json({ specialites });
  } catch (error) {
    next(
      new CreateError(500, "Erreur lors de la récupération des spécialités.", error)
    );
  }
};


