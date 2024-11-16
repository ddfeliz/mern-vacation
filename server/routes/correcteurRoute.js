const express = require('express');
const router = express.Router();
const correcteurControlleur = require('../controllers/correcteurControlleur');

router.post('/add', correcteurControlleur.addCorrecteur);

router.get('/all', correcteurControlleur.getAllCorrecteurs);

router.post('/comptage', correcteurControlleur.CompterCorrecteursStatut);

router.get('/count', correcteurControlleur.CountCorrecteur);

router.get('/:idCorrecteur', correcteurControlleur.getCorrecteurById);

router.get('/check/:cin', correcteurControlleur.getCINCorrecteur);

router.put('/updateStatus', correcteurControlleur.UpdateStatutCorrecteur);

router.put('/:idCorrecteur', correcteurControlleur.updateCorrecteur);

router.delete('/:idCorrecteur', correcteurControlleur.deleteCorrecteur);

module.exports = router;
