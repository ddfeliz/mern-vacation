const mongoose = require("mongoose");

// Définition du schéma pour le correcteur
const paymentSchema = new mongoose.Schema(
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
paymentSchema.pre("save", async function (next) {
  const payment = this;

  // Si l'idCorrecteur n'est pas défini (cas d'ajout d'un nouveau correcteur)
  if (!payment.idPayment) {
    const lastPayment = await Payment.findOne().sort({ _id: -1 });

    let newIdNumber = 1;
    if (lastPayment && lastPayment.idPayment) {
      const lastIdNumber = parseInt(lastPayment.idPayment.split("-")[1], 10);
      newIdNumber = lastIdNumber + 1;
    }

    payment.idPayment = `PAYM-${newIdNumber.toString().padStart(3, "0")}`;
  }

  next();
});

// Création du modèle à partir du schéma
const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
