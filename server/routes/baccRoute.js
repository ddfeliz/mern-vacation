const express = require('express');
const router = express.Router();
const baccControlleur = require('../controllers/baccControlleur'); // Assurez-vous que le chemin correspond à celui de votre fichier controller.js

// Route pour créer une nouvelle entrée Bac
router.post('/add', baccControlleur.createBacc);

// Route pour récupérer toutes les entrées Bac
router.get('/all', baccControlleur.getAllPBaccs);

// Route pour récupérer les spécialités
router.get('/specialiste', baccControlleur.getLibelleSpecialite); // Nouvelle route ajoutée
router.get('/secteurs', baccControlleur.getSecteurs); // Nouvelle route ajoutée
router.get('/matieres', baccControlleur.getMatieres); // Nouvelle route ajoutée
router.get('/options', baccControlleur.getLibelleOption); // Nouvelle route ajoutée

// Route pour récupérer une entrée Bac par ID
router.get('/:idMatiere', baccControlleur.getBaccById); // Remplacer idBacc par idMatiere

// Route pour mettre à jour une entrée Bac par ID
router.put('/:idMatiere', baccControlleur.updateBacc); // Remplacer idBacc par idMatiere

// Route pour supprimer une entrée Bac par ID
router.delete('/:idMatiere', baccControlleur.deleteBacc); // Remplacer idBacc par idMatiere


module.exports = router;
