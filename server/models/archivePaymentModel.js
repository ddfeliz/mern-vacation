const mongoose = require("mongoose");

// Créer un schéma similaire à celui du modèle Payment
const archivePaymentSchema = new mongoose.Schema(
  {
    idPayment: {
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
      required: true,
      unique: true,
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
      unique: true,
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
      type: Number, // Utiliser le type Number pour stocker une année
      default: new Date().getFullYear(), // Définir l'année courante comme valeur par défaut
    },
    statut: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Pour garder la trace des dates de création et de mise à jour
  }
);

const archivePayment = mongoose.model("ArchivedPayment", archivePaymentSchema);
module.exports = archivePayment;
