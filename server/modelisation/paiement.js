const mongoose = require("mongoose");

// Définition du schéma pour le correcteur
const paiementSchema = new mongoose.Schema(
  {
    idPaiement: {
      type: String,
      required: true,
      unique: true,
    },
    idVacation: {
      type: String,
      required: true,
      unique: true,
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
    pochette: {
        type: String,
        required: true,
    },
    nbcopie: {
      type: Number,
      required: true,
      min: 0, // Le nombre des copies ne peut pas être négative
    },
    optionTarif: {
      type: String,
      required: true,
    },
    montantTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    session: {
      type: Number,
      required: true,
      min: 0,
    },
    statut: {
        type: String,
        enum: ['Payé', 'Non payé'],
        default: 'Non payé' // Défaut "Non payé"
    },
  },
  {
    timestamps: true, // Pour garder la trace des dates de création et de mise à jour
  }
);

// Middlaware pour générer automatiquement l'idCorrecteur avant la sauvegarde
paiementSchema.pre("save", async function (next) {
  const paiement = this;

  // Si l'idCorrecteur n'est pas défini (cas d'ajout d'un nouveau correcteur)
  if (!paiement.idPaiement) {
    const lastPaiement = await Paiement.findOne().sort({ _id: -1 });

    let newIdNumber = 1;
    if (lastPaiement && lastPaiement.idPaiement) {
      const lastIdNumber = parseInt(lastPaiement.idPaiement.split("-")[1], 10);
      newIdNumber = lastIdNumber + 1;
    }

    paiement.idPaiement = `PAYM-${newIdNumber.toString().padStart(3, "0")}`;
  }

  next();
});

// Création du modèle à partir du schéma
const Paiement = mongoose.model("Paiement", paiementSchema);

module.exports = Paiement;
