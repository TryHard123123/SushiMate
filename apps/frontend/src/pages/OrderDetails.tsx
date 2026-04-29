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

const RED = '#DC2626';
const RED_DIM = '#FCA5A5';
const RED_BG = '#FEF2F2';
const DARK = '#111827';
const MUTED = '#6B7280';
const WHITE = '#FFFFFF';

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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' };
      case 'preparing': return { bg: '#DBEAFE', text: '#2563EB', border: '#BFDBFE' };
      case 'delivering': return { bg: '#EDE9FE', text: '#7C3AED', border: '#DDD6FE' };
      case 'delivered': return { bg: '#D1FAE5', text: '#059669', border: '#A7F3D0' };
      case 'cancelled': return { bg: '#FEE2E2', text: '#DC2626', border: '#FECACA' };
      default: return { bg: '#F3F4F6', text: '#6B7280', border: '#E5E7EB' };
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
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: WHITE }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🍣</div>
          <p style={{ color: MUTED, fontFamily: "'DM Sans', sans-serif" }}>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: WHITE, gap: '20px' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 700, color: DARK }}>
          Order Not Found
        </h1>
        <Link to="/orders" style={{
          color: RED,
          fontSize: '0.9rem',
          fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          textDecoration: 'none',
        }}>
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const statusStyle = getStatusStyle(order.status);

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Back link */}
        <Link to="/orders" style={{
          display: 'inline-block',
          color: RED,
          fontSize: '0.85rem',
          fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          textDecoration: 'none',
          marginBottom: '28px',
          transition: 'color 0.2s',
        }}>
          ← Back to Orders
        </Link>

        {/* Main Card */}
        <div style={{
          background: WHITE,
          border: '1px solid #FEE2E2',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '28px',
            paddingBottom: '24px',
            borderBottom: '2px solid #FEE2E2',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <div>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2rem',
                fontWeight: 700,
                color: DARK,
                marginBottom: '6px',
              }}>
                Order #{order.orderId}
              </h1>
              <p style={{
                fontSize: '0.85rem',
                color: MUTED,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <span style={{
              padding: '8px 20px',
              borderRadius: '50px',
              fontSize: '0.82rem',
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              background: statusStyle.bg,
              color: statusStyle.text,
              border: `1px solid ${statusStyle.border}`,
            }}>
              {getStatusText(order.status)}
            </span>
          </div>

          {/* Customer & Delivery Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '32px',
          }}>
            <div style={{
              background: RED_BG,
              borderRadius: '14px',
              padding: '24px',
              border: '1px solid #FEE2E2',
            }}>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.3rem',
                fontWeight: 700,
                color: RED,
                marginBottom: '16px',
              }}>
                Customer Info
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{ color: DARK, fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif" }}>
                  👤 {order.customer.name}
                </p>
                <p style={{ color: MUTED, fontSize: '0.88rem', fontFamily: "'DM Sans', sans-serif" }}>
                  📞 {order.customer.phone}
                </p>
                {order.customer.email && order.customer.email !== 'Not provided' && (
                  <p style={{ color: MUTED, fontSize: '0.88rem', fontFamily: "'DM Sans', sans-serif" }}>
                    ✉️ {order.customer.email}
                  </p>
                )}
              </div>
            </div>

            <div style={{
              background: RED_BG,
              borderRadius: '14px',
              padding: '24px',
              border: '1px solid #FEE2E2',
            }}>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.3rem',
                fontWeight: 700,
                color: RED,
                marginBottom: '16px',
              }}>
                Delivery Address
              </h3>
              <p style={{ color: DARK, fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
                📍 {order.delivery.fullAddress}
              </p>
              {order.delivery.specialInstructions && (
                <p style={{
                  color: MUTED,
                  fontSize: '0.84rem',
                  fontFamily: "'DM Sans', sans-serif",
                  marginTop: '10px',
                  lineHeight: 1.5,
                }}>
                  📝 {order.delivery.specialInstructions}
                </p>
              )}
            </div>
          </div>

          {/* Items */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.4rem',
              fontWeight: 700,
              color: DARK,
              marginBottom: '16px',
            }}>
              Items
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {order.items.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  background: '#F9FAFB',
                  borderRadius: '12px',
                  border: '1px solid #FEE2E2',
                }}>
                  <div>
                    <span style={{ fontWeight: 700, color: RED, fontSize: '0.95rem' }}>
                      {item.quantity}×{' '}
                    </span>
                    <span style={{ color: DARK, fontSize: '0.95rem', fontFamily: "'DM Sans', sans-serif" }}>
                      {item.name}
                    </span>
                  </div>
                  <span style={{
                    fontWeight: 700,
                    color: DARK,
                    fontSize: '0.95rem',
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {item.total.toFixed(2)} CAD
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div style={{
            background: RED_BG,
            borderRadius: '14px',
            padding: '24px',
            marginBottom: '32px',
            border: '1px solid #FEE2E2',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: MUTED, fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif" }}>Subtotal</span>
                <span style={{ color: DARK, fontSize: '0.9rem', fontWeight: 600 }}>{order.subtotal.toFixed(2)} CAD</span>
              </div>
              {order.promoDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#059669', fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif" }}>Promo Discount</span>
                  <span style={{ color: '#059669', fontSize: '0.9rem', fontWeight: 600 }}>-{order.promoDiscount.toFixed(2)} CAD</span>
                </div>
              )}
              {order.pointsDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#D97706', fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif" }}>Points Used</span>
                  <span style={{ color: '#D97706', fontSize: '0.9rem', fontWeight: 600 }}>-{order.pointsDiscount.toFixed(2)} CAD</span>
                </div>
              )}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '14px',
                borderTop: '2px solid #FCA5A5',
                marginTop: '4px',
              }}>
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: DARK,
                }}>Total</span>
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: RED,
                }}>{order.total.toFixed(2)} CAD</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={repeatOrder}
              style={{
                flex: 1,
                padding: '16px',
                background: RED,
                color: '#fff',
                border: 'none',
                borderRadius: '50px',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 20px rgba(220,38,38,0.3)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = '#EF4444';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = RED;
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}>
              🔄 Repeat Order
            </button>
            <Link
              to="/menu"
              style={{
                flex: 1,
                padding: '16px',
                background: 'transparent',
                border: `2px solid ${RED_DIM}`,
                color: RED,
                borderRadius: '50px',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                textDecoration: 'none',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = RED_BG;
                (e.currentTarget as HTMLElement).style.borderColor = RED;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.borderColor = RED_DIM;
              }}>
              🍣 Browse Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;