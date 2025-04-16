const express = require("express");
const router = express.Router();
const Controlleur = require('../controlleur/paiement');


router.post('/ajoute', Controlleur.ajoutPaiement);

router.get('/tous', Controlleur.avoirTousPaiements);

router.get('/total-montant', Controlleur.avoirTotaleMontants);

router.get('/total-copie', Controlleur.avoirTotalCopies);

router.get('/compter', Controlleur.CompterPaiement);

router.get('/regroupement', Controlleur.regrouperTousLesPaiements);

router.get('/generer-excel', Controlleur.generateExcelForSpeciality);

router.get('/:idPaiement', Controlleur.avoirIdPaiement);

router.get('/correcteur/:idCorrecteur', Controlleur.avoirIdCorPaiement);

router.put('/:idPaiement', Controlleur.modificationPaiement);

router.put('/statut-modification/:idCorrecteur', Controlleur.modificationPaiementsToPaid);

router.delete('/:idPaiement', Controlleur.supprimerPaiement);



module.exports = router;