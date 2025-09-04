const Correcteur = require("../modelisation/correcteur"); 
const Vacation = require('../modelisation/vacation');
const CreateError = require("../utils/appError"); 
const fs = require('fs');
const PdfPrinter = require('pdfmake');

// Définition des fonts pour PdfPrinter
const fonts = {
  Roboto: {
    normal: 'node_modules/pdfmake/build/vfs_fonts.js',
    bold: 'node_modules/pdfmake/build/vfs_fonts.js',
    italics: 'node_modules/pdfmake/build/vfs_fonts.js',
    bolditalics: 'node_modules/pdfmake/build/vfs_fonts.js'
  }
};


const printer = new PdfPrinter(fonts);

exports.ajoutCorrecteur = async (req, res, next) => {
  try {
    const {
      nom,
      prenom,
      immatricule,
      cin,
      telephone,
      adresse,
      adresseProfession,
      specialite,
      secteur,
      option,
      matiere,
    } = req.body;

    if (
      !nom ||
      !prenom ||
      !immatricule||
      !cin ||
      !adresse ||
      !adresseProfession ||
      !telephone ||
      !specialite ||
      !secteur 
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
      immatricule,
      cin,
      adresse,
      adresseProfession,
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

exports.avoirCINCorrecteur = async (req, res, next) => { // Ajout de next
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

exports.avoirIdCorrecteur = async (req, res, next) => { // Ajout de next
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

//Generer PDF
exports.genererPDFCorrecteurs = async (req, res, next) => {
  try {
    // Récupérer les filtres depuis le body de la requête
    const { specialite, secteur } = req.body;

    // Construction de la requête de filtrage
    let filter = {};
    if (specialite) {
      filter.specialite = specialite;
    }
    if (secteur) {
      filter.secteur = secteur;
    }

    // Récupérer les correcteurs avec filtres
    const correcteurs = await Correcteur.find(filter);

    if (!correcteurs || correcteurs.length === 0) {
      return next(new CreateError(404, "Aucun correcteur trouvé pour les critères sélectionnés."));
    }

    // Si une spécialité spécifique est demandée, traiter uniquement celle-ci
    if (specialite) {
      // Grouper par secteur pour cette spécialité
      const groupedBySecteur = correcteurs.reduce((acc, corr) => {
        const sect = corr.secteur || 'Non spécifié';
        if (!acc[sect]) acc[sect] = [];
        acc[sect].push(corr);
        return acc;
      }, {});

      // Définition du document PDF pour une spécialité spécifique
      const docDefinition = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [30, 50, 30, 50],
        content: [
          { 
            text: `Liste des Correcteurs - Spécialité: ${specialite}`, 
            style: 'header', 
            alignment: 'center' 
          },
          { 
            text: `Générée le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 
            style: 'date', 
            alignment: 'center' 
          }
        ],
        styles: {
          header: { 
            fontSize: 18, 
            bold: true, 
            margin: [0, 0, 0, 15],
            color: '#2c3e50'
          },
          date: {
            fontSize: 10,
            italics: true,
            margin: [0, 0, 0, 20],
            color: '#7f8c8d'
          },
          subheader: { 
            fontSize: 14, 
            bold: true, 
            margin: [0, 20, 0, 10],
            color: '#34495e'
          },
          tableHeader: { 
            bold: true, 
            fontSize: 10, 
            color: 'white',
            fillColor: '#3498db'
          }
        },
        defaultStyle: { 
          fontSize: 9,
          font: 'Roboto'
        }
      };

      // Ajouter chaque secteur pour la spécialité spécifique
      for (const secteur in groupedBySecteur) {
        docDefinition.content.push({ 
          text: `Secteur: ${secteur} (${groupedBySecteur[secteur].length} correcteurs)`, 
          style: 'subheader' 
        });

        const tableBody = [
          [
            { text: 'Nom', style: 'tableHeader' },
            { text: 'Prénom', style: 'tableHeader' },
            { text: 'Immatricule', style: 'tableHeader' },
            { text: 'CIN', style: 'tableHeader' },
            { text: 'Téléphone', style: 'tableHeader' },
            { text: 'Adresse Prof.', style: 'tableHeader' },
            { text: 'Matière', style: 'tableHeader' },
            { text: 'Statut', style: 'tableHeader' }
          ]
        ];

        groupedBySecteur[secteur].forEach(corr => {
          tableBody.push([
            corr.nom || 'N/A',
            corr.prenom || 'N/A',
            corr.immatricule || 'N/A',
            corr.cin || 'N/A',
            corr.telephone || 'N/A',
            corr.adresseProfession || 'N/A',
            corr.matiere || 'N/A',
            corr.statut || 'N/A'
          ]);
        });

        docDefinition.content.push({
          table: {
            headerRows: 1,
            widths: ['12%', '12%', '12%', '12%', '12%', '18%', '12%', '10%'],
            body: tableBody
          },
          layout: {
            fillColor: function (rowIndex) {
              return (rowIndex === 0) ? '#3498db' : (rowIndex % 2 === 0) ? '#ecf0f1' : null;
            },
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 2 : 1;
            },
            vLineWidth: function () {
              return 1;
            },
            hLineColor: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? '#2c3e50' : '#bdc3c7';
            },
            vLineColor: function () {
              return '#bdc3c7';
            }
          },
          margin: [0, 0, 0, 15]
        });
      }

      // Total général pour la spécialité
      docDefinition.content.push({
        text: `TOTAL GÉNÉRAL: ${correcteurs.length} correcteurs`,
        style: {
          fontSize: 12,
          bold: true,
          color: '#2c3e50',
          alignment: 'center'
        },
        margin: [0, 20, 0, 0]
      });

      // Générer et retourner le PDF pour une spécialité
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      
      const fileName = `correcteurs_${specialite.replace(/\s/g, '_')}_${Date.now()}.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      
      pdfDoc.pipe(res);
      pdfDoc.end();

    } else {
      // CAS GÉNÉRAL: Générer des PDFs pour TOUTES les spécialités
      // Grouper par spécialité d'abord
      const groupedBySpecialite = correcteurs.reduce((acc, corr) => {
        const spec = corr.specialite || 'Non spécifiée';
        if (!acc[spec]) acc[spec] = [];
        acc[spec].push(corr);
        return acc;
      }, {});

      const specialites = Object.keys(groupedBySpecialite);
      
      // Si un seul fichier PDF avec toutes les spécialités est souhaité
      if (req.body.singleFile === true) {
        // Créer UN SEUL PDF avec toutes les spécialités
        const docDefinition = {
          pageSize: 'A4',
          pageOrientation: 'landscape',
          pageMargins: [30, 50, 30, 50],
          content: [
            { 
              text: 'Liste Complète des Correcteurs - Toutes Spécialités', 
              style: 'mainHeader', 
              alignment: 'center' 
            },
            { 
              text: `Générée le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 
              style: 'date', 
              alignment: 'center' 
            },
            {
              text: `Nombre total de spécialités: ${specialites.length} | Nombre total de correcteurs: ${correcteurs.length}`,
              style: 'summary',
              alignment: 'center'
            }
          ],
          styles: {
            mainHeader: { 
              fontSize: 20, 
              bold: true, 
              margin: [0, 0, 0, 10],
              color: '#1a237e'
            },
            date: {
              fontSize: 10,
              italics: true,
              margin: [0, 0, 0, 10],
              color: '#7f8c8d'
            },
            summary: {
              fontSize: 11,
              bold: true,
              margin: [0, 0, 0, 25],
              color: '#2c3e50'
            },
            specialiteHeader: { 
              fontSize: 16, 
              bold: true, 
              margin: [0, 25, 0, 15],
              color: '#2c3e50',
              background: '#ecf0f1'
            },
            subheader: { 
              fontSize: 13, 
              bold: true, 
              margin: [0, 15, 0, 8],
              color: '#34495e'
            },
            tableHeader: { 
              bold: true, 
              fontSize: 9, 
              color: 'white',
              fillColor: '#3498db'
            }
          },
          defaultStyle: { 
            fontSize: 8,
            font: 'Roboto'
          }
        };

        // Parcourir toutes les spécialités
        for (const specialite of specialites) {
          const correctorsSpec = groupedBySpecialite[specialite];
          
          // Ajouter le header de la spécialité
          docDefinition.content.push({ 
            text: `SPÉCIALITÉ: ${specialite.toUpperCase()} (${correctorsSpec.length} correcteurs)`, 
            style: 'specialiteHeader',
            pageBreak: specialites.indexOf(specialite) > 0 ? 'before' : undefined
          });

          // Grouper par secteur pour cette spécialité
          const groupedBySecteur = correctorsSpec.reduce((acc, corr) => {
            const sect = corr.secteur || 'Non spécifié';
            if (!acc[sect]) acc[sect] = [];
            acc[sect].push(corr);
            return acc;
          }, {});

          // Ajouter chaque secteur
          for (const secteur in groupedBySecteur) {
            docDefinition.content.push({ 
              text: `Secteur: ${secteur} (${groupedBySecteur[secteur].length} correcteurs)`, 
              style: 'subheader' 
            });

            const tableBody = [
              [
                { text: 'Nom', style: 'tableHeader' },
                { text: 'Prénom', style: 'tableHeader' },
                { text: 'Immatricule', style: 'tableHeader' },
                { text: 'CIN', style: 'tableHeader' },
                { text: 'Téléphone', style: 'tableHeader' },
                { text: 'Adresse Prof.', style: 'tableHeader' },
                { text: 'Matière', style: 'tableHeader' },
                { text: 'Statut', style: 'tableHeader' }
              ]
            ];

            groupedBySecteur[secteur].forEach(corr => {
              tableBody.push([
                corr.nom || 'N/A',
                corr.prenom || 'N/A',
                corr.immatricule || 'N/A',
                corr.cin || 'N/A',
                corr.telephone || 'N/A',
                corr.adresseProfession || 'N/A',
                corr.matiere || 'N/A',
                corr.statut || 'N/A'
              ]);
            });

            docDefinition.content.push({
              table: {
                headerRows: 1,
                widths: ['11%', '11%', '11%', '11%', '11%', '17%', '11%', '9%'],
                body: tableBody
              },
              layout: {
                fillColor: function (rowIndex) {
                  return (rowIndex === 0) ? '#3498db' : (rowIndex % 2 === 0) ? '#ecf0f1' : null;
                },
                hLineWidth: function (i, node) {
                  return (i === 0 || i === node.table.body.length) ? 2 : 1;
                },
                vLineWidth: function () {
                  return 1;
                },
                hLineColor: function (i, node) {
                  return (i === 0 || i === node.table.body.length) ? '#2c3e50' : '#bdc3c7';
                },
                vLineColor: function () {
                  return '#bdc3c7';
                }
              },
              margin: [0, 0, 0, 12]
            });
          }

          // Sous-total pour cette spécialité
          docDefinition.content.push({
            text: `Sous-total ${specialite}: ${correctorsSpec.length} correcteurs`,
            style: {
              fontSize: 11,
              bold: true,
              italics: true,
              color: '#34495e',
              alignment: 'right'
            },
            margin: [0, 5, 0, 15]
          });
        }

        // Total général final
        docDefinition.content.push({
          text: `TOTAL GÉNÉRAL FINAL: ${correcteurs.length} correcteurs répartis sur ${specialites.length} spécialités`,
          style: {
            fontSize: 14,
            bold: true,
            color: '#1a237e',
            alignment: 'center'
          },
          margin: [0, 30, 0, 0]
        });

        // Générer le PDF unique
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        const fileName = `correcteurs_toutes_specialites_${Date.now()}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        
        pdfDoc.pipe(res);
        pdfDoc.end();

      } else {
        // GÉNÉRATION MULTIPLE: Créer des PDFs séparés pour chaque spécialité
        // (Logique de votre code original)
        const generatedFiles = [];

        for (const specialite of specialites) {
          const correctorsSpec = groupedBySpecialite[specialite];

          // Grouper par secteur pour cette spécialité
          const groupedBySecteur = correctorsSpec.reduce((acc, corr) => {
            const sect = corr.secteur || 'Non spécifié';
            if (!acc[sect]) acc[sect] = [];
            acc[sect].push(corr);
            return acc;
          }, {});

          // Définition du document PDF pour chaque spécialité
          const docDefinition = {
            pageSize: 'A4',
            pageOrientation: 'landscape',
            pageMargins: [30, 50, 30, 50],
            content: [
              { 
                text: `Liste des Correcteurs - Spécialité: ${specialite}`, 
                style: 'header', 
                alignment: 'center' 
              },
              { 
                text: `Générée le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 
                style: 'date', 
                alignment: 'center' 
              }
            ],
            styles: {
              header: { 
                fontSize: 18, 
                bold: true, 
                margin: [0, 0, 0, 15],
                color: '#2c3e50'
              },
              date: {
                fontSize: 10,
                italics: true,
                margin: [0, 0, 0, 20],
                color: '#7f8c8d'
              },
              subheader: { 
                fontSize: 14, 
                bold: true, 
                margin: [0, 20, 0, 10],
                color: '#34495e'
              },
              tableHeader: { 
                bold: true, 
                fontSize: 10, 
                color: 'white',
                fillColor: '#3498db'
              }
            },
            defaultStyle: { 
              fontSize: 9,
              font: 'Roboto'
            }
          };

          // Ajouter chaque secteur
          for (const secteur in groupedBySecteur) {
            docDefinition.content.push({ 
              text: `Secteur: ${secteur} (${groupedBySecteur[secteur].length} correcteurs)`, 
              style: 'subheader' 
            });

            const tableBody = [
              [
                { text: 'Nom', style: 'tableHeader' },
                { text: 'Prénom', style: 'tableHeader' },
                { text: 'Immatricule', style: 'tableHeader' },
                { text: 'CIN', style: 'tableHeader' },
                { text: 'Téléphone', style: 'tableHeader' },
                { text: 'Adresse Prof.', style: 'tableHeader' },
                { text: 'Matière', style: 'tableHeader' },
                { text: 'Statut', style: 'tableHeader' }
              ]
            ];

            groupedBySecteur[secteur].forEach(corr => {
              tableBody.push([
                corr.nom || 'N/A',
                corr.prenom || 'N/A',
                corr.immatricule || 'N/A',
                corr.cin || 'N/A',
                corr.telephone || 'N/A',
                corr.adresseProfession || 'N/A',
                corr.matiere || 'N/A',
                corr.statut || 'N/A'
              ]);
            });

            docDefinition.content.push({
              table: {
                headerRows: 1,
                widths: ['12%', '12%', '12%', '12%', '12%', '18%', '12%', '10%'],
                body: tableBody
              },
              layout: {
                fillColor: function (rowIndex) {
                  return (rowIndex === 0) ? '#3498db' : (rowIndex % 2 === 0) ? '#ecf0f1' : null;
                },
                hLineWidth: function (i, node) {
                  return (i === 0 || i === node.table.body.length) ? 2 : 1;
                },
                vLineWidth: function () {
                  return 1;
                },
                hLineColor: function (i, node) {
                  return (i === 0 || i === node.table.body.length) ? '#2c3e50' : '#bdc3c7';
                },
                vLineColor: function () {
                  return '#bdc3c7';
                }
              },
              margin: [0, 0, 0, 15]
            });
          }

          // Total pour cette spécialité
          docDefinition.content.push({
            text: `TOTAL GÉNÉRAL: ${correctorsSpec.length} correcteurs`,
            style: {
              fontSize: 12,
              bold: true,
              color: '#2c3e50',
              alignment: 'center'
            },
            margin: [0, 20, 0, 0]
          });

          const fileName = `correcteurs_${specialite.replace(/\s/g, '_')}_${Date.now()}.pdf`;
          generatedFiles.push({
            specialite,
            fileName,
            correcteursCount: correctorsSpec.length
          });
        }

        // Retourner la liste des fichiers générés (pour génération multiple)
        res.status(200).json({
          success: true,
          message: `${generatedFiles.length} PDF(s) générés avec succès`,
          files: generatedFiles,
          totalCorrecteurs: correcteurs.length,
          totalSpecialites: specialites.length
        });
      }
    }

  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    next(new CreateError(500, `Erreur lors de la génération du PDF: ${error.message}`, error));
  }
};
