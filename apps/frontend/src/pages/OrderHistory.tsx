import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../services/api';
import { useCart } from '../context/CartContext';
import { Product } from '../context/CartContext';

interface Order {
  _id: string;
  orderId: string;
  customer: { name: string; phone: string };
  items: Array<{ id: number; name: string; price: number; quantity: number; total: number }>;
  total: number;
  status: string;
  createdAt: string;
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { dispatch } = useCart();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const repeatOrder = (order: Order) => {
    order.items.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        dispatch({
          type: 'ADD_ITEM',
          payload: {
            id: item.id,
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
        <p className="text-gray-400">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-8 text-white">My Orders</h1>
        <div className="glass-card rounded-3xl p-8 max-w-md mx-auto">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-xl mb-6 text-gray-300">No orders yet</p>
          <Link to="/menu" className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-full font-semibold inline-block">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12 text-white">My Orders</h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {orders.map(order => (
          <div key={order._id} className="glass-card rounded-3xl p-6 hover:scale-[1.01] transition">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-4 border-b border-orange-500/30">
              <div>
                <p className="text-sm text-gray-400">Order #{order.orderId}</p>
                <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className={`px-4 py-1 rounded-full ${getStatusColor(order.status)} text-sm font-semibold mt-2 md:mt-0`}>
                {getStatusText(order.status)}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {order.items.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-300">{item.quantity}× {item.name}</span>
                  <span className="text-white">{item.total.toFixed(2)} AED</span>
                </div>
              ))}
              {order.items.length > 3 && (
                <p className="text-xs text-gray-500">+{order.items.length - 3} more items</p>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-orange-500/30">
              <div>
                <p className="text-sm text-gray-400">Total</p>
                <p className="text-xl font-bold text-orange-400">{order.total.toFixed(2)} AED</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => repeatOrder(order)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-full text-sm font-semibold hover:scale-105 transition"
                >
                  🔄 Repeat Order
                </button>
                <Link
                  to={`/order/${order._id}`}
                  className="px-4 py-2 bg-gray-800 rounded-full text-sm font-semibold hover:bg-gray-700 transition"
                >
                  Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;