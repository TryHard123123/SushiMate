import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { useLoyalty } from '../context/LoyaltyContext';
import { getOrders } from '../services/api';

// ─── Palette ────────────────────────────────────────────────────────────────
const BG      = '#0a0000';
const BG2     = '#130000';
const CARD    = '#160202';
const RED     = '#D42B2B';
const RED_DIM = '#3d0808';
const RED_BR  = '#FF3A3A';
const WHITE   = '#F5ECEC';
const MUTED   = '#9a7a7a';
const GOLD    = '#C8A04A';

// ─── Loyalty tiers ──────────────────────────────────────────────────────────
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

// ─── Small helpers ───────────────────────────────────────────────────────────
const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: CARD, border: `1px solid ${RED_DIM}`, borderRadius: '3px', ...style }}>
    {children}
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
    <div style={{ width: '3px', height: '20px', background: RED, flexShrink: 0 }} />
    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 700, color: WHITE }}>
      {children}
    </h2>
  </div>
);

const inputSt: React.CSSProperties = {
  width: '100%', padding: '10px 14px',
  background: BG2, border: `1px solid ${RED_DIM}`,
  color: WHITE, borderRadius: '2px',
  fontSize: '0.86rem', fontFamily: "'DM Sans', sans-serif", outline: 'none',
};

