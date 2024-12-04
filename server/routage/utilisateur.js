const express = require('express');
const router = express.Router();
const Controlleur = require('../controlleur/utilisateur'); 

router.post('/ajout', Controlleur.ajoutUtilisateur);

router.post('/connexion', Controlleur.connexionUtilisateur);

router.get('/tous', Controlleur.avoirTousUtilisateurs);

router.get('/profile', Controlleur.avoirUtilisateurProfile);

router.get('/:idUtilisateur', Controlleur.avoirIdUtilisateur);

router.put('/:idUtilisateur', Controlleur.modificationUtilisateur);

router.delete('/:idUtilisateur', Controlleur.suppressionUtilisateur);

module.exports = router;
