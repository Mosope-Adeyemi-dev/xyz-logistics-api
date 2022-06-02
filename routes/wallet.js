const router = require("express").Router();
const {
  intializePayment,
  verifyPayment,
  createWalletDemo,
} = require("../controllers/walletController");

router.post("/wallet/paystack/initialize", intializePayment);
router.get("/wallet/paystack/verify-transaction/", verifyPayment);
router.post("/wallet/create", createWalletDemo);
module.exports = router;
