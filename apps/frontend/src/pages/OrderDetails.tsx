import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrders } from '../services/api';
import { useCart } from '../context/CartContext';
import { Product } from '../context/CartContext';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

interface Order {
  _id: string;
  orderId: string;
  customer: { name: string; phone: string; email: string };
  delivery: {
    streetAddress: string;
    building: string;
    apartment: string;
    entrance: string;
    floor: string;
    landmark: string;
    fullAddress: string;
    specialInstructions: string;
  };
  items: OrderItem[];
  subtotal: number;
  promoDiscount: number;
  pointsDiscount: number;
  total: number;
  promocode: string | null;
  status: string;
  createdAt: string;
}

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { dispatch } = useCart();

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const response = await getOrders();
      const foundOrder = response.data.find((o: Order) => o._id === id);
      setOrder(foundOrder || null);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setLoading(false);
    }
  };

  const normalizeProductId = (rawId: string | number): number => {
    if (typeof rawId === 'number' && Number.isFinite(rawId)) return rawId;
    const numeric = Number(String(rawId).replace(/[^0-9]/g, ''));
    return Number.isFinite(numeric) && numeric > 0 ? numeric : Date.now();
  };

  const repeatOrder = () => {
    if (!order) return;
    order.items.forEach(item => {
      const normalizedId = normalizeProductId(item.id);
      for (let i = 0; i < item.quantity; i++) {
        dispatch({
          type: 'ADD_ITEM',
          payload: {
            id: normalizedId,
            name: item.name,
            price: item.price,
            description: '',
            fullDescription: '',
            image: '',
            images: [],
            category: ''
          } as Product
        });
      }
    });
    alert(`✅ ${order.items.length} items added to cart!`);
    window.location.href = '/cart';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'preparing': return 'bg-blue-500/20 text-blue-400';
      case 'delivering': return 'bg-purple-500/20 text-purple-400';
      case 'delivered': return 'bg-green-500/20 text-green-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '⏳ Pending';
      case 'preparing': return '👨‍🍳 Preparing';
      case 'delivering': return '🚚 Delivering';
      case 'delivered': return '✅ Delivered';
      case 'cancelled': return '❌ Cancelled';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-4xl mb-4 animate-pulse">🍣</div>
        <p className="text-gray-400">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-8 text-white">Order Not Found</h1>
        <Link to="/orders" className="text-orange-400 hover:text-orange-300">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <Link to="/orders" className="text-orange-400 hover:text-orange-300 mb-6 inline-block">
          ← Back to Orders
        </Link>

        <div className="glass-card rounded-3xl p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-orange-500/30">
            <div>
              <h1 className="text-2xl font-bold text-white">Order #{order.orderId}</h1>
              <p className="text-gray-400 text-sm mt-1">
                Placed on {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div className={`px-4 py-1 rounded-full ${getStatusColor(order.status)} text-sm font-semibold mt-2 md:mt-0`}>
              {getStatusText(order.status)}
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800/50 rounded-2xl p-4">
              <h3 className="text-lg font-semibold text-orange-400 mb-3">Customer Info</h3>
              <p className="text-white">👤 {order.customer.name}</p>
              <p className="text-gray-300 mt-1">📞 {order.customer.phone}</p>
              {order.customer.email && order.customer.email !== 'Not provided' && (
                <p className="text-gray-300 mt-1">✉️ {order.customer.email}</p>
              )}
            </div>

            <div className="bg-gray-800/50 rounded-2xl p-4">
              <h3 className="text-lg font-semibold text-orange-400 mb-3">Delivery Address</h3>
              <p className="text-white">📍 {order.delivery.fullAddress}</p>
              {order.delivery.specialInstructions && (
                <p className="text-gray-400 text-sm mt-2">📝 {order.delivery.specialInstructions}</p>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-orange-400 mb-3">Items</h3>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-800/30 rounded-xl">
                  <div>
                    <span className="font-medium text-orange-400">{item.quantity}×</span>
                    <span className="text-white ml-2">{item.name}</span>
                  </div>
                  <span className="text-white font-semibold">{item.total.toFixed(2)} AED</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gray-800/50 rounded-2xl p-4 mb-8">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>{order.subtotal.toFixed(2)} AED</span>
              </div>
              {order.promoDiscount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Promo Discount</span>
                  <span>-{order.promoDiscount.toFixed(2)} AED</span>
                </div>
              )}
              {order.pointsDiscount > 0 && (
                <div className="flex justify-between text-yellow-400">
                  <span>Points Used</span>
                  <span>-{order.pointsDiscount.toFixed(2)} AED</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-700">
                <span className="text-white">Total</span>
                <span className="text-orange-400">{order.total.toFixed(2)} AED</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={repeatOrder}
              className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full font-semibold hover:scale-105 transition"
            >
              🔄 Repeat Order
            </button>
            <Link
              to="/menu"
              className="flex-1 py-3 bg-gray-800 rounded-full font-semibold text-center hover:bg-gray-700 transition"
            >
              🍣 Browse Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;