// ════════════════════════════════════════════════════════════════════════════
const Profile = () => {
  const { profile, updateProfile, savedAddresses, removeSavedAddress } = useProfile();
  const { points } = useLoyalty();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData]   = useState({ name: profile.name, phone: profile.phone, email: profile.email });
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSpent,  setTotalSpent]  = useState(0);
  const [loading,     setLoading]     = useState(true);

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

  const tier     = getTier(points);
  const nextTier = getNextTier(points);
  const progress = nextTier
    ? Math.round(((points - tier.min) / (nextTier.min - tier.min)) * 100)
    : 100;

  // Avatar initials
  const initials = (profile.name || 'SM')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const joinDate = new Date(profile.joinDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ background: BG, minHeight: '100vh', padding: '0 0 80px' }}>

      {/* ── HERO BANNER ── */}
      <div style={{
        background: `linear-gradient(135deg, #130000 0%, #200505 50%, #0a0000 100%)`,
        borderBottom: `1px solid ${RED_DIM}`,
        padding: '48px 40px 40px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative background kanji */}
        <div style={{
          position: 'absolute', right: '60px', top: '-20px',
          fontFamily: 'serif', fontSize: '14rem', fontWeight: 700,
          color: 'rgba(212,43,43,0.04)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
        }}>木</div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '28px' }}>

          {/* Avatar */}
          <div style={{
            width: '88px', height: '88px', borderRadius: '3px',
            background: `linear-gradient(135deg, ${RED} 0%, #9e1515 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, border: `2px solid ${RED}`,
            boxShadow: '0 0 30px rgba(212,43,43,0.3)',
          }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 700, color: '#fff' }}>
              {initials}
            </span>
          </div>

          {/* Name + tier */}
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', letterSpacing: '4px', color: RED, textTransform: 'uppercase', marginBottom: '6px' }}>
              SushiMate Member
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', fontWeight: 700, color: WHITE, lineHeight: 1.1, marginBottom: '10px' }}>
              {profile.name || 'Guest User'}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                background: 'rgba(212,43,43,0.15)', border: `1px solid ${RED_DIM}`,
                padding: '4px 12px', borderRadius: '2px',
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

          {/* Edit button */}
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            style={{
              padding: '10px 24px', borderRadius: '2px',
              background: isEditing ? RED : 'transparent',
              border: `1px solid ${RED}`, color: isEditing ? '#fff' : RED,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
              fontSize: '0.72rem', letterSpacing: '2px', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.18s', flexShrink: 0,
            }}
          >
            {isEditing ? '✓ Save' : '✏ Edit Profile'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 40px 0' }}>

        {/* ── STATS ROW ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Total Orders',    value: loading ? '…' : String(totalOrders), icon: '📦', sub: 'completed'          },
            { label: 'Total Spent',     value: loading ? '…' : `${totalSpent.toFixed(0)}`, unit: 'AED', icon: '💳', sub: 'lifetime'  },
            { label: 'Loyalty Points',  value: String(points),  icon: tier.icon,  sub: `${tier.name} tier`, gold: true },
            { label: 'Avg Order Value', value: totalOrders > 0 ? (totalSpent / totalOrders).toFixed(0) : '—', unit: totalOrders > 0 ? 'AED' : '', icon: '📊', sub: 'per order' },
          ].map((s, i) => (
            <Card key={i} style={{ padding: '20px', textAlign: 'center', transition: 'border-color 0.2s' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{s.icon}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 700, color: s.gold ? GOLD : RED, lineHeight: 1 }}>
                {s.value}
                {s.unit && <span style={{ fontSize: '0.8rem', color: MUTED, fontFamily: "'DM Sans', sans-serif", fontWeight: 400, marginLeft: '4px' }}>{s.unit}</span>}
              </div>
              <div style={{ fontSize: '0.7rem', color: MUTED, fontFamily: "'DM Sans', sans-serif", letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px' }}>{s.label}</div>
              <div style={{ fontSize: '0.68rem', color: RED_DIM, fontFamily: "'DM Sans', sans-serif", marginTop: '2px' }}>{s.sub}</div>
            </Card>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

          {/* ── PERSONAL INFO ── */}
          <Card style={{ padding: '28px' }}>
            <SectionTitle>Personal Information</SectionTitle>
            {!isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Full Name',  value: profile.name  || '—', icon: '👤' },
                  { label: 'Phone',      value: profile.phone || '—', icon: '📞' },
                  { label: 'Email',      value: profile.email || '—', icon: '✉️' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: BG2, borderRadius: '2px', border: `1px solid ${RED_DIM}` }}>
                    <span style={{ fontSize: '1rem', flexShrink: 0 }}>{row.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.62rem', color: MUTED, fontFamily: "'DM Sans', sans-serif", letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2px' }}>
                        {row.label}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: row.value === '—' ? RED_DIM : WHITE, fontFamily: "'DM Sans', sans-serif" }}>
                        {row.value}
                      </div>
                    </div>
                  </div>
                ))}
                <p style={{ fontSize: '0.7rem', color: RED_DIM, fontFamily: "'DM Sans', sans-serif", textAlign: 'center', marginTop: '4px' }}>
                  Click "Edit Profile" above to update your details
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Full Name',  key: 'name',  type: 'text',  ph: 'John Smith' },
                  { label: 'Phone',      key: 'phone', type: 'tel',   ph: '+971 50 123 4567' },
                  { label: 'Email',      key: 'email', type: 'email', ph: 'you@example.com' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: '0.65rem', color: MUTED, fontFamily: "'DM Sans', sans-serif", letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      value={(formData as any)[f.key]}
                      onChange={e => setFormData(d => ({ ...d, [f.key]: e.target.value }))}
                      placeholder={f.ph}
                      style={inputSt}
                      onFocus={e => e.target.style.borderColor = RED}
                      onBlur={e  => e.target.style.borderColor = RED_DIM}
                    />
                  </div>
                ))}
                <button onClick={() => setIsEditing(false)} style={{ background: 'transparent', border: 'none', color: MUTED, fontSize: '0.75rem', cursor: 'pointer', textAlign: 'center', marginTop: '4px', fontFamily: "'DM Sans', sans-serif" }}>
                  Cancel
                </button>
              </div>
            )}
          </Card>

          {/* ── LOYALTY PROGRAM ── */}
          <Card style={{ padding: '28px' }}>
            <SectionTitle>Loyalty Program</SectionTitle>

            {/* Tier display */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px', padding: '16px', background: BG2, borderRadius: '2px', border: `1px solid ${RED_DIM}` }}>
              <div style={{ fontSize: '2.4rem' }}>{tier.icon}</div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 700, color: tier.color }}>
                  {tier.name} Member
                </div>
                <div style={{ fontSize: '0.76rem', color: MUTED, fontFamily: "'DM Sans', sans-serif" }}>
                  {points} loyalty points
                </div>
              </div>
            </div>

            {/* Progress bar */}
            {nextTier ? (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.7rem', color: MUTED, fontFamily: "'DM Sans', sans-serif", letterSpacing: '1px' }}>
                    {tier.name.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: MUTED, fontFamily: "'DM Sans', sans-serif", letterSpacing: '1px' }}>
                    {nextTier.name.toUpperCase()}
                  </span>
                </div>
                <div style={{ height: '6px', background: RED_DIM, borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(to right, ${RED}, ${RED_BR})`, borderRadius: '3px', transition: 'width 0.5s ease' }} />
                </div>
                <p style={{ fontSize: '0.72rem', color: MUTED, fontFamily: "'DM Sans', sans-serif", marginTop: '8px', textAlign: 'center' }}>
                  {nextTier.min - points} more points to reach {nextTier.icon} {nextTier.name}
                </p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(200,160,74,0.1)', border: `1px solid rgba(200,160,74,0.3)`, borderRadius: '2px', marginBottom: '20px' }}>
                <p style={{ fontSize: '0.82rem', color: GOLD, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
                  💎 Top Tier — Maximum Benefits!
                </p>
              </div>
            )}

            {/* Tier list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {TIERS.map(t => (
                <div key={t.name} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: t.name === tier.name ? 'rgba(212,43,43,0.1)' : 'transparent',
                  border: `1px solid ${t.name === tier.name ? RED_DIM : 'transparent'}`,
                  borderRadius: '2px',
                }}>
                  <span style={{ fontSize: '0.82rem', color: t.name === tier.name ? WHITE : MUTED, fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {t.icon} {t.name}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: t.name === tier.name ? RED : '#5a2a2a', fontFamily: "'DM Sans', sans-serif" }}>
                    {t.max === Infinity ? `${t.min}+` : `${t.min}–${t.max}`} pts
                  </span>
                </div>
              ))}
            </div>

            <p style={{ marginTop: '14px', fontSize: '0.72rem', color: MUTED, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, borderTop: `1px solid ${RED_DIM}`, paddingTop: '12px' }}>
              Earn 1 point per 10 AED spent. Points can be redeemed as AED discount at checkout.
            </p>
          </Card>
        </div>

        {/* ── PROMO CODE ── */}
        <Card style={{ padding: '22px 28px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '1.4rem' }}>🎁</div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontWeight: 700, color: WHITE, marginBottom: '2px' }}>
                  First Order Discount
                </div>
                <p style={{ fontSize: '0.78rem', color: MUTED, fontFamily: "'DM Sans', sans-serif" }}>
                  Use code at checkout for 10% off your first order
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <code style={{
                background: BG2, border: `1px dashed ${RED}`,
                color: RED, fontFamily: 'monospace', fontSize: '1rem',
                fontWeight: 700, padding: '6px 16px', borderRadius: '2px',
                letterSpacing: '2px',
              }}>
                SUSHIMATE10
              </code>
              <Link to="/menu" style={{
                background: RED, color: '#fff',
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase',
                padding: '8px 20px', borderRadius: '2px', textDecoration: 'none',
              }}>
                Order Now
              </Link>
            </div>
          </div>
        </Card>

        {/* ── SAVED ADDRESSES ── */}
        <Card style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <SectionTitle>Saved Addresses</SectionTitle>
            <Link to="/checkout" style={{ fontSize: '0.72rem', color: RED, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: '1px', textDecoration: 'none', borderBottom: `1px solid ${RED_DIM}`, paddingBottom: '1px' }}>
              + Add New
            </Link>
          </div>

          {savedAddresses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '14px', opacity: 0.3 }}>📍</div>
              <p style={{ color: MUTED, fontFamily: "'DM Sans', sans-serif", fontSize: '0.86rem', marginBottom: '16px' }}>
                No saved addresses yet
              </p>
              <Link to="/checkout" style={{
                display: 'inline-block',
                border: `1px solid ${RED_DIM}`, color: MUTED,
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                fontSize: '0.72rem', letterSpacing: '2px', textTransform: 'uppercase',
                padding: '9px 24px', borderRadius: '2px', textDecoration: 'none',
              }}>
                Place your first order →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
              {savedAddresses.map(addr => (
                <div key={addr.id} style={{
                  background: BG2, border: `1px solid ${RED_DIM}`,
                  borderRadius: '2px', padding: '16px',
                  display: 'flex', flexDirection: 'column', gap: '6px',
                  position: 'relative',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem', fontWeight: 700, color: WHITE }}>
                      📍 {addr.name}
                    </div>
                    <button onClick={() => removeSavedAddress(addr.id)}
                      style={{ background: 'none', border: 'none', color: RED_DIM, cursor: 'pointer', fontSize: '0.75rem', padding: '0', transition: 'color 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = RED; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = RED_DIM; }}
                    >
                      ✕
                    </button>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: MUTED, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
                    {[addr.building, addr.address, addr.city].filter(Boolean).join(', ')}
                  </p>
                  {addr.apartment && (
                    <p style={{ fontSize: '0.74rem', color: '#5a2a2a', fontFamily: "'DM Sans', sans-serif" }}>
                      Apt {addr.apartment}{addr.floor ? ` · Floor ${addr.floor}` : ''}
                    </p>
                  )}
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
