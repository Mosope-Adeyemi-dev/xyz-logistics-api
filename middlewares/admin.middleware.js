const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');

const verifyToken = async (req, res, next) => {
  const bearerHeader = req.headers['authorization'];

  if (bearerHeader !== undefined) {
    const token = bearerHeader.split(' ')[1];
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      const { exp, id } = decode;

      const foundAdmin = await Admin.findById(id);
      console.log(foundAdmin);

      if (exp < Date.now()) {
        req.adminId = id;
        next();
      } else {
        return res.status(403).json({
          error: true,
          message: 'Session expired',
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(403).json({
        error: true,
        message: 'Invalid token',
      });
    }
  }
  return res.status(403).json({
    error: true,
    message: 'No authorization token found',
  });
};
module.exports = {
  verifyToken,
};
