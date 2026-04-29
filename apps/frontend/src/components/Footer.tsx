import { Link } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';

const RED = '#DC2626';
const RED_DIM = '#FCA5A5';
const MUTED = '#6B7280';
const FAINT = '#9CA3AF';

const Footer = () => {
  const isMobile = useIsMobile();

  return (
    <footer style={{
      background: '#111827',
      borderTop: '3px solid #DC2626',
      padding: isMobile ? '48px 24px 32px' : '72px 40px 32px',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
          gap: isMobile ? '40px' : '60px',
          marginBottom: '48px',
        }}>
          {/* Brand */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '6px',
              marginBottom: '16px',
            }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1rem',
                letterSpacing: '4px',
                color: RED,
              }}>木</span>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2rem',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '2px',
              }}>
                SushiMate
              </span>
            </div>
            <p style={{
              fontSize: '0.85rem',
              color: '#9CA3AF',
              lineHeight: 1.7,
              marginBottom: '20px',
            }}>
              Premium Japanese sushi<br />crafted daily in Canada.
            </p>
            <div style={{ width: '40px', height: '3px', background: RED, borderRadius: '2px' }} />
          </div>

          {/* Contact */}
          <div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '4px',
              color: RED,
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              Contact
            </div>
            {[
              { icon: '📞', text: '+1 604 123 4567' },
              { icon: '✉️', text: 'info@sushimate.ca' },
              { icon: '🕙', text: 'Daily 10:00 – 23:00' },
            ].map((item, i) => (
              <div key={i} style={{
                fontSize: '0.82rem',
                color: '#9CA3AF',
                display: 'flex',
                gap: '10px',
                marginBottom: '12px',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Links */}
          <div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '4px',
              color: RED,
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              Information
            </div>
            {[
              { to: '/menu', label: 'Menu' },
              { to: '/policy', label: 'Privacy Policy' },
              { to: '/terms', label: 'Terms & Conditions' },
            ].map(l => (
              <div key={l.to} style={{ marginBottom: '12px' }}>
                <Link to={l.to} style={{
                  fontSize: '0.82rem',
                  color: '#9CA3AF',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = RED; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#9CA3AF'; }}>
                  {l.label}
                </Link>
              </div>
            ))}
          </div>

          {/* Delivery */}
          <div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '4px',
              color: RED,
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              Delivery
            </div>
            <p style={{
              fontSize: '0.82rem',
              color: '#9CA3AF',
              lineHeight: 1.7,
              marginBottom: '16px',
            }}>
              Vancouver · Toronto · Montreal<br />
              Free above 100 CAD<br />
              30–45 minutes
            </p>
            <div style={{
              display: 'inline-block',
              border: '1px solid rgba(220,38,38,0.3)',
              color: RED,
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '2px',
              padding: '6px 14px',
              borderRadius: '50px',
              textTransform: 'uppercase',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              ⭐ Premium Quality
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '24px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '0.75rem', color: FAINT }}>
            © 2026 SushiMate — Premium Japanese Cuisine in Canada
          </span>
          <span style={{
            fontSize: '0.7rem',
            color: RED,
            letterSpacing: '2px',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
          }}>
            FRESH · FAST · JAPANESE
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;