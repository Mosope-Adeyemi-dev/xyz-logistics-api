const router = require('express').Router();
const {
  inviteAdmin,
  login,
  signup,
} = require('../controllers/admin.controller');
const { verifyToken } = require('../middlewares/admin.middleware');

router.post('/admin/invite', verifyToken, inviteAdmin);
router.post('/auth/admin/login', signup);
module.exports = router;
