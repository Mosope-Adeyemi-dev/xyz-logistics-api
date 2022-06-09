const express = require('express');

const router = express.Router();

const {
  createRequest,
  getRequests,
  getUserRequests,
  requestDetails,
  cancelRequest,
} = require('../controllers/request.controller');

const { verifyToken } = require('../middlewares/admin.middleware');

const {
  requireSignin,
  isVerified,
  isAdmin,
} = require('../middlewares/auth.middleware');

router.post('/request', requireSignin, isVerified, createRequest);
router.get('/requests', verifyToken, isAdmin, getRequests);
router.get('/requests/user', requireSignin, isVerified, getUserRequests);
router.get('/request/:id', requestDetails);
router.patch('/request/:id/cancel', requireSignin, isVerified, cancelRequest);

module.exports = router;
