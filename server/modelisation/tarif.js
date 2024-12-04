const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
        type: Number, 
        required: true
    },
    MontantTarif: {
        type: Number, 
        required: true
    }
}, {
    timestamps: true
});

TarifSchema.pre('save', async function (next) {
    const tarif = this;

    const Tarif = mongoose.model('Tarif');

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
            
            return next(new Error('Erreur lors de la génération de l\'ID du tarif.'));
        }
    }

    next();
});


const Tarif = mongoose.model('Tarif', TarifSchema);

module.exports = Tarif;
