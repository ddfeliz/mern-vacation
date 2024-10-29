const mongoose = require('mongoose');

// Schéma pour l'Administrateur
const adminSchema = new mongoose.Schema({
    idAdmin: {
        type: String,
        unique: true,
        required: true
    },
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/ // Validation d'email
    },
    telephone: {
        type: String,
        required: true
    },
    motDePasse: {
        type: String,
        required: true
    },
    dateDeCreation: {
        type: Date,
        default: Date.now
    },
    adresse: {
        type: String,
        required: false
    },
    dateDeNaissance: {
        type: Date,
        required: false
    },
}, {
    timestamps: true // Ajoute createdAt et updatedAt
});

// Middleware pour générer automatiquement l'idAdmin avant la sauvegarde
adminSchema.pre('save', async function (next) {
    const admin = this;

    // Si l'idAdmin n'est pas défini (cas d'ajout d'un nouvel administrateur)
    if (!admin.idAdmin) {
        // Obtenez le dernier identifiant d'administrateur ajouté
        const lastAdmin = await Administrateur.findOne().sort({ _id: -1 });

        // Déterminer le numéro suivant basé sur le dernier ID
        let newIdNumber = 1;
        if (lastAdmin && lastAdmin.idAdmin) {
            const lastIdNumber = parseInt(lastAdmin.idAdmin.split('-')[1], 10);
            newIdNumber = lastIdNumber + 1;
        }

        // Générer le nouvel identifiant sous la forme ADM-001, ADM-002, ...
        admin.idAdmin = `ADM-${newIdNumber.toString().padStart(3, '0')}`;
    }

    next(); // Passer au middleware suivant
});

// Créer le modèle Mongoose pour l'Administrateur
const Administrateur = mongoose.model('Administrateur', adminSchema);

module.exports = Administrateur;
