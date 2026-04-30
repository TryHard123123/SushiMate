import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (method: 'delivery' | 'pickup', address?: string) => void;
}

const RED = '#DC2626';
const RED_DIM = '#FCA5A5';
const RED_BG = '#FEF2F2';
const DARK = '#111827';
const MUTED = '#6B7280';
const WHITE = '#FFFFFF';

// Адреса ресторанов для самовывоза
const RESTAURANT_LOCATIONS = [
  { 
    city: 'Vancouver', 
    address: '1234 Robson Street, Vancouver, BC V6E 1C7',
    hours: 'Daily 10:00 – 23:00',
  },
  { 
    city: 'Toronto', 
    address: '567 Queen Street West, Toronto, ON M5V 2B7',
    hours: 'Daily 10:00 – 23:00',
  },
  { 
    city: 'Montreal', 
    address: '890 Saint-Catherine St W, Montreal, QC H3B 1E3',
    hours: 'Daily 10:00 – 23:00',
  },
  { 
    city: 'Calgary', 
    address: '345 17th Ave SW, Calgary, AB T2S 0A5',
    hours: 'Daily 10:00 – 23:00',
  },
  { 
    city: 'Ottawa', 
    address: '678 Rideau Street, Ottawa, ON K1N 5Y8',
    hours: 'Daily 10:00 – 23:00',
  },
];

// База улиц и адресов для автодополнения
const STREETS_DATABASE = [
  // Vancouver
  '1234 Robson Street, Vancouver, BC',
  '567 Granville Street, Vancouver, BC',
  '890 Burrard Street, Vancouver, BC',
  '234 Davie Street, Vancouver, BC',
  '456 Denman Street, Vancouver, BC',
  '789 Main Street, Vancouver, BC',
  '321 Broadway, Vancouver, BC',
  '654 Commercial Drive, Vancouver, BC',
  '987 West 4th Avenue, Vancouver, BC',
  '111 Yaletown, Vancouver, BC',
  '222 Gastown, Vancouver, BC',
  '333 Kitsilano, Vancouver, BC',
  '444 West End, Vancouver, BC',
  '555 Mount Pleasant, Vancouver, BC',
  '666 Kensington-Cedar Cottage, Vancouver, BC',
  '777 Granville Island, Vancouver, BC',
  
  // Toronto
  '567 Queen Street West, Toronto, ON',
  '123 King Street West, Toronto, ON',
  '456 Yonge Street, Toronto, ON',
  '789 Bloor Street West, Toronto, ON',
  '234 College Street, Toronto, ON',
  '567 Dundas Street West, Toronto, ON',
  '890 Front Street West, Toronto, ON',
  '321 Spadina Avenue, Toronto, ON',
  '654 Bathurst Street, Toronto, ON',
  '987 Kensington Market, Toronto, ON',
  '111 Distillery District, Toronto, ON',
  '222 Yorkville, Toronto, ON',
  '333 The Beaches, Toronto, ON',
  '444 Downtown Toronto, Toronto, ON',
  
  // Montreal
  '890 Saint-Catherine St W, Montreal, QC',
  '123 Saint-Laurent Boulevard, Montreal, QC',
  '456 Sherbrooke Street, Montreal, QC',
  '789 Saint-Denis Street, Montreal, QC',
  '234 Mont-Royal Avenue, Montreal, QC',
  '567 Old Montreal, Montreal, QC',
  '890 Plateau Mont-Royal, Montreal, QC',
  '321 Westmount, Montreal, QC',
  
  // Calgary
  '345 17th Ave SW, Calgary, AB',
  '123 Stephen Avenue, Calgary, AB',
  '456 Kensington Road, Calgary, AB',
  '789 Downtown Calgary, Calgary, AB',
  
  // Ottawa
  '678 Rideau Street, Ottawa, ON',
  '123 Bank Street, Ottawa, ON',
  '456 ByWard Market, Ottawa, ON',
  '789 Westboro, Ottawa, ON',
  '234 Kanata, Ottawa, ON',
  
  // Edmonton
  '123 Whyte Avenue, Edmonton, AB',
  '456 Jasper Avenue, Edmonton, AB',
  '789 Downtown Edmonton, Edmonton, AB',
  
  // Winnipeg
  '123 Portage Avenue, Winnipeg, MB',
  '456 Osborne Street, Winnipeg, MB',
  
  // Quebec City
  '123 Grande Allée, Quebec City, QC',
  '456 Old Quebec, Quebec City, QC',
  
  // Halifax
  '123 Spring Garden Road, Halifax, NS',
  '456 Waterfront, Halifax, NS',
  
  // Victoria
  '123 Government Street, Victoria, BC',
  '456 Inner Harbour, Victoria, BC',
];

