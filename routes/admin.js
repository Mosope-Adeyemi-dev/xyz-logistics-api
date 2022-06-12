const router = require('express').Router();
const {
  inviteAdmin,
  login,
  signup,
  assignRider,
} = require('../controllers/admin.controller');
const { isSuperAdmin } = require('../middlewares/admin.middleware');

router.post('/admin/invite', isSuperAdmin, inviteAdmin);
router.post('/auth/admin/signup', signup);
router.post('/auth/admin/login', login);
router.get('/request/:packageId/assign-rider', assignRider);
module.exports = router;
