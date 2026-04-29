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

const RED = '#DC2626';
const RED_DIM = '#FCA5A5';
const BG = '#FFFFFF';
const BORDER = '#FEE2E2';
const MUTED = '#6B7280';

const Header = () => {
  const { state } = useCart();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

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

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: BG,
        borderBottom: `1px solid ${scrolled ? BORDER : 'transparent'}`,
        transition: 'box-shadow 0.3s, border-color 0.3s',
        boxShadow: scrolled ? '0 2px 20px rgba(220,38,38,0.08)' : 'none',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          padding: mobile ? '0 20px' : '0 40px',
          height: mobile ? '64px' : '80px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'baseline', gap: '6px', textDecoration: 'none' }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: mobile ? '1rem' : '1.2rem',
              letterSpacing: '4px', color: RED, opacity: 0.9,
            }}>木</span>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: mobile ? '2rem' : '2.8rem',
              fontWeight: 700, color: '#111827', letterSpacing: '2px',
            }}>SushiMate</span>
          </Link>

          {/* Desktop Nav */}
          {!mobile && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
              {navLinks.map(link => {
                const active = location.pathname === link.to;
                return (
                  <Link key={link.to} to={link.to} style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700, fontSize: '0.7rem', letterSpacing: '3px',
                    color: active ? RED : MUTED,
                    textDecoration: 'none', transition: 'all 0.2s',
                    borderBottom: active ? `2px solid ${RED}` : '2px solid transparent',
                    paddingBottom: '4px',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = RED; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = active ? RED : MUTED; }}>
                    {link.label}
                  </Link>
                );
              })}
              <Link to="/cart" style={{
                position: 'relative',
                color: MUTED,
                textDecoration: 'none',
                padding: '8px',
                borderRadius: '50%',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = '#FEF2F2';
                (e.currentTarget as HTMLElement).style.color = RED;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = MUTED;
              }}>
                <FontAwesomeIcon icon={faShoppingCart} style={{ fontSize: '1.1rem' }} />
                {itemCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-2px', right: '-2px',
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

          {/* Mobile right side */}
          {mobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link to="/cart" style={{
                position: 'relative',
                color: MUTED,
                textDecoration: 'none',
                padding: '6px',
              }}>
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
                  color: open ? RED : MUTED, fontSize: '1.4rem',
                  padding: '6px', transition: 'color 0.2s',
                }}
                aria-label="Menu">
                <FontAwesomeIcon icon={open ? faTimes : faBars} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile dropdown */}
        {mobile && (
          <div style={{
            overflow: 'hidden',
            maxHeight: open ? '400px' : '0',
            transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)',
            background: '#FEF2F2',
            borderTop: open ? `1px solid ${BORDER}` : 'none',
          }}>
            <nav style={{ padding: '8px 0' }}>
              {navLinks.map(link => {
                const active = location.pathname === link.to;
                return (
                  <Link key={link.to} to={link.to} style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '16px 24px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700, fontSize: '0.85rem', letterSpacing: '2px',
                    color: active ? RED : MUTED,
                    textDecoration: 'none',
                    borderLeft: active ? `3px solid ${RED}` : '3px solid transparent',
                    transition: 'all 0.15s',
                    background: active ? 'rgba(220,38,38,0.05)' : 'transparent',
                  }}>
                    <span style={{ fontSize: '1.1rem' }}>{link.icon}</span>
                    {link.label}
                  </Link>
                );
              })}
              <Link to="/cart" style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '16px 24px',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700, fontSize: '0.85rem', letterSpacing: '2px',
                color: MUTED, textDecoration: 'none',
                borderLeft: '3px solid transparent',
              }}>
                <span style={{ fontSize: '1.1rem' }}>🛒</span>
                CART {itemCount > 0 && (
                  <span style={{
                    background: RED, color: '#fff',
                    fontSize: '0.65rem', fontWeight: 800,
                    borderRadius: '999px', padding: '2px 8px',
                  }}>{itemCount}</span>
                )}
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Bottom accent */}
      <div style={{
        height: '3px',
        background: 'linear-gradient(to right, #DC2626, #FCA5A5, transparent)',
      }} />
    </>
  );
};

export default Header;