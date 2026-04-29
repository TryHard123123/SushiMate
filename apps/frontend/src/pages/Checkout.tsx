import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useLoyalty } from '../context/LoyaltyContext';
import { Link } from 'react-router-dom';

// ─── Delivery ───────────────────────────────────────────────────────────────
const DELIVERY_FEE       = 15;   // AED — avg Dubai sushi delivery
const FREE_THRESHOLD     = 100;  // AED — free above this

// ─── UAE cities ─────────────────────────────────────────────────────────────
const UAE_CITIES = [
  'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah',
  'Fujairah', 'Umm Al Quwain', 'Al Ain', 'Kalba', 'Khor Fakkan',
  'Dibba Al Hisn', 'Dibba Al Fujairah', 'Madinat Zayed', 'Al Dhafra',
  'Ruwais', 'Liwa', 'Ghayathi', 'Delma Island', 'Al Sila', 'Mezyad',
];

// ─── Dubai & UAE areas / streets ────────────────────────────────────────────
const UAE_AREAS = [
  'Downtown Dubai', 'Dubai Marina', 'JBR – Jumeirah Beach Residence',
  'Business Bay', 'DIFC', 'Jumeirah 1', 'Jumeirah 2', 'Jumeirah 3',
  'Al Barsha 1', 'Al Barsha 2', 'Al Barsha 3', 'Deira', 'Bur Dubai',
  'Karama', 'Al Nahda (Dubai)', 'Al Nahda (Sharjah)', 'Discovery Gardens',
  'Sports City', 'Silicon Oasis', 'Al Quoz', 'Motor City', 'Arabian Ranches',
  'Palm Jumeirah', 'The Greens', 'The Views', 'Emirates Hills',
  'JVC – Jumeirah Village Circle', 'JVT – Jumeirah Village Triangle',
  'Mirdif', 'Rashidiya', 'International City', 'Dubailand', 'Al Mamzar',
  'Al Rigga', 'Al Satwa', 'Al Safa', 'Al Sufouh', 'Al Warqa', 'Remraam',
  'Corniche Road (Abu Dhabi)', 'Al Reem Island', 'Khalidiyah', 'Al Mushrif',
  'Khalifa City A', 'Khalifa City B', 'Mohammed Bin Zayed City',
  'Al Raha Beach', 'Yas Island', 'Saadiyat Island', 'Al Reef',
  'Al Shamkha', 'Al Falah', 'Musaffah', 'Tourist Club Area',
  'Al Khalidiyah', 'Al Zahiyah', 'Al Muroor', 'Al Rawdah',
  'Al Majaz (Sharjah)', 'Al Qasimia (Sharjah)', 'Al Taawun (Sharjah)',
  'Al Bustan (Ajman)', 'Al Rashidiya (Ajman)', 'Al Rawda (Ajman)',
];

