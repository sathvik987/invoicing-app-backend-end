const express = require('express');
const router = express.Router();
const invoice = require('../controllers/invoice.controller');

router.post('/', invoice.add);
router.get('/', invoice.get);
router.put('/mark-as-paid/:id', invoice.markAsPaid);
router.post('/send-mail/:id', invoice.sendMail);

module.exports = router;