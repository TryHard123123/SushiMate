import { useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { Product } from '../context/CartContext';
import ToastNotification from '../components/ToastNotification';

const RED = '#DC2626';
const RED_DIM = '#FCA5A5';
const RED_BG = '#FEF2F2';
const DARK = '#111827';
const MUTED = '#6B7280';
const WHITE = '#FFFFFF';

interface OrderPageProps {
  onOpenModal: (product: Product) => void;
}

const categories = [
  { id: 'rolls', name: 'ROLLS', icon: '🍣' },
  { id: 'sets', name: 'SETS', icon: '🍱' },
  { id: 'sides', name: 'SIDES', icon: '🥗' },
  { id: 'drinks', name: 'DRINKS', icon: '🥤' },
];

const OrderPage: React.FC<OrderPageProps> = ({ onOpenModal }) => {
  const { state, lastAddedItem, clearLastAdded } = useCart();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const products = state.products || [];

  const filtered = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                           p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const order = ['rolls', 'sets', 'sides', 'drinks'];
      return order.indexOf(a.category) - order.indexOf(b.category);
    });

  const groupedProducts = categories
    .filter(cat => filtered.some(p => p.category === cat.id) || (activeCategory !== 'all' && cat.id === activeCategory))
    .map(cat => ({
      ...cat,
      products: filtered.filter(p => p.category === cat.id),
    }))
    .filter(cat => cat.products.length > 0 || activeCategory !== 'all');

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = sectionRefs.current[catId];
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 150;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (!products.length) {
    return (
      <div style={{
        minHeight: '60vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16, background: WHITE,
      }}>
        <div style={{ fontSize: '2.5rem' }}>🍣</div>
        <p style={{ color: MUTED, fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem' }}>
          Loading menu…
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: WHITE }}>
      {lastAddedItem && (
        <ToastNotification message={lastAddedItem} onClose={clearLastAdded} />
      )}

      {/* Поиск */}
      <div style={{
        background: WHITE,
        padding: '16px 16px 12px',
        borderBottom: '1px solid #FEE2E2',
        position: 'sticky',
        top: '0',
        zIndex: 40,
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search sushi, rolls, sets..."
            style={{
              width: '100%',
              padding: '12px 16px 12px 40px',
              background: RED_BG,
              border: `2px solid ${RED_DIM}`,
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontFamily: "'DM Sans', sans-serif",
              color: DARK,
              outline: 'none',
              transition: 'all 0.2s',
            }}
            onFocus={e => {
              e.target.style.borderColor = RED;
              e.target.style.background = WHITE;
            }}
            onBlur={e => {
              e.target.style.borderColor = RED_DIM;
              e.target.style.background = RED_BG;
            }}
          />
          <span style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '1rem',
            opacity: 0.5,
          }}>🔍</span>
        </div>
      </div>

      {/* Категории */}
      <div style={{
        position: 'sticky',
        top: '56px',
        zIndex: 39,
        background: WHITE,
        borderBottom: '1px solid #FEE2E2',
        padding: '8px 0',
        overflowX: 'auto',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 16px',
          display: 'flex',
          gap: '8px',
        }}>
          {[{ id: 'all', name: 'ALL', icon: '🍽️' }, ...categories].map(cat => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '50px',
                border: activeCategory === cat.id ? 'none' : `1.5px solid ${RED_DIM}`,
                background: activeCategory === cat.id ? RED : 'transparent',
                color: activeCategory === cat.id ? '#fff' : MUTED,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: '0.65rem',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Контент */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.5rem', color: DARK, marginBottom: '12px',
            }}>
              Nothing found
            </h3>
            <button onClick={() => { setSearch(''); setActiveCategory('all'); }} style={{
              background: RED, color: '#fff', border: 'none',
              padding: '10px 24px', borderRadius: '50px',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
              fontSize: '0.75rem', letterSpacing: '1.5px', textTransform: 'uppercase',
              cursor: 'pointer',
            }}>
              Clear Filters
            </button>
          </div>
        ) : (
          groupedProducts.map(cat => (
            <div
              key={cat.id}
              ref={el => { sectionRefs.current[cat.id] = el; }}
              style={{ marginBottom: '32px' }}
            >
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.5rem',
                fontWeight: 700,
                color: DARK,
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '2px solid #DC2626',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span>{cat.icon}</span> {cat.name}
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '10px',
              }}>
                {cat.products.map(p => (
                  <ProductCard
                    key={p._id || p.id}
                    product={p}
                    onOpenModal={onOpenModal}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderPage;