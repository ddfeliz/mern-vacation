const express = require("express");
const router = express.Router();
const Controlleur = require("../controlleur/archivage");
// Route des archive

router.post("/archive-paiements", async (req, res) => {
  const { session } = req.body;
  const result = await Controlleur.archivePaiementCompte(session);
  if (result.success) {
    res.status(200).json(result.message);
  } else {
    res.status(500).json(result.message);
  }
});

router.get("/tous", Controlleur.avoirArchivePaiement);

router.get("/compter", Controlleur.CompterArchive);

router.get("/:idPaiement", Controlleur.avoirArchiveIdPaiement);

router.delete("/:idPaiement", Controlleur.supprimerArchive);

module.exports = router;
