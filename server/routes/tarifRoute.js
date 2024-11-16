const express = require('express');
const router = express.Router();
const tarifControlleur = require('../controllers/tarifControlleur');

// Définir les routes et les lier aux méthodes du contrôleur
router.post('/add', tarifControlleur.createTarif);

router.get('/all', tarifControlleur.getAllTarifs);

router.get('/check', tarifControlleur.checkTarif);

router.get('/:idTarif', tarifControlleur.getTarifById);

router.put('/:idTarif', tarifControlleur.updateTarif);

router.delete('/:idTarif', tarifControlleur.deleteTarif);

module.exports = router;
