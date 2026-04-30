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

const RESTAURANT_LOCATIONS = [
  { city: 'Vancouver', address: '1234 Robson Street, Vancouver, BC V6E 1C7', hours: 'Daily 10:00 – 23:00', lat: 49.2827, lng: -123.1207 },
  { city: 'Toronto', address: '567 Queen Street West, Toronto, ON M5V 2B7', hours: 'Daily 10:00 – 23:00', lat: 43.6532, lng: -79.3832 },
  { city: 'Montreal', address: '890 Saint-Catherine St W, Montreal, QC H3B 1E3', hours: 'Daily 10:00 – 23:00', lat: 45.5017, lng: -73.5673 },
  { city: 'Calgary', address: '345 17th Ave SW, Calgary, AB T2S 0A5', hours: 'Daily 10:00 – 23:00', lat: 51.0447, lng: -114.0719 },
  { city: 'Ottawa', address: '678 Rideau Street, Ottawa, ON K1N 5Y8', hours: 'Daily 10:00 – 23:00', lat: 45.4215, lng: -75.6972 },
];

const STREETS_DATABASE = [
  '1234 Robson Street, Vancouver, BC', '567 Granville Street, Vancouver, BC',
  '890 Burrard Street, Vancouver, BC', '234 Davie Street, Vancouver, BC',
  '456 Denman Street, Vancouver, BC', '789 Main Street, Vancouver, BC',
  '567 Queen Street West, Toronto, ON', '123 King Street West, Toronto, ON',
  '456 Yonge Street, Toronto, ON', '789 Bloor Street West, Toronto, ON',
  '890 Saint-Catherine St W, Montreal, QC', '123 Saint-Laurent Boulevard, Montreal, QC',
  '345 17th Ave SW, Calgary, AB', '678 Rideau Street, Ottawa, ON',
];

