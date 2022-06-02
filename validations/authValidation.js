const { check } = require("express-validator");

exports.userSignupValidator = [
  check("email").isEmail().withMessage("Input a valid email address"),
  check("firstname").notEmpty().withMessage("Firstname is required"),
  check("lastname").notEmpty().withMessage("Lastname is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

exports.userSigninValidator = [
  check("email")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Input a valid email address"),
];

exports.resetPasswordValidator = [
  check("password")
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
