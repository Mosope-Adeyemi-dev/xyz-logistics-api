const {
  createAdminAccount,
  authenticateAdmin,
  setupAdminAccount,
} = require('../services/adminServices');
const {
  inviteAdminValidation,
  adminLoginValidation,
  adminSignupValidation,
} = require('../validations/adminValidation');
const { responseHandler } = require('../utils/responseHandler');
const transporter = require('../config/email');

const inviteAdmin = async (req, res) => {
  const details = await inviteAdminValidation();
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ''));
    return responseHandler(res, allErrors, 400, true, '');
  }
  const newAdmin = await createAdminAccount(req.body.email);
  if (newAdmin[0]) {
    const msg = {
      from: process.env.MAIL_USERNAME,
      to: newAdmin[1].email,
      subject: 'Admin Invitation',
      html: `
			<h2>XYZ Logistics</h2>
			<p>Please use the provided token to log into your admin acccount.</p>

      <h4>${newAdmin[1].inviteToken}</h4>
      <hr/>
      <footer>This email may contain sensitive information</footer>
		`,
    };
    try {
      await transporter.sendMail(msg);
      return responseHandler(res, 'Admin invitation sent', 201, false, '');
    } catch (error) {
      return responseHandler(
        res,
        'Unable to send invitation, try again!',
        400,
        true,
        ''
      );
    }
  }
  return responseHandler(res, newAdmin[1], 400, '');
};

const login = async (req, res) => {
  try {
    const { details } = await adminLoginValidation(req.body);
    if (details) {
      let allErrors = details.map((detail) => detail.message.replace(/"/g, ''));
      return responseHandler(res, allErrors, 400, true, '');
    }
    const check = await authenticateAdmin(req.body);
    if (check[0]) {
      res.cookie('token', check[1], { expiresIn: '1d', httpOnly: true });
      return responseHandler(res, 'Authenticated successfully', 200, false, {
        token: check[1],
      });
    }
    return responseHandler(
      res,
      'Incorrect username or passwsord',
      400,
      true,
      ''
    );
  } catch (error) {
    return responseHandler(res, 'An error occured', 500, true, error);
  }
};

const signup = async (req, res) => {
  const { details } = await adminSignupValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ''));
    return responseHandler(res, allErrors, 400, true, '');
  }

  // const check = await createSuperAdminDemo(req.body);
  const check = await setupAdminAccount(req.body);
  if (check[0]) {
    res.cookie('token', check[1], { expiresIn: '1d', httpOnly: true });
    return responseHandler(res, 'Account succesffully created', 201, false, {
      token: check[1],
    });
  }
  return responseHandler(res, check[1], 400, true, '');
};

module.exports = {
  inviteAdmin,
  login,
  signup,
};
