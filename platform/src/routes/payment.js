const express = require('express');
const router = express.Router();
const paymentCtrl = require('../controllers/paymentController');
const { auth } = require('../utils/authMiddleware');

router.post('/create-checkout-session', auth, paymentCtrl.createCheckoutSession);

module.exports = router;