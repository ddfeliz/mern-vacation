const Payment = require('../models/paiementModel');
const CreateError = require('../utils/appError'); // Import de la fonction CreateError


// Fonction pour ajouter un nouveau vacation
exports.addPayment = async (req, res, next) => {
  try {
    const {  idVacation, idCorrecteur, nom, prenom, cin, specialite, secteur, option, matiere, nbcopie, optionTarif, montantTotal } = req.body;


    const currentYear = new Date().getFullYear();

    // Vérifier que les champs obligatoires sont fournis
    if ( !idVacation || !idCorrecteur|| !nom || !prenom || !cin || !specialite || !secteur || !option || !matiere || !nbcopie || !optionTarif|| !montantTotal) {
      return next(new CreateError(400, 'Tous les champs obligatoires doivent être fournis.')); // Ajout de 'new'
    }

    // Vérifier si un correcteur avec l'email existe déjà
    const payementExist = await Payment.findOne({ cin });
    if (payementExist) {
      return next(new CreateError(409, 'Un paiement avec cet cin existe déjà.')); // Ajout de 'new'
    }
    /* const currentYear = new Date().getFullYear(); */


    // Créer un nouvel objet correcteur avec les informations fournies
    const newPayment = new Payment({
      idPayment: `PAYM-${Math.floor(1000 + Math.random() * 9000)}`, // Générer un identifiant unique
      idVacation,
      idCorrecteur,
      nom,
      prenom,
      cin,
      specialite,
      secteur,
      option,
      matiere,
      nbcopie,
      optionTarif,
      montantTotal,
      session: currentYear,
    });

    // Enregistrer le correcteur dans la base de données
    await newPayment.save();

    res.status(201).json({
      message: 'Payment du correcteur ajouté avec succès.',
      payment: {
        idPayment: newPayment.idPayment,
        idVacation: newPayment.idVacation,
        idCorrecteur: newPayment.idCorrecteur,
        nom: newPayment.nom,
        prenom: newPayment.prenom,
        cin: newPayment.cin,
        specialite: newPayment.specialite,
        secteur: newPayment.secteur,
        option: newPayment.option,
        matiere: newPayment.matiere,
        nbcopie: newPayment.nbcopie,
        optionTarif: newPayment.optionTarif,
        montantTotal: newPayment.montantTotal,
        session: newPayment.session,
        statut: newPayment.statut
      }
    });
  } catch (error) {
    next(new CreateError(500, 'Erreur lors de l\'ajout du paiement du vacation.', error)); // Ajout de 'new'
    console.log(error);
    
  }
};



// Fonction pour obtenir la liste de tous les paiements
exports.getAllPayments = async (req, res, next) => {
  try {
    // Chercher tous les paiements dans la base de données
    const payments = await Payment.find();

    // Vérifier si des paiements existent
    if (!payments || payments.length === 0) {
      return next(new CreateError(404, 'Aucun paiement trouvé.')); // Ajout de 'new'
    }

    res.status(200).json(payments);
  } catch (error) {
    next(new CreateError(500, 'Erreur lors de la récupération de la liste des paiements.', error)); // Ajout de 'new'
  }
};


// Fonction pour calculer le total des copies corrigées par tous les correcteurs
exports.getTotalCopies = async (req, res, next) => {
  try {
    // Utilisation de l'agrégation pour calculer la somme des "nbcopie"
    const result = await Payment.aggregate([
      {
        $group: {
          _id: null, // Pas de groupement particulier
          totalCopies: { $sum: "$nbcopie" } // Calculer la somme des copies
        }
      }
    ]);

    // Vérifier si un résultat a été trouvé
    if (!result || result.length === 0) {
      return next(new CreateError(404, 'Aucune copie trouvée.'));
    }

    const totalCopies = result[0].totalCopies;

    res.status(200).json({
      message: 'Le total des copies corrigées a été calculé avec succès.',
      totalCopies
    });
  } catch (error) {
    next(new CreateError(500, 'Erreur lors du calcul du total des copies.', error));
  }
};


// Fonction pour calculer le total des copies corrigées par tous les correcteurs
exports.getTotalMontants = async (req, res, next) => {
  try {
    // Utilisation de l'agrégation pour calculer la somme des "nbcopie"
    const result = await Payment.aggregate([
      {
        $group: {
          _id: null, // Pas de groupement particulier
          montantTotal: { $sum: "$montantTotal" } // Calculer la somme des copies
        }
      }
    ]);

    // Vérifier si un résultat a été trouvé
    if (!result || result.length === 0) {
      return next(new CreateError(404, 'Aucune montant trouvée.'));
    }

    const montantTotal = result[0].montantTotal;

    res.status(200).json({
      message: 'Le total des montants a été calculé avec succès.',
      montantTotal
    });
  } catch (error) {
    next(new CreateError(500, 'Erreur lors du calcul du total des montants.', error));
  }
};



// Fonction pour obtenir les informations d'un correcteur par son identifiant
exports.getPaymentById = async (req, res, next) => {
  try {
    const { idPayment } = req.params;

    // Rechercher le correcteur par son idCorrecteur
    const payment = await Payment.findOne({ idPayment });
    if (!payment) {
      return next(new CreateError(404, 'Paiement non trouvé.')); // Ajout de 'new'
    }

    res.status(200).json(payment);
  } catch (error) {
    next(new CreateError(500, 'Erreur lors de la récupération du paiement.', error)); // Ajout de 'new'
  }
};

// Fonction pour mettre à jour les informations d'un correcteur
exports.updatePayment = async (req, res, next) => {
  try {
    const { idPayment } = req.params;
    const updates = req.body;

    // Trouver le correcteur et mettre à jour ses informations
    const payment = await Payment.findOneAndUpdate(
      { idPayment },
      updates,
      { new: true, runValidators: true }
    );
    if (!payment) {
      return next(new CreateError(404, 'Paiement non trouvé.')); // Ajout de 'new'
    }

    res.status(200).json({
      message: 'Paiement mis à jour avec succès.',
      payment
    });
  } catch (error) {
    next(new CreateError(500, 'Erreur lors de la mise à jour du paiement.', error)); // Ajout de 'new'
  }
};


// Fonction pour compter les totales des paiements
exports.CountPayment = async (req, res, next) => {
  try {
    const paymentsCount = await Payment.countDocuments();
    res.status(200).json({ totalPayments: paymentsCount });
  } catch (error) {
    next(
      new CreateError(500, "Erreur lors de la compte des paiements.", error)
    );
  }
};




// Fonction pour supprimer un correcteur par son identifiant
exports.deletePayment = async (req, res, next) => {
  try {
    const { idPayment } = req.params;

    // Supprimer le paiement de la base de données
    const payment = await Payment.findOneAndDelete({ idPayment });
    if (!payment) {
      return next(new CreateError(404, 'Paiement non trouvé.')); // Ajout de 'new'
    }

    res.status(200).json({
      message: 'Paiement supprimé avec succès.'
    });
  } catch (error) {
    next(new CreateError(500, 'Erreur lors de la suppression du paiement.', error)); // Ajout de 'new'
  }
};
