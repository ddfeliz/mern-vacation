const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Définir le schéma pour la collection Bacc
const BaccSchema = new Schema({
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

// Middleware pour générer automatiquement l'idMatiere avant la sauvegarde
BaccSchema.pre('save', async function (next) {
    const matiere = this;
    
    // Utilisation de mongoose.model pour accéder au modèle Bacc
    const Bacc = mongoose.model('Bacc');

    // Si l'idMatiere n'est pas défini (cas d'ajout d'une nouvelle matière)
    if (!matiere.idMatiere) {
        const lastMatiere = await Bacc.findOne().sort({ _id: -1 });

        let newIdNumber = 1;
        if (lastMatiere && lastMatiere.idMatiere) {
            const lastIdNumber = parseInt(lastMatiere.idMatiere.split('-')[1], 10);
            newIdNumber = lastIdNumber + 1;
        }

        matiere.idMatiere = `LBMAT-${newIdNumber.toString().padStart(3, '0')}`;
    }

    next();
});

// Créer le modèle Mongoose pour Bac
const Bacc = mongoose.model('Bacc', BaccSchema);

module.exports = Bacc;
