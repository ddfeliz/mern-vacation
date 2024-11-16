const express = require("express");
const router = express.Router();
const paiementControlleur = require('../controllers/paiementControlleur');


router.post('/add', paiementControlleur.addPayment);

router.get('/all', paiementControlleur.getAllPayments);

router.get('/total-montant', paiementControlleur.getTotalMontants);

router.get('/total-copie', paiementControlleur.getTotalCopies);

router.get('/count', paiementControlleur.CountPayment);

router.get('/:idPayment', paiementControlleur.getPaymentById);

router.put('/:idPayment', paiementControlleur.updatePayment);

router.delete('/:idPayment', paiementControlleur.deletePayment);



module.exports = router;