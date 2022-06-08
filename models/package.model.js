const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'What is the name of the package?'],
    },
    package_id: {
      type: String,
      required: true,
    },
    creatorId: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: String,
      trim: true,
      required: [true, 'What is the name of the receiver?'],
    },
    receiver_phone: {
      type: String,
      maxlength: 15,
      required: [true, 'Phone number of the receiver is required!'],
    },
    weight: {
      type: Number,
      max: 500,
    },
    package_type: {
      type: String,

      required: [true, 'Please input the type.'],
    },
    pickup_address: {
      type: String,
    },
    delivery_address: {
      type: String,
      required: [true, 'Please a delivery address is required.'],
    },
    delivery_agent: {
      type: ObjectId,
      ref: 'User',
    },
    requestApproved: {
      type: Boolean,
      default: false,
    },
    deliveryType: {
      type: String,
      enum: ['pickup', 'dropoff'],
      default: 'pickup',
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'delivered', 'cancelled'],
      default: 'pending',
    },
    vehicle: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Package', packageSchema);
