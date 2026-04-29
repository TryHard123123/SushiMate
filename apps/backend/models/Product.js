const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  fullDescription: { type: String, default: '' },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  images: [{ type: String }],
  category: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 0 },
  isHit: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);