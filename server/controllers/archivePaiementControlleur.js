const archivePayment = require("../models/archivePaiementModel");
const Payment = require("../models/paiementModel");
const CreateError = require('../utils/appError'); // Import de la fonction CreateError

// Fonction qui archive les paiements d'une année spécifique
exports.archivePaymentCount = async (year) => {
    if (!year || typeof year !== 'number') {
        return { success: false, message: 'L\'année est invalide.' };
    }
    
    try {
        const payments = await Payment.find({ session: year });

        if (!payments.length) {
            return { success: false, message: `Aucun paiement trouvé pour l'année ${year}.` };
        }

        // Copier les paiements dans la collection d'archives
        await archivePayment.insertMany(payments);

        // Supprimer les paiements de la collection principale
        await Payment.deleteMany({ session: year });

        console.log(`Paiements de l'année ${year} archivés avec succès.`);
        return { success: true, message: `Paiements de l'année ${year} archivés.` };
    } catch (error) {
        console.error('Erreur lors de l\'archivage des paiements:', error);
        // Gestion correcte des erreurs sans utiliser `next` ici car il n'est pas dans un middleware
        return { success: false, message: 'Erreur lors de l\'archivage des paiements.', error };
    }
};

// Fonction pour récupérer les paiements archivés
exports.getArchivePayment = async (req, res, next) => {
    try {
        const archives = await archivePayment.find();
        
        // Vérifier si des archives existent
        if (!archives || archives.length === 0) {
            return next(new CreateError(404, 'Aucun archivage du paiement trouvé.'));
        }
  
        // Répondre avec la liste des archives
        res.status(200).json(archives);
    } catch (error) {
        next(new CreateError(500, 'Erreur lors de la récupération de la liste des paiements.', error));
    }
};

// Fonction pour obtenir les informations d'une archive par son identifiant MongoDB
exports.getArchiveByIdPayment = async (req, res, next) => {
  try {
    const { idPayment } = req.params; // Extraction de l'identifiant depuis les paramètres de la requête

    // Rechercher l'archive par son identifiant MongoDB
    const archive = await archivePayment.findOne({ idPayment });
    if (!archive) {
      return next(new CreateError(404, 'Archive non trouvée.'));
    }

    res.status(200).json(archive);
  } catch (error) {
    next(new CreateError(500, 'Erreur lors de la récupération de l\'archive.', error));
    console.log(error);
  }
};


  // Fonction pour supprimer un archive par son identifiant MongoDB
exports.deleteArchive = async (req, res, next) => {
    try {
      const { idPayment } = req.params; // Extraction de l'identifiant depuis les paramètres de la requête
  
      // Supprimer le paiement par son identifiant MongoDB
      const archive = await archivePayment.findOneAndDelete(idPayment);
      
      if (!archive) {
        return next(new CreateError(404, 'Archive non trouvé.'));
      }
  
      res.status(200).json({ message: 'Archive supprimé avec succès.' });
    } catch (error) {
      next(new CreateError(500, 'Erreur lors de la suppression du archive.', error));
    }
  };

  

// Fonction pour compter les totales des correcteurs
exports.CountArchive = async (req, res, next) => {
  try {
    const archivesCount = await archivePayment.countDocuments();
    res.status(200).json({ totalArchives: archivesCount });
  } catch (error) {
    next(
      new CreateError(500, "Erreur lors de la compte des correcteurs.", error)
    );
  }
};
  
  
