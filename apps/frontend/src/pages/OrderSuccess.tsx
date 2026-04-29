import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Получаем последний заказ из localStorage
    const savedOrders = localStorage.getItem('sushimate_orders');
    
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      if (orders.length > 0) {
        setOrderId(orders[0].orderId);
      }
    }
    
    // Небольшая задержка для анимации
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FFFFFF',
        gap: '20px',
      }}>
        <div style={{ fontSize: '4rem' }}>🍣</div>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #FFB6C1',
          borderTop: '3px solid #FF69B4',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1.2rem',
          color: '#6C757D',
        }}>
          Preparing your order...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
        padding: '50px 36px',
        background: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #FFB6C1',
        boxShadow: '0 10px 40px rgba(255,105,180,0.1)',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
        
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '2rem',
          fontWeight: 700,
          color: '#1F2937',
          marginBottom: '8px',
        }}>
          Order Confirmed!
        </h1>
        
        <p style={{
          fontSize: '0.9rem',
          color: '#6C757D',
          marginBottom: '24px',
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.6,
        }}>
          Thank you for your order!<br />
          Your sushi is being prepared with care.
        </p>

        {orderId && (
          <div style={{
            background: '#FFF0F5',
            border: '1px solid #FFB6C1',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '24px',
          }}>
            <p style={{
              fontSize: '0.7rem',
              color: '#6C757D',
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}>
              Order Number
            </p>
            <p style={{
              fontFamily: 'monospace',
              fontSize: '1.3rem',
              fontWeight: 700,
              color: '#FF69B4',
              letterSpacing: '1px',
            }}>
              #{orderId}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link
            to="/orders"
            style={{
              display: 'block',
              width: '100%',
              padding: '14px',
              background: '#FF69B4',
              color: '#FFFFFF',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              borderRadius: '50px',
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
          >
            📋 View My Orders
          </Link>
          
          <Link
            to="/menu"
            style={{
              display: 'block',
              width: '100%',
              padding: '14px',
              background: 'transparent',
              border: '2px solid #FFB6C1',
              color: '#FF69B4',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              borderRadius: '50px',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            🍣 Continue Shopping
          </Link>
        </div>

        <p style={{
          fontSize: '0.72rem',
          color: '#ADB5BD',
          marginTop: '20px',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          🚗 Estimated delivery: 30-45 min
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;