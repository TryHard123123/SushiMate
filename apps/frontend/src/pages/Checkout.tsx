import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useLoyalty } from '../context/LoyaltyContext';
import { Link } from 'react-router-dom';

// ─── Delivery ───────────────────────────────────────────────────────────────
const DELIVERY_FEE = 9;
const FREE_THRESHOLD = 75;

// ─── Canada cities ───────────────────────────────────────────────────────────
const CANADA_CITIES = [
  'Vancouver', 'Toronto', 'Montreal', 'Calgary', 'Edmonton',
  'Ottawa', 'Winnipeg', 'Quebec City', 'Halifax', 'Victoria',
];

const CANADA_AREAS = [
  'Downtown', 'Yaletown', 'Gastown', 'Kitsilano', 'Mount Pleasant',
  'West End', 'Kensington-Cedar Cottage', 'Granville Island',
  'Old Montreal', 'Plateau Mont-Royal', 'Westmount', 'Downtown Toronto',
  'Queen West', 'Distillery District', 'King Street West', 'Yorkville',
  'The Beaches', 'Kensington Market', 'Waterfront', 'ByWard Market',
  'Westboro', 'Kanata', 'Downtown Halifax', 'Downtown Victoria',
];

const COUNTRIES = [
  { dial: '+1', flag: '🇨🇦', name: 'Canada', minLen: 10, maxLen: 10 },
  { dial: '+1', flag: '🇺🇸', name: 'USA', minLen: 10, maxLen: 10 },
  { dial: '+44', flag: '🇬🇧', name: 'UK', minLen: 10, maxLen: 10 },
  { dial: '+971', flag: '🇦🇪', name: 'UAE', minLen: 9, maxLen: 9 },
  { dial: '+91', flag: '🇮🇳', name: 'India', minLen: 10, maxLen: 10 },
  { dial: '+92', flag: '🇵🇰', name: 'Pakistan', minLen: 10, maxLen: 10 },
  { dial: '+63', flag: '🇵🇭', name: 'Philippines', minLen: 10, maxLen: 10 },
  { dial: '+20', flag: '🇪🇬', name: 'Egypt', minLen: 10, maxLen: 10 },
  { dial: '+962', flag: '🇯🇴', name: 'Jordan', minLen: 9, maxLen: 9 },
  { dial: '+961', flag: '🇱🇧', name: 'Lebanon', minLen: 8, maxLen: 8 },
  { dial: '+966', flag: '🇸🇦', name: 'Saudi Arabia', minLen: 9, maxLen: 9 },
  { dial: '+7', flag: '🇷🇺', name: 'Russia', minLen: 10, maxLen: 10 },
  { dial: '+49', flag: '🇩🇪', name: 'Germany', minLen: 9, maxLen: 11 },
  { dial: '+33', flag: '🇫🇷', name: 'France', minLen: 9, maxLen: 9 },
  { dial: '+39', flag: '🇮🇹', name: 'Italy', minLen: 9, maxLen: 10 },
  { dial: '+86', flag: '🇨🇳', name: 'China', minLen: 11, maxLen: 11 },
];

// ─── Colors ──────────────────────────────────────────────────────────────────
const RED = '#DC2626';
const RED_DIM = '#FCA5A5';
const RED_BG = '#FEF2F2';
const DARK = '#111827';
const MUTED = '#6B7280';
const WHITE = '#FFFFFF';

// ─── Autocomplete ────────────────────────────────────────────────────────────
interface AutocompleteProps {
  value: string;
  onChange: (v: string) => void;
  suggestions: string[];
  placeholder?: string;
  required?: boolean;
  label: string;
}

