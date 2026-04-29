import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { Product } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

interface HomeProps { onOpenModal: (product: Product) => void; }

const BG     = '#0a0000';
const BG2    = '#130000';
const BG3    = '#1c0303';
const RED    = '#D42B2B';
const RED_DIM= '#3d0808';
const WHITE  = '#F5ECEC';
const MUTED  = '#9a7a7a';

const slides = [
  {
    title: 'Precision. Craft. Sushi.',
    sub:   'Free delivery across Dubai on orders above 100 AED',
    btn:   'Order Now',   link: '/menu',
    img:   'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=1600&h=700&fit=crop&q=90',
  },
  {
    title: "Chef's Seasonal Signatures",
    sub:   'Norwegian salmon · Premium bluefin tuna · Daily catch',
    btn:   'Explore Menu', link: '/menu',
    img:   'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=1600&h=700&fit=crop&q=90',
  },
  {
    title: '30–45 Minute Delivery',
    sub:   'Halal certified · Fresh daily import · Dubai & Abu Dhabi',
    btn:   'View Menu',   link: '/menu',
    img:   'https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=1600&h=700&fit=crop&q=90',
  },
];

const perks = [
  { icon: '🚗', title: 'Fast Delivery',    sub: '30–45 min · Dubai, Abu Dhabi, Sharjah' },
  { icon: '🐟', title: 'Daily Fresh Fish', sub: 'Norwegian salmon & bluefin, every morning' },
  { icon: '✅', title: 'Halal Certified',  sub: '100% Halal — certified for UAE' },
  { icon: '👨‍🍳', title: 'Master Sushist', sub: 'Trained in Osaka · 12 years of craft' },
];

