const mongoose = require("mongoose");

// Créer un schéma similaire à celui du modèle Payment
const archivePaiementSchema = new mongoose.Schema(
  {
    idPaiement: {
      type: String
    },
    idVacation: {
      type: String,
      required: true
    },
    idCorrecteur: {
      type: String,
    },
    immatricule: {
        type: String
    },
    nom: {
      type: String,
    },
    prenom: {
      type: String,
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
