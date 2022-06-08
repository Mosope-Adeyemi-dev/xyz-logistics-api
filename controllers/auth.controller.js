/* eslint-disable no-unused-vars */
const User = require('../models/user.model');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { translateError } = require('../utils/mongo_helper');
const jwt = require('jsonwebtoken');
const transporter = require('../config/email');
const { responseHandler } = require('../utils/responseHandler');

exports.signup = async (req, res) => {
  try {
    const {
      email,
      firstname,
      lastname,
      password,
      phone_number,
      role,
      address1,
      address2,
    } = req.body;

    const hashedPassword = await hashPassword(password);

    const userExists = await User.findOne({ email }).exec();

    if (userExists) {
      return responseHandler(res, 'Email already taken!', 400);
    }

    const token = jwt.sign({ email }, process.env.JWT_ACCOUNT_ACTIVATION, {
      expiresIn: '10m',
    });

    const msg = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: 'Verify your Account',
      html: `
			<h1>XYZ Logistics</h1>
			<p>Please use the following link to verify your acccount.
			<br/>The link expires in 10 minutes.</p>
            <a>${process.env.CLIENT_URL}/auth/verify?token=${token}</a>
            <hr />
            <footer>This email may contain sensitive information</footer>
		`,
    };

    const user = new User({
      email,
      firstname,
      lastname,
      password: hashedPassword,
      phone_number,
      address: { primary: address1, secondary: address2 },
    });

    user.save(async (err, user) => {
      if (err) {
        return responseHandler(res, translateError(err), 500);
      }

      if (role === 'Rider') {
        await User.findOneAndUpdate(
          { email },
          { $addToSet: { role: 'Rider' } },
          { new: true }
        );
      }

      transporter.sendMail(msg, (err, info) => {
        if (err) {
          return responseHandler(res, err, 502);
        }

        return responseHandler(
          res,
          `Signup successful! Please verify your email, ${info.accepted[0]}`,
          200,
          false
        );
      });
    });
  } catch (error) {
    return responseHandler(res, 'Something went wrong! Please try again.', 500);
  }
};

// Update database with email verification status.
exports.emailVerified = (req, res) => {
  try {
    const { token } = req.body;

    if (token) {
      jwt.verify(
        token,
        process.env.JWT_ACCOUNT_ACTIVATION,
        (error, decoded) => {
          if (error) {
            return responseHandler(
              res,
              'Expired link! Please signup again.',
              401
            );
          }

          const { email } = decoded;

          User.updateOne({ email }, { $set: { verified: true } }).exec();

          responseHandler(res, 'Email verified!', 200, false);
        }
      );
    } else {
      return responseHandler(res, 'Invalid token. Try again', 400);
    }
  } catch (error) {
    return responseHandler(res, 'Something went wrong! Please try again.', 500);
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).exec();

    if (!user) {
      return responseHandler(
        res,
        'User with that email does not exist! Please signup!',
        400
      );
    }
    // authenticate the entered password
    const verifyPassword = await comparePassword(password, user.password);
    if (!verifyPassword) {
      return responseHandler(res, 'Email and password do not match.', 401);
    }
    // generate a token and send as cookie to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    user.password = undefined;
    user.reset_password_pin = undefined;

    res.cookie('token', token, { expiresIn: '1d', httpOnly: true });

    return responseHandler(res, 'Login success!', 200, false, user);
  } catch (error) {
    console.log(error);
    return responseHandler(res, 'Something went wrong! Please try again.', 500);
  }
};

exports.signout = (req, res) => {
  try {
    res.clearCookie('token');
    return responseHandler(res, 'Signout success!', 200, false);
  } catch (error) {
    return responseHandler(res, 'Something went wrong! Please try again.', 500);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).exec();

    if (!user) {
      return responseHandler(res, 'User not found! Please signup', 401);
    }

    // credentials to reset password
    const resetPin = Math.floor(100000 + Math.random() * 900000);
    const pinExpiry = new Date().getTime() + 10 * 60000;

    const msg = {
      from: process.env.MAIL_USERNAME,
      to: user.email,
      subject: 'Reset your password',
      html: `
      <h1>XYZ Logistics</h1>
      <p>Please use the following pin to reset your password.
      <br/>The pin expires in 10 minutes.</p>
      <h2 style="text-align: center">${resetPin}</h2>
      <p>You can use the link below to go directly to the reset password page.</p>
      <a>${process.env.CLIENT_URL}/auth/reset</a>
      <hr />
      <footer>This email may contain sensitive information</footer>
    `,
    };

    return User.updateOne(
      { _id: user._id },
      { reset_password_pin: resetPin, reset_pin_expiry: pinExpiry }
    ).exec((err, success) => {
      if (err) {
        return responseHandler(res, translateError(err), 500);
      } else {
        transporter.sendMail(msg, (err, info) => {
          if (err) {
            return responseHandler(res, err, 502);
          }

          return responseHandler(
            res,
            `Email successfully sent to ${info.accepted[0]}`,
            200,
            false
          );
        });
      }
    });
  } catch (error) {
    console.log(error);
    return responseHandler(res, 'Something went wrong! Please try again.', 500);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { resetPin, password } = req.body;

    const user = await User.findOne({
      reset_password_pin: resetPin,
    }).exec();

    if (!user) return responseHandler(res, 'Incorrect pin!', 401);

    const currentTime = new Date().getTime();

    if (currentTime > user.reset_pin_expiry) {
      return responseHandler(res, 'Expired pin!', 400);
    }

    const hashedPassword = await hashPassword(password);

    return User.updateOne(
      { _id: user._id },
      {
        password: hashedPassword,
        reset_password_pin: '',
        reset_pin_expiry: '',
      }
    ).exec((err, success) => {
      if (err) {
        return responseHandler(res, translateError(err), 500);
      }

      responseHandler(res, 'Password changed successfully.', 200, false);
    });
  } catch (error) {
    console.log(error);
    return responseHandler(res, 'Something went wrong! Please try again.', 500);
  }
};

// Email verification
exports.verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const token = jwt.sign({ email }, process.env.JWT_ACCOUNT_ACTIVATION, {
      expiresIn: '10m',
    });

    const msg = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: 'Verify your Account',
      html: `
			<h1>XYZ Logistics</h1>
			<p>Please use the following link to verify your acccount.
			<br/>The link expires in 10 minutes.</p>
            <a>${process.env.CLIENT_URL}/auth/verify?token=${token}</a>
            <hr />
            <footer>This email may contain sensitive information</footer>
		`,
    };

    transporter.sendMail(msg, (err, info) => {
      if (err) {
        return responseHandler(res, err, 502);
      }

      return responseHandler(
        res,
        `Verification email sent to ${info.accepted[0]}`,
        200,
        false
      );
    });
  } catch (error) {
    console.log(error);
    return responseHandler(res, 'Something went wrong! Please try again.', 500);
  }
};