const DeliveryModal: React.FC<DeliveryModalProps> = ({ isOpen, onClose, onSelect }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'choose' | 'delivery' | 'pickup'>('choose');
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCity, setSelectedCity] = useState(RESTAURANT_LOCATIONS[0]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setStep('choose');
      setAddress('');
      setShowSuggestions(false);
    }
  }, [isOpen]);

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
    const found = RESTAURANT_LOCATIONS.find(loc =>
      value.toLowerCase().includes(loc.city.toLowerCase())
    );
    if (found) setSelectedCity(found);
  };

  const selectAddress = (addr: string) => {
    setAddress(addr);
    setShowSuggestions(false);
    const found = RESTAURANT_LOCATIONS.find(loc =>
      addr.toLowerCase().includes(loc.city.toLowerCase())
    );
    if (found) setSelectedCity(found);
  };

  const handleDeliveryConfirm = () => {
    if (address.trim().length >= 5) {
      onSelect('delivery', address);
      navigate('/order');
    }
  };

  const handlePickupSelect = (location: typeof RESTAURANT_LOCATIONS[0]) => {
    onSelect('pickup', location.address);
    navigate('/order');
  };

  const getGoogleMapsUrl = () => {
    return `https://maps.google.com/maps?q=${selectedCity.lat},${selectedCity.lng}&z=13&output=embed`;
  };

  if (!isOpen) return null;

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: isMobile ? 'flex-end' : 'center',
      justifyContent: 'center',
      padding: isMobile ? '0' : '20px',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: WHITE,
        borderRadius: isMobile ? '20px 20px 0 0' : '24px',
        width: '100%',
        maxWidth: step === 'delivery' ? (isMobile ? '100%' : '1100px') : (isMobile ? '100%' : '700px'),
        maxHeight: isMobile ? '90vh' : '85vh',
        overflow: 'auto',
        boxShadow: '0 30px 80px rgba(220,38,38,0.25)',
        position: 'relative',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px', zIndex: 10,
          width: '36px', height: '36px',
          background: WHITE, border: '2px solid #FEE2E2', color: MUTED,
          fontSize: '1rem', cursor: 'pointer', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = RED;
          (e.currentTarget as HTMLElement).style.color = '#fff';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = WHITE;
          (e.currentTarget as HTMLElement).style.color = MUTED;
        }}>
          ✕
        </button>

        <div style={{ padding: isMobile ? '32px 20px 24px' : '48px 40px 40px' }}>
          
          {/* ШАГ 1 */}
          {step === 'choose' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: isMobile ? '28px' : '40px' }}>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem',
                  letterSpacing: '5px', color: RED, textTransform: 'uppercase',
                  marginBottom: '12px',
                }}>SushiMate</div>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: isMobile ? '1.5rem' : '2rem',
                  fontWeight: 700, color: DARK, marginBottom: '8px',
                }}>How to get your order?</h2>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: isMobile ? '16px' : '24px',
              }}>
                <button onClick={() => setStep('delivery')} style={{
                  padding: isMobile ? '32px 24px' : '48px 32px',
                  background: RED_BG, border: '2px solid #FEE2E2',
                  borderRadius: '16px', cursor: 'pointer',
                  textAlign: 'center', transition: 'all 0.3s',
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🛵</div>
                  <h3 style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: '1.1rem',
                    fontWeight: 700, color: DARK, marginBottom: '6px',
                  }}>Delivery</h3>
                  <p style={{ color: MUTED, fontSize: '0.82rem' }}>
                    Enter your address — we'll deliver to your door
                  </p>
                </button>

                <button onClick={() => setStep('pickup')} style={{
                  padding: isMobile ? '32px 24px' : '48px 32px',
                  background: RED_BG, border: '2px solid #FEE2E2',
                  borderRadius: '16px', cursor: 'pointer',
                  textAlign: 'center', transition: 'all 0.3s',
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📍</div>
                  <h3 style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: '1.1rem',
                    fontWeight: 700, color: DARK, marginBottom: '6px',
                  }}>Pickup</h3>
                  <p style={{ color: MUTED, fontSize: '0.82rem' }}>
                    Pick up from one of our restaurant locations
                  </p>
                </button>
              </div>
            </>
          )}

          {/* ШАГ 2: ДОСТАВКА */}
          {step === 'delivery' && (
            <>
              <button onClick={() => setStep('choose')} style={{
                background: 'none', border: 'none', color: RED,
                cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                marginBottom: '20px', fontFamily: "'DM Sans', sans-serif",
              }}>
                ← Back
              </button>

              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: isMobile ? '20px' : '28px',
              }}>
                {/* Левая колонка — форма */}
                <div style={{ order: isMobile ? 2 : 1 }}>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: isMobile ? '1.3rem' : '1.5rem',
                    fontWeight: 700, color: DARK, marginBottom: '6px',
                  }}>
                    Enter your delivery address
                  </h3>
                  <p style={{
                    color: MUTED, fontSize: '0.85rem',
                    marginBottom: '16px',
                  }}>
                    Start typing your street address
                  </p>

                  {/* Поиск */}
                  <div style={{ position: 'relative', marginBottom: '12px' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      background: WHITE,
                      border: `2px solid ${showSuggestions ? RED : RED_DIM}`,
                      borderRadius: '12px', padding: '2px',
                      transition: 'all 0.2s',
                    }}>
                      <span style={{
                        fontSize: '1rem', padding: '0 10px', color: MUTED,
                      }}>📍</span>
                      <input
                        value={address}
                        onChange={e => handleAddressChange(e.target.value)}
                        placeholder="Start typing your street address..."
                        style={{
                          flex: 1, padding: '14px 8px',
                          border: 'none', background: 'transparent',
                          fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif",
                          color: DARK, outline: 'none',
                        }}
                      />
                    </div>

                    {showSuggestions && (
                      <div style={{
                        position: 'absolute', top: '100%', left: 0, right: 0,
                        background: WHITE, border: '2px solid #FEE2E2',
                        borderRadius: '0 0 12px 12px', zIndex: 20,
                        boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                        maxHeight: '200px', overflowY: 'auto', marginTop: '2px',
                      }}>
                        {suggestions.map((suggestion, i) => (
                          <div key={i} onClick={() => selectAddress(suggestion)} style={{
                            padding: '12px 16px', cursor: 'pointer',
                            borderBottom: '1px solid #FEF2F2',
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '0.82rem', color: DARK,
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = RED_BG; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                            📍 {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Быстрые города */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{
                      display: 'flex', flexWrap: 'wrap', gap: '6px',
                    }}>
                      {['Vancouver', 'Toronto', 'Montreal', 'Calgary', 'Ottawa'].map(city => (
                        <button key={city} onClick={() => handleAddressChange(city)} style={{
                          padding: '6px 14px',
                          border: `1px solid ${RED_DIM}`, borderRadius: '50px',
                          background: address.includes(city) ? RED_BG : 'transparent',
                          color: address.includes(city) ? RED : MUTED,
                          cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                          fontSize: '0.72rem', fontWeight: 600,
                        }}>
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Рестораны */}
                  <div style={{
                    background: RED_BG, borderRadius: '10px',
                    padding: '12px', marginBottom: '16px',
                    border: '1px solid #FEE2E2',
                  }}>
                    <p style={{
                      fontSize: '0.7rem', color: RED, fontWeight: 700,
                      marginBottom: '6px',
                    }}>🔴 Our locations:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {RESTAURANT_LOCATIONS.map(loc => (
                        <button key={loc.city} onClick={() => {
                          setSelectedCity(loc);
                          setAddress(loc.address);
                        }} style={{
                          padding: '4px 10px',
                          background: selectedCity.city === loc.city ? RED : WHITE,
                          color: selectedCity.city === loc.city ? '#fff' : RED,
                          border: `1px solid ${RED_DIM}`, borderRadius: '50px',
                          fontSize: '0.65rem', cursor: 'pointer',
                          fontWeight: 600,
                        }}>
                          📍 {loc.city}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={handleDeliveryConfirm} disabled={address.trim().length < 5} style={{
                    width: '100%', padding: isMobile ? '14px' : '16px',
                    background: address.trim().length >= 5 ? RED : '#D1D5DB',
                    color: '#fff', border: 'none', borderRadius: '50px',
                    cursor: address.trim().length >= 5 ? 'pointer' : 'not-allowed',
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                    fontSize: '0.8rem', letterSpacing: '2px',
                    textTransform: 'uppercase',
                  }}>
                    {address.trim().length >= 5
                      ? '✓ Confirm · Browse Menu →'
                      : 'Type address or select city'}
                  </button>
                </div>

                {/* Правая колонка — КАРТА */}
                <div style={{ order: isMobile ? 1 : 2 }}>
                  <p style={{
                    fontSize: '0.75rem', color: MUTED, marginBottom: '6px',
                  }}>
                    🗺️ Our restaurant locations
                  </p>
                  <div style={{
                    borderRadius: '12px', overflow: 'hidden',
                    border: '2px solid #FEE2E2',
                    height: isMobile ? '220px' : '450px',
                    background: '#F9FAFB',
                  }}>
                    <iframe
                      src={getGoogleMapsUrl()}
                      width="100%"
                      height="100%"
                      style={{ border: 'none' }}
                      title="Our restaurant locations"
                      loading="lazy"
                    />
                  </div>
                  <p style={{
                    fontSize: '0.65rem', color: MUTED, marginTop: '6px',
                    textAlign: 'center',
                  }}>
                    📍 {selectedCity.city}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ШАГ 2: САМОВЫВОЗ */}
          {step === 'pickup' && (
            <>
              <button onClick={() => setStep('choose')} style={{
                background: 'none', border: 'none', color: RED,
                cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                marginBottom: '24px', fontFamily: "'DM Sans', sans-serif",
              }}>
                ← Back
              </button>

              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📍</div>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: isMobile ? '1.4rem' : '1.8rem',
                  fontWeight: 700, color: DARK, marginBottom: '6px',
                }}>
                  Choose a pickup location
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {RESTAURANT_LOCATIONS.map((loc, i) => (
                  <button key={i} onClick={() => handlePickupSelect(loc)} style={{
                    padding: isMobile ? '16px' : '22px 24px',
                    background: RED_BG, border: '2px solid #FEE2E2',
                    borderRadius: '14px', cursor: 'pointer',
                    textAlign: 'left', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = RED;
                    (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#FEE2E2';
                    (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '12px',
                        background: WHITE, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '1.3rem',
                        border: '2px solid #FEE2E2', flexShrink: 0,
                      }}>📍</div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontWeight: 700, color: DARK,
                          fontSize: isMobile ? '1rem' : '1.2rem',
                          marginBottom: '4px',
                        }}>{loc.city}</h4>
                        <p style={{
                          color: MUTED, fontSize: '0.78rem',
                          lineHeight: 1.4, marginBottom: '2px',
                        }}>📍 {loc.address}</p>
                        <p style={{ color: RED, fontSize: '0.7rem', fontWeight: 600 }}>
                          🕐 {loc.hours}
                        </p>
                      </div>
                      <span style={{
                        color: RED, fontSize: '1.3rem', fontWeight: 700,
                        alignSelf: 'center',
                      }}>→</span>
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