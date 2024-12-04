const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema({
    idUtilisateur: {
        type: String,
        unique: true
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
        match: /.+\@.+\..+/ 
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
    statut: {
        type: String,
        enum: ['Actif', 'Non actif'],
        default: 'Non actif' 
    },
}, {
    timestamps: true 
});

utilisateurSchema.pre('save', async function (next) {
    const utilisateur = this;

    if (!utilisateur.idUtilisateur) {

        const lastUtilisateur = await Utilisateur.findOne().sort({ _id: -1 });


        let newIdNumber = 1;
        if (lastUtilisateur && lastUtilisateur.idUtilisateur) {
            const lastIdNumber = parseInt(lastUtilisateur.idUtilisateur.split('-')[1], 10);
            newIdNumber = lastIdNumber + 1;
        }


        utilisateur.idUtilisateur = `UTIL-${newIdNumber.toString().padStart(3, '0')}`;
    }

    next();
});


const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);

module.exports = Utilisateur;
