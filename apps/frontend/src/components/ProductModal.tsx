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
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '12px',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: WHITE,
        borderRadius: '16px',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(220,38,38,0.2)',
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '10px', right: '10px', zIndex: 10,
          width: '32px', height: '32px',
          background: 'rgba(255,255,255,0.9)', border: '1px solid #FEE2E2',
          color: MUTED, fontSize: '0.9rem', cursor: 'pointer',
          borderRadius: '50%', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>✕</button>

        {/* Image */}
        <div style={{
          position: 'relative',
          height: '280px',
          background: '#F9FAFB',
          overflow: 'hidden',
        }}>
          {!imgError && images[imgIdx] ? (
            <img
              src={images[imgIdx]}
              alt={product.name}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
              }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={{
              height: '100%', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '4rem', color: RED_DIM,
            }}>🍣</div>
          )}

          {images.length > 1 && (
            <>
              <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)} style={{
                position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
                background: WHITE, border: 'none', color: RED,
                width: '30px', height: '30px', borderRadius: '50%',
                cursor: 'pointer', fontSize: '1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}>‹</button>
              <button onClick={() => setImgIdx(i => (i + 1) % images.length)} style={{
                position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                background: WHITE, border: 'none', color: RED,
                width: '30px', height: '30px', borderRadius: '50%',
                cursor: 'pointer', fontSize: '1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}>›</button>
              <div style={{
                position: 'absolute', bottom: '10px', left: '50%',
                transform: 'translateX(-50%)', display: 'flex', gap: '4px',
              }}>
                {images.map((_, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} style={{
                    width: i === imgIdx ? '16px' : '6px', height: '6px',
                    borderRadius: '3px', border: 'none',
                    background: i === imgIdx ? RED : RED_DIM,
                    cursor: 'pointer', transition: 'all 0.2s',
                  }} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '20px' }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.6rem', letterSpacing: '3px',
            color: RED, textTransform: 'uppercase', marginBottom: '6px',
          }}>
            {product.category}
          </div>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.5rem', fontWeight: 700,
            color: DARK, lineHeight: 1.2, marginBottom: '8px',
          }}>
            {product.name}
          </h2>

          {product.rating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '12px' }}>
              <span style={{ color: '#FBBF24', fontSize: '0.8rem' }}>★</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: DARK }}>{product.rating}</span>
            </div>
          )}

          <p style={{
            fontSize: '0.85rem', color: MUTED,
            lineHeight: 1.5, marginBottom: '16px',
          }}>
            {product.fullDescription || product.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.8rem', fontWeight: 700, color: RED,
              }}>
                {product.price}
              </span>
              <span style={{
                fontSize: '0.8rem', color: MUTED, marginLeft: '4px',
              }}>CAD</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={dec} disabled={qty === 0} style={{
                width: '36px', height: '36px', borderRadius: '50%',
                border: `2px solid ${qty === 0 ? RED_DIM : RED}`,
                background: 'transparent',
                color: qty === 0 ? RED_DIM : RED,
                fontSize: '1.1rem', fontWeight: 700,
                cursor: qty === 0 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>−</button>
              <span style={{
                fontSize: '1.2rem', fontWeight: 700,
                color: qty > 0 ? RED : MUTED,
                minWidth: '20px', textAlign: 'center',
              }}>{qty}</span>
              <button onClick={inc} style={{
                width: '36px', height: '36px', borderRadius: '50%',
                border: 'none', background: RED, color: '#fff',
                fontSize: '1.1rem', fontWeight: 700,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;