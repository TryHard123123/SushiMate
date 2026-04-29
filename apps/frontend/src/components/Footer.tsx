import { Link } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';

const RED_DIM = '#3d0808';
const RED     = '#D42B2B';
const WHITE   = '#F5ECEC';
const MUTED   = '#9a7a7a';
const FAINT   = '#5a2a2a';

const Footer = () => {
  const isMobile = useIsMobile();

  return (
    <footer style={{ background: '#050000', borderTop: `1px solid ${RED_DIM}`, padding: isMobile ? '40px 20px 24px' : '60px 40px 28px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: isMobile ? '32px 24px' : '48px',
          marginBottom: '40px',
        }}>

          {/* Brand — full width on mobile */}
          <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '12px' }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.72rem', letterSpacing: '5px', color: RED, marginRight: '4px' }}>木</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.7rem', fontWeight: 700, color: WHITE, letterSpacing: '2px' }}>SushiMate</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: MUTED, lineHeight: 1.7 }}>
              Premium Japanese sushi<br />crafted daily in Dubai.
            </p>
            <div style={{ width: '32px', height: '2px', background: RED, marginTop: '14px' }} />
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', letterSpacing: '3px', color: RED, textTransform: 'uppercase', marginBottom: '14px' }}>
              Contact
            </div>
            {[
              { icon: '📞', text: '+971 4 123 4567'    },
              { icon: '✉️', text: 'info@sushimate.ae'  },
              { icon: '🕙', text: 'Daily 10:00 – 23:00' },
            ].map((item, i) => (
              <div key={i} style={{ fontSize: '0.78rem', color: MUTED, display: 'flex', gap: '8px', marginBottom: '9px', alignItems: 'center' }}>
                <span style={{ opacity: 0.6, fontSize: '0.9rem' }}>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Links */}
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', letterSpacing: '3px', color: RED, textTransform: 'uppercase', marginBottom: '14px' }}>
              Information
            </div>
            {[
              { to: '/menu',   label: 'Menu'               },
              { to: '/policy', label: 'Privacy Policy'     },
              { to: '/terms',  label: 'Terms & Conditions' },
            ].map(l => (
              <div key={l.to} style={{ marginBottom: '10px' }}>
                <Link to={l.to}
                  style={{ fontSize: '0.78rem', color: MUTED, textDecoration: 'none' }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.color = RED; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.color = MUTED; }}
                >
                  {l.label}
                </Link>
              </div>
            ))}
          </div>

          {/* Delivery */}
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', letterSpacing: '3px', color: RED, textTransform: 'uppercase', marginBottom: '14px' }}>
              Delivery
            </div>
            <p style={{ fontSize: '0.78rem', color: MUTED, lineHeight: 1.7, marginBottom: '12px' }}>
              Dubai · Abu Dhabi · Sharjah<br />
              Free above 100 AED<br />
              30–45 minutes
            </p>
            <div style={{
              display: 'inline-block',
              border: `1px solid ${RED_DIM}`, color: RED,
              fontSize: '0.6rem', letterSpacing: '1.5px',
              padding: '4px 10px', borderRadius: '2px',
              textTransform: 'uppercase',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
            }}>
              ✅ Halal Certified
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: `1px solid ${RED_DIM}`, paddingTop: '18px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'center' : 'auto',
          gap: '6px', textAlign: 'center',
        }}>
          <span style={{ fontSize: '0.72rem', color: FAINT }}>© 2026 SushiMate — Premium Japanese Cuisine in Dubai</span>
          <span style={{ fontSize: '0.72rem', color: FAINT, letterSpacing: '1px' }}>FRESH · FAST · JAPANESE</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
