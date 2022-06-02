const router = require("express").Router();
const {
  intializePayment,
  verifyPayment,
} = require("../controllers/walletController");

router.post("/wallet/paystack/initialize", intializePayment);
router.get("/wallet/paystack/verify-transaction/", verifyPayment);
module.exports = router;
