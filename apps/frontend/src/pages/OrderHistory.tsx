import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const RED = '#DC2626';
const RED_DIM = '#FCA5A5';
const WHITE = '#FFFFFF';
const DARK = '#111827';
const MUTED = '#6B7280';

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { dispatch } = useCart();

  useEffect(() => {
    loadOrders();
    window.addEventListener('storage', loadOrders);
    return () => window.removeEventListener('storage', loadOrders);
  }, []);

  const loadOrders = () => {
    try {
      const savedOrders = localStorage.getItem('sushimate_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
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
      case 'pending': return { bg: '#FEF3C7', text: '#D97706' };
      case 'preparing': return { bg: '#DBEAFE', text: '#2563EB' };
      case 'delivering': return { bg: '#E8D5F5', text: '#7C3AED' };
      case 'delivered': return { bg: '#D1FAE5', text: '#059669' };
      case 'cancelled': return { bg: '#FEE2E2', text: '#DC2626' };
      default: return { bg: '#F3F4F6', text: '#6B7280' };
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
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🍣</div>
          <p style={{ color: MUTED }}>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF', padding: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '440px' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 700, color: DARK, marginBottom: '24px' }}>
            My Orders
          </h1>
          <div style={{
            background: WHITE,
            border: '1px solid #FEE2E2',
            borderRadius: '16px',
            padding: '48px 32px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📦</div>
            <p style={{ fontSize: '1.2rem', color: MUTED, marginBottom: '28px', fontFamily: "'DM Sans', sans-serif" }}>
              No orders yet
            </p>
            <Link to="/menu" style={{
              display: 'inline-block',
              background: RED,
              color: '#fff',
              padding: '14px 36px',
              borderRadius: '50px',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(220,38,38,0.3)',
            }}>
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', padding: '48px 24px 80px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '2.5rem',
          fontWeight: 700,
          color: DARK,
          textAlign: 'center',
          marginBottom: '48px',
        }}>
          My Orders
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => {
            const statusStyle = getStatusColor(order.status);
            return (
              <div key={order._id} style={{
                background: WHITE,
                border: '1px solid #FEE2E2',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                transition: 'all 0.2s',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '20px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #FEE2E2',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}>
                  <div>
                    <p style={{ fontSize: '0.82rem', color: MUTED, marginBottom: '4px' }}>
                      Order #{order.orderId}
                    </p>
                    <p style={{ fontSize: '0.78rem', color: MUTED }}>
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span style={{
                    padding: '6px 16px',
                    borderRadius: '50px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    background: statusStyle.bg,
                    color: statusStyle.text,
                  }}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                      <span style={{ color: MUTED }}>{item.quantity}× {item.name}</span>
                      <span style={{ color: DARK, fontWeight: 600 }}>{item.total.toFixed(2)} CAD</span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p style={{ fontSize: '0.78rem', color: MUTED }}>
                      +{order.items.length - 3} more items
                    </p>
                  )}
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '16px',
                  borderTop: '1px solid #FEE2E2',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}>
                  <div>
                    <p style={{ fontSize: '0.78rem', color: MUTED }}>Total</p>
                    <p style={{ fontSize: '1.4rem', fontWeight: 700, color: RED }}>
                      {order.total.toFixed(2)} CAD
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => repeatOrder(order)} style={{
                      padding: '10px 24px',
                      background: RED,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50px',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 2px 12px rgba(220,38,38,0.2)',
                    }}>
                      🔄 Repeat
                    </button>
                    <Link to={`/order/${order._id}`} style={{
                      padding: '10px 24px',
                      background: 'transparent',
                      border: `2px solid ${RED_DIM}`,
                      color: RED,
                      borderRadius: '50px',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}>
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;