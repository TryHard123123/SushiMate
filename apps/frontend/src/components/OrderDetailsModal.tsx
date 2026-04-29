import { useState } from 'react';
import { Order } from '../types/order';
import { useCart } from '../context/CartContext';
import { Product } from '../context/CartContext';
import ProductModal from './ProductModal';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onRepeatOrder: (orderId: string) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, isOpen, onClose, onRepeatOrder }) => {
  const { dispatch } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  if (!isOpen || !order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'preparing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'delivering': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
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

  const handleProductClick = (item: any) => {
    // Создаём объект продукта из item заказа
    const product: Product = {
      id: item.id,
      name: item.name,
      description: '',
      fullDescription: '',
      price: item.price,
      image: '',
      images: [],
      category: ''
    };
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleRepeatOrder = () => {
    // Добавляем все товары из заказа в корзину
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
    onRepeatOrder(order.id);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative border border-orange-500/30 shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-white hover:text-orange-400 transition-colors z-10 text-2xl"
          >
            ✕
          </button>

          <div className="p-6 md:p-8">
            {/* Заголовок */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-orange-500/30">
              <div>
                <h2 className="text-2xl font-bold text-white">Order Details</h2>
                <p className="text-sm text-gray-400 mt-1">Order #{order.id.slice(-8)}</p>
              </div>
              <div className={`px-4 py-1 rounded-full border ${getStatusColor(order.status)} text-sm font-semibold mt-2 md:mt-0`}>
                {getStatusText(order.status)}
              </div>
            </div>

            {/* Информация о доставке */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="glass-card rounded-2xl p-4">
                <h3 className="text-lg font-semibold text-orange-400 mb-3">Customer Info</h3>
                <p className="text-white">👤 {order.customer.name}</p>
                <p className="text-gray-300 mt-1">📞 {order.customer.phone}</p>
                {order.customer.email && order.customer.email !== 'Not provided' && (
                  <p className="text-gray-300 mt-1">✉️ {order.customer.email}</p>
                )}
              </div>

              <div className="glass-card rounded-2xl p-4">
                <h3 className="text-lg font-semibold text-orange-400 mb-3">Delivery Address</h3>
                <p className="text-white">📍 {order.delivery.fullAddress}</p>
                {order.delivery.specialInstructions && (
                  <p className="text-gray-400 text-sm mt-2">📝 {order.delivery.specialInstructions}</p>
                )}
              </div>
            </div>

            {/* Товары */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-orange-400 mb-3">Items</h3>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl cursor-pointer hover:bg-gray-700/50 transition group"
                    onClick={() => handleProductClick(item)}
                  >
                    <div className="flex-1">
                      <span className="font-medium text-orange-400">{item.quantity}×</span>
                      <span className="text-white ml-2 group-hover:text-orange-400 transition">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white font-semibold">{item.total.toFixed(2)} AED</span>
                      <span className="text-gray-500 text-sm group-hover:text-orange-400 transition">▶</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Итого */}
            <div className="glass-card rounded-2xl p-4 mb-6">
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

            {/* Время заказа */}
            <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
              <span>📅 {new Date(order.timestamp).toLocaleString()}</span>
              {order.estimatedDelivery && (
                <span>🚚 Est. delivery: {new Date(order.estimatedDelivery).toLocaleTimeString()}</span>
              )}
            </div>

            {/* Кнопки действий */}
            <div className="flex gap-4">
              {order.status !== 'cancelled' && (
                <button
                  onClick={handleRepeatOrder}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full font-semibold hover:scale-105 transition"
                >
                  🔄 Repeat Order
                </button>
              )}
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gray-800 rounded-full font-semibold hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Модалка для просмотра блюда */}
      <ProductModal 
        product={selectedProduct} 
        isOpen={isProductModalOpen} 
        onClose={() => setIsProductModalOpen(false)} 
      />
    </>
  );
};

export default OrderDetailsModal;