const DeliveryModal: React.FC<DeliveryModalProps> = ({ isOpen, onClose, onSelect }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'choose' | 'delivery' | 'pickup'>('choose');
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('choose');
      setAddress('');
      setShowSuggestions(false);
    }
  }, [isOpen]);

  // Поиск с автодополнением
  const handleAddressChange = (value: string) => {
    setAddress(value);
    if (value.length >= 3) {
      const filtered = STREETS_DATABASE.filter(street =>
        street.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectAddress = (addr: string) => {
    setAddress(addr);
    setShowSuggestions(false);
  };

  // Подтверждение доставки
  const handleDeliveryConfirm = () => {
    if (address.trim().length >= 5) {
      onSelect('delivery', address);
      navigate('/order');
    }
  };

  // Выбор самовывоза
  const handlePickupSelect = (location: typeof RESTAURANT_LOCATIONS[0]) => {
    onSelect('pickup', location.address);
    navigate('/order');
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: WHITE,
          borderRadius: '24px',
          width: '100%',
          maxWidth: '700px',
          maxHeight: '85vh',
          overflow: 'auto',
          boxShadow: '0 30px 80px rgba(220,38,38,0.25)',
          position: 'relative',
        }}>
        
        {/* Кнопка закрытия */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '20px', right: '20px', zIndex: 10,
          width: '40px', height: '40px',
          background: WHITE, border: '2px solid #FEE2E2', color: MUTED,
          fontSize: '1.1rem', cursor: 'pointer', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = RED;
          (e.currentTarget as HTMLElement).style.color = '#fff';
          (e.currentTarget as HTMLElement).style.borderColor = RED;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = WHITE;
          (e.currentTarget as HTMLElement).style.color = MUTED;
          (e.currentTarget as HTMLElement).style.borderColor = '#FEE2E2';
        }}>
          ✕
        </button>

        <div style={{ padding: '48px 40px 40px' }}>
          
          {/* ================================================================ */}
          {/* ШАГ 1: ВЫБОР МЕТОДА */}
          {/* ================================================================ */}
          {step === 'choose' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.65rem', letterSpacing: '5px',
                  color: RED, textTransform: 'uppercase', marginBottom: '12px',
                }}>
                  SushiMate
                </div>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '2rem', fontWeight: 700, color: DARK, marginBottom: '8px',
                }}>
                  How to get your order?
                </h2>
                <p style={{ color: MUTED, fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem' }}>
                  Choose delivery or pickup from our restaurants
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Доставка */}
                <button onClick={() => setStep('delivery')} style={{
                  padding: '48px 32px',
                  background: RED_BG,
                  border: '2px solid #FEE2E2',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = RED;
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(220,38,38,0.15)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#FEE2E2';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🛵</div>
                  <h3 style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '1.2rem', fontWeight: 700, color: DARK, marginBottom: '8px',
                  }}>
                    Delivery
                  </h3>
                  <p style={{ color: MUTED, fontSize: '0.85rem', lineHeight: 1.5 }}>
                    Enter your address and we'll deliver to your door
                  </p>
                </button>

                {/* Самовывоз */}
                <button onClick={() => setStep('pickup')} style={{
                  padding: '48px 32px',
                  background: RED_BG,
                  border: '2px solid #FEE2E2',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = RED;
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(220,38,38,0.15)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#FEE2E2';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🏪</div>
                  <h3 style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '1.2rem', fontWeight: 700, color: DARK, marginBottom: '8px',
                  }}>
                    Pickup
                  </h3>
                  <p style={{ color: MUTED, fontSize: '0.85rem', lineHeight: 1.5 }}>
                    Pick up from one of our restaurant locations
                  </p>
                </button>
              </div>
            </>
          )}

          {/* ================================================================ */}
          {/* ШАГ 2: ДОСТАВКА — ПОИСК АДРЕСА */}
          {/* ================================================================ */}
          {step === 'delivery' && (
            <>
              <button onClick={() => setStep('choose')} style={{
                background: 'none', border: 'none', color: RED,
                cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                marginBottom: '28px', fontFamily: "'DM Sans', sans-serif",
              }}>
                ← Back to method selection
              </button>

              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🛵</div>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.8rem', fontWeight: 700, color: DARK, marginBottom: '8px',
                }}>
                  Enter your delivery address
                </h2>
                <p style={{ color: MUTED, fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem' }}>
                  Start typing your street address and select from suggestions
                </p>
              </div>

              {/* Поле поиска с автодополнением */}
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: WHITE,
                  border: `2px solid ${showSuggestions ? RED : RED_DIM}`,
                  borderRadius: '14px',
                  padding: '4px',
                  transition: 'all 0.2s',
                }}>
                  <span style={{
                    fontSize: '1.2rem',
                    padding: '0 12px',
                    color: MUTED,
                  }}>📍</span>
                  <input
                    value={address}
                    onChange={e => handleAddressChange(e.target.value)}
                    placeholder="Start typing your street address..."
                    style={{
                      flex: 1,
                      padding: '16px 8px',
                      border: 'none',
                      background: 'transparent',
                      fontSize: '1rem',
                      fontFamily: "'DM Sans', sans-serif",
                      color: DARK,
                      outline: 'none',
                    }}
                    autoFocus
                  />
                </div>

                {/* Подсказки */}
                {showSuggestions && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: WHITE,
                    border: '2px solid #FEE2E2',
                    borderRadius: '0 0 14px 14px',
                    zIndex: 20,
                    boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                    maxHeight: '280px',
                    overflowY: 'auto',
                    marginTop: '4px',
                  }}>
                    {suggestions.map((suggestion, i) => (
                      <div
                        key={i}
                        onClick={() => selectAddress(suggestion)}
                        style={{
                          padding: '14px 20px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #FEF2F2',
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: '0.88rem',
                          color: DARK,
                          transition: 'all 0.15s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.background = RED_BG;
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.background = 'transparent';
                        }}>
                        <span style={{ fontSize: '1rem' }}>📍</span>
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Подсказка */}
              <p style={{
                fontSize: '0.75rem',
                color: MUTED,
                textAlign: 'center',
                marginBottom: '24px',
                fontFamily: "'DM Sans', sans-serif",
              }}>
                💡 Try typing your street name, area, or city
              </p>

              {/* Быстрые города */}
              <div style={{ marginBottom: '28px' }}>
                <p style={{
                  fontSize: '0.75rem',
                  color: MUTED,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  marginBottom: '10px',
                  textAlign: 'center',
                }}>
                  Quick city select:
                </p>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  justifyContent: 'center',
                }}>
                  {['Vancouver', 'Toronto', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton'].map(city => (
                    <button
                      key={city}
                      onClick={() => {
                        setAddress(city);
                        handleAddressChange(city);
                      }}
                      style={{
                        padding: '8px 18px',
                        border: `1px solid ${RED_DIM}`,
                        borderRadius: '50px',
                        background: address === city ? RED_BG : 'transparent',
                        color: address === city ? RED : MUTED,
                        cursor: 'pointer',
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        transition: 'all 0.2s',
                      }}>
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Кнопка подтверждения */}
              <button
                onClick={handleDeliveryConfirm}
                disabled={address.trim().length < 5}
                style={{
                  width: '100%',
                  padding: '18px',
                  background: address.trim().length >= 5 ? RED : '#D1D5DB',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: address.trim().length >= 5 ? 'pointer' : 'not-allowed',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s',
                  boxShadow: address.trim().length >= 5 ? '0 4px 20px rgba(220,38,38,0.3)' : 'none',
                }}>
                {address.trim().length >= 5 
                  ? '✓ Confirm Address & Browse Menu →' 
                  : 'Type your address to continue'}
              </button>
            </>
          )}

          {/* ================================================================ */}
          {/* ШАГ 2: САМОВЫВОЗ — СПИСОК РЕСТОРАНОВ */}
          {/* ================================================================ */}
          {step === 'pickup' && (
            <>
              <button onClick={() => setStep('choose')} style={{
                background: 'none', border: 'none', color: RED,
                cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                marginBottom: '28px', fontFamily: "'DM Sans', sans-serif",
              }}>
                ← Back to method selection
              </button>

              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏪</div>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.8rem', fontWeight: 700, color: DARK, marginBottom: '8px',
                }}>
                  Choose a pickup location
                </h2>
                <p style={{ color: MUTED, fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem' }}>
                  Select one of our restaurant locations across Canada
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {RESTAURANT_LOCATIONS.map((loc, i) => (
                  <button
                    key={i}
                    onClick={() => handlePickupSelect(loc)}
                    style={{
                      padding: '22px 24px',
                      background: RED_BG,
                      border: '2px solid #FEE2E2',
                      borderRadius: '14px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = RED;
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(220,38,38,0.15)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateX(6px)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = '#FEE2E2';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                      (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
                    }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      {/* Иконка */}
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '14px',
                        background: WHITE,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.6rem',
                        border: '2px solid #FEE2E2',
                        flexShrink: 0,
                      }}>
                        🏪
                      </div>

                      {/* Инфо */}
                      <div style={{ flex: 1 }}>
                        <h4 style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontWeight: 700,
                          color: DARK,
                          fontSize: '1.2rem',
                          marginBottom: '6px',
                        }}>
                          {loc.city}
                        </h4>
                        <p style={{
                          color: MUTED,
                          fontSize: '0.85rem',
                          lineHeight: 1.5,
                          marginBottom: '4px',
                          fontFamily: "'DM Sans', sans-serif",
                        }}>
                          📍 {loc.address}
                        </p>
                        <p style={{
                          color: RED,
                          fontSize: '0.75rem',
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 600,
                        }}>
                          🕐 {loc.hours}
                        </p>
                      </div>

                      {/* Стрелка */}
                      <span style={{
                        color: RED,
                        fontSize: '1.6rem',
                        fontWeight: 700,
                        alignSelf: 'center',
                      }}>
                        →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryModal;