import { useState } from 'react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { Product } from '../context/CartContext';
import { useIsMobile } from '../hooks/useIsMobile';

interface MenuProps { onOpenModal: (product: Product) => void; }

const RED = '#DC2626';
const RED_DIM = '#FCA5A5';
const RED_BG = '#FEF2F2';
const MUTED = '#6B7280';

const categoryOrder = ['rolls', 'sets', 'sides', 'drinks'];
const categories = ['all', ...categoryOrder];
const catLabels: Record<string, string> = {
  all: 'All', rolls: 'Rolls', sets: 'Sets', sides: 'Sides', drinks: 'Drinks',
};

const Menu: React.FC<MenuProps> = ({ onOpenModal }) => {
  const { state } = useCart();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('all');

  const products = state.products || [];

  const filtered = products
    .filter(p =>
      (cat === 'all' || p.category === cat) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
       p.description.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const ai = categoryOrder.indexOf(a.category);
      const bi = categoryOrder.indexOf(b.category);
      return (ai === -1 ? 9 : ai) - (bi === -1 ? 9 : bi);
    });

  if (!products.length) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        background: '#FFFFFF',
      }}>
        <div style={{ fontSize: '2.5rem' }}>🍣</div>
        <p style={{
          color: MUTED,
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1.2rem',
          letterSpacing: '1px',
        }}>
          Loading menu…
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: '#FFFFFF',
      minHeight: '100vh',
      padding: isMobile ? '32px 20px 64px' : '64px 40px 96px',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '56px', textAlign: 'center' }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.65rem',
            letterSpacing: '6px',
            color: RED,
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>
            SushiMate
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: isMobile ? '2.4rem' : '3.5rem',
            fontWeight: 700,
            color: '#111827',
            lineHeight: 1,
            marginBottom: '16px',
          }}>
            Our Menu
          </h1>
          <div style={{ width: '60px', height: '3px', background: RED, margin: '0 auto', borderRadius: '2px' }} />
        </div>

        {/* Search + Filters */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '48px',
          justifyContent: 'center',
        }}>
          <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '400px' }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="      Search rolls, sets, drinks…"
              style={{
                width: '100%',
                padding: '14px 20px 14px 48px',
                background: RED_BG,
                border: `2px solid ${RED_DIM}`,
                color: '#111827',
                borderRadius: '50px',
                fontSize: '0.9rem',
                fontFamily: "'DM Sans', sans-serif",
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onFocus={e => {
                e.target.style.borderColor = RED;
                e.target.style.background = '#FFFFFF';
              }}
              onBlur={e => {
                e.target.style.borderColor = RED_DIM;
                e.target.style.background = RED_BG;
              }}
            />
            <span style={{
              position: 'absolute',
              left: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: MUTED,
              fontSize: '1rem',
            }}>🔍</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {categories.map(c => {
              const active = cat === c;
              return (
                <button key={c} onClick={() => setCat(c)} style={{
                  padding: '10px 28px',
                  borderRadius: '50px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: active ? RED : 'transparent',
                  color: active ? '#fff' : MUTED,
                  border: active ? 'none' : `2px solid ${RED_DIM}`,
                }}>
                  {catLabels[c]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        <div style={{
          marginBottom: '28px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.8rem',
          color: MUTED,
          letterSpacing: '1px',
          textAlign: 'center',
        }}>
          {filtered.length} {filtered.length === 1 ? 'item' : 'items'} found
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ padding: '100px 0', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2rem',
              color: '#111827',
              marginBottom: '20px',
            }}>
              Nothing found
            </h3>
            <button onClick={() => { setSearch(''); setCat('all'); }} style={{
              background: 'transparent',
              border: `2px solid ${RED}`,
              color: RED,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              padding: '12px 32px',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: isMobile ? '20px' : '28px',
          }}>
            {filtered.map(p => (
              <ProductCard key={p._id || p.id} product={p} onOpenModal={onOpenModal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;