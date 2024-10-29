const express = require('express');
const router = express.Router();
const administrateurController = require('../controllers/adminController'); // Import du contrôleur d'administrateur

// Route pour ajouter un nouvel administrateur
router.post('/add', administrateurController.addAdministrateur);

// Route pour la connexion d'un administrateur
router.post('/login', administrateurController.loginAdministrateur);

// Route pour récupérer tous les administrateurs
router.get('/all', administrateurController.getAllAdministrateurs);

// Route pour récupérer tous les administrateurs
router.get('/profile', administrateurController.getAdminProfile);

// Route pour récupérer un administrateur par son identifiant
router.get('/:idAdmin', administrateurController.getAdministrateurById);

// Route pour mettre à jour un administrateur
router.put('/:idAdmin', administrateurController.updateAdministrateur);

// Route pour supprimer un administrateur
router.delete('/:idAdmin', administrateurController.deleteAdministrateur);

module.exports = router;
