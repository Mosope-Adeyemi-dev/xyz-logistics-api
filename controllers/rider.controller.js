const Package = require('../models/package.model');
const { translateError } = require('../utils/mongo_helper');
const { responseHandler } = require('../utils/responseHandler');

exports.rejectDelivery = async (req, res) => {
  try {
    const package = await Package.findOne({
      _id: req.params.packageId,
      delivery_agent: req.user._id,
    }).exec();

    if (!package) return responseHandler(res, 'Package does not exist', 400);

    Package.findByIdAndUpdate(req.params.packageId, {
      $set: { delivery_agent: null },
    }).exec((err, result) => {
      if (err) return responseHandler(res, translateError(err), 500);

      responseHandler(res, 'You have been unassigned!', 200, false);
    });
  } catch (error) {
    console.log(error);
    return responseHandler(res, 'Something went wrong! Please try again.', 500);
  }
};

exports.myDeliveries = async (req, res) => {
  try {
    const deliveries = await Package.find({
      delivery_agent: req.user._id,
    }).exec();

    if (deliveries.length <= 0)
      return responseHandler(res, 'No deliveries yet', 200, false);

    responseHandler(
      res,
      'Deliveries retrieved successfully',
      200,
      false,
      deliveries
    );
  } catch (error) {
    console.log(error);
    return responseHandler(res, 'Something went wrong! Please try again.', 500);
  }
};
