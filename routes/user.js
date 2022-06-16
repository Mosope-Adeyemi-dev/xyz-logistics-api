const express = require('express');
// eslint-disable-next-line node/no-missing-require
const formidable = require('express-formidable-v2');

const router = express.Router();

const {
  userProfile,
  deleteAccount,
  updateAccount,
  changePassword,
  profiles,
  deleteAll,
} = require('../controllers/user.controller');

const { requireSignin } = require('../middlewares/auth.middleware');

router.get('/user/profile/:id', requireSignin, userProfile);
router.delete('/user/delete', requireSignin, deleteAccount);
router.put('/user/me', requireSignin, formidable(), updateAccount);
router.put('/user/change-password', requireSignin, changePassword);

// development only
router.get('/user/profiles', requireSignin, profiles);
router.post('/user/delete-all', requireSignin, deleteAll);

module.exports = router;
