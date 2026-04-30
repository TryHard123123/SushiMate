import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { useLoyalty } from '../context/LoyaltyContext';
import { getOrders } from '../services/api';

const RED = '#DC2626';
const RED_DIM = '#FCA5A5';
const RED_BG = '#FEF2F2';
const DARK = '#111827';
const MUTED = '#6B7280';
const WHITE = '#FFFFFF';
const GOLD = '#C8A04A';

const TIERS = [
  { name: 'Bronze',   min: 0,   max: 49,  color: '#cd7f32', icon: '🥉' },
  { name: 'Silver',   min: 50,  max: 199, color: '#b0b0b0', icon: '🥈' },
  { name: 'Gold',     min: 200, max: 499, color: '#C8A04A', icon: '🥇' },
  { name: 'Platinum', min: 500, max: Infinity, color: '#e5e4e2', icon: '💎' },
];

const getTier = (pts: number) => TIERS.find(t => pts >= t.min && pts <= t.max) ?? TIERS[0];
const getNextTier = (pts: number) => {
  const idx = TIERS.findIndex(t => pts >= t.min && pts <= t.max);
  return idx < TIERS.length - 1 ? TIERS[idx + 1] : null;
};

const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{
    background: WHITE,
    border: '1px solid #FEE2E2',
    borderRadius: '16px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
    ...style,
  }}>
    {children}
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
    <div style={{ width: '3px', height: '22px', background: RED, borderRadius: '2px', flexShrink: 0 }} />
    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 700, color: DARK }}>
      {children}
    </h2>
  </div>
);

const inputSt: React.CSSProperties = {
  width: '100%', padding: '12px 16px',
  background: '#F9FAFB', border: `2px solid ${RED_DIM}`,
  color: DARK, borderRadius: '12px',
  fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif", outline: 'none',
  transition: 'all 0.2s',
};

