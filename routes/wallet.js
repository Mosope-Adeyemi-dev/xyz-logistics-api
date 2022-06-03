const router = require('express').Router();
const {
  intializePayment,
  verifyPayment,
  // createWalletDemo,
} = require('../controllers/walletController');
const { requireSignin } = require('../middlewares/auth.middleware');

router.post('/wallet/paystack/initialize', requireSignin, intializePayment);
router.get(
  '/wallet/paystack/verify-transaction/',
  requireSignin,
  verifyPayment
);
// router.post("/wallet/create", createWalletDemo);
module.exports = router;
