const router = require('express').Router();
const {
  inviteAdmin,
  login,
  signup,
} = require('../controllers/admin.controller');
const { isSuperAdmin } = require('../middlewares/admin.middleware');

router.post('/admin/invite', isSuperAdmin, inviteAdmin);
router.post('/auth/admin/signup', signup);
router.post('/auth/admin/login', login);
module.exports = router;
