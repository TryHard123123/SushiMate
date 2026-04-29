import { useState } from 'react';
import { Product } from '../context/CartContext';
import { useCart } from '../context/CartContext';
import { useIsMobile } from '../hooks/useIsMobile';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
  onAddToCart?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenModal, onAddToCart }) => {
  const { state, dispatch } = useCart();
  const isMobile = useIsMobile();
  const [imageError, setImageError] = useState(false);
  const [hover, setHover] = useState(false);
  const [anim, setAnim] = useState(false);

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
      style={{
        background: '#FFFFFF',
        border: `2px solid ${hover ? '#DC2626' : '#FEE2E2'}`,
        borderRadius: '16px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.35s ease',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hover ? '0 12px 40px rgba(220,38,38,0.15)' : '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      {/* BEST SELLER */}
      {product.isHit && (
        <div style={{
          position: 'absolute', top: '10px', left: '10px', zIndex: 10,
          background: '#DC2626', color: '#fff',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.56rem', fontWeight: 800,
          letterSpacing: '2.5px', textTransform: 'uppercase',
          padding: '4px 10px', borderRadius: '20px',
          boxShadow: '0 2px 8px rgba(220,38,38,0.3)',
        }}>
          BEST SELLER
        </div>
      )}

      {/* Image */}
      <div style={{
        height: isMobile ? '140px' : '200px',
        overflow: 'hidden',
        background: '#FEF2F2',
        flexShrink: 0,
        position: 'relative',
      }}>
        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
              transform: hover ? 'scale(1.08)' : 'scale(1)',
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div style={{
            height: '100%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem', color: '#FCA5A5',
          }}>
            🍣
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{
        padding: isMobile ? '12px' : '16px',
        display: 'flex', flexDirection: 'column', flex: 1, gap: '6px',
      }}>
        {/* Rating */}
        {product.rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {[1,2,3,4,5].map(s => (
              <span key={s} style={{
                fontSize: '0.7rem',
                color: s <= Math.floor(product.rating!) ? '#FBBF24' : '#E5E7EB',
              }}>★</span>
            ))}
            <span style={{ fontSize: '0.7rem', color: '#6B7280', marginLeft: '4px', fontWeight: 600 }}>
              {product.rating}
            </span>
            {product.reviewCount && (
              <span style={{ fontSize: '0.65rem', color: '#9CA3AF', marginLeft: '2px' }}>
                ({product.reviewCount})
              </span>
            )}
          </div>
        )}

        {/* Name */}
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: isMobile ? '1rem' : '1.15rem',
          fontWeight: 700,
          color: '#111827',
          lineHeight: 1.25,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {product.name}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '0.78rem',
          color: '#6B7280',
          lineHeight: 1.5,
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {product.description}
        </p>

        {/* Divider */}
        <div style={{ height: '1px', background: '#FEE2E2', margin: '6px 0' }} />

        {/* Price + Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.3rem', fontWeight: 700, color: '#DC2626',
            }}>
              {product.price}
            </span>
            <span style={{
              fontSize: '0.72rem', color: '#6B7280', marginLeft: '4px',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              CAD
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={e => { e.stopPropagation(); dec(); }}
              disabled={qty === 0}
              style={{
                width: '30px', height: '30px', borderRadius: '50%',
                border: `2px solid ${qty === 0 ? '#FCA5A5' : '#DC2626'}`,
                background: 'transparent',
                color: qty === 0 ? '#FCA5A5' : '#DC2626',
                fontWeight: 700, fontSize: '1rem',
                cursor: qty === 0 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
            >−</button>

            <span style={{
              minWidth: '18px', textAlign: 'center',
              fontWeight: 700, fontSize: '0.95rem',
              color: qty > 0 ? '#DC2626' : '#6B7280',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {qty}
            </span>

            <button
              onClick={e => { e.stopPropagation(); inc(); }}
              disabled={qty >= 10}
              className={anim ? 'animate-bounce' : ''}
              style={{
                width: '30px', height: '30px', borderRadius: '50%',
                border: 'none',
                background: qty >= 10 ? '#FCA5A5' : '#DC2626',
                color: '#fff',
                fontWeight: 700, fontSize: '1rem',
                cursor: qty >= 10 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
                boxShadow: qty >= 10 ? 'none' : '0 2px 8px rgba(220,38,38,0.3)',
              }}
            >+</button>
          </div>
        </div>

        {qty >= 10 && (
          <p style={{ fontSize: '0.68rem', color: '#DC2626', textAlign: 'right', marginTop: '4px' }}>
            Maximum 10
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;