const express = require('express');
const router = express.Router();
const vacationControlleur = require('../controllers/vacationControlleur');


router.post('/add', vacationControlleur.addVacation);

router.get('/all', vacationControlleur.getAllVacations);

router.get('/total-copies', vacationControlleur.getTotalCopies);

router.get('/total-copies-by-years', vacationControlleur.getTotalCopiesByYear);

router.get('/count', vacationControlleur.getVacationCount);

router.get('/:idVacation', vacationControlleur.getVacationById);

router.get('/check/:idCorrecteur/:session', vacationControlleur.getSession);

router.put('/:idVacation', vacationControlleur.updateVacation);

router.delete('/:idVacation', vacationControlleur.deleteVacation);

module.exports = router;