const Home: React.FC<HomeProps> = ({ onOpenModal }) => {
  const { state } = useCart();
  const isMobile  = useIsMobile();
  const products  = state.products || [];
  const hits      = products.filter(p => p.isHit).slice(0, 4);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, []);

  if (!products.length) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: BG }}>
        <div style={{ fontSize: '2.5rem' }}>🍣</div>
        <p style={{ color: MUTED, fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', letterSpacing: '1px' }}>Loading menu…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: BG }}>

      {/* ══════ HERO ══════ */}
      <div style={{ position: 'relative', height: isMobile ? '380px' : '520px', overflow: 'hidden' }}>
        {slides.map((s, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            transform: `translateX(${(i - slide) * 100}%)`,
            transition: 'transform 0.8s cubic-bezier(0.4,0,0.2,1)',
          }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${s.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, rgba(10,0,0,0.92) 40%, rgba(10,0,0,0.55) 100%)' }} />
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: RED }} />

            <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', padding: isMobile ? '0 24px' : '0 80px' }}>
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '4px', color: RED, marginBottom: '12px', textTransform: 'uppercase' }}>
                  SushiMate · Premium · Dubai
                </div>
                <h1 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: isMobile ? '2rem' : 'clamp(2.2rem, 4vw, 3.8rem)',
                  fontWeight: 700, color: WHITE,
                  lineHeight: 1.1, marginBottom: '12px',
                  maxWidth: isMobile ? '280px' : '560px',
                }}>
                  {s.title}
                </h1>
                <p style={{ color: MUTED, fontSize: isMobile ? '0.8rem' : '0.92rem', marginBottom: isMobile ? '22px' : '32px', lineHeight: 1.6, maxWidth: '380px' }}>
                  {s.sub}
                </p>
                <Link to={s.link} style={{
                  display: 'inline-block',
                  background: RED, color: '#fff',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700, fontSize: '0.72rem',
                  letterSpacing: '2.5px', textTransform: 'uppercase',
                  padding: isMobile ? '11px 28px' : '13px 38px', borderRadius: '2px',
                  textDecoration: 'none',
                }}>
                  {s.btn}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Counter nav */}
        <div style={{ position: 'absolute', bottom: '20px', right: isMobile ? '20px' : '40px', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => setSlide(s => (s - 1 + slides.length) % slides.length)}
            style={{ background: 'transparent', border: `1px solid ${RED_DIM}`, color: MUTED, width: '30px', height: '30px', cursor: 'pointer', fontSize: '0.9rem', borderRadius: '2px' }}>
            ‹
          </button>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', color: '#5a2a2a', letterSpacing: '2px' }}>
            {String(slide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </span>
          <button onClick={() => setSlide(s => (s + 1) % slides.length)}
            style={{ background: RED, border: 'none', color: '#fff', width: '30px', height: '30px', cursor: 'pointer', fontSize: '0.9rem', borderRadius: '2px' }}>
            ›
          </button>
        </div>
      </div>

      {/* ══════ PERKS STRIP ══════ */}
      <div style={{ background: BG2, borderTop: `1px solid ${RED_DIM}`, borderBottom: `1px solid ${RED_DIM}` }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        }}>
          {perks.map((p, i) => (
            <div key={i} style={{
              padding: isMobile ? '16px 14px' : '26px 24px',
              borderRight: !isMobile && i < perks.length - 1 ? `1px solid ${RED_DIM}` : 'none',
              borderBottom: isMobile && i < 2 ? `1px solid ${RED_DIM}` : 'none',
              display: 'flex', alignItems: 'flex-start', gap: '10px',
            }}>
              <span style={{ fontSize: isMobile ? '1.1rem' : '1.3rem', flexShrink: 0 }}>{p.icon}</span>
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: isMobile ? '0.72rem' : '0.8rem', color: WHITE, marginBottom: '3px' }}>
                  {p.title}
                </div>
                <div style={{ fontSize: isMobile ? '0.68rem' : '0.76rem', color: MUTED, lineHeight: 1.5 }}>{p.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════ BEST SELLERS ══════ */}
      <section style={{ padding: isMobile ? '40px 16px 48px' : '72px 40px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: isMobile ? '24px' : '40px' }}>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', letterSpacing: '4px', color: RED, textTransform: 'uppercase', marginBottom: '6px' }}>
              This Week
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '1.9rem' : '2.6rem', fontWeight: 700, color: WHITE, lineHeight: 1 }}>
              Best Sellers
            </h2>
          </div>
          <Link to="/menu" style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem',
            fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
            color: MUTED, borderBottom: `1px solid ${RED_DIM}`, paddingBottom: '2px',
            textDecoration: 'none', whiteSpace: 'nowrap',
          }}>
            {isMobile ? 'All →' : 'Full Menu →'}
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(252px, 1fr))',
          gap: isMobile ? '12px' : '20px',
        }}>
          {hits.map(p => <ProductCard key={p._id || p.id} product={p} onOpenModal={onOpenModal} />)}
        </div>
      </section>

      {/* ══════ RED BANNER ══════ */}
      <section style={{
        background: `linear-gradient(135deg, ${RED} 0%, #9e1515 100%)`,
        padding: isMobile ? '40px 24px' : '60px 40px', textAlign: 'center',
      }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', letterSpacing: '5px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '8px' }}>
          First Order
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '1.7rem' : '2.6rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
          10% Off — Code: SUSHIMATE10
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: isMobile ? '0.78rem' : '0.88rem', marginBottom: '24px' }}>
          Applies automatically at checkout for new customers
        </p>
        <Link to="/menu" style={{
          display: 'inline-block',
          background: '#080000', color: '#F5ECEC',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700, fontSize: '0.72rem',
          letterSpacing: '2.5px', textTransform: 'uppercase',
          padding: isMobile ? '11px 28px' : '13px 42px', borderRadius: '2px',
          textDecoration: 'none',
          border: '1px solid rgba(255,255,255,0.15)',
        }}>
          Order Now
        </Link>
      </section>

      {/* ══════ STATS ROW ══════ */}
      <section style={{ background: BG3, borderTop: `1px solid ${RED_DIM}`, padding: isMobile ? '32px 16px' : '48px 40px' }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? '24px' : '40px',
          textAlign: 'center',
        }}>
          {[
            { n: '50+',   label: 'Menu Items'      },
            { n: '4.8★',  label: 'Average Rating'  },
            { n: '30–45', label: 'Min Delivery'    },
            { n: '100%',  label: 'Halal Certified' },
          ].map((stat, i) => (
            <div key={i}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '2rem' : '2.4rem', fontWeight: 700, color: RED, lineHeight: 1, marginBottom: '6px' }}>
                {stat.n}
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', letterSpacing: '2px', color: MUTED, textTransform: 'uppercase' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
