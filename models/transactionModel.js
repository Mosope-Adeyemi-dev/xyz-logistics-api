const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema({
  transactionId: { type: Number, required: true, unique: true },
  domain: String,
  status: { type: String, required: true, default: "pending" },
  amount: { type: Number, required: true },
  reference: { type: String, required: true },
  paid_at: Date,
  transaction_date: Date,
  channel: String,
  customer: { type: Object },
  userID: { type: mongoose.SchemaTypes.ObjectId, ref: "User", required },
  currency: { type: String, default: "NGN" },
});

const Transaction = mongoose.model(transactionSchema);
module.exports = Transaction;
