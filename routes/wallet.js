const router = require('express').Router();
const {
  intializePayment,
  verifyPayment,
  getTransactionHistory,
} = require('../controllers/wallet.controller');
const { requireSignin } = require('../middlewares/auth.middleware');

router.post('/wallet/paystack/initialize', requireSignin, intializePayment);
router.get(
  '/wallet/paystack/verify-transaction/',
  requireSignin,
  verifyPayment
);
router.get(
  '/wallet/paystak/transactions',
  requireSignin,
  getTransactionHistory
);
module.exports = router;
