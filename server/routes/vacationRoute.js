const express = require('express');
const router = express.Router();
const vacationController = require('../controllers/vacationController');


router.post('/add', vacationController.addVacation);

router.get('/all', vacationController.getAllVacations);

router.get('/total-copies', vacationController.getTotalCopies);

router.get('/total-copies-by-years', vacationController.getTotalCopiesByYear);

router.get('/count', vacationController.getVacationCount);

router.get('/:idVacation', vacationController.getVacationById);

router.get('/check/:idCorrecteur/:session', vacationController.getSession);

router.put('/:idVacation', vacationController.updateVacation);

router.delete('/:idVacation', vacationController.deleteVacation);

module.exports = router;
