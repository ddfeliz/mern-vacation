const Baccalaureat = require('../modelisation/baccalaureat');
const CreateError = require('../utils/appError');


exports.ajoutBaccalaureat = async (req, res, next) => {
    try {
        let matières = req.body; 

        if (!Array.isArray(matières)) {
            matières = [matières];
        }

        if (matières.length === 0) {
            return next(new CreateError(400, 'Un tableau de matières doit être fourni.'));
        }

        const addedMatieres = [];

        for (const matière of matières) {
            const {
                libelleSpecialite,
                libelleSecteur,
                codeSerieOption,
                libelleCourt,
                libelleOption,
                libCourtMatiere,
                nomMatiere
            } = matière;

            if (!libelleSpecialite ||
                !libelleSecteur ||
                !codeSerieOption ||
                !libelleCourt ||
                !libelleOption ||
                !libCourtMatiere ||
                !nomMatiere) {
                return next(new CreateError(400, 'Tous les champs obligatoires doivent être fournis pour chaque matière.'));
            }

            const matiereBaccExist = await Baccalaureat.findOne({ codeSerieOption, nomMatiere });
            if (matiereBaccExist) {
                return next(new CreateError(409, `Un matière baccalauréat avec le code ${codeSerieOption} et le nom ${nomMatiere} existe déjà.`));
            }

            const newBaccalaureat = new Baccalaureat({
                libelleSpecialite,
                libelleSecteur,
                codeSerieOption,
                libelleCourt,
                libelleOption,
                libCourtMatiere,
                nomMatiere,
                idMatiere: `LBMAT-${Math.floor(1000 + Math.random() * 9000)}` // Générer un identifiant unique
            });

            await newBaccalaureat.save();
            addedMatieres.push(newBaccalaureat); // Ajouter à la liste des matières ajoutées
        }

        res.status(201).json({
            message: 'Matières baccalauréat ajoutées avec succès.',
            matieres: addedMatieres.map(matiere => ({
                idMatiere: matiere.idMatiere,
                libelleSpecialite: matiere.libelleSpecialite,
                libelleSecteur: matiere.libelleSecteur,
                codeSerieOption: matiere.codeSerieOption,
                libelleCourt: matiere.libelleCourt,
                libelleOption: matiere.libelleOption,
                libCourtMatiere: matiere.libCourtMatiere,
                nomMatiere: matiere.nomMatiere
            }))
        });
    } catch (error) {
        console.error(error);
        next(new CreateError(500, 'Erreur lors de l\'ajout des matières baccalauréat.', error));
    }
};


exports.avoirTousBaccalaureats = async (req, res, next) => {
    try {

        const baccalaureats = await Baccalaureat.find();

        if (!baccalaureats || baccalaureats.length === 0) {
            return next(new CreateError(404, 'Aucun matière baccalauréat trouvé.'));
        }

        res.status(200).json(baccalaureats);
    } catch (error) {
        next(new CreateError(500, 'Erreur lors de la récupération de la liste des matières baccalauréats.', error));
    }
};



exports.avoirIdBaccalaureat = async (req, res, next) => {
    try {
        const { idMatiere } = req.params;

        const matiere = await Baccalaureat.findOne({ idMatiere });
        if (!matiere) {
            return next(new CreateError(404, 'Matière baccalauréat non trouvé.'));
        }

        res.status(200).json(matiere);
    } catch (error) {
        next(new CreateError(500, 'Erreur lors de la récupération du matière baccalauréat.', error));
    }
};


exports.modificationBaccalaureat = async (req, res, next) => {
    try {
        const { idMatiere } = req.params;
        const updates = req.body;
        const matiere = await Baccalaureat.findOneAndUpdate(
            { idMatiere },
            updates,
            { new: true, runValidators: true }
        );
        if (!matiere) {
            return next(new CreateError(404, 'Matière baccalauréat non trouvé.'));
        }

        res.status(200).json({
            message: 'Matière baccalauréat mis à jour avec succès.',
            matiere
        });
    } catch (error) {
        next(new CreateError(500, 'Erreur lors de la mise à jour du matière baccalauréat.', error));
    }
};


exports.suppressionBaccalaureat = async (req, res, next) => {
    try {
        const { idMatiere } = req.params;

        
        const matiere = await Baccalaureat.findOneAndDelete({ idMatiere });
        if (!matiere) {
            return next(new CreateError(404, 'Matière baccalauréat non trouvé.'));
        }

        res.status(200).json({
            message: 'Matière baccalauréat supprimé avec succès.'
        });
    } catch (error) {
        next(new CreateError(500, 'Erreur lors de la suppression du matière baccalauréat.', error));
    }
};

exports.avoirLibelleSpecialite = async (req, res, next) => {
    try {
        
        const specialites = await Baccalaureat.distinct('libelleSpecialite');

        res.status(200).json({
            message: 'Spécialités récupérées avec succès.',
            specialites
        });
    } catch (err) {
        next(new CreateError(500, 'Erreur lors de la récupération des spécialités', err));
    }
};


exports.avoirSecteurs = async (req, res, next) => {
    const { specialite } = req.query;

    if (!specialite) {
        return res.status(400).json({ message: 'Spécialité non fournie.' });
    }

    try {
        
        const secteurs = await Baccalaureat.find({ libelleSpecialite: specialite }).distinct('libelleCourt');
        res.status(200).json({
            message: `Secteurs pour la spécialité ${specialite} récupérés avec succès.`,
            secteurs
        });
    } catch (err) {
        next(new CreateError(500, 'Erreur lors de la récupération des spécialités', err));
    }
};


exports.avoirLibelleOption = async (req, res, next) => {
    const { secteur } = req.query;

    if (!secteur) {
        return res.status(400).json({ message: 'Secteur non fourni.' });
    }

    try {
        
        const options = await Baccalaureat.find({ libelleCourt: secteur }).distinct('libelleOption');
        res.status(200).json({
            message: `Matières pour le secteur ${secteur} récupérées avec succès.`,
            options
        });
    } catch (err) {
        next(new CreateError(500, 'Erreur lors de la récupération des spécialités', err));
    }
};


exports.avoirMatieres = async (req, res, next) => {
    const { option } = req.query;

    if (!option) {
        return res.status(400).json({ message: 'Secteur non fourni.' });
    }

    try {
        
        const matieres = await Baccalaureat.find({ libelleOption: option }).distinct('nomMatiere');
        res.status(200).json({
            message: `Matières pour le secteur ${option} récupérées avec succès.`,
            matieres
        });
    } catch (err) {
        next(new CreateError(500, 'Erreur lors de la récupération des spécialités', err));
    }
};



