const {
  intializePaymentValidation,
} = require("../validations/walletValidations");
const {
  intializePaymentChannel,
  verifyTransactionStatus,
  storeTransaction,
  checkTransactionExists,
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
  const checkTransactionDetails = await verifyTransactionStatus(reference);

  if (checkTransactionDetails[0]) {
    const isTransactionSaved = await checkTransactionExists(
      checkTransactionDetails[1].data.reference
    );
    if (
      checkTransactionDetails[1].data.status == "success" &&
      !isTransactionSaved
    ) {
      await storeTransaction(
        checkTransactionDetails[1].data.customer.email,
        checkTransactionDetails[1].data
      );
    }
    return responseHandler(
      res,
      checkTransactionDetails[1].message,
      200,
      false,
      {
        transactionStatus: checkTransactionDetails[1].data.status,
        reference: checkTransactionDetails[1].data.reference,
      }
    );
  }
  return responseHandler(
    res,
    checkTransactionDetails[1].message,
    400,
    true,
    checkTransactionDetails[1].data
  );
};

module.exports = {
  intializePayment,
  verifyPayment,
};
