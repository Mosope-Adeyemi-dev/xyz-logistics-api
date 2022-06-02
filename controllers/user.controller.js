const User = require("../models/user.model");
const { translateError } = require("../utils/mongo_helper");
const { comparePassword, hashPassword } = require("../utils/bcrypt");
const cloudinaryUpload = require("../utils/cloudinary");
const { responseHandler } = require("../utils/responseHandler");

exports.userProfile = async (req, res) => {
  try {
    const user = await User.findOne(
      { _id: req.params.id },
      { password: 0, reset_password_pin: 0 }
    ).exec();

    if (!user) return responseHandler(res, "No user data!", 400);

    responseHandler(res, "", 200, false, user);
  } catch (error) {
    console.log(error);
    return responseHandler(res, "Something went wrong! Please try again.", 500);
  }
};

exports.deleteAccount = (req, res) => {
  try {
    const user = User.findOne({ _id: req.user._id }).exec((err, user) => {
      if (err || !user) {
        return responseHandler(res, "User does not exist!", 400);
      }

      User.deleteOne({ _id: req.user._id }).exec();
    });

    responseHandler(res, "Account deleted successfully.", 200, false);
  } catch (error) {
    console.log(error);
    return responseHandler(res, "Something went wrong! Please try again.", 500);
  }
};

exports.updateAccount = async (req, res) => {
  try {
    const data = JSON.parse(req.fields.data);
    const { image } = req.files;

    const user = await User.findOne({ _id: req.user._id })
      .select(["-password", "-reset_password_pin"])
      .exec();

    if (!user) return responseHandler(res, "No user found!", 400);

    // Make sure nobody can change password/pin illegally so store them temporarily
    const userPassword = user.password;
    const userResetPin = user.reset_password_pin;
    const userEmail = user.email;

    // Upload image to cloudinary
    if (image) {
      await cloudinaryUpload(image.path).then(
        (downloadURL) => {
          user.photo = downloadURL;
        },
        (error) => {
          console.error("CLOUDINARY ERROR ==>", error);
        }
      );
    }

    // Check for fields with new value and assign to the user document for update
    for (const field in data) {
      user[field] = data[field];

      if (data["address1"]) user.address["primary"] = data["address1"];
      if (data["address2"]) user.address["secondary"] = data["address2"];
    }

    // Now if someone entered a new password/pin illegally, revert to old password/pin
    user.password = userPassword;
    user.reset_password_pin = userResetPin;
    user.email = userEmail;

    User.updateOne({ _id: req.user._id }, user).exec((err, success) => {
      if (err) return responseHandler(res, translateError(err), 500);
    });

    responseHandler(res, "User data updated successfully.", 200, false, user);
  } catch (error) {
    console.log(error);
    return responseHandler(res, "Something went wrong! Please try again.", 500);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, password } = req.body;

    const user = await User.findOne({ _id: req.user._id }).exec();

    if (!user) return responseHandler(res, "No user found!", 400);

    const verifyPassword = await comparePassword(oldPassword, user.password);
    if (!verifyPassword) {
      return responseHandler(res, "Current password is wrong!", 400);
    }

    const hashedPassword = await hashPassword(password);

    User.updateOne(
      { _id: req.user._id },
      { $set: { password: hashedPassword } }
    ).exec();

    responseHandler(res, "Password updated!", 200, false);
  } catch (error) {
    console.log(error);
    return responseHandler(res, "Something went wrong! Please try again.", 500);
  }
};

exports.profiles = async (req, res) => {
  try {
    const users = await User.find(
      {},
      { password: 0, reset_password_pin: 0 }
    ).exec();

    if (!users) return responseHandler(res, "No user data!", 400);

    responseHandler(res, "", 200, false, users);
  } catch (error) {
    console.log(error);
    return responseHandler(res, "Something went wrong! Please try again.", 500);
  }
};

exports.deleteAll = (req, res) => {
  try {
    const user = User.findOne({ email: req.body.email }).exec((err, user) => {
      if (err || !user) {
        return responseHandler(res, "User does not exist!", 400);
      }

      User.deleteOne({ email: req.body.email }).exec();
    });

    responseHandler(res, "Accounts deleted successfully.", 200, false);
  } catch (error) {
    console.log(error);
    return responseHandler(res, "Something went wrong! Please try again.", 500);
  }
};
