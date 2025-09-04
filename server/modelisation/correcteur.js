const mongoose = require('mongoose');
const Counter = require('./counter');

const correcteurSchema = new mongoose.Schema({
    idCorrecteur: {
        type: String,
        unique: true
    },
    immatricule: {
        type: String
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
        required: true,
        unique: true
    },
    adresse: {
        type: String,
        required: true
    },
    adresseProfession: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
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
    },
    matiere: {
        type: String,
    },
    statut: {
        type: String,
        enum: ['Actif', 'Non actif'],
        default: 'Non actif'
    },
}, {
    timestamps: true
});

correcteurSchema.pre('save', async function(next) {
    const correcteur = this;

    if (!correcteur.idCorrecteur) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { _id: 'correcteurId' },
                { $inc: { sequence: 1 } },
                { upsert: true, new: true }
            );
            correcteur.idCorrecteur = `NB-COR-${counter.sequence.toString().padStart(3, '0')}`;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const Correcteur = mongoose.model('Correcteur', correcteurSchema);

module.exports = Correcteur;