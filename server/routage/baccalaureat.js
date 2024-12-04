const express = require('express');
const router = express.Router();
const Controlleur = require('../controlleur/baccalaureat'); 

router.post('/ajout', Controlleur.ajoutBaccalaureat);

router.get('/tous', Controlleur.avoirTousBaccalaureats);

router.get('/specialiste', Controlleur.avoirLibelleSpecialite); 

router.get('/secteurs', Controlleur.avoirSecteurs); 

router.get('/matieres', Controlleur.avoirMatieres); 

router.get('/options', Controlleur.avoirLibelleOption); 

router.get('/:idMatiere', Controlleur.avoirIdBaccalaureat); 

router.put('/:idMatiere', Controlleur.modificationBaccalaureat); 

router.delete('/:idMatiere', Controlleur.suppressionBaccalaureat);

module.exports = router;
