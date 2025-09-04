const Paiement = require('../modelisation/paiement');
const CreateError = require('../utils/appError'); // Import de la fonction CreateError
const PDFDocument = require("pdfkit-table");


// Fonction pour ajouter un nouveau vacation
exports.ajoutPaiement = async (req, res, next) => {
  try {
    const { idVacation, idCorrecteur, immatricule, nom, prenom, cin, specialite, secteur, option, matiere, pochette, nbcopie, optionTarif, montantTotal } = req.body;


    const currentYear = new Date().getFullYear();

    // Vérifier si un correcteur avec l'email existe déjà
    const paiementExist = await Paiement.findOne({ idVacation });
    if (paiementExist) {
      return next(new CreateError(409, 'Un paiement avec cet vacation existe déjà.')); // Ajout de 'new'
    }
    /* const currentYear = new Date().getFullYear(); */


    // Créer un nouvel objet correcteur avec les informations fournies
    const newPaiement = new Paiement({
      idVacation,
      idCorrecteur,
      immatricule,
      nom,
      prenom,
      cin,
      specialite,
      secteur,
      option,
      matiere,
      pochette,
      nbcopie,
      optionTarif,
      montantTotal,
      session: currentYear,
    });

    // Enregistrer le correcteur dans la base de données
    await newPaiement.save();

    res.status(201).json({
      message: 'Payment du correcteur ajouté avec succès.',
      paiement: newPaiement
    });
  } catch (error) {
    next(new CreateError(500, 'Erreur lors de l\'ajout du paiement du vacation.', error)); // Ajout de 'new'
    console.log(error);

  }
};


