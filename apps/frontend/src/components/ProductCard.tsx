import { useState } from 'react';
import { Product } from '../context/CartContext';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
  onAddToCart?: (productName: string) => void;
  mode?: 'view' | 'order';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenModal, onAddToCart, mode = 'order' }) => {
  const { state, dispatch } = useCart();
  const [imageError, setImageError] = useState(false);
  const [hover, setHover] = useState(false);
  const [anim, setAnim] = useState(false);

  const productId = (product.id || product._id || Date.now()) as number;
  const qty = state.items.find(i => i.id === productId)?.quantity ?? 0;
  const isViewMode = mode === 'view';

  const inc = () => {
    if (isViewMode) return;
    if (qty === 0) {
      dispatch({ type: 'ADD_ITEM', payload: { ...product, id: productId } });
      onAddToCart?.(product.name);
    } else if (qty < 10) {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity: qty + 1 } });
    }
    setAnim(true);
    setTimeout(() => setAnim(false), 240);
  };

  const dec = () => {
    if (isViewMode) return;
    if (qty > 0) dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity: qty - 1 } });
  };

  const clickCard = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    onOpenModal(product);
  };

  return (
    <div
      onClick={clickCard}
      onMouseEnter={() => !isMobile() && setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: '#FFFFFF',
        border: `1px solid ${hover ? '#DC2626' : '#FEE2E2'}`,
        borderRadius: '12px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.25s ease',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hover ? '0 6px 24px rgba(220,38,38,0.1)' : '0 1px 4px rgba(0,0,0,0.04)',
        maxWidth: '100%',
      }}
    >
      {product.isHit && (
        <div style={{
          position: 'absolute', top: '6px', left: '6px', zIndex: 10,
          background: '#DC2626', color: '#fff',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.45rem', fontWeight: 800,
          letterSpacing: '1.5px', textTransform: 'uppercase',
          padding: '2px 6px', borderRadius: '20px',
        }}>
          BEST
        </div>
      )}

      {/* Image */}
      <div style={{
        height: '150px',
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
              transition: 'transform 0.4s ease',
              transform: hover ? 'scale(1.05)' : 'scale(1)',
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div style={{
            height: '100%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', color: '#FCA5A5',
          }}>🍣</div>
        )}
      </div>

      {/* Content */}
      <div style={{
        padding: '10px 12px 12px',
        display: 'flex', flexDirection: 'column',
        flex: 1, gap: '3px',
      }}>
        {product.rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <span style={{ fontSize: '0.6rem', color: '#FBBF24' }}>★</span>
            <span style={{ fontSize: '0.6rem', color: '#6B7280', fontWeight: 600 }}>
              {product.rating}
            </span>
          </div>
        )}

        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '0.9rem',
          fontWeight: 700,
          color: '#111827',
          lineHeight: 1.2,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {product.name}
        </h3>

        <p style={{
          fontSize: '0.7rem',
          color: '#6B7280',
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {product.description}
        </p>

        <div style={{ height: '1px', background: '#FEE2E2', margin: '2px 0' }} />

        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.1rem', fontWeight: 700, color: '#DC2626',
            }}>
              {product.price}
            </span>
            <span style={{
              fontSize: '0.6rem', color: '#6B7280',
              marginLeft: '2px', fontFamily: "'DM Sans', sans-serif",
            }}>
              CAD
            </span>
          </div>

          {!isViewMode && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {qty > 0 && (
                <>
                  <button
                    onClick={e => { e.stopPropagation(); dec(); }}
                    style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      border: `1.5px solid #DC2626`,
                      background: 'transparent',
                      color: '#DC2626',
                      fontWeight: 700, fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                    −
                  </button>
                  <span style={{
                    minWidth: '14px', textAlign: 'center',
                    fontWeight: 700, fontSize: '0.8rem',
                    color: '#DC2626', fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {qty}
                  </span>
                </>
              )}
              <button
                onClick={e => { e.stopPropagation(); inc(); }}
                className={anim ? 'animate-bounce' : ''}
                style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  border: 'none',
                  background: '#DC2626', color: '#fff',
                  fontWeight: 700, fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Хук для проверки мобильного
function isMobile() {
  return window.innerWidth < 768;
}

export default ProductCard;