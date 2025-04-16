const express = require('express');
const router = express.Router();
const Controlleur = require('../controlleur/correcteur');

router.post('/ajout', Controlleur.ajoutCorrecteur);

router.get('/tous', Controlleur.avoirTousCorrecteurs);

router.post('/comptage', Controlleur.CompterCorrecteursStatut);

router.get('/compter', Controlleur.CompterCorrecteur);

router.get('/:idCorrecteur', Controlleur.avoirIdCorrecteur);

router.get('/:identifiant', Controlleur.avoirIMCorrecteur);

router.get('/verification/:cin', Controlleur.avoirCINCorrecteur);

router.put('/modificationStatus', Controlleur.modificationStatutCorrecteur);

router.put('/:idCorrecteur', Controlleur.modificationCorrecteur);

router.delete('/:idCorrecteur', Controlleur.suppressionCorrecteur);

module.exports = router;
