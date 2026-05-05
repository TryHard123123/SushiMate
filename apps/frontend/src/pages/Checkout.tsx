import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useLoyalty } from '../context/LoyaltyContext';
import { Link } from 'react-router-dom';

const DELIVERY_FEE = 9;
const FREE_THRESHOLD = 75;

const CANADA_CITIES = [
  'Vancouver', 'Toronto', 'Montreal', 'Calgary', 'Edmonton',
  'Ottawa', 'Winnipeg', 'Quebec City', 'Halifax', 'Victoria',
];

const CANADA_AREAS = [
  'Downtown', 'Yaletown', 'Gastown', 'Kitsilano', 'Mount Pleasant',
  'West End', 'Old Montreal', 'Plateau Mont-Royal', 'Downtown Toronto',
  'Queen West', 'Distillery District', 'King Street West', 'Yorkville',
  'The Beaches', 'Kensington Market', 'ByWard Market',
];

const COUNTRIES = [
  { dial: '+1', flag: '🇨🇦', name: 'Canada', minLen: 10, maxLen: 10 },
  { dial: '+1', flag: '🇺🇸', name: 'USA', minLen: 10, maxLen: 10 },
  { dial: '+44', flag: '🇬🇧', name: 'UK', minLen: 10, maxLen: 10 },
  { dial: '+971', flag: '🇦🇪', name: 'UAE', minLen: 9, maxLen: 9 },
  { dial: '+91', flag: '🇮🇳', name: 'India', minLen: 10, maxLen: 10 },
  { dial: '+7', flag: '🇷🇺', name: 'Russia', minLen: 10, maxLen: 10 },
  { dial: '+49', flag: '🇩🇪', name: 'Germany', minLen: 9, maxLen: 11 },
  { dial: '+33', flag: '🇫🇷', name: 'France', minLen: 9, maxLen: 9 },
  { dial: '+39', flag: '🇮🇹', name: 'Italy', minLen: 9, maxLen: 10 },
  { dial: '+86', flag: '🇨🇳', name: 'China', minLen: 11, maxLen: 11 },
];

const RED = '#DC2626';
const RED_DIM = '#FCA5A5';
const RED_BG = '#FEF2F2';
const DARK = '#111827';
const MUTED = '#6B7280';
const WHITE = '#FFFFFF';

