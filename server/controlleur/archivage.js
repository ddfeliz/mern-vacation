const archivePaiement = require("../modelisation/archivage");
const Paiement = require("../modelisation/paiement");
const CreateError = require('../utils/appError'); // Import de la fonction CreateError

// Fonction qui archive les paiements d'une année spécifique
exports.archivePaiementCompte = async (year) => {
    if (!year || typeof year !== 'number') {
        return { success: false, message: 'L\'année est invalide.' };
    }
    
    try {
        const paiements = await Paiement.find({ session: year });

        if (!paiements.length) {
            return { success: false, message: `Aucun paiement trouvé pour l'année ${year}.` };
        }

        // Copier les paiements dans la collection d'archives
        await archivePaiement.insertMany(paiements);

        // Supprimer les paiements de la collection principale
        await Paiement.deleteMany({ session: year });

        console.log(`Paiements de l'année ${year} archivés avec succès.`);
        return { success: true, message: `Paiements de l'année ${year} archivés.` };
    } catch (error) {
        console.error('Erreur lors de l\'archivage des paiements:', error);
        // Gestion correcte des erreurs sans utiliser `next` ici car il n'est pas dans un middleware
        return { success: false, message: 'Erreur lors de l\'archivage des paiements.', error };
    }
};

// Fonction pour récupérer les paiements archivés
exports.avoirArchivePaiement = async (req, res, next) => {
    try {
        const archives = await archivePaiement.find();
        
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
exports.avoirArchiveIdPaiement = async (req, res, next) => {
  try {
    const { idPaiement } = req.params; // Extraction de l'identifiant depuis les paramètres de la requête

    // Rechercher l'archive par son identifiant MongoDB
    const archive = await archivePaiement.findOne({ idPaiement });
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
exports.supprimerArchive = async (req, res, next) => {
    try {
      const { idPaiement } = req.params; // Extraction de l'identifiant depuis les paramètres de la requête
  
      // Supprimer le paiement par son identifiant MongoDB
      const archive = await archivePaiement.findOneAndDelete(idPaiement);
      
      if (!archive) {
        return next(new CreateError(404, 'Archive non trouvé.'));
      }
  
      res.status(200).json({ message: 'Archive supprimé avec succès.' });
    } catch (error) {
      next(new CreateError(500, 'Erreur lors de la suppression du archive.', error));
    }
  };

  

// Fonction pour compter les totales des correcteurs
exports.CompterArchive = async (req, res, next) => {
  try {
    const archivesCount = await archivePaiement.countDocuments();
    res.status(200).json({ totalArchives: archivesCount });
  } catch (error) {
    next(
      new CreateError(500, "Erreur lors de la compte des correcteurs.", error)
    );
  }
};
  
  
