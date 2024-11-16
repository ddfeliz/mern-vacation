const express = require('express');
const router = express.Router();
const utilisateurControlleur = require('../controllers/utilisateurControlleur'); // Import du contrôleur d'administrateur

// Route pour ajouter un nouvel administrateur
router.post('/add', utilisateurControlleur.addAdministrateur);

// Route pour la connexion d'un administrateur
router.post('/login', utilisateurControlleur.loginAdministrateur);

// Route pour récupérer tous les administrateurs
router.get('/all', utilisateurControlleur.getAllAdministrateurs);

// Route pour récupérer tous les administrateurs
router.get('/profile', utilisateurControlleur.getAdminProfile);

// Route pour récupérer un administrateur par son identifiant
router.get('/:idAdmin', utilisateurControlleur.getAdministrateurById);

// Route pour mettre à jour un administrateur
router.put('/:idAdmin', utilisateurControlleur.updateAdministrateur);

// Route pour supprimer un administrateur
router.delete('/:idAdmin', utilisateurControlleur.deleteAdministrateur);

module.exports = router;
