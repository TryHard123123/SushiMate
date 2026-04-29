import { CartItem as CartItemType } from '../context/CartContext';
import { useCart } from '../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const RED = '#DC2626';
const RED_DIM = '#FCA5A5';
const RED_BG = '#FEF2F2';
const DARK = '#111827';
const MUTED = '#6B7280';
const WHITE = '#FFFFFF';

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { dispatch } = useCart();

  const handleUpdateQuantity = (quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: item.id });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity } });
    }
  };

  const handleRemove = () => {
    dispatch({ type: 'REMOVE_ITEM', payload: item.id });
  };

  const imageUrl = item.image && item.image !== ''
    ? item.image
    : 'https://via.placeholder.com/120x120?text=🍣';

  return (
    <div style={{
      background: WHITE,
      border: '1px solid #FEE2E2',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '24px',
      flexWrap: 'wrap',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          width: '110px',
          height: '110px',
          overflow: 'hidden',
          borderRadius: '14px',
          flexShrink: 0,
          background: RED_BG,
          border: '1px solid #FEE2E2',
        }}>
          <img
            src={imageUrl}
            alt={item.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/120x120?text=🍣';
            }}
          />
        </div>
        <div>
          <h3 style={{
            fontSize: '1.4rem',
            fontWeight: 700,
            color: DARK,
            fontFamily: "'Cormorant Garamond', serif",
            marginBottom: '6px',
          }}>
            {item.name}
          </h3>
          <p style={{
            color: RED,
            fontSize: '1rem',
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {item.price.toFixed(2)} CAD each
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              border: `2px solid ${RED_DIM}`,
              background: 'transparent',
              color: RED,
              fontSize: '1.3rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
            −
          </button>
          
          <span style={{
            fontSize: '1.4rem',
            fontWeight: 700,
            color: DARK,
            minWidth: '36px',
            textAlign: 'center',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {item.quantity}
          </span>
          
          <button
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              border: 'none',
              background: RED,
              color: '#fff',
              fontSize: '1.3rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(220,38,38,0.3)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = '#EF4444';
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = RED;
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            }}>
            +
          </button>
        </div>
        
        <button
          onClick={handleRemove}
          style={{
            padding: '12px 24px',
            borderRadius: '50px',
            border: `2px solid #FEE2E2`,
            background: 'transparent',
            color: MUTED,
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: '1px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = RED_BG;
            (e.currentTarget as HTMLElement).style.color = RED;
            (e.currentTarget as HTMLElement).style.borderColor = RED;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = MUTED;
            (e.currentTarget as HTMLElement).style.borderColor = '#FEE2E2';
          }}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;