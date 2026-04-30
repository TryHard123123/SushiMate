import { useEffect, useState } from 'react';

interface ToastNotificationProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ message, onClose, duration = 2500 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: '100px',
      right: '24px',
      zIndex: 300,
      transform: visible ? 'translateX(0)' : 'translateX(400px)',
      opacity: visible ? 1 : 0,
      transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      <div style={{
        background: '#FFFFFF',
        border: '2px solid #FEE2E2',
        borderRadius: '16px',
        padding: '20px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 12px 40px rgba(220,38,38,0.15)',
        minWidth: '340px',
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: '#DC2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.3rem',
          color: '#fff',
          flexShrink: 0,
        }}>
          ✓
        </div>
        <div style={{ flex: 1 }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.7rem',
            fontWeight: 600,
            color: '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '3px',
          }}>
            Added to your cart
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.15rem',
            fontWeight: 700,
            color: '#111827',
          }}>
            {message}
          </p>
        </div>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#9CA3AF',
            cursor: 'pointer',
            fontSize: '1rem',
            padding: '4px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#DC2626'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#9CA3AF'; }}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;