const Paiement = require('../modelisation/paiement');
const CreateError = require('../utils/appError'); // Import de la fonction CreateError


// Fonction pour ajouter un nouveau vacation
exports.ajoutPaiement = async (req, res, next) => {
  try {
    const {  idVacation, idCorrecteur, immatricule, nom, prenom, cin, specialite, secteur, option, matiere, pochette, nbcopie, optionTarif, montantTotal } = req.body;


    const currentYear = new Date().getFullYear();

    // Vérifier si un correcteur avec l'email existe déjà
    const paiementExist = await Paiement.findOne({ idVacation });
    if (paiementExist) {
      return next(new CreateError(409, 'Un paiement avec cet vacation existe déjà.')); // Ajout de 'new'
    }
    /* const currentYear = new Date().getFullYear(); */


    // Créer un nouvel objet correcteur avec les informations fournies
    const newPaiement = new Paiement({
      idPaiement: `PAYM-${Math.floor(1000 + Math.random() * 9000)}`, // Générer un identifiant unique
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
      "PRESIDENCE",
      "",
      `B - VACATION D'ANNEE: - ${new Date().getFullYear()}`,
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
    // Ligne fusionnée A1:A2 retirée pour éviter conflit
    // worksheet.mergeCells("A1:A2"); 

    worksheet.addRow(["Nom et Prénom(s)", "Total", "Matières", "Pochettes", "Nb de copies", "Montant", "Total"]);

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

    // 🔹 BOUCLE SUR CHAQUE CORRECTEUR
    data.forEach((correcteur) => {
      const { correcteurInfo, vacations } = correcteur;
      const totalCorrecteur = vacations.reduce((sum, v) => sum + v.montantTotal, 0);
      grandTotal += totalCorrecteur;

      // Ligne avec nom + total global
      const rowNom = worksheet.addRow([
        `${correcteurInfo.nom} ${correcteurInfo.prenom}`,
        totalCorrecteur,
        "", "", "", "", totalCorrecteur
      ]);
      rowNom.font = { bold: true };

      // Matières du correcteur
      vacations.forEach((vac) => {
        worksheet.addRow([
          "",
          "",
          vac.matiere,
          vac.pochette,
          vac.nbcopie,
          vac.montantTotal,
          ""
        ]);
      });

      worksheet.addRow([]); // ligne vide entre correcteurs
    });

    // 🔹 GRAND TOTAL
    const rowTotal = worksheet.addRow(["", "", "", "", "", "Grand Total", grandTotal]);
    rowTotal.font = { bold: true };

    // Ajuster largeur colonnes
    worksheet.columns = [
      { width: 35 }, // Nom
      { width: 12 }, // Total global
      { width: 20 }, // Matière
      { width: 25 }, // Pochettes
      { width: 15 }, // Nb copies
      { width: 15 }, // Montant
      { width: 15 }  // Total répété
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






