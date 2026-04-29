import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { Product } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

interface HomeProps { onOpenModal: (product: Product) => void; }

const RED = '#DC2626';
const RED_DIM = '#FCA5A5';
const RED_BG = '#FEF2F2';
const WHITE = '#FFFFFF';
const DARK = '#111827';
const MUTED = '#6B7280';

const slides = [
  {
    title: 'Precision. Craft. Sushi.',
    sub: 'Free delivery across Canada on orders above 100 CAD',
    btn: 'Order Now',
    link: '/menu',
    img: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=1600&h=700&fit=crop&q=90',
  },
  {
    title: "Chef's Seasonal Signatures",
    sub: 'Norwegian salmon · Premium bluefin tuna · Daily catch',
    btn: 'Explore Menu',
    link: '/menu',
    img: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=1600&h=700&fit=crop&q=90',
  },
  {
    title: '30–45 Minute Delivery',
    sub: 'Fresh daily import · Vancouver, Toronto, Montreal',
    btn: 'View Menu',
    link: '/menu',
    img: 'https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=1600&h=700&fit=crop&q=90',
  },
];

const perks = [
  { icon: "🚗", title: "Fast Delivery", sub: "30–45 min · Vancouver, Toronto, Montreal" },
  { icon: "🐟", title: "Daily Fresh Fish", sub: "Norwegian salmon & bluefin, every morning" },
  { icon: "⭐", title: "Premium Quality", sub: "Top-rated Japanese cuisine in Canada" },
  { icon: "👨‍🍳", title: "Master Sushist", sub: "Trained in Osaka · 12 years of craft" },
];

const stats = [
  { n: '50+', label: 'Menu Items' },
  { n: '4.8★', label: 'Average Rating' },
  { n: '30–45', label: 'Min Delivery' },
  { n: '100%', label: 'Fresh Quality' },
];

const restaurantImages = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop',
];

