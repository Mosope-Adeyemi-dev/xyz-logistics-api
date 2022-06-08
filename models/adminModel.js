const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema({
  lastname: { type: String, trim: true },
  firstname: { type: String, trim: true },
  password: {
    type: String,
    trim: true,
    min: [8, 'password characters must be atleast 8'],
    max: [1024, 'password too long'],
  },
  email: {
    type: String,
    unique: [true, 'Email taken'],
    required: true,
    trim: true,
  },
  inviteToken: { type: String, required: true },
  role: { type: String, default: 'admin' },
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