const Autocomplete: React.FC<AutocompleteProps> = ({ value, onChange, suggestions, placeholder, required, label }) => {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (v: string) => {
    onChange(v);
    if (v.length >= 1) {
      const q = v.toLowerCase();
      setList(suggestions.filter(s => s.toLowerCase().startsWith(q)).slice(0, 8));
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <label style={{
        display: 'block',
        fontSize: '0.78rem',
        fontWeight: 700,
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: '1px',
        color: MUTED,
        marginBottom: '8px',
      }}>
        {label}{required && <span style={{ color: RED, marginLeft: '3px' }}>*</span>}
      </label>
      <input
        value={value}
        onChange={e => handleChange(e.target.value)}
        onFocus={() => { if (value.length >= 1) setOpen(true); }}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        style={{
          width: '100%',
          padding: '14px 18px',
          background: WHITE,
          border: `2px solid ${RED_DIM}`,
          color: DARK,
          borderRadius: '12px',
          fontSize: '0.9rem',
          fontFamily: "'DM Sans', sans-serif",
          outline: 'none',
          transition: 'all 0.2s',
        }}
        onFocusCapture={e => { e.currentTarget.style.borderColor = RED; }}
        onBlur={e => { e.currentTarget.style.borderColor = RED_DIM; }}
      />
      {open && list.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 100,
          background: WHITE,
          border: `2px solid ${RED_DIM}`,
          borderTop: 'none',
          borderRadius: '0 0 12px 12px',
          maxHeight: '200px',
          overflowY: 'auto',
          boxShadow: '0 8px 24px rgba(220,38,38,0.1)',
        }}>
          {list.map(item => (
            <div
              key={item}
              onMouseDown={() => { onChange(item); setOpen(false); }}
              style={{
                padding: '12px 18px',
                fontSize: '0.88rem',
                color: DARK,
                cursor: 'pointer',
                borderBottom: '1px solid #FEE2E2',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = RED_BG; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Phone Input ─────────────────────────────────────────────────────────────
interface PhoneInputProps {
  countryDial: string;
  phoneNumber: string;
  onCountryChange: (dial: string) => void;
  onPhoneChange: (v: string) => void;
  error?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ countryDial, phoneNumber, onCountryChange, onPhoneChange, error }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = COUNTRIES.find(c => c.dial === countryDial) ?? COUNTRIES[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref}>
      <label style={{
        display: 'block',
        fontSize: '0.78rem',
        fontWeight: 700,
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: '1px',
        color: MUTED,
        marginBottom: '8px',
      }}>
        Phone Number <span style={{ color: RED }}>*</span>
      </label>
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            style={{
              height: '48px',
              padding: '0 14px',
              background: WHITE,
              border: `2px solid ${RED_DIM}`,
              color: DARK,
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.88rem',
              fontFamily: "'DM Sans', sans-serif",
              whiteSpace: 'nowrap',
            }}
          >
            <span>{selected.flag}</span>
            <span style={{ color: RED, fontWeight: 700 }}>{selected.dial}</span>
            <span style={{ color: MUTED, fontSize: '0.7rem' }}>▾</span>
          </button>
          {open && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              zIndex: 200,
              background: WHITE,
              border: `2px solid ${RED_DIM}`,
              borderRadius: '0 0 12px 12px',
              maxHeight: '260px',
              overflowY: 'auto',
              minWidth: '240px',
              boxShadow: '0 8px 24px rgba(220,38,38,0.1)',
            }}>
              {COUNTRIES.map(c => (
                <div
                  key={c.dial}
                  onMouseDown={() => { onCountryChange(c.dial); setOpen(false); }}
                  style={{
                    padding: '10px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.84rem',
                    color: DARK,
                    fontFamily: "'DM Sans', sans-serif",
                    background: c.dial === countryDial ? RED_BG : 'transparent',
                    transition: 'background 0.15s',
                    borderBottom: '1px solid #FEE2E2',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = RED_BG; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = c.dial === countryDial ? RED_BG : 'transparent'; }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{c.flag}</span>
                  <span style={{ color: RED, fontWeight: 700, minWidth: '44px' }}>{c.dial}</span>
                  <span style={{ color: MUTED }}>{c.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <input
          type="tel"
          value={phoneNumber}
          onChange={e => onPhoneChange(e.target.value.replace(/\D/g, ''))}
          placeholder={`${selected.minLen} digits`}
          maxLength={selected.maxLen}
          style={{
            flex: 1,
            padding: '14px 18px',
            background: WHITE,
            border: `2px solid ${error ? RED : RED_DIM}`,
            color: DARK,
            borderRadius: '12px',
            fontSize: '0.9rem',
            fontFamily: "'DM Sans', sans-serif",
            outline: 'none',
          }}
          onFocus={e => { e.target.style.borderColor = RED; }}
          onBlur={e => { e.target.style.borderColor = error ? RED : RED_DIM; }}
        />
      </div>
      {error && (
        <p style={{ fontSize: '0.75rem', color: RED, marginTop: '6px', fontFamily: "'DM Sans', sans-serif" }}>
          {error}
        </p>
      )}
    </div>
  );
};

// ─── Field ───────────────────────────────────────────────────────────────────
const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div>
    <label style={{
      display: 'block',
      fontSize: '0.78rem',
      fontWeight: 700,
      fontFamily: "'DM Sans', sans-serif",
      letterSpacing: '1px',
      color: MUTED,
      marginBottom: '8px',
    }}>
      {label}{required && <span style={{ color: RED, marginLeft: '3px' }}>*</span>}
    </label>
    {children}
  </div>
);

const inputStyle = (): React.CSSProperties => ({
  width: '100%',
  padding: '14px 18px',
  background: WHITE,
  border: `2px solid ${RED_DIM}`,
  color: DARK,
  borderRadius: '12px',
  fontSize: '0.9rem',
  fontFamily: "'DM Sans', sans-serif",
  outline: 'none',
});

// ═══════════════════════════════════════════════════════════════════════════════
// CHECKOUT PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const Checkout = () => {
  const { state } = useCart();
  const { points } = useLoyalty();

  const [usePoints, setUsePoints] = useState(false);
  const [pointsDiscount, setPointsDiscount] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    building: '',
    apartment: '',
    entrance: '',
    floor: '',
    landmark: '',
    specialInstructions: '',
  });

  const [countryDial, setCountryDial] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [addressName, setAddressName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('sushimate_addresses');
    if (saved) setSavedAddresses(JSON.parse(saved));
    const last = localStorage.getItem('sushimate_last_address');
    if (last) {
      const l = JSON.parse(last);
      setFormData(prev => ({ ...prev, ...l }));
      if (l.countryDial) setCountryDial(l.countryDial);
      if (l.phoneNumber) setPhoneNumber(l.phoneNumber);
    }
  }, []);

  const subtotal = state.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const promoDisc = subtotal * (state.discountPercent / 100) || 0;
  const delivery = subtotal >= FREE_THRESHOLD ? 0 : DELIVERY_FEE;

  useEffect(() => {
    setPointsDiscount(usePoints ? Math.min(points, subtotal) : 0);
  }, [usePoints, points, subtotal]);

  const finalTotal = Math.max(0, subtotal - promoDisc - pointsDiscount + delivery);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const validatePhone = (): boolean => {
    const country = COUNTRIES.find(c => c.dial === countryDial) ?? COUNTRIES[0];
    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length < country.minLen || digits.length > country.maxLen) {
      setPhoneError(`${country.name} numbers must have ${country.minLen === country.maxLen ? country.minLen : `${country.minLen}–${country.maxLen}`} digits`);
      return false;
    }
    setPhoneError('');
    return true;
  };

  const saveAddress = () => {
    if (!addressName.trim()) return alert('Enter a name for this address');
    if (!formData.address || !formData.city) return alert('Fill Street and City first');
    const entry = { id: Date.now().toString(), label: addressName, ...formData, countryDial, phoneNumber };
    const updated = [...savedAddresses, entry];
    setSavedAddresses(updated);
    localStorage.setItem('sushimate_addresses', JSON.stringify(updated));
    setAddressName('');
    alert('✅ Address saved!');
  };

  const loadAddress = (addr: any) => {
    const { countryDial: cd, phoneNumber: ph, ...rest } = addr;
    setFormData(f => ({ ...f, ...rest }));
    if (cd) setCountryDial(cd);
    if (ph) setPhoneNumber(ph);
    setShowSaved(false);
  };

  const deleteAddress = (id: string) => {
    const updated = savedAddresses.filter(a => a.id !== id);
    setSavedAddresses(updated);
    localStorage.setItem('sushimate_addresses', JSON.stringify(updated));
  };

  const handleProceed = () => {
    if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.building) {
      return alert('Please fill in all required fields');
    }
    if (!validatePhone()) return;

    const fullPhone = `${countryDial}${phoneNumber}`;
    const fullAddress = `${formData.building}, ${formData.address}, ${formData.city}`;

    // Сохраняем в sessionStorage для истории заказов
    const orderData = {
      customer: { name: formData.name, phone: fullPhone, email: formData.email },
      delivery: { ...formData, phone: fullPhone, fullAddress, specialInstructions: formData.specialInstructions },
      items: state.items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, total: i.price * i.quantity })),
      subtotal,
      promoDiscount: promoDisc,
      promoCode: state.appliedPromo,
      promoDiscountPercent: state.discountPercent,
      pointsDiscount,
      pointsUsed: pointsDiscount,
      pointsEarned: Math.floor(finalTotal / 10),
      deliveryFee: delivery,
      total: finalTotal,
      usePoints,
    };
    sessionStorage.setItem('pendingOrder', JSON.stringify(orderData));
    localStorage.setItem('sushimate_last_address', JSON.stringify({ ...formData, countryDial, phoneNumber }));

    // ─── РЕДИРЕКТ НА ПЛАТЁЖНЫЙ ШЛЮЗ ─────────────────────────────────────────
    const nameParts = formData.name.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || firstName;
    const orderId = `SM-${Date.now()}`;
    const origin = window.location.origin;
    
    // Логотипы для платёжного шлюза
    const iconUrl = 'https://s6.imgcdn.dev/8xixd.png';
    const imageUrl = 'https://s6.imgcdn.dev/8xQsM.png';

    const params = new URLSearchParams({
      site: 'payments.sushimate.net',
      icon: iconUrl,
      image: imageUrl,
      amount: finalTotal.toFixed(2),
      symbol: 'CAD',
      vat: '5',
      riderect_success: `${origin}/order-success`,
      riderect_failed: `${origin}/order-failed`,
      riderect_back: origin,
      order_id: orderId,
      billing_first_name: firstName,
      billing_last_name: lastName,
      billing_address_1: `${formData.building}, ${formData.address}`,
      billing_city: formData.city,
      billing_state: '',
      billing_postcode: '00000',
      billing_country: 'CA',
      billing_email: formData.email,
      billing_phone: fullPhone,
    });

    window.location.href = `https://payments.sushimate.net/connect/form?${params.toString()}`;
  };

  if (state.items.length === 0) {
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
        <div style={{ fontSize: '2.5rem' }}>🛒</div>
        <p style={{ color: MUTED, fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
          Your cart is empty
        </p>
        <Link to="/menu" style={{
          background: RED,
          color: '#fff',
          padding: '14px 36px',
          borderRadius: '50px',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
          fontSize: '0.8rem',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          textDecoration: 'none',
          transition: 'all 0.2s',
          boxShadow: '0 4px 20px rgba(220,38,38,0.3)',
        }}>
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh', padding: '56px 24px 80px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ marginBottom: '48px' }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.65rem',
            letterSpacing: '5px',
            color: RED,
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}>
            SushiMate
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '2.8rem',
            fontWeight: 700,
            color: DARK,
          }}>
            Checkout
          </h1>
          <div style={{ width: '40px', height: '3px', background: RED, marginTop: '14px', borderRadius: '2px' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>
          {/* LEFT: Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              background: WHITE,
              border: '1px solid #FEE2E2',
              borderRadius: '16px',
              padding: '36px',
              boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
            }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.6rem',
                fontWeight: 700,
                color: DARK,
                marginBottom: '28px',
              }}>
                Delivery Information
              </h2>

              {savedAddresses.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <button type="button" onClick={() => setShowSaved(s => !s)} style={{
                    background: RED_BG,
                    border: `2px solid ${RED_DIM}`,
                    color: RED,
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    padding: '10px 20px',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    transition: 'all 0.2s',
                  }}>
                    📍 {showSaved ? 'Hide' : 'Show'} saved addresses ({savedAddresses.length})
                  </button>
                  {showSaved && (
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {savedAddresses.map(addr => (
                        <div key={addr.id} style={{
                          background: RED_BG,
                          border: `1px solid ${RED_DIM}`,
                          borderRadius: '12px',
                          padding: '14px 18px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                          <div>
                            <p style={{ fontWeight: 700, color: DARK, fontSize: '0.88rem' }}>{addr.label}</p>
                            <p style={{ fontSize: '0.78rem', color: MUTED }}>
                              {addr.building}, {addr.address}, {addr.city}
                            </p>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="button" onClick={() => loadAddress(addr)} style={{
                              background: 'none', border: 'none', color: RED, fontSize: '0.78rem', cursor: 'pointer', fontWeight: 700,
                            }}>Use</button>
                            <button type="button" onClick={() => deleteAddress(addr.id)} style={{
                              background: 'none', border: 'none', color: MUTED, fontSize: '0.78rem', cursor: 'pointer',
                            }}>✕</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Field label="Full Name" required>
                  <input name="name" value={formData.name} onChange={handleInput} placeholder="John Smith" required
                    style={inputStyle()}
                    onFocus={e => e.target.style.borderColor = RED}
                    onBlur={e => e.target.style.borderColor = RED_DIM} />
                </Field>

                <Field label="Email" required>
                  <input name="email" type="email" value={formData.email} onChange={handleInput} placeholder="you@example.com" required
                    style={inputStyle()}
                    onFocus={e => e.target.style.borderColor = RED}
                    onBlur={e => e.target.style.borderColor = RED_DIM} />
                </Field>

                <PhoneInput
                  countryDial={countryDial}
                  phoneNumber={phoneNumber}
                  onCountryChange={setCountryDial}
                  onPhoneChange={v => { setPhoneNumber(v); setPhoneError(''); }}
                  error={phoneError}
                />

                <Autocomplete
                  label="City"
                  value={formData.city}
                  onChange={v => setFormData(f => ({ ...f, city: v }))}
                  suggestions={CANADA_CITIES}
                  placeholder="Vancouver, Toronto…"
                  required
                />

                <Autocomplete
                  label="Street / Area"
                  value={formData.address}
                  onChange={v => setFormData(f => ({ ...f, address: v }))}
                  suggestions={CANADA_AREAS}
                  placeholder="Downtown, Yaletown…"
                  required
                />

                <Field label="Building / Villa Name" required>
                  <input name="building" value={formData.building} onChange={handleInput} placeholder="Building name" required
                    style={inputStyle()}
                    onFocus={e => e.target.style.borderColor = RED}
                    onBlur={e => e.target.style.borderColor = RED_DIM} />
                </Field>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                  {([['Apartment', 'apartment'], ['Floor', 'floor'], ['Entrance', 'entrance']] as const).map(([lbl, nm]) => (
                    <Field key={nm} label={lbl}>
                      <input name={nm} value={(formData as any)[nm]} onChange={handleInput}
                        style={inputStyle()}
                        onFocus={e => e.target.style.borderColor = RED}
                        onBlur={e => e.target.style.borderColor = RED_DIM} />
                    </Field>
                  ))}
                </div>

                <Field label="Landmark (optional)">
                  <input name="landmark" value={formData.landmark} onChange={handleInput} placeholder="Near Metro, Behind Mall…"
                    style={inputStyle()}
                    onFocus={e => e.target.style.borderColor = RED}
                    onBlur={e => e.target.style.borderColor = RED_DIM} />
                </Field>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <input value={addressName} onChange={e => setAddressName(e.target.value)} placeholder="Save as: Home / Work"
                    style={{ ...inputStyle(), flex: 1 }}
                    onFocus={e => e.target.style.borderColor = RED}
                    onBlur={e => e.target.style.borderColor = RED_DIM} />
                  <button type="button" onClick={saveAddress} style={{
                    padding: '0 22px',
                    background: 'transparent',
                    border: `2px solid ${RED_DIM}`,
                    color: RED,
                    borderRadius: '50px',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                  }}>
                    💾 Save
                  </button>
                </div>

                <Field label="Special Instructions">
                  <textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleInput} rows={3}
                    placeholder="Ring the bell, leave with security…"
                    style={{ ...inputStyle(), resize: 'none' }}
                    onFocus={e => e.target.style.borderColor = RED}
                    onBlur={e => e.target.style.borderColor = RED_DIM} />
                </Field>
              </div>
            </div>
          </div>

          {/* RIGHT: Summary */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div style={{
              background: WHITE,
              border: '1px solid #FEE2E2',
              borderRadius: '16px',
              padding: '36px',
              boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
            }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.6rem',
                fontWeight: 700,
                color: DARK,
                marginBottom: '24px',
              }}>
                Order Summary
              </h2>

              <div style={{
                maxHeight: '220px',
                overflowY: 'auto',
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}>
                {state.items.map(item => (
                  <div key={item.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.84rem',
                    paddingBottom: '10px',
                    borderBottom: '1px solid #FEE2E2',
                  }}>
                    <span style={{ color: MUTED }}>{item.quantity}× {item.name}</span>
                    <span style={{ color: DARK, fontWeight: 600 }}>
                      {(item.price * item.quantity).toFixed(0)} CAD
                    </span>
                  </div>
                ))}
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                borderTop: `2px solid ${RED_DIM}`,
                paddingTop: '16px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem' }}>
                  <span style={{ color: MUTED }}>Subtotal</span>
                  <span style={{ color: DARK }}>{subtotal.toFixed(0)} CAD</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem' }}>
                  <span style={{ color: MUTED }}>Delivery</span>
                  <span style={{ color: delivery === 0 ? '#059669' : DARK }}>
                    {delivery === 0 ? 'Free 🎉' : `${delivery} CAD`}
                  </span>
                </div>

                {state.discountPercent > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem' }}>
                    <span style={{ color: '#059669' }}>Promo ({state.discountPercent}%)</span>
                    <span style={{ color: '#059669' }}>−{promoDisc.toFixed(0)} CAD</span>
                  </div>
                )}

                {points > 0 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.86rem',
                    alignItems: 'center',
                  }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      color: '#D97706',
                    }}>
                      <input type="checkbox" checked={usePoints} onChange={e => setUsePoints(e.target.checked)}
                        style={{
                          accentColor: RED,
                          width: '18px',
                          height: '18px',
                        }} />
                      Use {points} pts
                    </label>
                    <span style={{ color: '#D97706' }}>
                      {usePoints ? `−${pointsDiscount.toFixed(0)} CAD` : '—'}
                    </span>
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '14px',
                  borderTop: `2px solid ${RED_DIM}`,
                  marginTop: '4px',
                }}>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: DARK,
                  }}>Total</span>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: RED,
                  }}>{finalTotal.toFixed(0)} CAD</span>
                </div>
              </div>

              <button onClick={handleProceed} style={{
                marginTop: '24px',
                width: '100%',
                padding: '16px',
                background: RED,
                border: 'none',
                color: '#fff',
                borderRadius: '50px',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: '0.8rem',
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 20px rgba(220,38,38,0.3)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = '#EF4444';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(220,38,38,0.4)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = RED;
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(220,38,38,0.3)';
              }}>
                Proceed to Payment · {finalTotal.toFixed(0)} CAD
              </button>

              <div style={{ marginTop: '18px', textAlign: 'center' }}>
                <p style={{
                  fontSize: '0.75rem',
                  color: MUTED,
                  fontFamily: "'DM Sans', sans-serif",
                  marginBottom: '10px',
                }}>
                  🚗 30–45 min delivery · ⭐ Premium Quality
                </p>
                <Link to="/menu" style={{
                  fontSize: '0.78rem',
                  color: RED,
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;