const Profile = () => {
  const { profile, updateProfile, savedAddresses, removeSavedAddress } = useProfile();
  const { points } = useLoyalty();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: profile.name, phone: profile.phone, email: profile.email });
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then(r => {
        const orders = r.data;
        setTotalOrders(orders.length);
        setTotalSpent(orders.reduce((s: number, o: any) => s + (o.total ?? 0), 0));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = () => { updateProfile(formData); setIsEditing(false); };

  const tier = getTier(points);
  const nextTier = getNextTier(points);
  const progress = nextTier ? Math.round(((points - tier.min) / (nextTier.min - tier.min)) * 100) : 100;

  const initials = (profile.name || 'SM').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const joinDate = new Date(profile.joinDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh', padding: '0 0 80px' }}>

      {/* HERO BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #FEF2F2 0%, #FFFFFF 100%)',
        borderBottom: '1px solid #FEE2E2',
        padding: '48px 40px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: '60px', top: '-20px',
          fontFamily: 'serif', fontSize: '14rem', fontWeight: 700,
          color: 'rgba(220,38,38,0.04)', lineHeight: 1,
          userSelect: 'none', pointerEvents: 'none',
        }}>木</div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '28px' }}>
          <div style={{
            width: '88px', height: '88px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, border: '3px solid #DC2626',
            boxShadow: '0 0 30px rgba(220,38,38,0.3)',
          }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 700, color: '#fff' }}>
              {initials}
            </span>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem',
              letterSpacing: '4px', color: RED, textTransform: 'uppercase', marginBottom: '6px',
            }}>
              SushiMate Member
            </div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem',
              fontWeight: 700, color: DARK, lineHeight: 1.1, marginBottom: '10px',
            }}>
              {profile.name || 'Guest User'}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                background: RED_BG, border: `1px solid ${RED_DIM}`,
                padding: '4px 12px', borderRadius: '50px',
                fontSize: '0.72rem', fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                color: tier.color, letterSpacing: '1px',
              }}>
                {tier.icon} {tier.name} Member
              </span>
              <span style={{ fontSize: '0.76rem', color: MUTED, fontFamily: "'DM Sans', sans-serif" }}>
                Member since {joinDate}
              </span>
              {profile.email && (
                <span style={{ fontSize: '0.76rem', color: MUTED }}>· {profile.email}</span>
              )}
            </div>
          </div>

          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            style={{
              padding: '10px 24px', borderRadius: '50px',
              background: isEditing ? RED : 'transparent',
              border: `2px solid ${RED}`, color: isEditing ? '#fff' : RED,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
              fontSize: '0.72rem', letterSpacing: '2px', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.18s', flexShrink: 0,
            }}>
            {isEditing ? '✓ Save' : '✏ Edit Profile'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 40px 0' }}>

        {/* STATS ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Total Orders',    value: loading ? '…' : String(totalOrders), icon: '📦', sub: 'completed' },
            { label: 'Total Spent',     value: loading ? '…' : `${totalSpent.toFixed(0)}`, unit: 'CAD', icon: '💳', sub: 'lifetime' },
            { label: 'Loyalty Points',  value: String(points), icon: tier.icon, sub: `${tier.name} tier`, gold: true },
            { label: 'Avg Order Value', value: totalOrders > 0 ? (totalSpent / totalOrders).toFixed(0) : '—', unit: totalOrders > 0 ? 'CAD' : '', icon: '📊', sub: 'per order' },
          ].map((s, i) => (
            <Card key={i} style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '12px' }}>{s.icon}</div>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem',
                fontWeight: 700, color: s.gold ? GOLD : RED, lineHeight: 1,
              }}>
                {s.value}
                {s.unit && <span style={{ fontSize: '0.8rem', color: MUTED, fontFamily: "'DM Sans', sans-serif", fontWeight: 400, marginLeft: '4px' }}>{s.unit}</span>}
              </div>
              <div style={{ fontSize: '0.7rem', color: MUTED, fontFamily: "'DM Sans', sans-serif", letterSpacing: '1px', textTransform: 'uppercase', marginTop: '6px' }}>{s.label}</div>
              <div style={{ fontSize: '0.68rem', color: RED_DIM, fontFamily: "'DM Sans', sans-serif", marginTop: '2px' }}>{s.sub}</div>
            </Card>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

          {/* PERSONAL INFO */}
          <Card style={{ padding: '28px' }}>
            <SectionTitle>Personal Information</SectionTitle>
            {!isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Full Name', value: profile.name || '—', icon: '👤' },
                  { label: 'Phone', value: profile.phone || '—', icon: '📞' },
                  { label: 'Email', value: profile.email || '—', icon: '✉️' },
                ].map(row => (
                  <div key={row.label} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px 16px', background: RED_BG,
                    borderRadius: '12px', border: `1px solid ${RED_DIM}`,
                  }}>
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{row.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.62rem', color: MUTED, fontFamily: "'DM Sans', sans-serif", letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2px' }}>
                        {row.label}
                      </div>
                      <div style={{ fontSize: '0.95rem', color: row.value === '—' ? RED_DIM : DARK, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                        {row.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Full Name', key: 'name', type: 'text', ph: 'John Smith' },
                  { label: 'Phone', key: 'phone', type: 'tel', ph: '+1 604 123 4567' },
                  { label: 'Email', key: 'email', type: 'email', ph: 'you@example.com' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: '0.68rem', color: MUTED, fontFamily: "'DM Sans', sans-serif", letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      value={(formData as any)[f.key]}
                      onChange={e => setFormData(d => ({ ...d, [f.key]: e.target.value }))}
                      placeholder={f.ph}
                      style={inputSt}
                      onFocus={e => e.target.style.borderColor = RED}
                      onBlur={e => e.target.style.borderColor = RED_DIM}
                    />
                  </div>
                ))}
                <button onClick={() => setIsEditing(false)} style={{
                  background: 'transparent', border: 'none', color: MUTED,
                  fontSize: '0.8rem', cursor: 'pointer', textAlign: 'center',
                  marginTop: '8px', fontFamily: "'DM Sans', sans-serif",
                }}>
                  Cancel
                </button>
              </div>
            )}
          </Card>

          {/* LOYALTY */}
          <Card style={{ padding: '28px' }}>
            <SectionTitle>Loyalty Program</SectionTitle>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              marginBottom: '24px', padding: '18px',
              background: RED_BG, borderRadius: '12px', border: `1px solid ${RED_DIM}`,
            }}>
              <div style={{ fontSize: '2.5rem' }}>{tier.icon}</div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 700, color: tier.color }}>
                  {tier.name} Member
                </div>
                <div style={{ fontSize: '0.8rem', color: MUTED, fontFamily: "'DM Sans', sans-serif" }}>
                  {points} loyalty points
                </div>
              </div>
            </div>

            {nextTier ? (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.72rem', color: MUTED, fontFamily: "'DM Sans', sans-serif", letterSpacing: '1px' }}>
                    {tier.name}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: MUTED, fontFamily: "'DM Sans', sans-serif", letterSpacing: '1px' }}>
                    {nextTier.name}
                  </span>
                </div>
                <div style={{ height: '8px', background: RED_DIM, borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${progress}%`,
                    background: 'linear-gradient(to right, #DC2626, #EF4444)',
                    borderRadius: '4px', transition: 'width 0.5s ease',
                  }} />
                </div>
                <p style={{ fontSize: '0.78rem', color: MUTED, fontFamily: "'DM Sans', sans-serif", marginTop: '10px', textAlign: 'center' }}>
                  {nextTier.min - points} more points to {nextTier.icon} {nextTier.name}
                </p>
              </div>
            ) : (
              <div style={{
                textAlign: 'center', padding: '14px',
                background: 'rgba(200,160,74,0.1)',
                border: '1px solid rgba(200,160,74,0.3)',
                borderRadius: '12px', marginBottom: '24px',
              }}>
                <p style={{ fontSize: '0.88rem', color: GOLD, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
                  💎 Top Tier — Maximum Benefits!
                </p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {TIERS.map(t => (
                <div key={t.name} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: t.name === tier.name ? RED_BG : 'transparent',
                  border: `1px solid ${t.name === tier.name ? RED_DIM : 'transparent'}`,
                  borderRadius: '8px',
                }}>
                  <span style={{ fontSize: '0.85rem', color: t.name === tier.name ? DARK : MUTED, fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {t.icon} {t.name}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: t.name === tier.name ? RED : MUTED, fontFamily: "'DM Sans', sans-serif" }}>
                    {t.max === Infinity ? `${t.min}+` : `${t.min}–${t.max}`} pts
                  </span>
                </div>
              ))}
            </div>

            <p style={{
              fontSize: '0.78rem', color: MUTED, fontFamily: "'DM Sans', sans-serif",
              lineHeight: 1.6, borderTop: `1px solid ${RED_DIM}`, paddingTop: '14px',
            }}>
              Earn 1 point per 10 CAD spent. Redeem as discount at checkout.
            </p>
          </Card>
        </div>

        {/* PROMO */}
        <Card style={{ padding: '24px 28px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ fontSize: '1.6rem' }}>🎁</div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 700, color: DARK, marginBottom: '4px' }}>
                  First Order Discount
                </div>
                <p style={{ fontSize: '0.82rem', color: MUTED, fontFamily: "'DM Sans', sans-serif" }}>
                  Use code at checkout for 10% off
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <code style={{
                background: RED_BG, border: `2px dashed ${RED}`,
                color: RED, fontFamily: 'monospace', fontSize: '1.1rem',
                fontWeight: 700, padding: '10px 24px', borderRadius: '50px',
                letterSpacing: '2px',
              }}>
                SUSHIMATE10
              </code>
              <Link to="/order" style={{
                background: RED, color: '#fff',
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase',
                padding: '10px 24px', borderRadius: '50px', textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(220,38,38,0.3)',
              }}>
                Order Now
              </Link>
            </div>
          </div>
        </Card>

        {/* SAVED ADDRESSES */}
        <Card style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <SectionTitle>Saved Addresses</SectionTitle>
            <Link to="/order" style={{
              fontSize: '0.75rem', color: RED, fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700, letterSpacing: '1px', textDecoration: 'none',
              borderBottom: `2px solid ${RED_DIM}`, paddingBottom: '2px',
            }}>
              + Add New
            </Link>
          </div>

          {savedAddresses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px', opacity: 0.3 }}>📍</div>
              <p style={{ color: MUTED, fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', marginBottom: '20px' }}>
                No saved addresses yet
              </p>
              <Link to="/order" style={{
                display: 'inline-block',
                border: `2px solid ${RED_DIM}`, color: RED,
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase',
                padding: '10px 28px', borderRadius: '50px', textDecoration: 'none',
                transition: 'all 0.2s',
              }}>
                Place your first order →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {savedAddresses.map(addr => (
                <div key={addr.id} style={{
                  background: RED_BG, border: `1px solid ${RED_DIM}`,
                  borderRadius: '12px', padding: '18px',
                  display: 'flex', flexDirection: 'column', gap: '8px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontWeight: 700, color: DARK }}>
                      📍 {addr.name}
                    </div>
                    <button onClick={() => removeSavedAddress(addr.id)} style={{
                      background: 'none', border: 'none', color: MUTED,
                      cursor: 'pointer', fontSize: '0.8rem', padding: '0',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = RED; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = MUTED; }}>
                      ✕
                    </button>
                  </div>
                  <p style={{ fontSize: '0.84rem', color: MUTED, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
                    {[addr.building, addr.address, addr.city].filter(Boolean).join(', ')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>
    </div>
  );
};

export default Profile;