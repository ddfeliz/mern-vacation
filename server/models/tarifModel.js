const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Définir le schéma pour le tarif
const TarifSchema = new Schema({
    idTarif: {
        type: String,
        unique: true,
        required: true
    },
    optionTarif: {
        type: String,
        required: true
    },
    nombreTarif: {
        type: Number, // Représentation numérique du nombre de copies ou autres
        required: true
    },
    MontantTarif: {
        type: Number, // Montant en tant que nombre
        required: true
    }
}, {
    timestamps: true
});

// Middleware pour générer automatiquement l'idTarif avant la sauvegarde
TarifSchema.pre('save', async function (next) {
    const tarif = this;

    // Utilisation de mongoose.model pour accéder au modèle Tarif
    const Tarif = mongoose.model('Tarif');

    // Si l'idTarif n'est pas défini (cas d'ajout d'un nouveau tarif)
    if (!tarif.idTarif) {
        try {
            const lastTarif = await Tarif.findOne().sort({ _id: -1 });

            let newIdNumber = 1;
            if (lastTarif && lastTarif.idTarif) {
                const lastIdNumber = parseInt(lastTarif.idTarif.split('-')[1], 10);
                newIdNumber = lastIdNumber + 1;
            }

            tarif.idTarif = `TARF-${newIdNumber.toString().padStart(3, '0')}`;
        } catch (error) {
            // Gestion d'erreur dans le cas où la récupération des tarifs échoue
            return next(new Error('Erreur lors de la génération de l\'ID du tarif.'));
        }
    }

    next();
});

// Créer le modèle Mongoose pour Tarif
const Tarif = mongoose.model('Tarif', TarifSchema);

module.exports = Tarif;
