const { gen } = require('n-digit-token');
const Admin = require('../models/adminModel');
const { translateError } = require('../utils/mongo_helper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createAdminAccount = async (email) => {
  try {
    const newAdminAccount = new Admin({
      inviteToken: gen(5, { returnType: 'string' }),
      email,
    });
    if (await newAdminAccount.save()) {
      return [true, newAdminAccount];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};

const createSuperAdminDemo = async ({
  firstname,
  lastname,
  email,
  role,
  password,
}) => {
  try {
    const superAdmin = new Admin({
      firstname,
      lastname,
      email,
      role,
      password: await hashedPassword(password),
    });
    if (await superAdmin.save()) {
      return [true, await signJwt(superAdmin._id), superAdmin];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};

const authenticateAdmin = async ({ password, email }) => {
  try {
    const foundAdmin = await Admin.findOne({ email });
    if (!foundAdmin) {
      return [false];
    }
    const isValidPassword = await validatePassword(
      password,
      foundAdmin.password
    );
    if (isValidPassword) {
      return [true, await signJwt(foundAdmin.id)];
    }
    return [false];
  } catch (error) {
    return [false, translateError(error)];
  }
};

const hashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(15);
  return await bcrypt.hash(password, salt);
};

const signJwt = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24 * 30,
  });
  return token;
};

const validatePassword = async (formPassword, dbPassword) =>
  await bcrypt.compare(formPassword, dbPassword);

module.exports = {
  createAdminAccount,
  createSuperAdminDemo,
  authenticateAdmin,
  signJwt,
};
