import { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { Product } from '../context/CartContext';
import { useIsMobile } from '../hooks/useIsMobile';
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
  const isMobile = useIsMobile();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const products = state.products || [];

  // Фильтрация
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

  // Группировка по категориям
  const groupedProducts = categories
    .filter(cat => filtered.some(p => p.category === cat.id))
    .map(cat => ({
      ...cat,
      products: filtered.filter(p => p.category === cat.id),
    }));

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = sectionRefs.current[catId];
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 140;
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
      {/* Toast Notification */}
      {lastAddedItem && (
        <ToastNotification message={lastAddedItem} onClose={clearLastAdded} />
      )}

      {/* Поиск */}
      <div style={{
        background: WHITE,
        padding: '24px 40px',
        borderBottom: '1px solid #FEE2E2',
        position: 'sticky',
        top: '80px',
        zIndex: 40,
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search sushi, rolls, sets, drinks..."
            style={{
              width: '100%',
              padding: '16px 24px 16px 52px',
              background: RED_BG,
              border: `2px solid ${RED_DIM}`,
              borderRadius: '16px',
              fontSize: '1rem',
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
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '1.2rem',
          }}>
            🔍
          </span>
        </div>
      </div>

      {/* Категории */}
      <div style={{
        position: 'sticky',
        top: '140px',
        zIndex: 39,
        background: WHITE,
        borderBottom: '1px solid #FEE2E2',
        padding: '12px 0',
        overflowX: 'auto',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 40px',
          display: 'flex',
          gap: '10px',
        }}>
          {[
            { id: 'all', name: 'ALL', icon: '🍽️' },
            ...categories.filter(cat => products.some(p => p.category === cat.id)),
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              style={{
                padding: '10px 22px',
                borderRadius: '50px',
                border: activeCategory === cat.id ? 'none' : `2px solid ${RED_DIM}`,
                background: activeCategory === cat.id ? RED : 'transparent',
                color: activeCategory === cat.id ? '#fff' : MUTED,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '2px',
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

      {/* Результаты */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔍</div>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2rem', color: DARK, marginBottom: '12px',
            }}>
              Nothing found
            </h3>
            <button onClick={() => { setSearch(''); setActiveCategory('all'); }} style={{
              background: RED, color: '#fff', border: 'none',
              padding: '12px 32px', borderRadius: '50px',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
              fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase',
              cursor: 'pointer',
            }}>
              Clear Filters
            </button>
          </div>
        ) : activeCategory === 'all' && !search ? (
          // Группировка по категориям
          groupedProducts.map(cat => (
            <div
              key={cat.id}
              ref={el => { sectionRefs.current[cat.id] = el; }}
              style={{ marginBottom: '56px' }}
            >
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2rem',
                fontWeight: 700,
                color: DARK,
                marginBottom: '24px',
                paddingBottom: '12px',
                borderBottom: '3px solid #DC2626',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <span>{cat.icon}</span> {cat.name}
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px',
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
        ) : (
          // Отфильтрованные товары
          <div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.85rem',
              color: MUTED,
              marginBottom: '28px',
            }}>
              {filtered.length} {filtered.length === 1 ? 'item' : 'items'} found
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
            }}>
              {filtered.map(p => (
                <ProductCard
                  key={p._id || p.id}
                  product={p}
                  onOpenModal={onOpenModal}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;