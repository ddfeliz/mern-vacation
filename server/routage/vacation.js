const express = require('express');
const router = express.Router();
const Controlleur = require('../controlleur/vacation');


router.post('/ajout', Controlleur.ajoutVacation);

router.get('/tous', Controlleur.avoirTousVacations);

router.get('/totales-copies', Controlleur.avoirTotalesCopies);

router.get('/totales-copies-en-annee', Controlleur.avoirTotalesCopiesEnAnnee);

router.get('/compte', Controlleur.avoirVacationCompte);

router.get('/compte-vacation', Controlleur.avoirVacationCompteByCorrecteur);

router.get('/correcteur/:immatricule', Controlleur.avoirIdVacation);

router.get('/verification/:session', Controlleur.avoirPochette);

router.get('/:idVacation', Controlleur.avoirIMVacation);

router.put('/:idVacation', Controlleur.modificationVacation);

router.delete('/:idVacation', Controlleur.suppressionVacation);

module.exports = router;
