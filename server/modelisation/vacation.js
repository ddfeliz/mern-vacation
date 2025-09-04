const mongoose = require('mongoose');
const Counter = require('./counter');

const vacationSchema = new mongoose.Schema({
    idVacation: {
        type: String,
        unique: true
    },
    idCorrecteur: {
        type: String,
        required: true
    },
    immatricule: {
        type: String,
    },
    nom: {
        type: String,
        required: true,
    },
    prenom: {
        type: String,
        required: true,
    },
    cin: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true,
    },
    pochette: {
        type: String,
        required: true,
    },
    specialite: {
        type: String,
        required: true,
    },
    secteur: {
        type: String,
        required: true,
    },
    option: {
        type: String,
        required: true,
    },
    matiere: {
        type: String,
        required: true,
    },
    session: {
        type: Number,
        required: true,
        min:0
    },
    nbcopie: {
        type: Number,
        required: true,
        min: 0 
    },
    statut_paiement: {
        type: String,
        enum: ['Disponible', 'Indisponible'],
        default: 'Indisponible'
    },
}, {
    timestamps: true 
});

vacationSchema.pre('save', async function(next) {
    const vacation = this;

    if (!vacation.idVacation) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { _id: 'vacationId' },
                { $inc: { sequence: 1 } },
                { upsert: true, new: true }
            );
            vacation.idVacation = `NB-VAC-${counter.sequence.toString().padStart(3, '0')}`;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const Vacation = mongoose.model('Vacation', vacationSchema);

module.exports = Vacation;
