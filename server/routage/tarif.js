const express = require('express');
const router = express.Router();
const Controlleur = require('../controlleur/tarif');

// Définir les routes et les lier aux méthodes du contrôleur
router.post('/ajout', Controlleur.ajoutTarif);

router.get('/tous', Controlleur.avoirTousTarifs);

router.get('/verification', Controlleur.varificationTarif);

router.get('/:idTarif', Controlleur.avoirIdTarif);

router.put('/:idTarif', Controlleur.modificationTarif);

router.delete('/:idTarif', Controlleur.suppressionTarif);

module.exports = router;
