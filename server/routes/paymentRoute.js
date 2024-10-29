const express = require("express");
const router = express.Router();
const paymentController = require('../controllers/paymentController');


router.post('/add', paymentController.addPayment);

router.get('/all', paymentController.getAllPayments);

router.get('/total-montant', paymentController.getTotalMontants);

router.get('/total-copie', paymentController.getTotalCopies);

router.get('/count', paymentController.CountPayment);

router.get('/:idPayment', paymentController.getPaymentById);

router.put('/:idPayment', paymentController.updatePayment);

router.delete('/:idPayment', paymentController.deletePayment);



module.exports = router;