// ─── Autocomplete ──────────────────────────────────────────────────────────
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
        display: 'block', fontSize: '0.78rem', fontWeight: 700,
        fontFamily: "'DM Sans', sans-serif", letterSpacing: '1px',
        color: MUTED, marginBottom: '8px',
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
          width: '100%', padding: '14px 18px',
          background: WHITE, border: `2px solid ${RED_DIM}`,
          color: DARK, borderRadius: '12px',
          fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif",
          outline: 'none', transition: 'all 0.2s',
        }}
        onFocusCapture={e => { e.currentTarget.style.borderColor = RED; }}
        onBlur={e => { e.currentTarget.style.borderColor = RED_DIM; }}
      />
      {open && list.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
          background: WHITE, border: `2px solid ${RED_DIM}`, borderTop: 'none',
          borderRadius: '0 0 12px 12px', maxHeight: '200px', overflowY: 'auto',
          boxShadow: '0 8px 24px rgba(220,38,38,0.1)',
        }}>
          {list.map(item => (
            <div key={item} onMouseDown={() => { onChange(item); setOpen(false); }}
              style={{
                padding: '12px 18px', fontSize: '0.88rem', color: DARK,
                cursor: 'pointer', borderBottom: '1px solid #FEE2E2',
                fontFamily: "'DM Sans', sans-serif", transition: 'background 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = RED_BG; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── PhoneInput ───────────────────────────────────────────────────────────
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
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button type="button" onClick={() => setOpen(o => !o)} style={{
            height: '48px', padding: '0 14px',
            background: WHITE, border: `2px solid ${RED_DIM}`,
            color: DARK, borderRadius: '12px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '0.88rem', fontFamily: "'DM Sans', sans-serif",
            whiteSpace: 'nowrap',
          }}>
            <span>{selected.flag}</span>
            <span style={{ color: RED, fontWeight: 700 }}>{selected.dial}</span>
            <span style={{ color: MUTED, fontSize: '0.7rem' }}>▾</span>
          </button>
          {open && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, zIndex: 200,
              background: WHITE, border: `2px solid ${RED_DIM}`,
              borderRadius: '0 0 12px 12px', maxHeight: '260px', overflowY: 'auto',
              minWidth: '240px', boxShadow: '0 8px 24px rgba(220,38,38,0.1)',
            }}>
              {COUNTRIES.map(c => (
                <div key={c.dial} onMouseDown={() => { onCountryChange(c.dial); setOpen(false); }}
                  style={{
                    padding: '10px 14px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    fontSize: '0.84rem', color: DARK,
                    fontFamily: "'DM Sans', sans-serif",
                    background: c.dial === countryDial ? RED_BG : 'transparent',
                    borderBottom: '1px solid #FEE2E2',
                  }}>
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
            flex: 1, padding: '14px 18px',
            background: WHITE, border: `2px solid ${error ? RED : RED_DIM}`,
            color: DARK, borderRadius: '12px',
            fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif",
            outline: 'none',
          }}
          onFocus={e => { e.target.style.borderColor = RED; }}
          onBlur={e => { e.target.style.borderColor = error ? RED : RED_DIM; }}
        />
      </div>
      {error && (
        <p style={{ fontSize: '0.75rem', color: RED, marginTop: '6px' }}>
          {error}
        </p>
      )}
    </div>
  );
};

// ─── Field ─────────────────────────────────────────────────────────────────
const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div>
    <label style={{
      display: 'block', fontSize: '0.78rem', fontWeight: 700,
      fontFamily: "'DM Sans', sans-serif", letterSpacing: '1px',
      color: MUTED, marginBottom: '8px',
    }}>
      {label}{required && <span style={{ color: RED, marginLeft: '3px' }}>*</span>}
    </label>
    {children}
  </div>
);

const inputStyle = (): React.CSSProperties => ({
  width: '100%', padding: '14px 18px',
  background: WHITE, border: `2px solid ${RED_DIM}`,
  color: DARK, borderRadius: '12px',
  fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif",
  outline: 'none',
});

// ═══════════════════════════════════════════════════════════════════════════
// CHECKOUT PAGE
// ═══════════════════════════════════════════════════════════════════════════
const Checkout = () => {
  const { state } = useCart();
  const { points } = useLoyalty();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [usePoints, setUsePoints] = useState(false);
  const [pointsDiscount, setPointsDiscount] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    province: '',
    building: '',
    apartment: '',
    postalCode: '',
    specialInstructions: '',
  });

  const [countryDial, setCountryDial] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Загрузка сохранённого адреса
  useEffect(() => {
    const savedStreet = localStorage.getItem('sushimate_delivery_street');
    const savedCity = localStorage.getItem('sushimate_delivery_city');
    
    if (savedStreet) {
      setFormData(prev => ({ ...prev, address: savedStreet }));
    }
    if (savedCity) {
      setFormData(prev => ({ ...prev, city: savedCity }));
    }
    
    // Для обратной совместимости
    const savedAddress = localStorage.getItem('sushimate_delivery_address');
    if (savedAddress && !savedStreet) {
      const parts = savedAddress.split(',');
      if (parts.length >= 3) {
        setFormData(prev => ({ 
          ...prev, 
          address: parts[0].trim(),
          city: parts[1].trim()
        }));
      } else if (parts.length === 2) {
        setFormData(prev => ({ ...prev, city: parts[0].trim() }));
      } else {
        setFormData(prev => ({ ...prev, address: savedAddress }));
      }
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
      setPhoneError(`${country.name} numbers must have ${country.minLen} digits`);
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleProceed = () => {
    if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.building || !formData.postalCode) {
      return alert('Please fill in all required fields: Name, Email, Street, City, Building, Postal Code');
    }
    if (!validatePhone()) return;

    const fullPhone = `${countryDial}${phoneNumber}`;
    const fullAddress = `${formData.building} ${formData.address}${formData.apartment ? ', ' + formData.apartment : ''}, ${formData.city}, ${formData.province}, ${formData.postalCode}`;

    const orderData = {
      customer: { name: formData.name, phone: fullPhone, email: formData.email },
      delivery: { ...formData, phone: fullPhone, fullAddress },
      items: state.items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, total: i.price * i.quantity })),
      subtotal, promoDiscount: promoDisc, promoCode: state.appliedPromo,
      promoDiscountPercent: state.discountPercent,
      pointsDiscount, pointsUsed: pointsDiscount, pointsEarned: Math.floor(finalTotal / 10),
      deliveryFee: delivery, total: finalTotal, usePoints,
    };
    sessionStorage.setItem('pendingOrder', JSON.stringify(orderData));

    const nameParts = formData.name.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || firstName;
    const orderId = `SM-${Date.now()}`;
    const origin = window.location.origin;
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
      billing_address_1: `${formData.building} ${formData.address}`,
      billing_city: formData.city,
      billing_state: formData.province,
      billing_postcode: formData.postalCode,
      billing_country: 'CA',
      billing_email: formData.email,
      billing_phone: fullPhone,
    });

    window.location.href = `https://payments.sushimate.net/connect/form?${params.toString()}`;
  };

  if (state.items.length === 0) {
    return (
      <div style={{
        minHeight: '60vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16, background: '#F9FAFB',
      }}>
        <div style={{ fontSize: '2.5rem' }}>🛒</div>
        <p style={{ color: MUTED, fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
          Your cart is empty
        </p>
        <Link to="/order" style={{
          background: RED, color: '#fff', padding: '14px 36px', borderRadius: '50px',
          fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
          fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none',
        }}>
          Browse Menu
        </Link>
      </div>
    );
  }

  // ═══ МОБИЛЬНАЯ ВЕРСИЯ ═══
  if (isMobile) {
    return (
      <div style={{ background: '#F9FAFB', minHeight: '100vh', padding: '16px 16px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '4px', color: RED, textTransform: 'uppercase', marginBottom: '6px' }}>SushiMate</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 700, color: DARK }}>Checkout</h1>
        </div>

        <div style={{ background: WHITE, border: '1px solid #FEE2E2', borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 700, color: DARK, marginBottom: '14px' }}>Delivery Information</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Field label="Full Name" required>
              <input name="name" value={formData.name} onChange={handleInput} placeholder="John Smith" required style={inputStyle()} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = RED_DIM} />
            </Field>

            <Field label="Email" required>
              <input name="email" type="email" value={formData.email} onChange={handleInput} placeholder="you@example.com" required style={inputStyle()} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = RED_DIM} />
            </Field>

            <Field label="Street Address" required>
              <input name="address" value={formData.address} onChange={handleInput} placeholder="123 King Street West" required style={inputStyle()} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = RED_DIM} />
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="City" required>
                <input name="city" value={formData.city} onChange={handleInput} placeholder="Toronto" required style={inputStyle()} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = RED_DIM} />
              </Field>
              <Field label="Province" required>
                <input name="province" value={formData.province} onChange={handleInput} placeholder="ON" required style={inputStyle()} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = RED_DIM} />
              </Field>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Building / House #" required>
                <input name="building" value={formData.building} onChange={handleInput} placeholder="123" required style={inputStyle()} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = RED_DIM} />
              </Field>
              <Field label="Apartment / Unit">
                <input name="apartment" value={formData.apartment} onChange={handleInput} placeholder="Apt 4B" style={inputStyle()} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = RED_DIM} />
              </Field>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Postal Code" required>
                <input name="postalCode" value={formData.postalCode} onChange={handleInput} placeholder="M5V 2B7" required style={inputStyle()} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = RED_DIM} />
              </Field>
              <Field label="Phone Number" required>
                <PhoneInput countryDial={countryDial} phoneNumber={phoneNumber} onCountryChange={setCountryDial} onPhoneChange={v => { setPhoneNumber(v); setPhoneError(''); }} error={phoneError} />
              </Field>
            </div>

            <Field label="Delivery Instructions">
              <textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleInput} rows={2} placeholder="Buzz code, leave at door..." style={{ ...inputStyle(), resize: 'none' }} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = RED_DIM} />
            </Field>
          </div>
        </div>

        <div style={{ background: WHITE, border: '1px solid #FEE2E2', borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 700, color: DARK, marginBottom: '12px' }}>Order Summary</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
            {state.items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: MUTED }}>{item.quantity}× {item.name}</span>
                <span style={{ color: DARK }}>{(item.price * item.quantity).toFixed(0)} CAD</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: `2px solid ${RED_DIM}`, paddingTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.82rem' }}>
              <span style={{ color: MUTED }}>Subtotal</span>
              <span style={{ color: DARK }}>{subtotal.toFixed(0)} CAD</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.82rem' }}>
              <span style={{ color: MUTED }}>Delivery</span>
              <span style={{ color: delivery === 0 ? '#059669' : DARK }}>{delivery === 0 ? 'Free' : `${delivery} CAD`}</span>
            </div>
            {state.discountPercent > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.82rem' }}>
                <span style={{ color: '#059669' }}>Promo</span>
                <span style={{ color: '#059669' }}>-{promoDisc.toFixed(0)} CAD</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: `2px solid ${RED_DIM}`, marginTop: '4px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: DARK }}>Total</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: RED }}>{finalTotal.toFixed(0)} CAD</span>
            </div>
          </div>
        </div>

        <button onClick={handleProceed} style={{
          width: '100%', padding: '16px', background: RED, color: '#fff', border: 'none',
          borderRadius: '50px', fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
          fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(220,38,38,0.3)',
        }}>
          Proceed to Payment · {finalTotal.toFixed(0)} CAD
        </button>

        <Link to="/order" style={{ display: 'block', textAlign: 'center', color: RED, fontSize: '0.8rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", textDecoration: 'none', marginTop: '14px' }}>
          ← Continue Shopping
        </Link>
      </div>
    );
  }

  // ═══ ДЕСКТОПНАЯ ВЕРСИЯ ═══
  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh', padding: '48px 24px 80px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '4px', color: RED, textTransform: 'uppercase', marginBottom: '8px' }}>SushiMate</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 700, color: DARK }}>Checkout</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '28px', alignItems: 'start' }}>
          <div style={{ background: WHITE, border: '1px solid #FEE2E2', borderRadius: '16px', padding: '36px' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 700, color: DARK, marginBottom: '24px' }}>Delivery Information</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Field label="Full Name" required>
                <input name="name" value={formData.name} onChange={handleInput} placeholder="John Smith" required style={inputStyle()} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = RED_DIM} />
              </Field>

              <Field label="Email" required>
                <input name="email" type="email" value={formData.email} onChange={handleInput} placeholder="you@example.com" required style={inputStyle()} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = RED_DIM} />
              </Field>

              <Field label="Street Address" required>
                <input name="address" value={formData.address} onChange={handleInput} placeholder="123 King Street West" required style={inputStyle()} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = RED_DIM} />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <Field label="City" required>
                  <input name="city" value={formData.city} onChange={handleInput} placeholder="Toronto" required style={inputStyle()} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = RED_DIM} />
                </Field>
                <Field label="Province" required>
                  <input name="province" value={formData.province} onChange={handleInput} placeholder="ON" required style={inputStyle()} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = RED_DIM} />
                </Field>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <Field label="Building / House Number" required>
                  <input name="building" value={formData.building} onChange={handleInput} placeholder="123" required style={inputStyle()} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = RED_DIM} />
                </Field>
                <Field label="Apartment / Unit">
                  <input name="apartment" value={formData.apartment} onChange={handleInput} placeholder="Apt 4B" style={inputStyle()} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = RED_DIM} />
                </Field>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <Field label="Postal Code" required>
                  <input name="postalCode" value={formData.postalCode} onChange={handleInput} placeholder="M5V 2B7" required style={inputStyle()} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = RED_DIM} />
                </Field>
                <Field label="Phone Number" required>
                  <PhoneInput countryDial={countryDial} phoneNumber={phoneNumber} onCountryChange={setCountryDial} onPhoneChange={v => { setPhoneNumber(v); setPhoneError(''); }} error={phoneError} />
                </Field>
              </div>

              <Field label="Delivery Instructions">
                <textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleInput} rows={2} placeholder="Buzz code, leave at door, side entrance..." style={{ ...inputStyle(), resize: 'none' }} onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = RED_DIM} />
              </Field>
            </div>
          </div>

          <div style={{ position: 'sticky', top: '100px' }}>
            <div style={{ background: WHITE, border: '1px solid #FEE2E2', borderRadius: '16px', padding: '28px' }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 700, color: DARK, marginBottom: '18px' }}>Order Summary</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                {state.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: MUTED }}>{item.quantity}× {item.name}</span>
                    <span style={{ color: DARK }}>{(item.price * item.quantity).toFixed(0)} CAD</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: `2px solid ${RED_DIM}`, paddingTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: MUTED }}>Subtotal</span>
                  <span style={{ color: DARK }}>{subtotal.toFixed(0)} CAD</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: MUTED }}>Delivery</span>
                  <span style={{ color: delivery === 0 ? '#059669' : DARK }}>{delivery === 0 ? 'Free' : `${delivery} CAD`}</span>
                </div>
                {state.discountPercent > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#059669' }}>Promo</span>
                    <span style={{ color: '#059669' }}>-{promoDisc.toFixed(0)} CAD</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: `2px solid ${RED_DIM}` }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 700, color: DARK }}>Total</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 700, color: RED }}>{finalTotal.toFixed(0)} CAD</span>
                </div>
              </div>
              <button onClick={handleProceed} style={{
                marginTop: '20px', width: '100%', padding: '14px',
                background: RED, color: '#fff', border: 'none', borderRadius: '50px',
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                fontSize: '0.78rem', letterSpacing: '2px', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: '0 4px 20px rgba(220,38,38,0.3)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#EF4444'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = RED; }}>
                Proceed to Payment · {finalTotal.toFixed(0)} CAD
              </button>
              <Link to="/order" style={{
                display: 'block', textAlign: 'center', color: RED,
                fontSize: '0.78rem', fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif", textDecoration: 'none', marginTop: '12px',
              }}>
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;