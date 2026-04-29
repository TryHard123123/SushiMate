import { useState } from 'react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { Product } from '../context/CartContext';
import { useIsMobile } from '../hooks/useIsMobile';

interface MenuProps { onOpenModal: (product: Product) => void; }

const BG      = '#0a0000';
const BG2     = '#130000';
const RED     = '#D42B2B';
const RED_DIM = '#3d0808';
const WHITE   = '#F5ECEC';
const MUTED   = '#9a7a7a';

const categoryOrder = ['rolls', 'sets', 'sides', 'drinks'];
const categories    = ['all', ...categoryOrder];
const catLabels: Record<string, string> = {
  all: 'All', rolls: 'Rolls', sets: 'Sets', sides: 'Sides', drinks: 'Drinks',
};

const Menu: React.FC<MenuProps> = ({ onOpenModal }) => {
  const { state } = useCart();
  const isMobile  = useIsMobile();
  const [search, setSearch] = useState('');
  const [cat, setCat]       = useState('all');

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
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, background: BG }}>
        <div style={{ fontSize: '2.5rem' }}>🍣</div>
        <p style={{ color: MUTED, fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', letterSpacing: '1px' }}>Loading menu…</p>
      </div>
    );
  }

  return (
    <div style={{ background: BG, minHeight: '100vh', padding: isMobile ? '28px 16px 60px' : '56px 40px 80px' }} className="fade-in">
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Heading */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', letterSpacing: '5px', color: RED, textTransform: 'uppercase', marginBottom: '8px' }}>
            SushiMate
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '2.2rem' : '3rem', fontWeight: 700, color: WHITE, lineHeight: 1 }}>
            Our Menu
          </h1>
          <div style={{ width: '40px', height: '2px', background: RED, marginTop: '14px' }} />
        </div>

        {/* Search + Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px', marginBottom: '36px' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '360px' }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search rolls, sets, drinks…"
              style={{
                width: '100%', padding: '11px 16px 11px 40px',
                background: BG2, border: `1px solid ${RED_DIM}`,
                color: WHITE, borderRadius: '2px',
                fontSize: '0.85rem', fontFamily: "'DM Sans', sans-serif",
                outline: 'none',
              }}
              onFocus={e  => { e.target.style.borderColor = RED; }}
              onBlur={e   => { e.target.style.borderColor = RED_DIM; }}
            />
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: MUTED, pointerEvents: 'none', fontSize: '0.85rem' }}>
              🔍
            </span>
          </div>

          {/* Category tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {categories.map(c => {
              const active = cat === c;
              return (
                <button key={c} onClick={() => setCat(c)} style={{
                  padding: '8px 22px', borderRadius: '2px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700, fontSize: '0.68rem',
                  letterSpacing: '1.5px', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'all 0.15s',
                  background: active ? RED      : 'transparent',
                  color:      active ? '#fff'   : MUTED,
                  border:     active ? 'none'   : `1px solid ${RED_DIM}`,
                }}>
                  {catLabels[c]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Count */}
        <div style={{ marginBottom: '22px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#5a2a2a', letterSpacing: '1px' }}>
          {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ padding: '80px 0', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', color: WHITE, marginBottom: '16px' }}>
              Nothing found
            </h3>
            <button onClick={() => { setSearch(''); setCat('all'); }} style={{
              background: 'transparent', border: `1px solid ${RED_DIM}`,
              color: MUTED, fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.72rem', letterSpacing: '1.5px', textTransform: 'uppercase',
              padding: '10px 28px', borderRadius: '2px', cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s',
            }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(248px, 1fr))', gap: isMobile ? '12px' : '20px' }}>
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
