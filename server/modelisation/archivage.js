const mongoose = require("mongoose");

// Créer un schéma similaire à celui du modèle Payment
const archivePaiementSchema = new mongoose.Schema(
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
      required: true,
    },
  },
  {
    timestamps: true, // Pour garder la trace des dates de création et de mise à jour
  }
);

const archivePaiement = mongoose.model("ArchivePaiement", archivePaiementSchema);
module.exports = archivePaiement;
