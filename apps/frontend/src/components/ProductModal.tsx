import { useState, useEffect, useRef } from 'react';
import { Product } from '../context/CartContext';
import { useCart } from '../context/CartContext';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const BG_CARD = '#160202';
const BG_IMG  = '#0a0000';
const RED     = '#D42B2B';
const RED_DIM = '#3d0808';
const RED_BR  = '#FF3A3A';
const WHITE   = '#F5ECEC';
const MUTED   = '#9a7a7a';
const GOLD    = '#C8A04A';
const GOLD_DIM= '#4a3010';

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const { state, dispatch } = useCart();
  const [imgIdx, setImgIdx]     = useState(0);
  const [imgError, setImgError] = useState(false);
  const scrollRef = useRef(0);

  useEffect(() => { setImgIdx(0); setImgError(false); }, [product]);

  useEffect(() => {
    if (isOpen) {
      scrollRef.current = window.scrollY;
      document.body.style.overflow  = 'hidden';
      document.body.style.position  = 'fixed';
      document.body.style.top       = `-${scrollRef.current}px`;
      document.body.style.width     = '100%';
    } else {
      document.body.style.overflow  = '';
      document.body.style.position  = '';
      document.body.style.top       = '';
      document.body.style.width     = '';
      window.scrollTo(0, scrollRef.current);
    }
    return () => {
      document.body.style.overflow  = '';
      document.body.style.position  = '';
      document.body.style.top       = '';
      document.body.style.width     = '';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const productId = (product.id || product._id || Date.now()) as number;
  const qty       = state.items.find(i => i.id === productId)?.quantity ?? 0;
  const images    = (product.images?.length ? product.images : [product.image]).filter(Boolean);

  const inc = () => {
    if (qty === 0) dispatch({ type: 'ADD_ITEM', payload: { ...product, id: productId } });
    else if (qty < 10) dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity: qty + 1 } });
  };
  const dec = () => {
    if (qty > 0) dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity: qty - 1 } });
  };

  return (
    /* Overlay */
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        background: 'rgba(4,0,0,0.92)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      {/* Modal panel */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: BG_CARD,
          border: `1px solid ${RED_DIM}`,
          borderRadius: '4px',
          width: '100%', maxWidth: '860px',
          maxHeight: '90vh', overflowY: 'auto',
          position: 'relative',
          boxShadow: `0 24px 80px rgba(180,20,20,0.25)`,
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '14px', right: '14px', zIndex: 10,
            width: '32px', height: '32px',
            background: RED_DIM, border: 'none',
            color: WHITE, fontSize: '0.9rem',
            cursor: 'pointer', borderRadius: '2px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = RED; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = RED_DIM; }}
        >
          ✕
        </button>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
          gap: 0,
        }}>

          {/* ── LEFT: Image carousel ── */}
          <div style={{ position: 'relative', background: BG_IMG, borderRight: `1px solid ${RED_DIM}` }}>
            <div style={{ height: '420px', overflow: 'hidden', position: 'relative' }}>
              {!imgError && images[imgIdx] ? (
                <img
                  src={images[imgIdx]}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.88)' }}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', color: RED_DIM }}>
                  🍣
                </div>
              )}

              {/* Bottom fade */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to top, #160202, transparent)' }} />

              {/* Left red stripe */}
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: RED, opacity: 0.7 }} />
            </div>

            {/* Arrows */}
            {images.length > 1 && (
              <>
                <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                  style={{
                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(10,0,0,0.7)', border: `1px solid ${RED_DIM}`,
                    color: WHITE, width: '32px', height: '32px',
                    borderRadius: '2px', cursor: 'pointer', fontSize: '1rem',
                  }}>
                  ‹
                </button>
                <button onClick={() => setImgIdx(i => (i + 1) % images.length)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(10,0,0,0.7)', border: `1px solid ${RED_DIM}`,
                    color: WHITE, width: '32px', height: '32px',
                    borderRadius: '2px', cursor: 'pointer', fontSize: '1rem',
                  }}>
                  ›
                </button>

                {/* Dots */}
                <div style={{ position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 5 }}>
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setImgIdx(i)} style={{
                      width: i === imgIdx ? '22px' : '6px',
                      height: '4px', borderRadius: '2px', border: 'none',
                      background: i === imgIdx ? RED : RED_DIM,
                      cursor: 'pointer', transition: 'width 0.25s, background 0.25s',
                    }} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── RIGHT: Info ── */}
          <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: '0' }}>

            {/* Category label */}
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', letterSpacing: '4px', color: RED, textTransform: 'uppercase', marginBottom: '10px' }}>
              {product.category}
            </div>

            {/* Name */}
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.9rem', fontWeight: 700,
              color: WHITE, lineHeight: 1.15, marginBottom: '12px',
            }}>
              {product.name}
            </h2>

            {/* Rating */}
            {product.rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
                {[1,2,3,4,5].map(s => (
                  <span key={s} style={{ fontSize: '0.85rem', color: s <= Math.floor(product.rating!) ? GOLD : GOLD_DIM }}>★</span>
                ))}
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: WHITE, marginLeft: '5px' }}>{product.rating}</span>
                {product.reviewCount && (
                  <span style={{ fontSize: '0.76rem', color: MUTED }}>({product.reviewCount} reviews)</span>
                )}
              </div>
            )}

            {/* Divider */}
            <div style={{ height: '1px', background: RED_DIM, marginBottom: '16px' }} />

            {/* Description */}
            <p style={{ fontSize: '0.88rem', color: MUTED, lineHeight: 1.65, marginBottom: '24px', flex: 1 }}>
              {product.fullDescription || product.description}
            </p>

            {/* Price */}
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.4rem', fontWeight: 700, color: RED }}>
                {product.price}
              </span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', color: MUTED, marginLeft: '6px' }}>
                AED / item
              </span>
            </div>

            {/* Qty controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
              <button
                onClick={dec}
                disabled={qty === 0}
                style={{
                  width: '44px', height: '44px', borderRadius: '2px',
                  border: `1px solid ${qty === 0 ? RED_DIM : RED}`,
                  background: 'transparent',
                  color: qty === 0 ? RED_DIM : RED,
                  fontSize: '1.4rem', fontWeight: 800,
                  cursor: qty === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s', lineHeight: 1,
                }}
              >−</button>

              <div style={{ textAlign: 'center', minWidth: '48px' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', fontWeight: 700, color: qty > 0 ? RED : '#4a2a2a', lineHeight: 1 }}>
                  {qty}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', letterSpacing: '2px', color: MUTED, marginTop: '2px' }}>
                  IN CART
                </div>
              </div>

              <button
                onClick={inc}
                disabled={qty >= 10}
                style={{
                  width: '44px', height: '44px', borderRadius: '2px',
                  border: 'none',
                  background: qty >= 10 ? RED_DIM : RED,
                  color: '#fff', fontSize: '1.4rem', fontWeight: 800,
                  cursor: qty >= 10 ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s', lineHeight: 1,
                  boxShadow: qty >= 10 ? 'none' : '0 4px 16px rgba(212,43,43,0.35)',
                }}
                onMouseEnter={e => { if (qty < 10) (e.currentTarget as HTMLElement).style.background = RED_BR; }}
                onMouseLeave={e => { if (qty < 10) (e.currentTarget as HTMLElement).style.background = RED; }}
              >+</button>
            </div>

            {/* CTA button */}
            <button
              onClick={() => { if (qty === 0) inc(); else onClose(); }}
              style={{
                width: '100%', padding: '14px',
                background: qty > 0 ? RED : 'transparent',
                border: `1px solid ${RED}`,
                color: qty > 0 ? '#fff' : RED,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700, fontSize: '0.78rem',
                letterSpacing: '2.5px', textTransform: 'uppercase',
                borderRadius: '2px', cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = RED_BR;
                el.style.color = '#fff';
                el.style.borderColor = RED_BR;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = qty > 0 ? RED : 'transparent';
                el.style.color = qty > 0 ? '#fff' : RED;
                el.style.borderColor = RED;
              }}
            >
              {qty > 0 ? `✓ ${qty} in Cart — View Order` : 'Add to Order'}
            </button>

            {qty >= 10 && (
              <p style={{ textAlign: 'center', fontSize: '0.68rem', color: RED, marginTop: '8px', fontFamily: "'DM Sans', sans-serif", letterSpacing: '1px' }}>
                MAXIMUM 10 PER ORDER
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
