import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext';

const navLinks = [
  { to: '/',        label: 'HOME',    icon: '🏠' },
  { to: '/menu',    label: 'MENU',    icon: '🍣' },
  { to: '/orders',  label: 'ORDERS',  icon: '📦' },
  { to: '/profile', label: 'PROFILE', icon: '👤' },
];

const RED     = '#D42B2B';
const BG      = '#0a0000';
const BORDER  = '#3d0808';
const MUTED   = '#9a7a7a';
const WHITE   = '#F5ECEC';

const Header = () => {
  const { state }       = useCart();
  const location        = useLocation();
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: BG,
        borderBottom: `1px solid ${BORDER}`,
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          padding: mobile ? '0 20px' : '0 40px',
          height: mobile ? '62px' : '76px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'baseline', gap: '4px', textDecoration: 'none' }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: mobile ? '0.9rem' : '1.1rem',
              letterSpacing: '4px', color: RED, opacity: 0.85,
              marginRight: '4px',
            }}>木</span>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: mobile ? '1.8rem' : '2.5rem',
              fontWeight: 700, color: WHITE, letterSpacing: '2px',
            }}>SushiMate</span>
          </Link>

          {/* Desktop Nav */}
          {!mobile && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
              {navLinks.map(link => {
                const active = location.pathname === link.to;
                return (
                  <Link key={link.to} to={link.to} style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700, fontSize: '0.68rem', letterSpacing: '2.5px',
                    color: active ? RED : MUTED,
                    textDecoration: 'none', transition: 'color 0.2s',
                    borderBottom: active ? `1px solid ${RED}` : '1px solid transparent',
                    paddingBottom: '2px',
                  }}>
                    {link.label}
                  </Link>
                );
              })}
              <Link to="/cart" style={{ position: 'relative', color: MUTED, textDecoration: 'none' }}>
                <FontAwesomeIcon icon={faShoppingCart} style={{ fontSize: '1rem' }} />
                {itemCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-7px', right: '-9px',
                    background: RED, color: '#fff',
                    fontSize: '0.58rem', fontWeight: 800,
                    borderRadius: '999px', padding: '1px 5px', lineHeight: 1.5,
                  }}>{itemCount}</span>
                )}
              </Link>
            </nav>
          )}

          {/* Mobile right side: cart + burger */}
          {mobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Cart */}
              <Link to="/cart" style={{ position: 'relative', color: MUTED, textDecoration: 'none' }}>
                <FontAwesomeIcon icon={faShoppingCart} style={{ fontSize: '1.1rem' }} />
                {itemCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-8px', right: '-10px',
                    background: RED, color: '#fff',
                    fontSize: '0.6rem', fontWeight: 800,
                    borderRadius: '999px', padding: '1px 5px', lineHeight: 1.5,
                  }}>{itemCount}</span>
                )}
              </Link>
              {/* Burger */}
              <button
                onClick={() => setOpen(o => !o)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: open ? RED : MUTED, fontSize: '1.3rem',
                  padding: '4px', lineHeight: 1, transition: 'color 0.2s',
                }}
                aria-label="Menu"
              >
                <FontAwesomeIcon icon={open ? faTimes : faBars} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile dropdown menu */}
        {mobile && (
          <div style={{
            overflow: 'hidden',
            maxHeight: open ? '320px' : '0',
            transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)',
            background: '#0f0000',
            borderTop: open ? `1px solid ${BORDER}` : 'none',
          }}>
            <nav style={{ padding: '12px 0 8px' }}>
              {navLinks.map(link => {
                const active = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '14px 24px',
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 700, fontSize: '0.8rem', letterSpacing: '2px',
                      color: active ? RED : MUTED,
                      textDecoration: 'none',
                      borderLeft: active ? `3px solid ${RED}` : '3px solid transparent',
                      transition: 'all 0.15s',
                      background: active ? 'rgba(212,43,43,0.06)' : 'transparent',
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>{link.icon}</span>
                    {link.label}
                  </Link>
                );
              })}
              {/* Cart link in menu */}
              <Link
                to="/cart"
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 24px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700, fontSize: '0.8rem', letterSpacing: '2px',
                  color: MUTED, textDecoration: 'none',
                  borderLeft: '3px solid transparent',
                }}
              >
                <span style={{ fontSize: '1rem' }}>🛒</span>
                CART {itemCount > 0 && (
                  <span style={{
                    background: RED, color: '#fff',
                    fontSize: '0.6rem', fontWeight: 800,
                    borderRadius: '999px', padding: '1px 7px',
                  }}>{itemCount}</span>
                )}
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Bottom red gradient accent */}
      <div style={{ height: '1px', background: 'linear-gradient(to right, #D42B2B, #7a1010, transparent)' }} />
    </>
  );
};

export default Header;
