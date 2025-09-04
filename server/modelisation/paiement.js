const mongoose = require("mongoose");
const Counter = require("./counter");

// Définition du schéma pour le paiement
const paiementSchema = new mongoose.Schema(
  {
    idPaiement: {
      type: String,
      unique: true
    },
    idVacation: {
      type: String,
    },
    idCorrecteur: {
      type: String,
    },
    immatricule: {
      type: String,
    },
    nom: {
      type: String,
    },
    prenom: {
      type: String,
    },
    cin: {
      type: String,
    },
    specialite: {
      type: String,
    },
    secteur: {
      type: String,
    },
    option: {
      type: String,
    },
    matiere: {
      type: String,
    },
    pochette: {
      type: String,
    },
    nbcopie: {
      type: Number,
      min: 0,
    },
    optionTarif: {
      type: String,
    },
    montantTotal: {
      type: Number,
      min: 0,
    },
    session: {
      type: Number,
      min: 0,
    },
    statut: {
      type: String,
      enum: ['Payé', 'Non payé'],
      default: 'Non payé'
    },
  },
  {
    timestamps: true,
  }
);


// Middleware pour générer automatiquement l'idPaiement avant la sauvegarde
paiementSchema.pre("save", async function (next) {
  const paiement = this;

    if (!paiement.idPaiement) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { _id: 'paiementId' },
                { $inc: { sequence: 1 } },
                { upsert: true, new: true }
            );
            paiement.idPaiement = `NB-PAYM-${counter.sequence.toString().padStart(3, '0')}`;
        } catch (error) {
            return next(error);
        }
    }

  next();
});


const Paiement = mongoose.model("Paiement", paiementSchema);

module.exports = Paiement;
