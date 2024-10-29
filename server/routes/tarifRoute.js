const express = require('express');
const router = express.Router();
const tarifController = require('../controllers/tarifController');

// Définir les routes et les lier aux méthodes du contrôleur
router.post('/add', tarifController.createTarif);

router.get('/all', tarifController.getAllTarifs);

router.get('/check', tarifController.checkTarif);

router.get('/:idTarif', tarifController.getTarifById);

router.put('/:idTarif', tarifController.updateTarif);

router.delete('/:idTarif', tarifController.deleteTarif);

module.exports = router;
