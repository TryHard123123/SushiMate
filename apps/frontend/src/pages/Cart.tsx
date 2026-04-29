import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { promoCodes } from '../config/promocodes';

const RED = '#DC2626';
const RED_DIM = '#FCA5A5';
const RED_BG = '#FEF2F2';
const DARK = '#111827';
const MUTED = '#6B7280';
const WHITE = '#FFFFFF';

const Cart = () => {
  const { state, dispatch } = useCart();
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState('');

  const handleClearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const handleApplyPromo = () => {
    const code = promoInput.toUpperCase();
    if (state.appliedPromo === code) {
      setPromoMessage('Promocode already applied');
      return;
    }
    const promo = promoCodes[code];
    if (promo) {
      dispatch({ type: 'APPLY_PROMO', payload: { code, discountPercent: promo.discountPercent } });
      setPromoMessage(`Promocode applied! ${promo.discountPercent}% discount`);
      setPromoInput('');
    } else {
      setPromoMessage('Invalid promocode');
    }
  };

  const handleRemovePromo = () => {
    dispatch({ type: 'REMOVE_PROMO' });
    setPromoMessage('');
  };

  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = state.discountPercent > 0 ? subtotal * (state.discountPercent / 100) : 0;

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', padding: '48px 24px 80px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.65rem',
            letterSpacing: '5px',
            color: RED,
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}>
            SushiMate
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '2.5rem',
            fontWeight: 700,
            color: DARK,
            marginBottom: '8px',
          }}>
            Your Cart
          </h1>
          <div style={{ width: '50px', height: '3px', background: RED, margin: '0 auto', borderRadius: '2px' }} />
        </div>

        {state.items.length === 0 ? (
          <div style={{
            background: WHITE,
            border: '1px solid #FEE2E2',
            borderRadius: '16px',
            padding: '60px 40px',
            textAlign: 'center',
            boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🛒</div>
            <p style={{
              fontSize: '1.2rem',
              color: MUTED,
              marginBottom: '32px',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Your cart is empty
            </p>
            <Link to="/menu" style={{
              display: 'inline-block',
              background: RED,
              color: '#fff',
              padding: '14px 40px',
              borderRadius: '50px',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.2s',
              boxShadow: '0 4px 20px rgba(220,38,38,0.3)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = '#EF4444';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(220,38,38,0.4)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = RED;
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(220,38,38,0.3)';
            }}>
              Browse Menu
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div style={{ marginBottom: '24px' }}>
              {state.items.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Actions Row */}
            <div style={{
              background: WHITE,
              border: '1px solid #FEE2E2',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            }}>
              <button
                onClick={handleClearCart}
                style={{
                  padding: '12px 28px',
                  borderRadius: '50px',
                  border: `2px solid ${RED_DIM}`,
                  background: 'transparent',
                  color: RED,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
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
                Clear Cart
              </button>

              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '24px', marginBottom: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <div>
                    <span style={{ fontSize: '0.82rem', color: MUTED }}>Subtotal: </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: DARK }}>
                      {subtotal.toFixed(2)} CAD
                    </span>
                  </div>
                  {discount > 0 && (
                    <div>
                      <span style={{ fontSize: '0.82rem', color: '#059669' }}>
                        Discount ({state.discountPercent}%): 
                      </span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#059669' }}>
                        -{discount.toFixed(2)} CAD
                      </span>
                    </div>
                  )}
                </div>
                <div style={{
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  color: RED,
                  fontFamily: "'Cormorant Garamond', serif",
                }}>
                  Total: {state.total.toFixed(2)} CAD
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div style={{
              background: WHITE,
              border: '1px solid #FEE2E2',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            }}>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.3rem',
                fontWeight: 700,
                color: DARK,
                marginBottom: '16px',
              }}>
                Promo Code
              </h3>
              
              {state.appliedPromo ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                  background: '#D1FAE5',
                  borderRadius: '12px',
                  border: '1px solid #A7F3D0',
                }}>
                  <p style={{ color: '#059669', fontWeight: 600, fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif" }}>
                    ✓ {state.appliedPromo} applied ({state.discountPercent}% off)
                  </p>
                  <button
                    onClick={handleRemovePromo}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: RED,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      fontFamily: "'DM Sans', sans-serif",
                      textDecoration: 'underline',
                    }}>
                    Remove
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Enter promo code"
                    style={{
                      flex: 1,
                      padding: '14px 18px',
                      borderRadius: '12px',
                      border: `2px solid ${RED_DIM}`,
                      background: WHITE,
                      color: DARK,
                      fontSize: '0.9rem',
                      fontFamily: "'DM Sans', sans-serif",
                      outline: 'none',
                      transition: 'all 0.2s',
                    }}
                    onFocus={e => { e.target.style.borderColor = RED; }}
                    onBlur={e => { e.target.style.borderColor = RED_DIM; }}
                  />
                  <button
                    onClick={handleApplyPromo}
                    style={{
                      padding: '14px 32px',
                      background: RED,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50px',
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 4px 16px rgba(220,38,38,0.25)',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = '#EF4444';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(220,38,38,0.35)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = RED;
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(220,38,38,0.25)';
                    }}>
                    Apply
                  </button>
                </div>
              )}
              
              {promoMessage && !state.appliedPromo && (
                <p style={{
                  fontSize: '0.8rem',
                  color: RED,
                  marginTop: '10px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                }}>
                  {promoMessage}
                </p>
              )}
            </div>

            {/* Checkout Button */}
            <div style={{ textAlign: 'center' }}>
              <Link
                to="/checkout"
                style={{
                  display: 'inline-block',
                  background: RED,
                  color: '#fff',
                  padding: '16px 60px',
                  borderRadius: '50px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  letterSpacing: '2.5px',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  boxShadow: '0 6px 30px rgba(220,38,38,0.35)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = '#EF4444';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 40px rgba(220,38,38,0.45)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = RED;
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 30px rgba(220,38,38,0.35)';
                }}>
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;