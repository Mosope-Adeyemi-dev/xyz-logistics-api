const mongoose = require('mongoose');

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
    wallet_balance: {
      type: Number,
      default: 0,
    },
    photo: {
      type: String,
      default: '/avatar.png',
    },
    phone_number: {
      type: String,
      maxlength: [15, 'Phone number should not be more than 15 characters'],
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
      default: ['User'],
      enum: ['User', 'Rider', 'Admin'],
    },
    reset_password_pin: {
      type: String,
      default: '',
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

module.exports = mongoose.model('User', userSchema);
