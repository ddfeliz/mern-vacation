const mongoose = require('mongoose');

// Définition du schéma pour le correcteur
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
        min: 0 // Le nombre des copies ne peut pas être négative
    }
}, {
    timestamps: true // Pour garder la trace des dates de création et de mise à jour
});

// Middlaware pour générer automatiquement l'idCorrecteur avant la sauvegarde
vacationSchema.pre('save', async function(next) {
    const vacation = this;

    // Si l'idCorrecteur n'est pas défini (cas d'ajout d'un nouveau correcteur)
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


// Création du modèle à partir du schéma
const Vacation = mongoose.model('Vacation', vacationSchema);

module.exports = Vacation;
