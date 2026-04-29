const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' }
  },
  delivery: {
    streetAddress: String,
    building: String,
    apartment: String,
    entrance: String,
    floor: String,
    landmark: String,
    fullAddress: String,
    specialInstructions: String
  },
  items: [{
    id: { type: String }, // МЕНЯЕМ с Number на String
    name: String,
    price: Number,
    quantity: Number,
    total: Number
  }],
  subtotal: Number,
  promoDiscount: { type: Number, default: 0 },
  pointsDiscount: { type: Number, default: 0 },
  total: Number,
  promocode: { type: String, default: null },
  pointsUsed: { type: Number, default: 0 },
  pointsEarned: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'delivering', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);