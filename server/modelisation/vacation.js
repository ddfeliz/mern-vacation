const mongoose = require('mongoose');

const vacationSchema = new mongoose.Schema({
    idVacation: {
        type: String,
        required: true,
        unique: true
    },
    idCorrecteur: {
        type: String,
        required: true
    },
    immatricule: {
        type: String,
        required: true
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
        const lastVacation = await Vacation.findOne().sort({_id: -1});

        let newIdNumber = 1;
        if (lastVacation && lastVacation.idVacation) {
            const lastIdNumber = parseInt(lastVacation.idVacation.split('-')[1], 10);
            newIdNumber = lastIdNumber + 1;
        }

        vacation.idVacation = `VAC-${newIdNumber.toString().padStart(3, '0')}`;
    }

    next();
});

const Vacation = mongoose.model('Vacation', vacationSchema);

module.exports = Vacation;
