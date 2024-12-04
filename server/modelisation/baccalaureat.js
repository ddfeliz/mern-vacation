const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BaccalaureatSchema = new Schema({
    idMatiere: {
        type: String,
        unique: true,
        required: true
    },
    libelleSpecialite: {
        type: String,
        required: true
    },
    libelleSecteur: {
        type: String,
        required: true
    },
    codeSerieOption: {
        type: String,
        required: true
    },
    libelleCourt: {
        type: String,
        required: true
    },
    libelleOption: {
        type: String,
        required: true
    },
    libCourtMatiere: {
        type: String,
        required: true
    },
    nomMatiere: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

BaccalaureatSchema.pre('save', async function (next) {
    const matiere = this;
    
    const Baccalaureat = mongoose.model('Baccalaureat');

    if (!matiere.idMatiere) {
        const lastMatiere = await Baccalaureat.findOne().sort({ _id: -1 });

        let newIdNumber = 1;
        if (lastMatiere && lastMatiere.idMatiere) {
            const lastIdNumber = parseInt(lastMatiere.idMatiere.split('-')[1], 10);
            newIdNumber = lastIdNumber + 1;
        }

        matiere.idMatiere = `LBMAT-${newIdNumber.toString().padStart(3, '0')}`;
    }

    next();
});

const Baccalaureat = mongoose.model('Baccalaureat', BaccalaureatSchema);

module.exports = Baccalaureat;
