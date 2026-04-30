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
  { name: 'Bronze', min: 0, max: 49, color: '#cd7f32', icon: '🥉' },
  { name: 'Silver', min: 50, max: 199, color: '#b0b0b0', icon: '🥈' },
  { name: 'Gold', min: 200, max: 499, color: '#C8A04A', icon: '🥇' },
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
    <div style={{
      width: '3px', height: '22px', background: RED,
      borderRadius: '2px', flexShrink: 0,
    }} />
    <h2 style={{
      fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem',
      fontWeight: 700, color: DARK,
    }}>
      {children}
    </h2>
  </div>
);

const Profile = () => {
  const { profile, updateProfile, savedAddresses, removeSavedAddress } = useProfile();
  const { points } = useLoyalty();
  const [isMobile, setIsMobile] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: profile.name, phone: profile.phone, email: profile.email });
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

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
        padding: isMobile ? '32px 20px 28px' : '48px 40px 40px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'flex', alignItems: 'center',
          gap: isMobile ? '16px' : '28px',
          flexDirection: isMobile ? 'column' : 'row',
          textAlign: isMobile ? 'center' : 'left',
        }}>
          <div style={{
            width: isMobile ? '72px' : '88px',
            height: isMobile ? '72px' : '88px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, border: '3px solid #DC2626',
            boxShadow: '0 0 30px rgba(220,38,38,0.3)',
          }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: isMobile ? '1.6rem' : '2rem',
              fontWeight: 700, color: '#fff',
            }}>{initials}</span>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem',
              letterSpacing: '4px', color: RED, textTransform: 'uppercase',
              marginBottom: '6px',
            }}>
              SushiMate Member
            </div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: isMobile ? '1.6rem' : '2.2rem',
              fontWeight: 700, color: DARK, lineHeight: 1.1,
              marginBottom: '8px',
            }}>
              {profile.name || 'Guest User'}
            </h1>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start',
            }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                background: RED_BG, border: `1px solid ${RED_DIM}`,
                padding: '4px 10px', borderRadius: '50px',
                fontSize: '0.68rem', fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700, color: tier.color, letterSpacing: '1px',
              }}>
                {tier.icon} {tier.name} Member
              </span>
            </div>
          </div>

          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            style={{
              padding: '8px 20px', borderRadius: '50px',
              background: isEditing ? RED : 'transparent',
              border: `2px solid ${RED}`, color: isEditing ? '#fff' : RED,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
              fontSize: '0.68rem', letterSpacing: '2px',
              textTransform: 'uppercase', cursor: 'pointer',
              transition: 'all 0.18s', flexShrink: 0,
              marginTop: isMobile ? '8px' : '0',
            }}>
            {isEditing ? '✓ Save' : '✏ Edit'}
          </button>
        </div>
      </div>

      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        padding: isMobile ? '20px 16px 0' : '32px 40px 0',
      }}>
        
        {/* STATS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? '10px' : '16px',
          marginBottom: isMobile ? '20px' : '28px',
        }}>
          {[
            { label: 'Orders', value: loading ? '…' : String(totalOrders), icon: '📦' },
            { label: 'Spent', value: loading ? '…' : `${totalSpent.toFixed(0)}`, unit: 'CAD', icon: '💳' },
            { label: 'Points', value: String(points), icon: tier.icon, gold: true },
            { label: 'Avg Order', value: totalOrders > 0 ? (totalSpent / totalOrders).toFixed(0) : '—', unit: 'CAD', icon: '📊' },
          ].map((s, i) => (
            <Card key={i} style={{
              padding: isMobile ? '14px' : '20px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{s.icon}</div>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: isMobile ? '1.3rem' : '1.6rem',
                fontWeight: 700, color: s.gold ? GOLD : RED, lineHeight: 1,
              }}>
                {s.value}
                {s.unit && <span style={{
                  fontSize: '0.65rem', color: MUTED,
                  fontFamily: "'DM Sans', sans-serif", marginLeft: '2px',
                }}>{s.unit}</span>}
              </div>
              <div style={{
                fontSize: '0.6rem', color: MUTED,
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: '1px', textTransform: 'uppercase',
                marginTop: '4px',
              }}>{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Блоки: инфо + лояльность */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '14px' : '20px',
          marginBottom: isMobile ? '14px' : '20px',
        }}>
          
          {/* PERSONAL INFO */}
          <Card style={{ padding: isMobile ? '20px' : '28px' }}>
            <SectionTitle>Personal Information</SectionTitle>
            {!isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Full Name', value: profile.name || '—', icon: '👤' },
                  { label: 'Phone', value: profile.phone || '—', icon: '📞' },
                  { label: 'Email', value: profile.email || '—', icon: '✉️' },
                ].map(row => (
                  <div key={row.label} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 14px', background: RED_BG,
                    borderRadius: '10px', border: `1px solid ${RED_DIM}`,
                  }}>
                    <span style={{ fontSize: '1rem' }}>{row.icon}</span>
                    <div>
                      <div style={{
                        fontSize: '0.58rem', color: MUTED,
                        fontFamily: "'DM Sans', sans-serif",
                        letterSpacing: '1.5px', textTransform: 'uppercase',
                        marginBottom: '1px',
                      }}>{row.label}</div>
                      <div style={{
                        fontSize: '0.82rem', color: row.value === '—' ? RED_DIM : DARK,
                        fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                      }}>{row.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Full Name', key: 'name', type: 'text', ph: 'John Smith' },
                  { label: 'Phone', key: 'phone', type: 'tel', ph: '+1 604 123 4567' },
                  { label: 'Email', key: 'email', type: 'email', ph: 'you@example.com' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{
                      fontSize: '0.62rem', color: MUTED,
                      fontFamily: "'DM Sans', sans-serif",
                      letterSpacing: '1.5px', textTransform: 'uppercase',
                      display: 'block', marginBottom: '4px',
                    }}>{f.label}</label>
                    <input
                      type={f.type}
                      value={(formData as any)[f.key]}
                      onChange={e => setFormData(d => ({ ...d, [f.key]: e.target.value }))}
                      placeholder={f.ph}
                      style={{
                        width: '100%', padding: '10px 14px',
                        background: '#F9FAFB', border: `2px solid ${RED_DIM}`,
                        color: DARK, borderRadius: '10px',
                        fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif",
                        outline: 'none', transition: 'all 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = RED}
                      onBlur={e => e.target.style.borderColor = RED_DIM}
                    />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button onClick={handleSave} style={{
                    flex: 1, padding: '10px',
                    background: RED, color: '#fff', border: 'none',
                    borderRadius: '50px', fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700, fontSize: '0.72rem', letterSpacing: '1.5px',
                    cursor: 'pointer',
                  }}>✓ Save</button>
                  <button onClick={() => setIsEditing(false)} style={{
                    padding: '10px 16px',
                    background: 'transparent', border: `2px solid ${RED_DIM}`,
                    color: MUTED, borderRadius: '50px',
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                    fontSize: '0.72rem', cursor: 'pointer',
                  }}>Cancel</button>
                </div>
              </div>
            )}
          </Card>

          {/* LOYALTY */}
          <Card style={{ padding: isMobile ? '20px' : '28px' }}>
            <SectionTitle>Loyalty Program</SectionTitle>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              marginBottom: '20px', padding: '14px',
              background: RED_BG, borderRadius: '10px',
              border: `1px solid ${RED_DIM}`,
            }}>
              <div style={{ fontSize: '2rem' }}>{tier.icon}</div>
              <div>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.2rem', fontWeight: 700, color: tier.color,
                }}>{tier.name}</div>
                <div style={{ fontSize: '0.72rem', color: MUTED }}>{points} points</div>
              </div>
            </div>

            {nextTier && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginBottom: '8px', fontSize: '0.65rem', color: MUTED,
                }}>
                  <span>{tier.name}</span>
                  <span>{nextTier.name}</span>
                </div>
                <div style={{
                  height: '6px', background: RED_DIM,
                  borderRadius: '3px', overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', width: `${progress}%`,
                    background: 'linear-gradient(to right, #DC2626, #EF4444)',
                    borderRadius: '3px',
                  }} />
                </div>
                <p style={{
                  fontSize: '0.68rem', color: MUTED, textAlign: 'center',
                  marginTop: '8px',
                }}>
                  {nextTier.min - points} pts to {nextTier.icon} {nextTier.name}
                </p>
              </div>
            )}

            <p style={{
              fontSize: '0.7rem', color: MUTED,
              borderTop: `1px solid ${RED_DIM}`, paddingTop: '12px',
              lineHeight: 1.5,
            }}>
              Earn 1 point per 10 CAD spent
            </p>
          </Card>
        </div>

        {/* PROMO */}
        <Card style={{
          padding: isMobile ? '16px' : '22px 28px',
          marginBottom: isMobile ? '14px' : '20px',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.3rem' }}>🎁</span>
              <div>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1rem', fontWeight: 700, color: DARK,
                }}>First Order Discount</div>
                <p style={{ fontSize: '0.7rem', color: MUTED }}>10% off with code:</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <code style={{
                background: RED_BG, border: `2px dashed ${RED}`,
                color: RED, fontFamily: 'monospace',
                fontSize: '0.9rem', fontWeight: 700,
                padding: '6px 14px', borderRadius: '50px',
              }}>SUSHIMATE10</code>
              <Link to="/order" style={{
                background: RED, color: '#fff',
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                fontSize: '0.65rem', letterSpacing: '1.5px',
                padding: '8px 16px', borderRadius: '50px',
                textDecoration: 'none',
              }}>Order</Link>
            </div>
          </div>
        </Card>

        {/* SAVED ADDRESSES */}
        <Card style={{ padding: isMobile ? '20px' : '28px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '16px',
          }}>
            <SectionTitle>Saved Addresses</SectionTitle>
            <Link to="/order" style={{
              fontSize: '0.68rem', color: RED, fontWeight: 700,
              textDecoration: 'none',
            }}>+ Add</Link>
          </div>
          {savedAddresses.length === 0 ? (
            <p style={{ color: MUTED, textAlign: 'center', padding: '20px', fontSize: '0.8rem' }}>
              No saved addresses
            </p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '10px',
            }}>
              {savedAddresses.map(addr => (
                <div key={addr.id} style={{
                  background: RED_BG, border: `1px solid ${RED_DIM}`,
                  borderRadius: '10px', padding: '12px',
                }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    marginBottom: '4px',
                  }}>
                    <span style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 700, fontSize: '0.9rem', color: DARK,
                    }}>📍 {addr.name}</span>
                    <button onClick={() => removeSavedAddress(addr.id)} style={{
                      background: 'none', border: 'none', color: MUTED,
                      cursor: 'pointer', fontSize: '0.7rem',
                    }}>✕</button>
                  </div>
                  <p style={{ fontSize: '0.72rem', color: MUTED }}>
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