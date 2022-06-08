const express = require('express');

const router = express.Router();

const {
  createRequest,
  getRequests,
  getUserRequests,
} = require('../controllers/request.controller');

const {
  requireSignin,
  isVerified,
  isAdmin,
} = require('../middlewares/auth.middleware');

router.post('/request', requireSignin, isVerified, createRequest);
router.get('/requests', requireSignin, isVerified, isAdmin, getRequests);
router.get('/requests/:userId', requireSignin, isVerified, getUserRequests);
// router.get('/requests', );
// router.put('/request/:id', );

module.exports = router;
