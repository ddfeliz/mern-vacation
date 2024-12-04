const mongoose = require('mongoose');

const correcteurSchema = new mongoose.Schema({
    idCorrecteur: {
        type: String,
        required: true,
        unique: true
    },
    immatricule: {
        type: String,
        unique: true
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
    grade: {
        type: String,
        required: true,
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
        const lastCorrecteur = await Correcteur.findOne().sort({_id: -1});

        let newIdNumber = 1;
        if (lastCorrecteur && lastCorrecteur.idCorrecteur) {
            const lastIdNumber = parseInt(lastCorrecteur.idCorrecteur.split('-')[1], 10);
            newIdNumber = lastIdNumber + 1;
        }

        correcteur.idCorrecteur = `COR-${newIdNumber.toString().padStart(3, '0')}`;
    }

    if (!correcteur.immatricule) {
        
        const entier = Math.floor(Math.random() * 900) + 100; 
        const decimal = Math.floor(Math.random() * 900) + 100; 
        const nombreDecimal = `${entier}.${decimal}`; 

        correcteur.immatricule = nombreDecimal;
    }

    next();
});


const Correcteur = mongoose.model('Correcteur', correcteurSchema);

module.exports = Correcteur;
