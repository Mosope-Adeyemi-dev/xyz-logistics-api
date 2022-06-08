const Package = require('../models/package.model');
const { translateError } = require('../utils/mongo_helper');
const { responseHandler } = require('../utils/responseHandler');

exports.createRequest = async (req, res) => {
  try {
    const {
      name,
      receiver,
      receiver_phone,
      weight,
      pickup_address,
      delivery_address,
      deliveryType,
    } = req.body;

    const creatorId = req.user._id;
    const package_id = `XYZ-${Math.random()
      .toString(36)
      .slice(2)
      .toUpperCase()}`;

    const package = new Package({
      name,
      package_id,
      creatorId,
      receiver,
      receiver_phone,
      weight,
      pickup_address,
      delivery_address,
      deliveryType,
    });

    await package.save((err, package) => {
      if (err) return responseHandler(res, translateError(err), 500);

      responseHandler(
        res,
        `Request to deliver package ${package_id} created.`,
        200,
        false,
        package
      );
    });
  } catch (error) {
    console.log(error);
    return responseHandler(res, 'Something went wrong! Please try again.', 500);
  }
};

exports.getRequests = async (req, res) => {
  try {
    const requests = await Package.find()
      .populate('creatorId', '_id firstname lastname phone_number')
      .populate('delivery_agent', '_id firstname lastname phone_number')
      .exec();

    if (requests.length <= 0) return responseHandler(res, 'No requests!', 200);

    responseHandler(
      res,
      'Requests retrieved successfully.',
      200,
      false,
      requests
    );
  } catch (error) {
    console.log(error);
    return responseHandler(res, 'Something went wrong! Please try again.', 500);
  }
};

exports.getUserRequests = async (req, res) => {
  try {
    const requests = await Package.find({ creatorId: req.params.userId })
      .populate('creatorId', '_id firstname lastname phone_number')
      .populate('delivery_agent', '_id firstname lastname phone_number')
      .exec();

    if (requests.length <= 0)
      return responseHandler(res, 'No requests!', 200, false);

    responseHandler(
      res,
      'Requests retrieved successfully.',
      200,
      false,
      requests
    );
  } catch (error) {
    console.log(error);
    return responseHandler(res, 'Something went wrong! Please try again.', 500);
  }
};
