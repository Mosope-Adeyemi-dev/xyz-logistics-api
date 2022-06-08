const { validationResult } = require('express-validator');
const { responseHandler } = require('../utils/responseHandler');

exports.runValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return responseHandler(res, errors.array()[0].msg, 422);
  }

  next();
};