exports.existePaiement = async (req, res, next) => { // Ajout de next
  try {
    const idVacation = req.params.idVacation;
    const paiementExist = await Paiement.findOne({ idVacation });
    if (paiementExist) {
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

exports.modificationPaiementsToPaid = async (req, res) => {
  try {
    const { idCorrecteur } = req.params;
    const result = await Paiement.updateMany(
      { idCorrecteur, statut: 'Non payé' },
      { $set: { statut: 'Payé' } }
    );
    res.status(200).json({
      message: 'Tous les paiements ont été mis à jour avec succès.',
      result,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour des paiements.', error: err });
  }
};

// Fonction pour obtenir la liste de tous les paiements
exports.avoirTousPaiements = async (req, res, next) => {
  try {
    // Chercher tous les paiements dans la base de données
    const paiements = await Paiement.find();

    // Vérifier si des paiements existent
    if (!paiements || paiements.length === 0) {
      return next(new CreateError(404, 'Aucun paiement trouvé.')); // Ajout de 'new'
    }

    res.status(200).json(paiements);
  } catch (error) {
    next(new CreateError(500, 'Erreur lors de la récupération de la liste des paiements.', error)); // Ajout de 'new'
  }
};

// Fonction pour regrouper tous les paiements des vacations des correcteurs
exports.regrouperTousLesPaiements = async (req, res, next) => {
  try {
    // Récupérer tous les paiements de tous les correcteurs
    const paiements = await Paiement.find();

    if (paiements.length === 0) {
      return next(new CreateError(404, 'Aucun paiement trouvé.'));
    }

    // Regrouper les paiements par idCorrecteur
    const paiementsParCorrecteur = paiements.reduce((acc, paiement) => {
      const { idCorrecteur, montantTotal, session, nom, prenom, cin, statut } = paiement;

      if (!acc[idCorrecteur]) {
        acc[idCorrecteur] = {
          idCorrecteur,
          nom,
          prenom,
          cin,
          session,
          montantTotal: 0,
          nombreVacations: 0,
          statut,
        };
      }

      acc[idCorrecteur].montantTotal += montantTotal;
      acc[idCorrecteur].nombreVacations += 1;

      return acc;
    }, {});

    // Créer un tableau avec les paiements regroupés
    const paiementsRegroupes = Object.values(paiementsParCorrecteur);

    // Renvoyer la réponse avec tous les paiements regroupés
    res.status(200).json({
      message: 'Tous les paiements des vacations ont été regroupés avec succès.',
      paiementsRegroupes,
    });
  } catch (error) {
    next(new CreateError(500, 'Erreur lors du regroupement des paiements des vacations.', error));
    console.log(error);
  }
};


// Fonction pour calculer le total des copies corrigées par tous les correcteurs
exports.avoirTotalCopies = async (req, res, next) => {
  try {
    // Utilisation de l'agrégation pour calculer la somme des "nbcopie"
    const result = await Paiement.aggregate([
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


// Fonction pour calculer le total des copies corrigées par tous les correcteurs
exports.avoirTotaleMontants = async (req, res, next) => {
  try {
    // Utilisation de l'agrégation pour calculer la somme des "nbcopie"
    const result = await Paiement.aggregate([
      {
        $group: {
          _id: null, // Pas de groupement particulier
          montantTotal: { $sum: "$montantTotal" } // Calculer la somme des copies
        }
      }
    ]);

    // Vérifier si un résultat a été trouvé
    if (!result || result.length === 0) {
      return next(new CreateError(404, 'Aucune montant trouvée.'));
    }

    const montantTotal = result[0].montantTotal;

    res.status(200).json({
      message: 'Le total des montants a été calculé avec succès.',
      montantTotal
    });
  } catch (error) {
    next(new CreateError(500, 'Erreur lors du calcul du total des montants.', error));
  }
};

// Fonction pour obtenir les informations d'un correcteur par son identifiant
exports.avoirIdCorPaiement = async (req, res, next) => {
  try {
    const { idCorrecteur } = req.params;

    // Rechercher le correcteur par son idCorrecteur
    const paiement = await Paiement.find({ idCorrecteur });
    if (!paiement.length) {
      return next(new CreateError(404, 'Paiement non trouvé.')); // Ajout de 'new'
    }

    res.status(200).json(paiement);
  } catch (error) {
    next(new CreateError(500, 'Erreur lors de la récupération du paiement.', error)); // Ajout de 'new'
  }
};


// Fonction pour obtenir les informations d'un correcteur par son identifiant
exports.avoirIdPaiement = async (req, res, next) => {
  try {
    const { idPaiement } = req.params;

    // Rechercher le correcteur par son idCorrecteur
    const paiement = await Paiement.findOne({ idPaiement });
    if (!paiement) {
      return next(new CreateError(404, 'Paiement non trouvé.')); // Ajout de 'new'
    }

    res.status(200).json(paiement);
  } catch (error) {
    next(new CreateError(500, 'Erreur lors de la récupération du paiement.', error)); // Ajout de 'new'
  }
};

// Fonction pour mettre à jour les informations d'un correcteur
exports.modificationPaiement = async (req, res, next) => {
  try {
    const { idPaiement } = req.params;
    const updates = req.body;

    // Trouver le correcteur et mettre à jour ses informations
    const paiement = await Paiement.findOneAndUpdate(
      { idPaiement },
      updates,
      { new: true, runValidators: true }
    );
    if (!paiement) {
      return next(new CreateError(404, 'Paiement non trouvé.')); // Ajout de 'new'
    }

    res.status(200).json({
      message: 'Paiement mis à jour avec succès.',
      paiement
    });
  } catch (error) {
    next(new CreateError(500, 'Erreur lors de la mise à jour du paiement.', error)); // Ajout de 'new'
  }
};


// Fonction pour compter les totales des paiements
exports.CompterPaiement = async (req, res, next) => {
  try {
    const paiementsCompter = await Paiement.countDocuments();
    res.status(200).json({ totalPaiements: paiementsCompter });
  } catch (error) {
    next(
      new CreateError(500, "Erreur lors de la compte des paiements.", error)
    );
  }
};




// Fonction pour supprimer un correcteur par son identifiant
exports.supprimerPaiement = async (req, res, next) => {
  try {
    const { idPaiement } = req.params;

    // Supprimer le paiement de la base de données
    const paiement = await Paiement.findOneAndDelete({ idPaiement });
    if (!paiement) {
      return next(new CreateError(404, 'Paiement non trouvé.')); // Ajout de 'new'
    }

    res.status(200).json({
      message: 'Paiement supprimé avec succès.',
      paiement
    });
  } catch (error) {
    next(new CreateError(500, 'Erreur lors de la suppression du paiement.', error)); // Ajout de 'new'
  }
};

const getPaiementsGroupedByCorrecteur = async (specialite) => {
  return await Paiement.aggregate([
    {
      $match: {
        specialite: specialite, // Filtrer par spécialité
      },
    },
    {
      $group: {
        _id: "$idCorrecteur",
        correcteurInfo: {
          $first: {
            nom: "$nom",
            prenom: "$prenom",
            cin: "$cin",
            specialite: "$specialite"
          },
        },
        vacations: {
          $push: {
            secteur: "$secteur",
            option: "$option",
            matiere: "$matiere",
            pochette: "$pochette",
            nbcopie: "$nbcopie",
            montantTotal: "$montantTotal",
          },
        },
      },
    },
  ]);
};

exports.generateExcelForSpeciality = async (req, res) => {
  try {
    const { specialite } = req.query;
    if (!specialite) {
      return res.status(400).send("La spécialité est requise.");
    }

    const data = await getPaiementsGroupedByCorrecteur(specialite);
    if (data.length === 0) {
      return res.status(404).send(`Aucun paiement trouvé pour la spécialité : ${specialite}`);
    }

    const ExcelJS = require("exceljs");
    const path = require("path");

    // Fonction pour tronquer nom feuille à 31 caractères max
    function truncateSheetName(name) {
      return name.length > 31 ? name.substring(0, 31) : name;
    }

    const sheetName = truncateSheetName(`Paiements - ${specialite}`);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);
    
    // Fonction utilitaire pour formater montant
    const formatMontant = (val) =>
      (val || 0).toLocaleString("fr-FR").replace(/\s/g, " ") + " Ar";

    // 🔹 EN-TÊTE TITRE COMME DANS LE DOCUMENT
    const headerLines = [
      "REPOBILIKAN'I MADAGASIKARA",
      "Fitiavana - Tanindrazana - Fandrosoana",
      "----------------------------",
      "MINISTERE DE L'ENSEIGNEMENT SUPÉRIEUR",
      "ET DE LA RECHERCHE SCIENTIFIQUE",
      "----------------------------",
      "UNIVERSITÉ DE TOLIARA",
      "----------------------------",
      "OFFICE DU BACCALAUREAT",
      "",
      `BACCALAUREAT: - ${new Date().getFullYear()}`,
      `VACATION DES CORRECTEURS - MATIÈRES ${specialite.toUpperCase()}`
    ];

    headerLines.forEach((line) => {
      const row = worksheet.addRow([line]);
      worksheet.mergeCells(`A${row.number}:G${row.number}`);
      row.alignment = { horizontal: "center", vertical: "middle" };
      row.font = { bold: true };
    });

    worksheet.addRow([]);

    // 🔹 EN-TÊTE DU TABLEAU
    worksheet.addRow(["Nom et Prénom(s)", "Matières", "Spécialité", "Pochettes", "Nb de copies", "Montant", "Total"]);

    // Styles d’en-tête
    const headerRow = worksheet.lastRow;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
    });

    let grandTotal = 0;

    // 🔹 TRIER LES CORRECTEURS PAR PRÉNOM
    const sortedData = [...data].sort((a, b) =>
      a.correcteurInfo.prenom.localeCompare(b.correcteurInfo.prenom)
    );

    // 🔹 BOUCLE SUR CHAQUE CORRECTEUR (TRIÉ)
    sortedData.forEach((correcteur) => {
      const { correcteurInfo, vacations } = correcteur;
      const totalCorrecteur = vacations.reduce((sum, v) => sum + v.montantTotal, 0);
      grandTotal += totalCorrecteur;

      // Ligne avec nom + total global
      const rowNom = worksheet.addRow([
        `${correcteurInfo.prenom} ${correcteurInfo.nom}`,
        "",
        "",
        "",
        "",
        "",
        formatMontant(totalCorrecteur)
      ]);
      rowNom.font = { bold: true };

      // Matières du correcteur
      vacations.forEach((vac) => {
        const row = worksheet.addRow([
          "",
          vac.matiere,
          vac.secteur,
          vac.pochette,
          vac.nbcopie || 0, // Écrire comme nombre, pas comme texte
          formatMontant(vac.montantTotal),
          ""
        ]);
        // Alignement à droite pour la colonne "Nb de copies" (colonne E)
        row.getCell(5).alignment = { horizontal: "left" };
      });

      worksheet.addRow([]); // ligne vide entre correcteurs
    });

    // 🔹 GRAND TOTAL
    const rowTotal = worksheet.addRow(["", "", "", "", "", "Grand Total", formatMontant(grandTotal)]);
    rowTotal.font = { bold: true };
    rowTotal.getCell(6).alignment = { horizontal: "right" }; // Alignement à droite pour "Grand Total"
    rowTotal.getCell(7).alignment = { horizontal: "right" }; // Alignement à droite pour le montant total

    // Ajuster largeur colonnes
    worksheet.columns = [
      { width: 35 }, // Nom
      { width: 12 }, // Matières
      { width: 20 }, // Spécialité
      { width: 25 }, // Pochettes
      { width: 15 }, // Nb copies
      { width: 15 }, // Montant
      { width: 15 }  // Total
    ];

    // Sauvegarde et téléchargement
    const filePath = path.join(__dirname, `../files/vacations_${specialite}.xlsx`);
    await workbook.xlsx.writeFile(filePath);
    res.download(filePath, `vacations_${specialite}.xlsx`);

  } catch (error) {
    console.error("Erreur :", error);
    res.status(500).send("Erreur lors de la génération du fichier Excel");
  }
};

// Générer un PDF de paiement pour un correcteur
// exports.generatePaiementPDF = async (req, res, next) => {
//   try {
//     const { idCorrecteur, session } = req.params;

//     // Récupérer les paiements du correcteur pour la session donnée
//     const paiements = await Paiement.find({ idCorrecteur, session });

//     if (!paiements || paiements.length === 0) {
//       return res.status(404).json({ message: "Aucun paiement trouvé pour ce correcteur." });
//     }

//     // On suppose que les infos de base du correcteur sont dans le premier paiement
//     const correcteur = paiements[0];
//     const totalMontant = paiements.reduce((sum, p) => sum + (p.montantTotal || 0), 0);

//     // Création du PDF
//     const doc = new PDFDocument({ margin: 50 });
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", `attachment; filename=paiement_${correcteur.nom}_${correcteur.prenom}.pdf`);
//     res.setHeader("Access-Control-Expose-Headers", "Content-Disposition"); // <-- ajout important
//     doc.pipe(res);

//     // === En-tête officiel ===
//     doc
//       .fontSize(12)
//       .text("REPOBILIKAN'I MADAGASIKARA", { align: "center" })
//       .text("Fitiavana - Tanindrazana - Fandrosoana", { align: "center" })
//       .text("----------------------------", { align: "center" })
//       .text("MINISTERE DE L'ENSEIGNEMENT SUPÉRIEUR", { align: "center" })
//       .text("ET DE LA RECHERCHE SCIENTIFIQUE", { align: "center" })
//       .text("----------------------------", { align: "center" })
//       .text("UNIVERSITÉ DE TOLIARA", { align: "center" })
//       .text("----------------------------", { align: "center" })
//       .text("PRESIDENCE", { align: "center" })
//       .moveDown()
//       .text(`ANNEE : ${new Date().getFullYear()}`, { align: "center" })
//       .text("VACATION DES CORRECTEURS", { align: "center" })
//       .moveDown(2);

//     // === Informations correcteur ===
//     doc.fontSize(11).text(`Nom complet : ${correcteur.nom} ${correcteur.prenom}`);
//     doc.text(`Immatricule : ${correcteur.immatricule}`);
//     doc.text(`CIN : ${correcteur.cin}`);
//     doc.text(`Mode de paiement : DIRECTE`);
//     doc.moveDown(2);

//     // === Tableau des vacations ===
//     const tableTop = doc.y;
//     const itemSpacing = 25;

//     // En-têtes
//     doc.font("Helvetica-Bold");
//     doc.text("Matière", 50, tableTop);
//     doc.text("Spécialité", 150, tableTop);
//     doc.text("Pochettes", 280, tableTop);
//     doc.text("Nb copies", 380, tableTop);
//     doc.text("Montant", 460, tableTop);
//     doc.font("Helvetica");

//     let y = tableTop + 20;
//     paiements.forEach((p) => {
//       doc.text(p.matiere || "-", 50, y);
//       doc.text(p.specialite || "-", 150, y);
//       doc.text(p.pochette || "-", 280, y);
//       doc.text(p.nbcopie?.toString() || "0", 380, y);
//       doc.text(`${p.montantTotal?.toFixed(2) || "0"} Ar`, 460, y, { align: "left" });
//       y += itemSpacing;
//     });

//     // Total
//     doc.font("Helvetica-Bold");
//     doc.text("TOTAL", 380, y + 10);
//     doc.text(`${totalMontant.toFixed(2)} Ar`, 460, y + 10);
//     doc.font("Helvetica");
//     doc.moveDown(4);

//     // === Signature ===
//     doc.text("Signature du correcteur :", 50, y + 80);
//     doc.text("_________________________", 50, y + 110);

//     doc.end();
//   } catch (error) {
//     console.error("Erreur génération PDF:", error);
//     next(error);
//   }
// };


// Générer un PDF de paiement pour un correcteur
exports.generatePaiementPDF = async (req, res, next) => {
  try {
    const { idCorrecteur, session } = req.params;

    // Récupérer les paiements du correcteur pour la session donnée
    const paiements = await Paiement.find({ idCorrecteur, session });

    if (!paiements || paiements.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucun paiement trouvé pour ce correcteur." });
    }

    const correcteur = paiements[0];
    const totalMontant = paiements.reduce(
      (sum, p) => sum + (p.montantTotal || 0),
      0
    );

    // Fonction utilitaire pour formater montant
    const formatMontant = (val) =>
      (val || 0).toLocaleString("fr-FR").replace(/\s/g, " ") + " Ar";

    // Création du PDF
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=paiement_${correcteur.nom}_${correcteur.prenom}.pdf`
    );
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
    doc.pipe(res);

    // === Logo (en haut à gauche) ===
    try {
      doc.image("public/favicon.ico", 30, 40, { width: 65 }); // un peu plus à gauche et plus petit
    } catch (err) {
      console.warn("⚠️ Logo introuvable, vérifie le chemin.");
    }

    // === En-tête officiel ===
    doc
      .fontSize(12)
      .text("UNIVERSITÉ DE TOLIARA", 0, 40, { align: "center" })
      .text("----------------------------", { align: "center" })
      .text("OFFICE DU BACCALAUREAT", { align: "center" })
      .fontSize(13)
      .text(`BACCALAUREAT : ${new Date().getFullYear()}`, { align: "center" })
      .text("VACATION DES CORRECTEURS", {
        align: "center",
        underline: true,
      })
      .moveDown(2);

    // === Informations correcteur (alignées avec logo) ===
    const infoX = 40; // Décalage vers la droite
    doc.fontSize(11).text(`Nom complet : ${correcteur.prenom} ${correcteur.nom}`, infoX);
    doc.text(`I.M : ${correcteur.immatricule}`, infoX);
    doc.text(`CIN : ${correcteur.cin}`, infoX);
    doc.text(`Correcteur du baccalauréat : ${correcteur.specialite}`, infoX);
    doc.text(`Mode de paiement : DIRECTE`, infoX);
    doc.moveDown(2);

    // === Tableau avec pdfkit-table ===
    const table = {
      title: "Détail des vacations",
      headers: [
        { label: "Matière", property: "matiere", width: 100, align: "center" },
        { label: "Spécialité", property: "specialite", width: 100, align: "center" },
        { label: "Pochette", property: "pochette", width: 100, align: "center" },
        { label: "Nb copies", property: "nbcopie", width: 80, align: "center" },
        { label: "Montant", property: "montantTotal", width: 100, align: "center" },
      ],
      datas: paiements.map((p) => ({
        matiere: p.matiere || "-",
        specialite: p.secteur || "-",
        pochette: p.pochette || "-",
        nbcopie: p.nbcopie?.toString() || "0",
        montantTotal: formatMontant(p.montantTotal),
      })),
    };

    await doc.table(table, {
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
      prepareRow: (row, i) => doc.font("Helvetica").fontSize(9),
      divider: {
        header: { disabled: false, width: 1, opacity: 0.5 },
        horizontal: { disabled: false, width: 0.5, opacity: 0.3 },
      },
    });

    // === Ligne du total ===
    doc.moveDown();
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .text(`TOTAL : ${formatMontant(totalMontant)}`, 400);

    // === Date et lieu (vide à remplir manuellement) ===
    doc.moveDown(3);
    doc
      .font("Helvetica-Oblique")
      .fontSize(11)
      .text("Fait à Toliara, le ..........................", 350);

    // === Signatures (alignées gauche et droite) ===
    doc.moveDown(2);

    const y = doc.y;
    doc.font("Helvetica").fontSize(11);

    // Signature correcteur à gauche
    doc.text("Signature du correcteur :", 50, y);
    doc.text("_________________________", 50, y + 40);

    // Signature Office à droite
    doc.text("Signature Office du Baccalauréat :", 350, y);
    doc.text("_________________________", 350, y + 40);

    doc.end();
  } catch (error) {
    console.error("Erreur génération PDF:", error);
    next(error);
  }
};












