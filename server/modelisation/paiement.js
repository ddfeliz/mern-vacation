const mongoose = require("mongoose");

// Définition du schéma pour le paiement
const paiementSchema = new mongoose.Schema(
  {
    idPaiement: {
      type: String,
      required: true,
      unique: true,
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

// Création du modèle à partir du schéma
const Paiement = mongoose.model("Paiement", paiementSchema);

// Middleware pour générer automatiquement l'idPaiement avant la sauvegarde
paiementSchema.pre("save", async function (next) {
  const paiement = this;

  // Si l'idPaiement n'est pas encore défini
  if (!paiement.idPaiement) {
    const lastPaiement = await Paiement.findOne().sort({ _id: -1 });

    let newIdNumber = 1;
    if (lastPaiement && /^PAYM-\d+$/.test(lastPaiement.idPaiement)) {
      const lastIdNumber = parseInt(lastPaiement.idPaiement.split("-")[1], 10);
      newIdNumber = lastIdNumber + 1;
    }

    paiement.idPaiement = `PAYM-${newIdNumber.toString().padStart(3, "0")}`;
  }

  next();
});

module.exports = Paiement;