// ─── Country dial codes ──────────────────────────────────────────────────────
const COUNTRIES = [
  { dial: '+971', flag: '🇦🇪', name: 'UAE',          minLen: 9,  maxLen: 9  },
  { dial: '+91',  flag: '🇮🇳', name: 'India',        minLen: 10, maxLen: 10 },
  { dial: '+92',  flag: '🇵🇰', name: 'Pakistan',     minLen: 10, maxLen: 10 },
  { dial: '+63',  flag: '🇵🇭', name: 'Philippines',  minLen: 10, maxLen: 10 },
  { dial: '+20',  flag: '🇪🇬', name: 'Egypt',        minLen: 10, maxLen: 10 },
  { dial: '+962', flag: '🇯🇴', name: 'Jordan',       minLen: 9,  maxLen: 9  },
  { dial: '+961', flag: '🇱🇧', name: 'Lebanon',      minLen: 8,  maxLen: 8  },
  { dial: '+966', flag: '🇸🇦', name: 'Saudi Arabia', minLen: 9,  maxLen: 9  },
  { dial: '+965', flag: '🇰🇼', name: 'Kuwait',       minLen: 8,  maxLen: 8  },
  { dial: '+973', flag: '🇧🇭', name: 'Bahrain',      minLen: 8,  maxLen: 8  },
  { dial: '+974', flag: '🇶🇦', name: 'Qatar',        minLen: 8,  maxLen: 8  },
  { dial: '+968', flag: '🇴🇲', name: 'Oman',         minLen: 8,  maxLen: 8  },
  { dial: '+44',  flag: '🇬🇧', name: 'UK',           minLen: 10, maxLen: 10 },
  { dial: '+1',   flag: '🇺🇸', name: 'USA / Canada', minLen: 10, maxLen: 10 },
  { dial: '+7',   flag: '🇷🇺', name: 'Russia',       minLen: 10, maxLen: 10 },
  { dial: '+49',  flag: '🇩🇪', name: 'Germany',      minLen: 9,  maxLen: 11 },
  { dial: '+33',  flag: '🇫🇷', name: 'France',       minLen: 9,  maxLen: 9  },
  { dial: '+39',  flag: '🇮🇹', name: 'Italy',        minLen: 9,  maxLen: 10 },
  { dial: '+90',  flag: '🇹🇷', name: 'Turkey',       minLen: 10, maxLen: 10 },
  { dial: '+86',  flag: '🇨🇳', name: 'China',        minLen: 11, maxLen: 11 },
  { dial: '+880', flag: '🇧🇩', name: 'Bangladesh',   minLen: 10, maxLen: 10 },
  { dial: '+94',  flag: '🇱🇰', name: 'Sri Lanka',    minLen: 9,  maxLen: 9  },
  { dial: '+977', flag: '🇳🇵', name: 'Nepal',        minLen: 10, maxLen: 10 },
  { dial: '+251', flag: '🇪🇹', name: 'Ethiopia',     minLen: 9,  maxLen: 9  },
];

// ─── Autocomplete input ──────────────────────────────────────────────────────
interface AutocompleteProps {
  value: string;
  onChange: (v: string) => void;
  suggestions: string[];
  placeholder?: string;
  required?: boolean;
  label: string;
}