const Home: React.FC<HomeProps> = ({ onOpenModal }) => {
  const { state } = useCart();
  const isMobile = useIsMobile();
  const products = state.products || [];
  const hits = products.filter(p => p.isHit).slice(0, 4);
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoPlay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAutoPlay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    startAutoPlay(); // Сбрасываем таймер
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
    startAutoPlay();
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
    startAutoPlay();
  };

  if (!products.length) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        background: WHITE,
      }}>
        <div style={{ fontSize: '2.5rem' }}>🍣</div>
        <p style={{ color: MUTED, fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', letterSpacing: '1px' }}>
          Loading menu…
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: WHITE }}>

      {/* ════════════════════════════════════════════════
          HERO SLIDER — простой плавный 1→2→3→1
          ════════════════════════════════════════════════ */}
      <div style={{
        position: 'relative',
        height: isMobile ? '500px' : '650px',
        overflow: 'hidden',
      }}>
        {/* Слайды */}
        {slides.map((s, index) => (
          <div key={index} style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: currentSlide === index ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            pointerEvents: currentSlide === index ? 'auto' : 'none',
          }}>
            {/* Фон */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${s.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }} />

            {/* Затемнение снизу */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.05) 100%)',
            }} />

            {/* Контент */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: isMobile ? '0 24px 100px' : '0 80px 120px',
              maxWidth: '1280px',
              margin: '0 auto',
            }}>
              <div style={{
                display: 'inline-block',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '5px',
                color: '#FCA5A5',
                textTransform: 'uppercase',
                marginBottom: '16px',
                background: 'rgba(220,38,38,0.15)',
                padding: '6px 16px',
                borderRadius: '50px',
                border: '1px solid rgba(252,165,165,0.3)',
              }}>
                SushiMate · Canada
              </div>

              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: isMobile ? '2.4rem' : 'clamp(2.8rem, 5vw, 4.5rem)',
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: 1.05,
                marginBottom: '16px',
                maxWidth: isMobile ? '100%' : '650px',
              }}>
                {s.title}
              </h1>

              <p style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: isMobile ? '0.9rem' : '1.1rem',
                marginBottom: isMobile ? '28px' : '36px',
                lineHeight: 1.6,
                maxWidth: '420px',
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {s.sub}
              </p>

              <Link to={s.link} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: '#DC2626',
                color: '#FFFFFF',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: '0.78rem',
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                padding: isMobile ? '14px 36px' : '16px 48px',
                borderRadius: '50px',
                textDecoration: 'none',
                transition: 'all 0.2s',
                boxShadow: '0 8px 30px rgba(220,38,38,0.4)',
              }}>
                {s.btn}
                <span style={{ fontSize: '1.2rem' }}>→</span>
              </Link>
            </div>
          </div>
        ))}

        {/* Стрелки */}
        <div style={{
          position: 'absolute',
          bottom: '30px',
          right: isMobile ? '20px' : '60px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <button onClick={prevSlide} style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#FFFFFF',
            width: '44px',
            height: '44px',
            cursor: 'pointer',
            fontSize: '1.4rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}>
            ‹
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1.3rem',
              fontWeight: 700,
              color: '#FFFFFF',
            }}>
              {String(currentSlide + 1).padStart(2, '0')}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.3rem' }}>/</span>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1.3rem',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.4)',
            }}>
              {String(slides.length).padStart(2, '0')}
            </span>
          </div>

          <button onClick={nextSlide} style={{
            background: '#DC2626',
            border: 'none',
            color: '#FFFFFF',
            width: '44px',
            height: '44px',
            cursor: 'pointer',
            fontSize: '1.4rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            boxShadow: '0 4px 15px rgba(220,38,38,0.4)',
          }}>
            ›
          </button>
        </div>

        {/* Точки */}
        <div style={{
          position: 'absolute',
          bottom: '34px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          gap: '10px',
        }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              style={{
                width: i === currentSlide ? '28px' : '10px',
                height: '10px',
                borderRadius: '5px',
                border: 'none',
                background: i === currentSlide ? '#DC2626' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* PERKS */}
      <div style={{ background: WHITE, padding: isMobile ? '48px 20px' : '80px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '48px' }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '5px',
              color: RED,
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              Why Choose Us
            </div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: isMobile ? '1.8rem' : '2.4rem',
              fontWeight: 700,
              color: DARK,
              lineHeight: 1.2,
            }}>
              The SushiMate Difference
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: isMobile ? '16px' : '24px',
          }}>
            {perks.map((p, i) => (
              <div key={i} style={{
                padding: isMobile ? '24px' : '32px 28px',
                background: WHITE,
                border: '1px solid #FEE2E2',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '16px',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: RED_BG,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                }}>
                  {p.icon}
                </div>
                <div>
                  <h3 style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: DARK,
                    marginBottom: '6px',
                  }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: MUTED, lineHeight: 1.6 }}>
                    {p.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BEST SELLERS */}
      <div style={{ background: RED_BG, padding: isMobile ? '48px 20px' : '80px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: isMobile ? '32px' : '48px',
          }}>
            <div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '5px',
                color: RED,
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}>
                Popular This Week
              </div>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: isMobile ? '2rem' : '2.8rem',
                fontWeight: 700,
                color: DARK,
                lineHeight: 1,
              }}>
                Best Sellers
              </h2>
            </div>
            <Link to="/menu" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: RED,
              borderBottom: '2px solid #DC2626',
              paddingBottom: '4px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}>
              Full Menu →
            </Link>
          </div>

          {/* В Home.tsx найдите секцию Best Sellers и замените grid: */}

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', // 4 колонки
            gap: isMobile ? '16px' : '20px', // поменьше отступ
          }}>
            {hits.map(p => (
              <ProductCard key={p._id || p.id} product={p} onOpenModal={onOpenModal} />
            ))}
          </div>
        </div>
      </div>

      {/* GALLERY */}
      <div style={{ background: WHITE, padding: isMobile ? '48px 20px' : '80px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '48px' }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '5px',
              color: RED,
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}>
              Our Locations
            </div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: isMobile ? '2rem' : '2.8rem',
              fontWeight: 700,
              color: DARK,
              lineHeight: 1,
            }}>
              Restaurant Gallery
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: '16px',
          }}>
            {restaurantImages.map((img, i) => (
              <div key={i} style={{
                aspectRatio: '4/3',
                overflow: 'hidden',
                borderRadius: '12px',
                border: '1px solid #FEE2E2',
              }}>
                <img src={img} alt={`Restaurant ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAP */}
      <div style={{ background: RED_BG, padding: isMobile ? '48px 20px' : '80px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '48px' }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '5px',
              color: RED,
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}>
              Find Us
            </div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: isMobile ? '2rem' : '2.8rem',
              fontWeight: 700,
              color: DARK,
              lineHeight: 1,
            }}>
              Our Location
            </h2>
          </div>
          <div style={{
            height: '400px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '2px solid #FCA5A5',
          }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2602.689!2d-123.1207!3d49.2827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548673c4b6b8c6b7%3A0x1234567890abcdef!2sVancouver%2C%20BC!5e0!3m2!1sen!2sca!4v1690000000000!5m2!1sen!2sca"
              width="100%" height="100%" style={{ border: 0 }} loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      {/* PROMO BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
        padding: isMobile ? '48px 24px' : '72px 40px',
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '5px',
          color: 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase',
          marginBottom: '12px',
        }}>
          First Order Special
        </div>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: isMobile ? '2rem' : '3rem',
          fontWeight: 700,
          color: '#FFFFFF',
          marginBottom: '12px',
        }}>
          10% Off — Code: SUSHIMATE10
        </h2>
        <p style={{
          color: 'rgba(255,255,255,0.8)',
          fontSize: isMobile ? '0.85rem' : '1rem',
          marginBottom: '28px',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Applies automatically at checkout for new customers in Canada
        </p>
        <Link to="/menu" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: '#FFFFFF',
          color: '#DC2626',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
          fontSize: '0.78rem',
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          padding: isMobile ? '14px 36px' : '16px 48px',
          borderRadius: '50px',
          textDecoration: 'none',
          transition: 'all 0.2s',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}>
          Order Now <span style={{ fontSize: '1.2rem' }}>→</span>
        </Link>
      </div>

      {/* STATS */}
      <div style={{
        background: WHITE,
        borderTop: '1px solid #FEE2E2',
        padding: isMobile ? '40px 20px' : '56px 40px',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? '24px' : '40px',
          textAlign: 'center',
        }}>
          {stats.map((stat, i) => (
            <div key={i}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: isMobile ? '2.2rem' : '2.8rem',
                fontWeight: 700,
                color: RED,
                lineHeight: 1,
                marginBottom: '8px',
              }}>
                {stat.n}
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '2px',
                color: MUTED,
                textTransform: 'uppercase',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;