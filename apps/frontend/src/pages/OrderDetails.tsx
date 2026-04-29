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
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'preparing': return 'bg-blue-100 text-blue-700';
      case 'delivering': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
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
        <p className="text-gray-500">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Order Not Found</h1>
        <Link to="/orders" className="text-pink-500 hover:text-pink-600">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <Link to="/orders" className="text-pink-500 hover:text-pink-600 mb-6 inline-block">
          ← Back to Orders
        </Link>

        <div className="bg-white border border-pink-200 rounded-2xl p-8 shadow-sm">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-pink-100">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderId}</h1>
              <p className="text-gray-500 text-sm mt-1">
                Placed on {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div className={`px-4 py-1 rounded-full text-sm font-semibold mt-2 md:mt-0 ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-2xl p-4">
              <h3 className="text-lg font-semibold text-pink-500 mb-3">Customer Info</h3>
              <p className="text-gray-900">👤 {order.customer.name}</p>
              <p className="text-gray-600 mt-1">📞 {order.customer.phone}</p>
              {order.customer.email && order.customer.email !== 'Not provided' && (
                <p className="text-gray-600 mt-1">✉️ {order.customer.email}</p>
              )}
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <h3 className="text-lg font-semibold text-pink-500 mb-3">Delivery Address</h3>
              <p className="text-gray-900">📍 {order.delivery.fullAddress}</p>
              {order.delivery.specialInstructions && (
                <p className="text-gray-500 text-sm mt-2">📝 {order.delivery.specialInstructions}</p>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-pink-500 mb-3">Items</h3>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <div>
                    <span className="font-medium text-pink-500">{item.quantity}×</span>
                    <span className="text-gray-900 ml-2">{item.name}</span>
                  </div>
                  <span className="text-gray-900 font-semibold">{item.total.toFixed(2)} CAD</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-8">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{order.subtotal.toFixed(2)} CAD</span>
              </div>
              {order.promoDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Promo Discount</span>
                  <span>-{order.promoDiscount.toFixed(2)} CAD</span>
                </div>
              )}
              {order.pointsDiscount > 0 && (
                <div className="flex justify-between text-yellow-600">
                  <span>Points Used</span>
                  <span>-{order.pointsDiscount.toFixed(2)} CAD</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span className="text-gray-900">Total</span>
                <span className="text-pink-500">{order.total.toFixed(2)} CAD</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={repeatOrder}
              className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-semibold transition shadow-sm"
            >
              🔄 Repeat Order
            </button>
            <Link
              to="/menu"
              className="flex-1 py-3 border-2 border-pink-300 text-pink-500 rounded-full font-semibold text-center hover:bg-pink-50 transition"
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