const Autocomplete: React.FC<AutocompleteProps> = ({ value, onChange, suggestions, placeholder, required, label }) => {
  const [open, setOpen]   = useState(false);
  const [list, setList]   = useState<string[]>([]);
  const ref               = useRef<HTMLDivElement>(null);

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
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, fontFamily: "'DM Sans', sans-serif", letterSpacing: '1px', color: '#9a7a7a', marginBottom: '6px' }}>
        {label}{required && <span style={{ color: '#D42B2B', marginLeft: '3px' }}>*</span>}
      </label>
      <input
        value={value}
        onChange={e => handleChange(e.target.value)}
        onFocus={() => { if (value.length >= 1) setOpen(true); }}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        style={{
          width: '100%', padding: '11px 14px',
          background: '#130000', border: '1px solid #3d0808',
          color: '#F5ECEC', borderRadius: '2px',
          fontSize: '0.88rem', fontFamily: "'DM Sans', sans-serif",
          outline: 'none', transition: 'border-color 0.2s',
        }}
        onFocusCapture={e => { e.currentTarget.style.borderColor = '#D42B2B'; }}
        onBlur={e => { e.currentTarget.style.borderColor = '#3d0808'; }}
      />
      {open && list.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
          background: '#1c0303', border: '1px solid #3d0808', borderTop: 'none',
          borderRadius: '0 0 2px 2px', maxHeight: '200px', overflowY: 'auto',
        }}>
          {list.map(item => (
            <div
              key={item}
              onMouseDown={() => { onChange(item); setOpen(false); }}
              style={{
                padding: '9px 14px', fontSize: '0.86rem',
                color: '#F5ECEC', cursor: 'pointer',
                borderBottom: '1px solid #2a0505',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#3d0808'; }}
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

// ─── Phone input with country selector ───────────────────────────────────────
interface PhoneInputProps {
  countryDial: string;
  phoneNumber: string;
  onCountryChange: (dial: string) => void;
  onPhoneChange: (v: string) => void;
  error?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ countryDial, phoneNumber, onCountryChange, onPhoneChange, error }) => {
  const [open, setOpen]   = useState(false);
  const ref               = useRef<HTMLDivElement>(null);
  const selected          = COUNTRIES.find(c => c.dial === countryDial) ?? COUNTRIES[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref}>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, fontFamily: "'DM Sans', sans-serif", letterSpacing: '1px', color: '#9a7a7a', marginBottom: '6px' }}>
        Phone Number <span style={{ color: '#D42B2B' }}>*</span>
      </label>
      <div style={{ display: 'flex', gap: '8px' }}>
        {/* Country selector */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            style={{
              height: '42px', padding: '0 10px',
              background: '#130000', border: '1px solid #3d0808',
              color: '#F5ECEC', borderRadius: '2px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '0.85rem', fontFamily: "'DM Sans', sans-serif",
              whiteSpace: 'nowrap',
            }}
          >
            <span>{selected.flag}</span>
            <span style={{ color: '#D42B2B', fontWeight: 700 }}>{selected.dial}</span>
            <span style={{ color: '#9a7a7a', fontSize: '0.7rem' }}>▾</span>
          </button>
          {open && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, zIndex: 200,
              background: '#1c0303', border: '1px solid #3d0808',
              borderRadius: '0 0 2px 2px', maxHeight: '260px', overflowY: 'auto',
              minWidth: '220px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            }}>
              {COUNTRIES.map(c => (
                <div
                  key={c.dial}
                  onMouseDown={() => { onCountryChange(c.dial); setOpen(false); }}
                  style={{
                    padding: '8px 12px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    fontSize: '0.82rem', color: '#F5ECEC',
                    fontFamily: "'DM Sans', sans-serif",
                    background: c.dial === countryDial ? '#3d0808' : 'transparent',
                    transition: 'background 0.15s',
                    borderBottom: '1px solid #2a0505',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#3d0808'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = c.dial === countryDial ? '#3d0808' : 'transparent'; }}
                >
                  <span style={{ fontSize: '1rem' }}>{c.flag}</span>
                  <span style={{ color: '#D42B2B', fontWeight: 700, minWidth: '44px' }}>{c.dial}</span>
                  <span style={{ color: '#9a7a7a' }}>{c.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Phone number */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={e => onPhoneChange(e.target.value.replace(/\D/g, ''))}
          placeholder={`${selected.minLen} digits`}
          maxLength={selected.maxLen}
          style={{
            flex: 1, padding: '11px 14px',
            background: '#130000',
            border: `1px solid ${error ? '#D42B2B' : '#3d0808'}`,
            color: '#F5ECEC', borderRadius: '2px',
            fontSize: '0.88rem', fontFamily: "'DM Sans', sans-serif",
            outline: 'none',
          }}
          onFocus={e => { e.target.style.borderColor = '#D42B2B'; }}
          onBlur={e => { e.target.style.borderColor = error ? '#D42B2B' : '#3d0808'; }}
        />
      </div>
      {error && (
        <p style={{ fontSize: '0.72rem', color: '#D42B2B', marginTop: '5px', fontFamily: "'DM Sans', sans-serif" }}>
          {error}
        </p>
      )}
      <p style={{ fontSize: '0.68rem', color: '#5a2a2a', marginTop: '4px', fontFamily: "'DM Sans', sans-serif" }}>
        Enter number without country code · digits only
      </p>
    </div>
  );
};

// ─── Form field ───────────────────────────────────────────────────────────────
const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div>
    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, fontFamily: "'DM Sans', sans-serif", letterSpacing: '1px', color: '#9a7a7a', marginBottom: '6px' }}>
      {label}{required && <span style={{ color: '#D42B2B', marginLeft: '3px' }}>*</span>}
    </label>
    {children}
  </div>
);

const inputStyle = (hasError = false): React.CSSProperties => ({
  width: '100%', padding: '11px 14px',
  background: '#130000',
  border: `1px solid ${hasError ? '#D42B2B' : '#3d0808'}`,
  color: '#F5ECEC', borderRadius: '2px',
  fontSize: '0.88rem', fontFamily: "'DM Sans', sans-serif",
  outline: 'none',
});

// ═══════════════════════════════════════════════════════════════════════════
// CHECKOUT PAGE
// ═══════════════════════════════════════════════════════════════════════════
const Checkout = () => {
  const { state } = useCart();
  const { points } = useLoyalty();

  const [usePoints,     setUsePoints]     = useState(false);
  const [pointsDiscount, setPointsDiscount] = useState(0);

  const [formData, setFormData] = useState({
    name:               '',
    email:              '',
    address:            '',
    city:               '',
    building:           '',
    apartment:          '',
    entrance:           '',
    floor:              '',
    landmark:           '',
    specialInstructions:'',
  });

  const [countryDial, setCountryDial] = useState('+971');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError,  setPhoneError]  = useState('');

  const [savedAddresses,    setSavedAddresses]    = useState<any[]>([]);
  const [showSaved,         setShowSaved]         = useState(false);
  const [addressName,       setAddressName]       = useState('');

  // Load saved addresses
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

  // ── Totals ─────────────────────────────────────────────────────────────
  const subtotal    = state.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const promoDisc   = subtotal * (state.discountPercent / 100) || 0;
  const delivery    = subtotal >= FREE_THRESHOLD ? 0 : DELIVERY_FEE;

  useEffect(() => {
    setPointsDiscount(usePoints ? Math.min(points, subtotal) : 0);
  }, [usePoints, points, subtotal]);

  const finalTotal  = Math.max(0, subtotal - promoDisc - pointsDiscount + delivery);

  // ── Input handlers ─────────────────────────────────────────────────────
  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const validatePhone = (): boolean => {
    const country = COUNTRIES.find(c => c.dial === countryDial) ?? COUNTRIES[0];
    const digits  = phoneNumber.replace(/\D/g, '');
    if (digits.length < country.minLen || digits.length > country.maxLen) {
      setPhoneError(`${country.name} numbers must have ${country.minLen === country.maxLen ? country.minLen : `${country.minLen}–${country.maxLen}`} digits`);
      return false;
    }
    // UAE: must start with 5
    if (countryDial === '+971' && !digits.startsWith('5')) {
      setPhoneError('UAE mobile numbers must start with 5 (e.g. 50, 52, 54, 55, 56, 58)');
      return false;
    }
    setPhoneError('');
    return true;
  };

  // ── Saved addresses ────────────────────────────────────────────────────
  const saveAddress = () => {
    if (!addressName.trim()) return alert('Enter a name for this address (e.g. Home)');
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

  // ── Submit ─────────────────────────────────────────────────────────────
  const handleProceed = () => {
    if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.building) {
      return alert('Please fill in all required fields (Name, Email, Street, City, Building)');
    }
    if (!validatePhone()) return;

    const fullPhone   = `${countryDial} ${phoneNumber}`;
    const fullAddress = `${formData.building}, ${formData.address}, ${formData.city}${formData.apartment ? `, Apt ${formData.apartment}` : ''}${formData.floor ? `, Floor ${formData.floor}` : ''}`;

    // Save for back-redirect
    const orderData = {
      customer: { name: formData.name, phone: fullPhone, email: formData.email },
      delivery:  { ...formData, phone: fullPhone, fullAddress, specialInstructions: formData.specialInstructions },
      items:      state.items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, total: i.price * i.quantity })),
      subtotal, promoDiscount: promoDisc, promoCode: state.appliedPromo,
      promoDiscountPercent: state.discountPercent,
      pointsDiscount, pointsUsed: pointsDiscount, pointsEarned: Math.floor(finalTotal / 10),
      deliveryFee: delivery, total: finalTotal, usePoints,
    };
    sessionStorage.setItem('pendingOrder', JSON.stringify(orderData));
    localStorage.setItem('sushimate_last_address', JSON.stringify({ ...formData, countryDial, phoneNumber }));

    // ── Payment gateway redirect ─────────────────────────────────────
    const ICON_URL  = 'https://sushimate.net/logo.png';
    const IMAGE_URL = 'https://sushimate.net/logo.png';
    const nameParts = formData.name.trim().split(/\s+/);
    const firstName = nameParts[0] ?? '';
    const lastName  = nameParts.slice(1).join(' ') || firstName;
    const orderId   = `SM-${Date.now()}`;
    const origin    = window.location.origin;

    const params = new URLSearchParams({
      site:               'SushiMate',
      icon:               ICON_URL,
      image:              IMAGE_URL,
      amount:             finalTotal.toFixed(2),
      symbol:             'AED',
      vat:                '5',
      riderect_success:   `${origin}/order/success`,
      riderect_failed:    `${origin}/order/failed`,
      riderect_back:      origin,
      order_id:           orderId,
      billing_first_name: firstName,
      billing_last_name:  lastName,
      billing_address_1:  `${formData.building}, ${formData.address}`,
      billing_city:       formData.city,
      billing_state:      '',
      billing_postcode:   '00000',
      billing_country:    'AE',
      billing_email:      formData.email,
      billing_phone:      fullPhone,
    });

    window.location.href = `https://payments.sushimate.net/connect/form?${params.toString()}`;
  };

  // ── Empty cart ─────────────────────────────────────────────────────────
  if (state.items.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: '#0a0000' }}>
        <div style={{ fontSize: '2.5rem' }}>🛒</div>
        <p style={{ color: '#9a7a7a', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>Your cart is empty</p>
        <Link to="/menu" style={{ background: '#D42B2B', color: '#fff', padding: '11px 32px', borderRadius: '2px', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.78rem', letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none' }}>
          Browse Menu
        </Link>
      </div>
    );
  }

  const card: React.CSSProperties = {
    background: '#160202', border: '1px solid #3d0808', borderRadius: '3px', padding: '32px',
  };
  const RED   = '#D42B2B';
  const MUTED = '#9a7a7a';
  const WHITE = '#F5ECEC';

  return (
    <div style={{ background: '#0a0000', minHeight: '100vh', padding: '48px 24px 80px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Title */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', letterSpacing: '5px', color: RED, textTransform: 'uppercase', marginBottom: '8px' }}>
            SushiMate
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.6rem', fontWeight: 700, color: WHITE }}>
            Checkout
          </h1>
          <div style={{ width: '40px', height: '2px', background: RED, marginTop: '12px' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '28px', alignItems: 'start' }}>

          {/* ── LEFT: Form ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={card}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: WHITE, marginBottom: '24px' }}>
                Delivery Information
              </h2>

              {/* Saved addresses */}
              {savedAddresses.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <button type="button" onClick={() => setShowSaved(s => !s)}
                    style={{ background: 'transparent', border: `1px solid #3d0808`, color: RED, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', padding: '7px 14px', borderRadius: '2px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                    📍 {showSaved ? 'Hide' : 'Show'} saved addresses ({savedAddresses.length})
                  </button>
                  {showSaved && (
                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {savedAddresses.map(addr => (
                        <div key={addr.id} style={{ background: '#1c0303', border: '1px solid #3d0808', borderRadius: '2px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <p style={{ fontWeight: 700, color: WHITE, fontSize: '0.85rem' }}>{addr.label}</p>
                            <p style={{ fontSize: '0.76rem', color: MUTED }}>{addr.building}, {addr.address}, {addr.city}</p>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="button" onClick={() => loadAddress(addr)} style={{ background: 'none', border: 'none', color: RED, fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 }}>Use</button>
                            <button type="button" onClick={() => deleteAddress(addr.id)} style={{ background: 'none', border: 'none', color: '#5a2a2a', fontSize: '0.75rem', cursor: 'pointer' }}>✕</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                {/* Full name */}
                <Field label="Full Name" required>
                  <input name="name" value={formData.name} onChange={handleInput} placeholder="John Smith" required style={inputStyle()} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = '#3d0808'} />
                </Field>

                {/* Email */}
                <Field label="Email" required>
                  <input name="email" type="email" value={formData.email} onChange={handleInput} placeholder="you@example.com" required style={inputStyle()} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = '#3d0808'} />
                </Field>

                {/* Phone */}
                <PhoneInput
                  countryDial={countryDial}
                  phoneNumber={phoneNumber}
                  onCountryChange={setCountryDial}
                  onPhoneChange={v => { setPhoneNumber(v); setPhoneError(''); }}
                  error={phoneError}
                />

                {/* City autocomplete */}
                <Autocomplete
                  label="City"
                  value={formData.city}
                  onChange={v => setFormData(f => ({ ...f, city: v }))}
                  suggestions={UAE_CITIES}
                  placeholder="Dubai, Abu Dhabi…"
                  required
                />

                {/* Street autocomplete */}
                <Autocomplete
                  label="Street / Area"
                  value={formData.address}
                  onChange={v => setFormData(f => ({ ...f, address: v }))}
                  suggestions={UAE_AREAS}
                  placeholder="Downtown Dubai, JBR…"
                  required
                />

                {/* Building */}
                <Field label="Building / Villa Name" required>
                  <input name="building" value={formData.building} onChange={handleInput} placeholder="Building name or villa number" required style={inputStyle()} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = '#3d0808'} />
                </Field>

                {/* Apt / Floor / Entrance */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  {([['Apartment', 'apartment'], ['Floor', 'floor'], ['Entrance', 'entrance']] as const).map(([lbl, nm]) => (
                    <Field key={nm} label={lbl}>
                      <input name={nm} value={(formData as any)[nm]} onChange={handleInput} style={inputStyle()} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = '#3d0808'} />
                    </Field>
                  ))}
                </div>

                {/* Landmark */}
                <Field label="Landmark (optional)">
                  <input name="landmark" value={formData.landmark} onChange={handleInput} placeholder="Near Metro, Behind Mall…" style={inputStyle()} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = '#3d0808'} />
                </Field>

                {/* Save address */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input value={addressName} onChange={e => setAddressName(e.target.value)} placeholder="Save as: Home / Work" style={{ ...inputStyle(), flex: 1 }} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = '#3d0808'} />
                  <button type="button" onClick={saveAddress}
                    style={{ padding: '0 18px', background: 'transparent', border: '1px solid #3d0808', color: MUTED, borderRadius: '2px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}>
                    💾 Save
                  </button>
                </div>

                {/* Special instructions */}
                <Field label="Special Instructions">
                  <textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleInput} rows={3} placeholder="Ring the bell, leave with security…" style={{ ...inputStyle(), resize: 'none' }} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = '#3d0808'} />
                </Field>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Summary ── */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div style={card}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: WHITE, marginBottom: '20px' }}>
                Order Summary
              </h2>

              {/* Items */}
              <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {state.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', paddingBottom: '8px', borderBottom: '1px solid #2a0505' }}>
                    <span style={{ color: MUTED }}>{item.quantity}× {item.name}</span>
                    <span style={{ color: WHITE }}>{(item.price * item.quantity).toFixed(0)} AED</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #3d0808', paddingTop: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                  <span style={{ color: MUTED }}>Subtotal</span>
                  <span style={{ color: WHITE }}>{subtotal.toFixed(0)} AED</span>
                </div>

                {/* Delivery */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                  <span style={{ color: MUTED }}>Delivery</span>
                  <span style={{ color: delivery === 0 ? '#4caf50' : WHITE }}>
                    {delivery === 0 ? 'Free 🎉' : `${delivery} AED`}
                  </span>
                </div>
                {delivery > 0 && (
                  <p style={{ fontSize: '0.7rem', color: '#5a2a2a', fontFamily: "'DM Sans', sans-serif" }}>
                    Add {(FREE_THRESHOLD - subtotal).toFixed(0)} AED more for free delivery
                  </p>
                )}

                {state.discountPercent > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                    <span style={{ color: '#4caf50' }}>Promo ({state.discountPercent}%)</span>
                    <span style={{ color: '#4caf50' }}>−{promoDisc.toFixed(0)} AED</span>
                  </div>
                )}

                {points > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#C8A04A' }}>
                      <input type="checkbox" checked={usePoints} onChange={e => setUsePoints(e.target.checked)}
                        style={{ accentColor: RED, width: '14px', height: '14px' }} />
                      Use {points} pts
                    </label>
                    <span style={{ color: '#C8A04A' }}>{usePoints ? `−${pointsDiscount.toFixed(0)} AED` : '—'}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #3d0808' }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 700, color: WHITE }}>Total</span>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 700, color: RED }}>{finalTotal.toFixed(0)} AED</span>
                </div>
              </div>

              {/* CTA */}
              <button onClick={handleProceed} style={{
                marginTop: '20px', width: '100%', padding: '14px',
                background: RED, border: 'none', color: '#fff', borderRadius: '2px',
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.78rem',
                letterSpacing: '2.5px', textTransform: 'uppercase', cursor: 'pointer',
                transition: 'background 0.18s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FF3A3A'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = RED; }}
              >
                Proceed to Payment · {finalTotal.toFixed(0)} AED
              </button>

              <div style={{ marginTop: '14px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.72rem', color: '#5a2a2a', fontFamily: "'DM Sans', sans-serif", marginBottom: '8px' }}>
                  🚗 30–45 min delivery · ✅ Halal certified
                </p>
                <Link to="/menu" style={{ fontSize: '0.72rem', color: MUTED, textDecoration: 'none' }}>
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
