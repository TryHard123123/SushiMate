import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBars, faTimes, faMapMarkerAlt, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext';
import DeliveryModal from './DeliveryModal';

const RED = '#DC2626';
const RED_DIM = '#FCA5A5';
const RED_BG = '#FEF2F2';
const BG = '#FFFFFF';
const BORDER = '#FEE2E2';
const MUTED = '#6B7280';
const DARK = '#111827';

const Header = () => {
  const { state } = useCart();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup' | null>(
    () => localStorage.getItem('sushimate_delivery_method') as 'delivery' | 'pickup' | null
  );
  const [deliveryAddress, setDeliveryAddress] = useState(
    () => localStorage.getItem('sushimate_delivery_address') || ''
  );

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const handleDeliveryMethodSelect = (method: 'delivery' | 'pickup', address?: string) => {
    setDeliveryMethod(method);
    if (address) {
      setDeliveryAddress(address);
      localStorage.setItem('sushimate_delivery_address', address);
    }
    localStorage.setItem('sushimate_delivery_method', method);
    setDeliveryModalOpen(false);
  };

  const getDeliveryLabel = () => {
    if (!deliveryMethod) return null;
    if (deliveryMethod === 'delivery') {
      const short = deliveryAddress.length > 35 
        ? deliveryAddress.slice(0, 32) + '...'
        : deliveryAddress;
      return `🚗 Delivery to: ${short || 'Address set'}`;
    }
    const short = deliveryAddress.length > 35 
      ? deliveryAddress.slice(0, 32) + '...'
      : deliveryAddress;
    return `🏪 Pickup: ${short || 'Location selected'}`;
  };

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: BG,
        borderBottom: `1px solid ${scrolled ? BORDER : 'transparent'}`,
        transition: 'box-shadow 0.3s, border-color 0.3s',
        boxShadow: scrolled ? '0 2px 20px rgba(220,38,38,0.08)' : 'none',
      }}>
        {/* Топ-бар с выбранным методом доставки */}
        {deliveryMethod && (
          <div
            onClick={() => setDeliveryModalOpen(true)}
            style={{
              background: RED_BG,
              borderBottom: `1px solid ${BORDER}`,
              padding: '10px 0',
              cursor: 'pointer',
            }}>
            <div style={{
              maxWidth: '1280px', margin: '0 auto', padding: '0 40px',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                color: RED,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.82rem',
                fontWeight: 600,
              }}>
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <span>{getDeliveryLabel()}</span>
                <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '0.6rem', opacity: 0.6 }} />
              </div>
            </div>
          </div>
        )}

        {/* Основной хедер */}
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          padding: mobile ? '0 20px' : '0 40px',
          height: mobile ? '64px' : '76px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Логотип */}
          <Link to="/" style={{ display: 'flex', alignItems: 'baseline', gap: '6px', textDecoration: 'none' }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: mobile ? '1rem' : '1.2rem',
              letterSpacing: '4px', color: RED, opacity: 0.9,
            }}>木</span>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: mobile ? '2rem' : '2.6rem',
              fontWeight: 700, color: DARK, letterSpacing: '2px',
            }}>SushiMate</span>
          </Link>

          {/* Десктопная навигация */}
          {!mobile && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              
              {/* ===== ВОТ СЮДА ВСТАВЛЯТЬ КНОПКУ ORDER ONLINE ===== */}
              {deliveryMethod ? (
                // Если метод уже выбран — сразу переходим на страницу заказа
                <Link to="/order" style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700, fontSize: '0.78rem', letterSpacing: '3px',
                  color: '#FFFFFF',
                  background: RED,
                  border: 'none',
                  padding: '14px 28px',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 20px rgba(220,38,38,0.35)',
                  textTransform: 'uppercase',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = '#EF4444';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = RED;
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}>
                  ORDER ONLINE
                </Link>
              ) : (
                // Если метод не выбран — открываем окно выбора
                <button
                  onClick={() => setDeliveryModalOpen(true)}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700, fontSize: '0.78rem', letterSpacing: '3px',
                    color: '#FFFFFF',
                    background: RED,
                    border: 'none',
                    padding: '14px 28px',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 20px rgba(220,38,38,0.35)',
                    textTransform: 'uppercase',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = '#EF4444';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = RED;
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}>
                  ORDER ONLINE
                </button>
              )}
              {/* ===== КОНЕЦ ВСТАВКИ ===== */}

              <Link to="/orders" style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700, fontSize: '0.72rem', letterSpacing: '3px',
                color: location.pathname === '/orders' ? RED : MUTED,
                textDecoration: 'none',
                borderBottom: location.pathname === '/orders' ? `2px solid ${RED}` : '2px solid transparent',
                paddingBottom: '4px', transition: 'all 0.2s',
              }}>
                ORDERS
              </Link>

              <Link to="/profile" style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700, fontSize: '0.72rem', letterSpacing: '3px',
                color: location.pathname === '/profile' ? RED : MUTED,
                textDecoration: 'none',
                borderBottom: location.pathname === '/profile' ? `2px solid ${RED}` : '2px solid transparent',
                paddingBottom: '4px', transition: 'all 0.2s',
              }}>
                PROFILE
              </Link>

              <Link to="/cart" style={{
                position: 'relative', color: MUTED, textDecoration: 'none',
                padding: '8px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = RED; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = MUTED; }}>
                <FontAwesomeIcon icon={faShoppingCart} style={{ fontSize: '1.1rem' }} />
                {itemCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-3px', right: '-3px',
                    background: RED, color: '#fff',
                    fontSize: '0.6rem', fontWeight: 800,
                    borderRadius: '999px', padding: '2px 6px',
                    minWidth: '18px', textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(220,38,38,0.3)',
                  }}>{itemCount}</span>
                )}
              </Link>
            </nav>
          )}

          {/* Мобильная правая часть */}
          {mobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link to="/cart" style={{ position: 'relative', color: MUTED, textDecoration: 'none', padding: '6px' }}>
                <FontAwesomeIcon icon={faShoppingCart} style={{ fontSize: '1.2rem' }} />
                {itemCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-4px', right: '-4px',
                    background: RED, color: '#fff',
                    fontSize: '0.6rem', fontWeight: 800,
                    borderRadius: '999px', padding: '2px 5px',
                    boxShadow: '0 2px 8px rgba(220,38,38,0.3)',
                  }}>{itemCount}</span>
                )}
              </Link>
              <button
                onClick={() => setOpen(o => !o)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: open ? RED : MUTED, fontSize: '1.4rem', padding: '6px',
                }}>
                <FontAwesomeIcon icon={open ? faTimes : faBars} />
              </button>
            </div>
          )}
        </div>

        {/* Мобильное меню */}
        {mobile && (
          <div style={{
            overflow: 'hidden',
            maxHeight: open ? '350px' : '0',
            transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)',
            background: RED_BG,
            borderTop: open ? `1px solid ${BORDER}` : 'none',
          }}>
            <nav style={{ padding: '8px 0' }}>
              {deliveryMethod ? (
                <Link to="/order" style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '16px 24px',
                  background: RED, color: '#fff',
                  textDecoration: 'none',
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                  fontSize: '0.85rem', letterSpacing: '2px',
                }}>
                  <span>🛵</span> ORDER ONLINE
                </Link>
              ) : (
                <button
                  onClick={() => { setDeliveryModalOpen(true); setOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '16px 24px',
                    background: RED, color: '#fff',
                    border: 'none', width: '100%',
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                    fontSize: '0.85rem', letterSpacing: '2px', cursor: 'pointer',
                  }}>
                  <span>🛵</span> ORDER ONLINE
                </button>
              )}
              <Link to="/orders" style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '16px 24px', color: MUTED, textDecoration: 'none',
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                fontSize: '0.85rem', letterSpacing: '2px',
              }}>
                <span>📦</span> ORDERS
              </Link>
              <Link to="/profile" style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '16px 24px', color: MUTED, textDecoration: 'none',
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                fontSize: '0.85rem', letterSpacing: '2px',
              }}>
                <span>👤</span> PROFILE
              </Link>
            </nav>
          </div>
        )}
      </header>

      <div style={{ height: '2px', background: 'linear-gradient(to right, #DC2626, #FCA5A5, transparent)' }} />

      <DeliveryModal
        isOpen={deliveryModalOpen}
        onClose={() => setDeliveryModalOpen(false)}
        onSelect={handleDeliveryMethodSelect}
      />
    </>
  );
};

export default Header;