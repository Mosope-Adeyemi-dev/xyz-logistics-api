const router = require('express').Router();
const {
  intializePayment,
  verifyPayment,
} = require('../controllers/wallet.controller');
const { requireSignin } = require('../middlewares/auth.middleware');

router.post('/wallet/paystack/initialize', requireSignin, intializePayment);
router.get(
  '/wallet/paystack/verify-transaction/',
  requireSignin,
  verifyPayment
);
module.exports = router;
