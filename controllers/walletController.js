const {
  intializePaymentValidation,
} = require("../validations/walletValidations");
const {
  intializePaymentChannel,
  verifyTransactionStatus,
} = require("../services/wallet");
const { responseHandler } = require("../utils/responseHandler");

const intializePayment = async (req, res) => {
  const { details } = await intializePaymentValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, true, "");
  }
  const checkInitialization = await intializePaymentChannel(req.body);
  console.log(checkInitialization, "controller here");
  if (checkInitialization[0]) {
    return responseHandler(
      res,
      checkInitialization[1].message,
      200,
      false,
      checkInitialization[1].data
    );
  }
  return responseHandler(
    res,
    checkInitialization[1].message,
    400,
    true,
    checkInitialization[1].data
  );
};

const verifyPayment = async (req, res) => {
  if (req.query.reference === undefined) {
    return responseHandler(
      res,
      "Include valid transaction reference",
      400,
      true,
      ""
    );
  }
  const { reference } = req.query;
  const checkTransactionStatus = await verifyTransactionStatus(reference);
  console.log(checkTransactionStatus, "controller here");
  if (checkTransactionStatus[0]) {
    return responseHandler(
      res,
      "Transaction status rertrieved succesful",
      200,
      false,
      checkTransactionStatus[1]
    );
  }
  return responseHandler(
    res,
    "Transaction status retrieval unsuccesful",
    400,
    true,
    checkTransactionStatus[1]
  );
};

module.exports = {
  intializePayment,
  verifyPayment,
};
