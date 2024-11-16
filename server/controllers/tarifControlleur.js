const Tarif = require('../models/tarifModel'); // Assurez-vous que le chemin vers le modèle est correct
const CreateError = require('../utils/appError'); // Assurez-vous que l'import est correct


// Créer un nouveau tarif
exports.createTarif = async (req, res, next) => {
    try {
        const { optionTarif, nombreTarif, MontantTarif } = req.body;

        // Vérification des données d'entrée
        if (!optionTarif || !nombreTarif || !MontantTarif) {
            return next(new CreateError(400, 'Tous les champs sont requis.'));
        }

        // Création d'une nouvelle instance de tarif
        const newTarif = new Tarif({
            optionTarif,
            nombreTarif,
            MontantTarif,
            idTarif: `TARF-${Math.floor(1000 + Math.random() * 9000)}` // Générer un identifiant unique
        });

        // Sauvegarde dans la base de données
        const savedTarif = await newTarif.save();
        res.status(201).json(savedTarif);
    } catch (error) {
        next(new CreateError(500, 'Erreur lors de la création du tarif', error));
    }
};

// Récupérer tous les tarifs
exports.getAllTarifs = async (req, res, next) => {
    try {
        const tarifs = await Tarif.find();

        // Vérifier si des matières existent
        if (!tarifs || tarifs.length === 0) {
            return next(new CreateError(404, 'Aucun matière baccalauréat trouvé.'));
        }
        res.status(200).json(tarifs);
    } catch (error) {
        next(new CreateError(500, 'Erreur lors de la récupération des tarifs.', error));
    }
};

// Récupérer un tarif par son ID
exports.getTarifById = async (req, res, next) => {
    try {
        const { idTarif } = req.params;
        const tarif = await Tarif.findOne({idTarif});

        if (!tarif) {
            return next(new CreateError(404, 'Tarif non trouvé.'));
        }

        res.status(200).json(tarif);
    } catch (error) {
        next(new CreateError(500, 'Erreur lors de la récupération du tarif.', error));
    }
};

// Contrôleur pour vérifier l'existence d'un tarif
exports.checkTarif = async (req, res) => {
    const { optionTarif, nombreTarif, MontantTarif } = req.query;
  
    try {
      // Rechercher un tarif existant avec les mêmes critères
      const existingTarif = await Tarif.findOne({
        optionTarif,
        nombreTarif,
        MontantTarif,
      });
  
      if (existingTarif) {
        return res.status(200).json({ exists: true });
      }
  
      return res.status(200).json({ exists: false });
    } catch (error) {
      console.error('Erreur lors de la vérification du tarif:', error);
      next(new CreateError(500, 'Erreur lors de la récupération du tarif.', error));
    }
  };

// Mettre à jour un tarif par son ID
exports.updateTarif = async (req, res, next) => {
    try {
        const { idTarif } = req.params;
        const { optionTarif, nombreTarif, MontantTarif } = req.body;

        // Vérification des données d'entrée
        if (!optionTarif || !nombreTarif || !MontantTarif) {
            return res.status(400).json({ message: 'Tous les champs sont requis.' });
        }

        // Utilisation de findOneAndUpdate pour mettre à jour le tarif
        const updatedTarif = await Tarif.findOneAndUpdate(
            { idTarif }, // Condition pour trouver le tarif par ID
            { optionTarif, nombreTarif, MontantTarif },
            { new: true, runValidators: true }
        );

        // Vérification si le tarif a été trouvé et mis à jour
        if (!updatedTarif) {
            return next(new CreateError(404, 'Tarif non trouvé.'));
        }

        // Retourner le tarif mis à jour
        res.status(200).json(updatedTarif);
    } catch (error) {
        next(new CreateError(500, 'Erreur lors de la mise à jour du tarif.', error));
        console.log(error);
        
    }
};


// Supprimer un tarif par son ID
exports.deleteTarif = async (req, res, next) => {
    try {
        const { idTarif } = req.params;

        const deletedTarif = await Tarif.findOneAndDelete(idTarif);

        if (!deletedTarif) {
            return next(new CreateError(404, 'Tarif non trouvé.'));
        }

        res.status(200).json({ message: 'Tarif supprimé avec succès.' });
    } catch (error) {
        next(new CreateError(500, 'Erreur lors de la suppression du tarif.', error));
    }
};
