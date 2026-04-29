import { useState, useEffect, useRef } from 'react';
import { Product } from '../context/CartContext';
import { useCart } from '../context/CartContext';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const RED = '#DC2626';
const RED_DIM = '#FCA5A5';
const RED_BG = '#FEF2F2';
const DARK = '#111827';
const MUTED = '#6B7280';
const WHITE = '#FFFFFF';

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const { state, dispatch } = useCart();
  const [imgIdx, setImgIdx] = useState(0);
  const [imgError, setImgError] = useState(false);
  const scrollRef = useRef(0);

  useEffect(() => { setImgIdx(0); setImgError(false); }, [product]);

  useEffect(() => {
    if (isOpen) {
      scrollRef.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollRef.current}px`;
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollRef.current);
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const productId = (product.id || product._id || Date.now()) as number;
  const qty = state.items.find(i => i.id === productId)?.quantity ?? 0;
  const images = (product.images?.length ? product.images : [product.image]).filter(Boolean);

  const inc = () => {
    if (qty === 0) dispatch({ type: 'ADD_ITEM', payload: { ...product, id: productId } });
    else if (qty < 10) dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity: qty + 1 } });
  };
  const dec = () => {
    if (qty > 0) dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity: qty - 1 } });
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 60,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: WHITE,
        borderRadius: '20px',
        width: '100%',
        maxWidth: '950px',
        maxHeight: '90vh',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 30px 80px rgba(220,38,38,0.2)',
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr', // ИЗОБРАЖЕНИЕ ШИРЕ
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px', zIndex: 10,
          width: '36px', height: '36px',
          background: WHITE, border: '2px solid #FEE2E2', color: MUTED,
          fontSize: '1rem', cursor: 'pointer', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = RED;
          (e.currentTarget as HTMLElement).style.color = '#fff';
          (e.currentTarget as HTMLElement).style.borderColor = RED;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = WHITE;
          (e.currentTarget as HTMLElement).style.color = MUTED;
          (e.currentTarget as HTMLElement).style.borderColor = '#FEE2E2';
        }}>
          ✕
        </button>

        {/* LEFT: ШИРОКОЕ ИЗОБРАЖЕНИЕ */}
        <div style={{
          position: 'relative',
          background: '#F9FAFB',
          minHeight: '450px',
          overflow: 'hidden',
        }}>
          {!imgError && images[imgIdx] ? (
            <img
              src={images[imgIdx]}
              alt={product.name}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                position: 'absolute', top: 0, left: 0,
              }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={{
              height: '100%', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '5rem', color: RED_DIM, background: RED_BG,
            }}>🍣</div>
          )}

          {/* Arrows */}
          {images.length > 1 && (
            <>
              <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)} style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                background: WHITE, border: 'none', color: RED,
                width: '38px', height: '38px', borderRadius: '50%',
                cursor: 'pointer', fontSize: '1.2rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
              }}>‹</button>
              <button onClick={() => setImgIdx(i => (i + 1) % images.length)} style={{
                position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                background: WHITE, border: 'none', color: RED,
                width: '38px', height: '38px', borderRadius: '50%',
                cursor: 'pointer', fontSize: '1.2rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
              }}>›</button>

              {/* Dots */}
              <div style={{
                position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
                display: 'flex', gap: '6px',
              }}>
                {images.map((_, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} style={{
                    width: i === imgIdx ? '20px' : '8px', height: '8px',
                    borderRadius: '4px', border: 'none',
                    background: i === imgIdx ? RED : RED_DIM,
                    cursor: 'pointer', transition: 'all 0.3s',
                  }} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* RIGHT: Info */}
        <div style={{
          padding: '36px 32px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.65rem', letterSpacing: '4px',
            color: RED, textTransform: 'uppercase', marginBottom: '10px',
          }}>
            {product.category}
          </div>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.8rem', fontWeight: 700,
            color: DARK, lineHeight: 1.15, marginBottom: '12px',
          }}>
            {product.name}
          </h2>

          {product.rating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
              {[1,2,3,4,5].map(s => (
                <span key={s} style={{
                  fontSize: '0.85rem',
                  color: s <= Math.floor(product.rating!) ? '#FBBF24' : '#E5E7EB',
                }}>★</span>
              ))}
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: DARK, marginLeft: '6px' }}>
                {product.rating}
              </span>
              {product.reviewCount && (
                <span style={{ fontSize: '0.78rem', color: MUTED }}>
                  ({product.reviewCount} reviews)
                </span>
              )}
            </div>
          )}

          <div style={{ height: '1px', background: '#FEE2E2', marginBottom: '20px' }} />

          <p style={{
            fontSize: '0.9rem', color: MUTED, lineHeight: 1.7,
            marginBottom: '28px', flex: 1,
          }}>
            {product.fullDescription || product.description}
          </p>

          <div style={{ marginBottom: '28px' }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2.5rem', fontWeight: 700, color: RED,
            }}>
              {product.price}
            </span>
            <span style={{
              fontSize: '0.9rem', color: MUTED, marginLeft: '6px',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              CAD
            </span>
          </div>

          {/* Quantity */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '24px', marginBottom: '24px',
          }}>
            <button onClick={dec} disabled={qty === 0} style={{
              width: '44px', height: '44px', borderRadius: '50%',
              border: `2px solid ${qty === 0 ? RED_DIM : RED}`,
              background: 'transparent',
              color: qty === 0 ? RED_DIM : RED,
              fontSize: '1.3rem', fontWeight: 700,
              cursor: qty === 0 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}>−</button>

            <div style={{ textAlign: 'center', minWidth: '48px' }}>
              <div style={{
                fontSize: '2rem', fontWeight: 700,
                color: qty > 0 ? RED : '#9CA3AF',
                fontFamily: "'DM Sans', sans-serif",
              }}>{qty}</div>
              <div style={{
                fontSize: '0.65rem', color: MUTED,
                fontFamily: "'DM Sans', sans-serif", letterSpacing: '2px',
              }}>IN CART</div>
            </div>

            <button onClick={inc} disabled={qty >= 10} style={{
              width: '44px', height: '44px', borderRadius: '50%',
              border: 'none',
              background: qty >= 10 ? RED_DIM : RED,
              color: '#fff', fontSize: '1.3rem', fontWeight: 700,
              cursor: qty >= 10 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
              boxShadow: qty >= 10 ? 'none' : '0 4px 16px rgba(220,38,38,0.35)',
            }}
            onMouseEnter={e => { if (qty < 10) (e.currentTarget as HTMLElement).style.background = '#EF4444'; }}
            onMouseLeave={e => { if (qty < 10) (e.currentTarget as HTMLElement).style.background = RED; }}>
              +
            </button>
          </div>

          {/* CTA */}
          <button
            onClick={() => { if (qty === 0) inc(); else onClose(); }}
            style={{
              width: '100%', padding: '16px',
              background: qty > 0 ? RED : 'transparent',
              border: `2px solid ${RED}`,
              color: qty > 0 ? '#fff' : RED,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700, fontSize: '0.8rem',
              letterSpacing: '2.5px', textTransform: 'uppercase',
              borderRadius: '50px', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = '#EF4444';
              el.style.color = '#fff';
              el.style.borderColor = '#EF4444';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = qty > 0 ? RED : 'transparent';
              el.style.color = qty > 0 ? '#fff' : RED;
              el.style.borderColor = RED;
            }}>
            {qty > 0 ? `✓ ${qty} in Cart` : 'Add to Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;