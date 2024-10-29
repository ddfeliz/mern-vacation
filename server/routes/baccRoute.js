const express = require('express');
const router = express.Router();
const bacController = require('../controllers/baccController'); // Assurez-vous que le chemin correspond à celui de votre fichier controller.js

// Route pour créer une nouvelle entrée Bac
router.post('/add', bacController.createBacc);

// Route pour récupérer toutes les entrées Bac
router.get('/all', bacController.getAllPBaccs);

// Route pour récupérer les spécialités
router.get('/specialiste', bacController.getLibelleSpecialite); // Nouvelle route ajoutée
router.get('/secteurs', bacController.getSecteurs); // Nouvelle route ajoutée
router.get('/matieres', bacController.getMatieres); // Nouvelle route ajoutée
router.get('/options', bacController.getLibelleOption); // Nouvelle route ajoutée

// Route pour récupérer une entrée Bac par ID
router.get('/:idMatiere', bacController.getBaccById); // Remplacer idBacc par idMatiere

// Route pour mettre à jour une entrée Bac par ID
router.put('/:idMatiere', bacController.updateBacc); // Remplacer idBacc par idMatiere

// Route pour supprimer une entrée Bac par ID
router.delete('/:idMatiere', bacController.deleteBacc); // Remplacer idBacc par idMatiere


module.exports = router;
