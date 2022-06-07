const express = require("express");

const router = express.Router();

const {
  signup,
  emailVerified,
  signin,
  signout,
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require("../controllers/auth.controller");

const {
  userSignupValidator,
  userSigninValidator,
  resetPasswordValidator,
} = require("../validations/authValidation");
const { runValidation } = require("../validations");
const { requireSignin } = require("../middlewares/auth.middleware");

router.post("/auth/signup", userSignupValidator, runValidation, signup);
router.post("/auth/update", emailVerified);
router.post("/auth/signin", userSigninValidator, runValidation, signin);
router.post("/auth/signout", requireSignin, signout);
router.post("/auth/forgot_password", forgotPassword);
router.post(
  "/auth/reset_password",
  resetPasswordValidator,
  runValidation,
  resetPassword
);
router.post("/auth/verify-email", verifyEmail);

module.exports = router;
