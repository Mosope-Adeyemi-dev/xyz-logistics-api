const express = require('express');

const router = express.Router();

const {
  rejectDelivery,
  myDeliveries,
} = require('../controllers/rider.controller');

const { requireSignin, isVerified } = require('../middlewares/auth.middleware');

router.put(
  '/rider/reject/:packageId',
  requireSignin,
  isVerified,
  rejectDelivery
);
router.get('/rider/deliveries', requireSignin, isVerified, myDeliveries);

module.exports = router;
