const mongoose = require('mongoose');

// Définition du schéma pour le correcteur
const correcteurSchema = new mongoose.Schema({
    idCorrecteur: {
        type: String,
        required: true,
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
        default: 'Non actif' // Défaut "nonactifs"
    },
}, {
    timestamps: true // Pour garder la trace des dates de création et de mise à jour
});

// Middlaware pour générer automatiquement l'idCorrecteur avant la sauvegarde
correcteurSchema.pre('save', async function(next) {
    const correcteur = this;

    // Si l'idCorrecteur n'est pas défini (cas d'ajout d'un nouveau correcteur)
    if (!correcteur.idCorrecteur) {
        const lastCorrecteur = await Correcteur.findOne().sort({_id: -1});

        let newIdNumber = 1;
        if (lastCorrecteur && lastCorrecteur.idCorrecteur) {
            const lastIdNumber = parseInt(lastCorrecteur.idCorrecteur.split('-')[1], 10);
            newIdNumber = lastIdNumber + 1;
        }

        correcteur.idCorrecteur = `COR-${newIdNumber.toString().padStart(3, '0')}`;
    }

    next();
});


// Création du modèle à partir du schéma
const Correcteur = mongoose.model('Correcteur', correcteurSchema);

module.exports = Correcteur;
