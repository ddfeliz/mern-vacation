const Tarif = require('../modelisation/tarif'); 
const CreateError = require('../utils/appError'); 

exports.ajoutTarif = async (req, res, next) => {
    try {
        const { optionTarif, nombreTarif, MontantTarif } = req.body;

        if (!optionTarif || !nombreTarif || !MontantTarif) {
            return next(new CreateError(400, 'Tous les champs sont requis.'));
        }

        const newTarif = new Tarif({
            optionTarif,
            nombreTarif,
            MontantTarif,
            idTarif: `TARF-${Math.floor(1000 + Math.random() * 9000)}` 
        });

        const savedTarif = await newTarif.save();
        res.status(201).json(savedTarif);
    } catch (error) {
        next(new CreateError(500, 'Erreur lors de la création du tarif', error));
    }
};

exports.avoirTousTarifs = async (req, res, next) => {
    try {
        const tarifs = await Tarif.find();

        if (!tarifs || tarifs.length === 0) {
            return next(new CreateError(404, 'Aucun matière baccalauréat trouvé.'));
        }
        res.status(200).json(tarifs);
    } catch (error) {
        next(new CreateError(500, 'Erreur lors de la récupération des tarifs.', error));
    }
};

exports.avoirIdTarif = async (req, res, next) => {
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

exports.varificationTarif = async (req, res) => {
    const { optionTarif, nombreTarif, MontantTarif } = req.query;
  
    try {

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

exports.modificationTarif = async (req, res, next) => {
    try {
        const { idTarif } = req.params;
        const { optionTarif, nombreTarif, MontantTarif } = req.body;

        if (!optionTarif || !nombreTarif || !MontantTarif) {
            return res.status(400).json({ message: 'Tous les champs sont requis.' });
        }

        const updatedTarif = await Tarif.findOneAndUpdate(
            { idTarif }, 
            { optionTarif, nombreTarif, MontantTarif },
            { new: true, runValidators: true }
        );

        if (!updatedTarif) {
            return next(new CreateError(404, 'Tarif non trouvé.'));
        }

        res.status(200).json(updatedTarif);
    } catch (error) {
        next(new CreateError(500, 'Erreur lors de la mise à jour du tarif.', error));
        console.log(error);
        
    }
};

exports.suppressionTarif = async (req, res, next) => {
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
