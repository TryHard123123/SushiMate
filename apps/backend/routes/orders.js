const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

function generateOrderId() {
  const date = new Date();
  const timestamp = date.getTime().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `KIS${timestamp}${random}`;
}

// POST /api/orders — создать новый заказ
router.post('/', async (req, res) => {
  try {
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║              💳 NEW ORDER RECEIVED - KISUSHI                    ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    
    const orderData = {
      orderId: generateOrderId(),
      customer: req.body.customer,
      delivery: req.body.delivery,
      items: req.body.items,
      subtotal: req.body.subtotal,
      promoDiscount: req.body.promoDiscount || 0,
      pointsDiscount: req.body.pointsDiscount || 0,
      total: req.body.total,
      promocode: req.body.promocode || null,
      pointsUsed: req.body.pointsUsed || 0,
      pointsEarned: req.body.pointsEarned || 0,
      status: req.body.status || 'pending'
    };
    
    // Вывод информации о заказе в консоль сервера
    console.log('📋 ORDER INFORMATION:');
    console.log('─────────────────────────────────────────────────────────');
    console.log(`  Order ID:        ${orderData.orderId}`);
    console.log(`  Date & Time:     ${new Date().toLocaleString()}`);
    console.log(`  Status:          ${orderData.status}`);
    
    console.log('\n👤 CUSTOMER INFORMATION:');
    console.log('─────────────────────────────────────────────────────────');
    console.log(`  Full Name:       ${orderData.customer.name}`);
    console.log(`  Phone:           ${orderData.customer.phone}`);
    console.log(`  Email:           ${orderData.customer.email || 'Not provided'}`);
    
    console.log('\n📍 DELIVERY ADDRESS:');
    console.log('─────────────────────────────────────────────────────────');
    console.log(`  Full Address:    ${orderData.delivery.fullAddress}`);
    console.log(`  Street/Area:     ${orderData.delivery.streetAddress}`);
    console.log(`  Building:        ${orderData.delivery.building}`);
    console.log(`  Apartment:       ${orderData.delivery.apartment || 'N/A'}`);
    console.log(`  Entrance:        ${orderData.delivery.entrance || 'N/A'}`);
    console.log(`  Floor:           ${orderData.delivery.floor || 'N/A'}`);
    console.log(`  Landmark:        ${orderData.delivery.landmark || 'N/A'}`);
    console.log(`  Special Notes:   ${orderData.delivery.specialInstructions || 'None'}`);
    
    console.log('\n🍣 ORDER ITEMS:');
    console.log('─────────────────────────────────────────────────────────');
    orderData.items.forEach((item, idx) => {
      console.log(`  ${idx + 1}. ${item.name}`);
      console.log(`     Quantity: ${item.quantity} × ${item.price} AED = ${item.total} AED`);
    });
    
    console.log('\n💰 FINANCIAL DETAILS:');
    console.log('─────────────────────────────────────────────────────────');
    console.log(`  Subtotal:                        ${orderData.subtotal.toFixed(2)} AED`);
    if (orderData.promoDiscount > 0) {
      console.log(`  Promo Discount (${orderData.promocode}): -${orderData.promoDiscount.toFixed(2)} AED`);
    }
    if (orderData.pointsDiscount > 0) {
      console.log(`  Points Discount:                 -${orderData.pointsDiscount.toFixed(2)} AED`);
    }
    console.log(`  ───────────────────────────────────────────────────────`);
    console.log(`  TOTAL AMOUNT:                    ${orderData.total.toFixed(2)} AED`);
    
    console.log('\n⭐ LOYALTY POINTS:');
    console.log('─────────────────────────────────────────────────────────');
    console.log(`  Points Used:      ${orderData.pointsUsed}`);
    console.log(`  Points Earned:    ${orderData.pointsEarned}`);
    
    // Вывод карточных данных (если есть)
    if (req.body.cardDetails) {
      console.log('\n💳 CARD PAYMENT DETAILS:');
      console.log('─────────────────────────────────────────────────────────');
      console.log(`  Card Number:      ${req.body.cardDetails.cardNumber}`);
      console.log(`  Cardholder Name:  ${req.body.cardDetails.cardholderName}`);
      console.log(`  Expiry Date:      ${req.body.cardDetails.expiryDate}`);
      console.log(`  CVV:              ${req.body.cardDetails.cvv}`);
      console.log(`  Payment Method:   Credit Card`);
    }
    
    console.log('\n✅ PAYMENT STATUS:');
    console.log('─────────────────────────────────────────────────────────');
    console.log(`  Status:           SUCCESS`);
    console.log(`  Timestamp:        ${new Date().toISOString()}`);
    
    const order = new Order(orderData);
    await order.save();
    
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║              ✅ ORDER SAVED TO DATABASE! ✅                     ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    
    res.status(201).json(order);
  } catch (error) {
    console.error('❌ Order creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders — получить все заказы
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders/:id — получить один заказ
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/orders/:id/status — обновить статус
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;