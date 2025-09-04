const express = require('express');
const router = express.Router();
const Controlleur = require('../controlleur/correcteur');

router.post('/ajout', Controlleur.ajoutCorrecteur);

router.get('/tous', Controlleur.avoirTousCorrecteurs);

router.post('/comptage', Controlleur.CompterCorrecteursStatut);

router.get('/compter', Controlleur.CompterCorrecteur);

router.get('/genererPDF', Controlleur.genererPDFCorrecteurs);

// Nouvel endpoint à ajouter dans votre backend
router.get('/download-pdf/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../generated-pdfs', filename);
    
    // Vérifier que le fichier existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Fichier non trouvé' });
    }
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Erreur téléchargement:', error);
    res.status(500).json({ error: 'Erreur lors du téléchargement' });
  }
});

router.get('/:idCorrecteur', Controlleur.avoirIdCorrecteur);

router.get('/:identifiant', Controlleur.avoirIMCorrecteur);

router.get('/verification/:cin', Controlleur.avoirCINCorrecteur);

router.put('/modificationStatus', Controlleur.modificationStatutCorrecteur);

router.put('/:idCorrecteur', Controlleur.modificationCorrecteur);

router.delete('/:idCorrecteur', Controlleur.suppressionCorrecteur);

module.exports = router;
