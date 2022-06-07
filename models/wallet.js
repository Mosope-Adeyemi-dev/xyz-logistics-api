const mongoose = require("mongoose");
const { Schema } = mongoose;

const bankCardSchema = new Schema({
  authorizationCode: { type: String, required: true },
  last4: String,
  expMonth: String,
  expYear: String,
  bank: String,
  cardType: String,
  reusable: Boolean,
  signature: String,
});
const bankAccountSchema = new Schema({
  accountNumber: { type: Number },
  accountName: { type: String },
  bankCode: { type: String },
  bankId: { type: String },
});
const transactionSchema = new Schema({
  transactionId: { type: Number },
  status: { type: String, default: "pending" },
  amount: { type: Number },
  reference: { type: String },
  authorizationCode: { type: String },
  channel: String,
  currency: { type: String, default: "NGN" },
});
// 629888464bed4b45e0d61148
const walletSchema = new Schema(
  {
    bankAccounts: [bankAccountSchema],
    bankCards: [bankCardSchema],
    transactionDetails: [transactionSchema],
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      unique: true,
      ref: "User",
      required: true,
    },
    walletBalance: { type: Number, default: 0, required: true },
  },
  { timestamps: true }
);

const Wallet = mongoose.model("wallet", walletSchema);
module.exports = Wallet;
