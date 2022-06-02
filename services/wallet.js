const https = require("https");
const { v4: uuidv4 } = require("uuid");
const { getUrl } = require("./userServices");

const intializePaymentChannel = async ({ email, amount }) => {
  const params = JSON.stringify({
    email,
    amount: amount * 100,
    reference: uuidv4(),
    currency: "NGN",
    callback_url: `${getUrl}/api/v1/wallet/paystack/verify-transaction/`,
  });
  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transaction/initialize",
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };

  return new Promise(function (resolve, reject) {
    const req = https
      .request(options, (res) => {
        let responseData = "";
        res.on("data", (chunk) => {
          responseData += chunk;
        });
        res.on("end", () => {
          /*if request was succesful but paystack service fails i.e status: false*/
          if (JSON.parse(responseData).status) {
            resolve([true, JSON.parse(responseData)]);
          } else {
            resolve([false, JSON.parse(responseData)]);
          }
        });
      })
      .on("error", (error) => {
        console.error(error);
        resolve([false, JSON.parse(responseData)]);
      });
    req.write(params);
    req.end();
  });
};

const verifyTransactionStatus = async (reference) => {
  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: `/transaction/verify/${reference}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };

  return new Promise(function (resolve, reject) {
    const req = https
      .request(options, (res) => {
        let responseData = "";
        res.on("data", (chunk) => {
          responseData += chunk;
        });
        res.on("end", () => {
          /*if request was succesful but paystack service fails i.e status: false*/
          if (JSON.parse(responseData).status) {
            resolve([true, JSON.parse(responseData)]);
          } else {
            resolve([false, JSON.parse(responseData)]);
          }
        });
      })
      .on("error", (error) => {
        console.error(error);
        resolve([false, JSON.parse(responseData)]);
      });
    req.end();
  });
};
module.exports = {
  intializePaymentChannel,
  verifyTransactionStatus,
};
