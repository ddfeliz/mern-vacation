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

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Paiements - ${specialite}`);

    // 🟡 TITRE OFFICIEL CENTRÉ
    const headerLines = [
      "REPOBILIKAN'I MADAGASIKARA",
      "Fitiavana-Tanindrazana-Fandrosoana",
      "----------------------------",
      "MINISTERE DE L'ENSEIGNEMENT SUPPERIEUR",
      "ET DE LA RECHERCHE SCIENTIFIQUE",
      "----------------------------",
      "UNIVERSITE DE TOLIARA",
      "----------------------------",
      "PRESIDENCE",
      ""
    ];

    // Centrer chaque ligne de l'en-tête sur les 9 colonnes du tableau
    headerLines.forEach((line, index) => {
      const row = worksheet.addRow([line]);
      worksheet.mergeCells(`A${row.number}:I${row.number}`);
      row.alignment = { horizontal: "center", vertical: "middle" };
      row.font = { bold: true };
    });

    worksheet.addRow([]);

    // 🟢 EN-TÊTE DU TABLEAU
    worksheet.columns = [
      { header: "Nom et Prénom(s)", key: "nomPrenom", width: 30 },
      { header: "CIN", key: "cin", width: 15 },
      { header: "Montant", key: "montantTotal", width: 15 },
      { header: "Spécialité", key: "specialite", width: 20 },
      { header: "Secteur", key: "secteur", width: 20 },
      { header: "Option", key: "option", width: 20 },
      { header: "Matière", key: "matiere", width: 20 },
      { header: "Pochette", key: "pochette", width: 30 },
      { header: "Nombre de Copies", key: "nbcopie", width: 20 },
    ];

    let grandTotal = 0;

    data.forEach((correcteur) => {
      const { correcteurInfo, vacations } = correcteur;
      const totalCorrecteur = vacations.reduce((sum, v) => sum + v.montantTotal, 0);
      grandTotal += totalCorrecteur;

      // 🟦 Ligne principale (correcteur)
      worksheet.addRow({
        nomPrenom: `${correcteurInfo.nom} ${correcteurInfo.prenom}`,
        cin: correcteurInfo.cin,
        montantTotal: totalCorrecteur,
        specialite: correcteurInfo.specialite,
        secteur: "",
        option: "",
        matiere: "",
        pochette: "",
        nbcopie: "",
      });

      // 🟩 Détails des vacations
      vacations.forEach((vacation) => {
        worksheet.addRow({
          nomPrenom: "",
          cin: "",
          montantTotal: vacation.montantTotal,
          specialite: "",
          secteur: vacation.secteur,
          option: vacation.option,
          matiere: vacation.matiere,
          pochette: vacation.pochette,
          nbcopie: vacation.nbcopie,
        });
      });

      worksheet.addRow({});
    });

    // 🔴 Ligne du GRAND TOTAL
    const totalRow = worksheet.addRow({
      nomPrenom: "",
      cin: "",
      montantTotal: grandTotal,
      specialite: "",
      secteur: "",
      option: "Grand Total",
      matiere: "",
      pochette: "",
      nbcopie: "",
    });

    totalRow.font = { bold: true };

    // 📁 Génération du fichier Excel
    const filePath = path.join(__dirname, `../files/paiements_${specialite}.xlsx`);
    await workbook.xlsx.writeFile(filePath);
    res.download(filePath, `paiements_${specialite}.xlsx`);
  } catch (error) {
    console.error("Erreur :", error);
    res.status(500).send("Erreur lors de la génération du fichier Excel");
  }
};
