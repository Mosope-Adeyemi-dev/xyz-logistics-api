const mongoose = require("mongoose");
const transactionHistorySchema = new mongoose.Schema({
  transactionId: { type: Number, unique: true },
  status: { type: String, default: "pending" },
  amount: Number,
  reference: { type: String, unique: true },
  authorizationCode: String,
  fullHistory: Object,
});
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    firstname: {
      type: String,
      trim: true,
      required: true,
    },
    lastname: {
      type: String,
      trim: true,
      required: true,
    },
    transactionHistory: [transactionHistorySchema],
    photo: {
      type: String,
      default: "/avatar.png",
    },
    phone_number: {
      type: String,
      maxlength: [15, "Phone number should not be more than 15 characters"],
    },
    address: {
      primary: {
        type: String,
      },
      secondary: {
        type: String,
      },
    },
    role: {
      type: [String],
      default: ["User"],
      enum: ["User", "Rider"],
    },
    reset_password_pin: {
      type: String,
      default: "",
    },
    reset_pin_expiry: {
      type: Date,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
