const express = require('express');
const router = express.Router();
const correcteurController = require('../controllers/correcteurController');

router.post('/add', correcteurController.addCorrecteur);

router.get('/all', correcteurController.getAllCorrecteurs);

router.post('/comptage', correcteurController.CompterCorrecteursStatut);

router.get('/count', correcteurController.CountCorrecteur);

router.get('/:idCorrecteur', correcteurController.getCorrecteurById);

router.get('/check/:cin', correcteurController.getCINCorrecteur);

router.put('/updateStatus', correcteurController.UpdateStatutCorrecteur);

router.put('/:idCorrecteur', correcteurController.updateCorrecteur);

router.delete('/:idCorrecteur', correcteurController.deleteCorrecteur);

module.exports = router;
