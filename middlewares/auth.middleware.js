const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { responseHandler } = require('../utils/responseHandler');

const requireSignin = async (req, res, next) => {
  const token = req.cookies.token;

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return responseHandler(res, err, 403);
    console.log(user);

    const userExists = await User.findById(user._id).exec();

    if (userExists) {
      req.user = user;
      next();
    } else {
      return responseHandler(res, 'User does not exist! Please signup.', 403);
    }
  });
};

const isVerified = async (req, res, next) => {
  const user = await User.findOne({
    $or: [{ _id: req.user?._id }, { email: req.body?.email }],
  }).exec();

  if (!user.verified) {
    return responseHandler(res, 'Verify your email to use this service.', 403);
  }

  next();
};

module.exports = { requireSignin, isVerified };
