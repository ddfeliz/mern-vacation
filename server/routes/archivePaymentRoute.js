const express = require("express");
const router = express.Router();
const archivePaymentController = require('../controllers/archivePaymentController')
// Route des archive

router.post('/archive-payments', async (req, res) => {
    const { session } = req.body;
    const result = await archivePaymentController.archivePaymentCount(session);
    if (result.success) {
        res.status(200).json(result.message);
    } else {
        res.status(500).json(result.message);
    }
});

router.get('/all', archivePaymentController.getArchivePayment);

router.get('/count', archivePaymentController.CountArchive);

router.get('/:idPayment', archivePaymentController.getArchiveByIdPayment);

router.delete('/:idPayment', archivePaymentController.deleteArchive);


module.exports = router;