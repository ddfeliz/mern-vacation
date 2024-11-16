const express = require("express");
const router = express.Router();
const archivePaiementControlleur = require("../controllers/archivePaiementControlleur");
// Route des archive

router.post("/archive-payments", async (req, res) => {
  const { session } = req.body;
  const result = await archivePaiementControlleur.archivePaymentCount(session);
  if (result.success) {
    res.status(200).json(result.message);
  } else {
    res.status(500).json(result.message);
  }
});

router.get("/all", archivePaiementControlleur.getArchivePayment);

router.get("/count", archivePaiementControlleur.CountArchive);

router.get("/:idPayment", archivePaiementControlleur.getArchiveByIdPayment);

router.delete("/:idPayment", archivePaiementControlleur.deleteArchive);

module.exports = router;
