const Joi = require("joi");

const intializePaymentValidation = async (field) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    amount: Joi.number().required(),
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

module.exports = {
  intializePaymentValidation,
};
