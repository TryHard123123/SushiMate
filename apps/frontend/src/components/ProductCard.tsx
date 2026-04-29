import { useState } from 'react';
import { Product } from '../context/CartContext';
import { useCart } from '../context/CartContext';
import { useIsMobile } from '../hooks/useIsMobile';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
  onAddToCart?: () => void;
}

// Red–Black palette
const BG_CARD = '#160202';
const RED      = '#D42B2B';
const RED_DIM  = '#3d0808';
const WHITE    = '#F5ECEC';
const MUTED    = '#9a7a7a';
const GOLD     = '#C8A04A';
const GOLD_DIM = '#4a3010';

const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenModal, onAddToCart }) => {
  const { state, dispatch } = useCart();
  const isMobile = useIsMobile();
  const [imageError, setImageError] = useState(false);
  const [hover, setHover]   = useState(false);
  const [anim, setAnim]     = useState(false);

  const productId = (product.id || product._id || Date.now()) as number;
  const qty = state.items.find(i => i.id === productId)?.quantity ?? 0;

  const inc = () => {
    if (qty === 0) dispatch({ type: 'ADD_ITEM', payload: { ...product, id: productId } });
    else if (qty < 10) dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity: qty + 1 } });
    onAddToCart?.();
    setAnim(true);
    setTimeout(() => setAnim(false), 240);
  };

  const dec = () => {
    if (qty > 0) dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity: qty - 1 } });
  };

  const clickCard = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    onOpenModal(product);
  };

  return (
    <div
      onClick={clickCard}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="fade-in"
      style={{
        background: BG_CARD,
        border: `1px solid ${hover ? RED : RED_DIM}`,
        borderRadius: '3px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hover ? `0 8px 32px rgba(212,43,43,0.18)` : 'none',
      }}
    >
      {/* BEST SELLER badge */}
      {product.isHit && (
        <div style={{
          position: 'absolute', top: '10px', left: '10px', zIndex: 10,
          background: RED,
          color: '#fff',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.56rem', fontWeight: 800,
          letterSpacing: '2.5px', textTransform: 'uppercase',
          padding: '3px 9px', borderRadius: '2px',
        }}>
          BEST SELLER
        </div>
      )}

      {/* Image */}
      <div style={{
        height: isMobile ? '150px' : '196px', overflow: 'hidden',
        background: '#0d0000', flexShrink: 0,
        position: 'relative',
      }}>
        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.55s ease',
              transform: hover ? 'scale(1.06)' : 'scale(1)',
              filter: 'brightness(0.88)',
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: RED_DIM }}>
            🍣
          </div>
        )}
        {/* Bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '64px',
          background: 'linear-gradient(to top, #160202, transparent)',
        }} />
      </div>

      {/* Body */}
      <div style={{ padding: isMobile ? '10px 11px 12px' : '15px 16px 16px', display: 'flex', flexDirection: 'column', flex: 1, gap: '4px' }}>

        {/* Rating */}
        {product.rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {[1,2,3,4,5].map(s => (
              <span key={s} style={{ fontSize: '0.68rem', color: s <= Math.floor(product.rating!) ? GOLD : GOLD_DIM }}>★</span>
            ))}
            <span style={{ fontSize: '0.68rem', color: MUTED, marginLeft: '4px' }}>{product.rating}</span>
            {product.reviewCount && (
              <span style={{ fontSize: '0.65rem', color: '#4a2a2a', marginLeft: '2px' }}>({product.reviewCount})</span>
            )}
          </div>
        )}

        {/* Name */}
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: isMobile ? '0.95rem' : '1.12rem', fontWeight: 700,
          color: WHITE, lineHeight: 1.25,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {product.name}
        </h3>

        {/* Desc */}
        <p style={{
          fontSize: '0.78rem', color: MUTED, lineHeight: 1.5, flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {product.description}
        </p>

        {/* Red divider */}
        <div style={{ height: '1px', background: RED_DIM, margin: '6px 0' }} />

        {/* Price + controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.3rem', fontWeight: 700, color: RED,
            }}>
              {product.price}
            </span>
            <span style={{ fontSize: '0.72rem', color: MUTED, marginLeft: '4px', fontFamily: "'DM Sans', sans-serif" }}>
              AED
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* − */}
            <button
              onClick={e => { e.stopPropagation(); dec(); }}
              disabled={qty === 0}
              style={{
                width: '28px', height: '28px', borderRadius: '2px',
                border: `1px solid ${qty === 0 ? RED_DIM : RED}`,
                background: 'transparent',
                color: qty === 0 ? RED_DIM : RED,
                fontWeight: 800, fontSize: '1rem',
                cursor: qty === 0 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s', lineHeight: 1,
              }}
            >−</button>

            {/* count */}
            <span style={{
              minWidth: '18px', textAlign: 'center',
              fontWeight: 800, fontSize: '0.95rem',
              color: qty > 0 ? RED : '#4a2a2a',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {qty}
            </span>

            {/* + */}
            <button
              onClick={e => { e.stopPropagation(); inc(); }}
              disabled={qty >= 10}
              className={anim ? 'animate-bounce' : ''}
              style={{
                width: '28px', height: '28px', borderRadius: '2px',
                border: 'none',
                background: qty >= 10 ? RED_DIM : RED,
                color: '#fff',
                fontWeight: 800, fontSize: '1rem',
                cursor: qty >= 10 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s', lineHeight: 1,
              }}
            >+</button>
          </div>
        </div>

        {qty >= 10 && (
          <p style={{ fontSize: '0.68rem', color: RED, textAlign: 'right', marginTop: '4px' }}>
            Maximum 10
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
