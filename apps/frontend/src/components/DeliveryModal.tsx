import { useState, useEffect, useRef } from 'react';
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

const DeliveryModal: React.FC<DeliveryModalProps> = ({ isOpen, onClose, onSelect }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'choose' | 'delivery' | 'pickup'>('choose');
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCity, setSelectedCity] = useState(RESTAURANT_LOCATIONS[0]);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      setSelectedCity(RESTAURANT_LOCATIONS[0]);
    }
  }, [isOpen]);

  // Автодополнение адреса
  const handleAddressChange = (value: string) => {
    setAddress(value);
    if (value.length >= 2) {
      const filtered = CANADA_ADDRESSES.filter(addr =>
        addr.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
    
    // Определяем город для карты
    const found = RESTAURANT_LOCATIONS.find(loc =>
      value.toLowerCase().includes(loc.city.toLowerCase())
    );
    if (found) setSelectedCity(found);
  };

  const selectSuggestion = (addr: string) => {
    setAddress(addr);
    setShowSuggestions(false);
    const found = RESTAURANT_LOCATIONS.find(loc =>
      addr.toLowerCase().includes(loc.city.toLowerCase())
    );
    if (found) setSelectedCity(found);
  };

  // Сохраняем и идём дальше
  const handleDeliveryConfirm = () => {
    if (address.trim().length >= 5) {
      const parts = address.split(',');
      let street = '';
      let city = '';
      if (parts.length >= 3) {
        street = parts[0].trim();
        city = parts[1].trim();
      } else if (parts.length === 2) {
        city = parts[0].trim();
      } else {
        street = address;
      }
      localStorage.setItem('sushimate_delivery_street', street);
      localStorage.setItem('sushimate_delivery_city', city);
      onSelect('delivery', address);
      navigate('/order');
    }
  };

  // Выбор самовывоза
  const handlePickupSelect = (location: typeof RESTAURANT_LOCATIONS[0]) => {
    onSelect('pickup', location.address);
    navigate('/order');
  };

  // Карта пользователя (доставка)
  const getUserMapUrl = () => {
    const query = encodeURIComponent(address || selectedCity.address);
    return `https://maps.google.com/maps?q=${query}&z=15&output=embed`;
  };

  // Карта ресторанов (самовывоз)
  const getRestaurantMapUrl = () => {
    return `https://maps.google.com/maps?q=${selectedCity.lat},${selectedCity.lng}&z=14&output=embed`;
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
        maxWidth: step === 'delivery' ? (isMobile ? '100%' : '1100px') : (isMobile ? '100%' : '800px'),
        maxHeight: isMobile ? '90vh' : '85vh',
        overflow: 'auto',
        boxShadow: '0 30px 80px rgba(220,38,38,0.25)',
        position: 'relative',
      }}>
        {/* Крестик */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px', zIndex: 10,
          width: '36px', height: '36px',
          background: WHITE, border: '2px solid #FEE2E2', color: MUTED,
          fontSize: '1rem', cursor: 'pointer', borderRadius: '50%',
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

        <div style={{ padding: isMobile ? '32px 20px 24px' : '48px 40px 40px' }}>
          
          {/* ══════════════════════════════════════ */}
          {/* ШАГ 1: ВЫБОР МЕТОДА */}
          {/* ══════════════════════════════════════ */}
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
                <p style={{
                  color: MUTED, fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.9rem',
                }}>Choose delivery or pickup</p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: isMobile ? '16px' : '24px',
              }}>
                {/* Доставка */}
                <button onClick={() => setStep('delivery')} style={{
                  padding: isMobile ? '32px 24px' : '48px 32px',
                  background: RED_BG, border: '2px solid #FEE2E2',
                  borderRadius: '16px', cursor: 'pointer',
                  textAlign: 'center', transition: 'all 0.3s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = RED;
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#FEE2E2';
                  (e.currentTarget as HTMLElement).style.transform = 'none';
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🛵</div>
                  <h3 style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: '1.1rem',
                    fontWeight: 700, color: DARK, marginBottom: '6px',
                  }}>Delivery</h3>
                  <p style={{ color: MUTED, fontSize: '0.85rem' }}>
                    Enter your address — we'll deliver to your door
                  </p>
                </button>

                {/* Самовывоз */}
                <button onClick={() => setStep('pickup')} style={{
                  padding: isMobile ? '32px 24px' : '48px 32px',
                  background: RED_BG, border: '2px solid #FEE2E2',
                  borderRadius: '16px', cursor: 'pointer',
                  textAlign: 'center', transition: 'all 0.3s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = RED;
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#FEE2E2';
                  (e.currentTarget as HTMLElement).style.transform = 'none';
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🏢</div>
                  <h3 style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: '1.1rem',
                    fontWeight: 700, color: DARK, marginBottom: '6px',
                  }}>Pickup</h3>
                  <p style={{ color: MUTED, fontSize: '0.85rem' }}>
                    Pick up from one of our restaurant locations
                  </p>
                </button>
              </div>
            </>
          )}

          {/* ══════════════════════════════════════ */}
          {/* ДОСТАВКА — поиск + карта пользователя */}
          {/* ══════════════════════════════════════ */}
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
                {/* Левая — форма */}
                <div style={{ order: isMobile ? 2 : 1 }}>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: isMobile ? '1.3rem' : '1.5rem',
                    fontWeight: 700, color: DARK, marginBottom: '6px',
                  }}>
                    Enter your delivery address
                  </h3>
                  <p style={{
                    color: MUTED, fontSize: '0.85rem', marginBottom: '16px',
                  }}>
                    Start typing your address — it will appear on the map
                  </p>

                  {/* Поле ввода — один бордер */}
                  <div style={{ position: 'relative', marginBottom: '20px' }}>
                    <input
                      ref={inputRef}
                      value={address}
                      onChange={e => handleAddressChange(e.target.value)}
                      onFocus={() => {
                        if (address.length >= 2) setShowSuggestions(true);
                      }}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      placeholder="Start typing your address..."
                      style={{
                        width: '100%',
                        padding: '14px 18px',
                        border: `2px solid ${showSuggestions ? RED : RED_DIM}`,
                        borderRadius: '12px',
                        fontSize: '0.95rem',
                        fontFamily: "'DM Sans', sans-serif",
                        color: DARK,
                        outline: 'none',
                        background: WHITE,
                        transition: 'border-color 0.2s',
                      }}
                    />

                    {/* Подсказки */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: WHITE,
                        border: `2px solid ${RED_DIM}`,
                        borderTop: 'none',
                        borderRadius: '0 0 12px 12px',
                        zIndex: 20,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                        maxHeight: '220px',
                        overflowY: 'auto',
                        marginTop: '-1px',
                      }}>
                        {suggestions.map((sug, i) => (
                          <div
                            key={i}
                            onMouseDown={() => selectSuggestion(sug)}
                            style={{
                              padding: '12px 18px',
                              cursor: 'pointer',
                              borderBottom: '1px solid #FEF2F2',
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: '0.85rem',
                              color: DARK,
                              transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLElement).style.background = RED_BG;
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLElement).style.background = 'transparent';
                            }}>
                            📍 {sug}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleDeliveryConfirm}
                    disabled={address.trim().length < 5}
                    style={{
                      width: '100%', padding: '14px',
                      background: address.trim().length >= 5 ? RED : '#D1D5DB',
                      color: '#fff', border: 'none', borderRadius: '50px',
                      cursor: address.trim().length >= 5 ? 'pointer' : 'not-allowed',
                      fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                      fontSize: '0.82rem', letterSpacing: '2px', textTransform: 'uppercase',
                      boxShadow: address.trim().length >= 5 ? '0 4px 20px rgba(220,38,38,0.3)' : 'none',
                    }}>
                    {address.trim().length >= 5 ? '✓ Confirm & Browse Menu →' : 'Enter your address'}
                  </button>
                </div>

                {/* Правая — КАРТА ПОЛЬЗОВАТЕЛЯ */}
                <div style={{ order: isMobile ? 1 : 2 }}>
                  <p style={{
                    fontSize: '0.75rem', color: MUTED, marginBottom: '6px',
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    🗺️ Your delivery location
                  </p>
                  <div style={{
                    borderRadius: '12px', overflow: 'hidden',
                    border: '2px solid #FEE2E2',
                    height: isMobile ? '220px' : '400px',
                    background: '#F9FAFB',
                  }}>
                    <iframe
                      src={getUserMapUrl()}
                      width="100%"
                      height="100%"
                      style={{ border: 'none' }}
                      title="Your location"
                      loading="lazy"
                    />
                  </div>
                  {address.trim().length >= 5 && (
                    <p style={{
                      fontSize: '0.72rem', color: RED, marginTop: '6px',
                      textAlign: 'center', fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600,
                    }}>
                      📍 Showing: {address}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ══════════════════════════════════════ */}
          {/* САМОВЫВОЗ — список + карта ресторанов */}
          {/* ══════════════════════════════════════ */}
          {step === 'pickup' && (
            <>
              <button onClick={() => setStep('choose')} style={{
                background: 'none', border: 'none', color: RED,
                cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                marginBottom: '24px', fontFamily: "'DM Sans', sans-serif",
              }}>
                ← Back
              </button>

              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: isMobile ? '20px' : '28px',
              }}>
                {/* Список ресторанов */}
                <div>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: isMobile ? '1.3rem' : '1.5rem',
                    fontWeight: 700, color: DARK, marginBottom: '16px',
                  }}>
                    Choose a pickup location
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {RESTAURANT_LOCATIONS.map((loc, i) => (
                      <button
                        key={i}
                        onClick={() => handlePickupSelect(loc)}
                        style={{
                          padding: isMobile ? '14px' : '18px 20px',
                          background: selectedCity.city === loc.city ? RED_BG : WHITE,
                          border: `2px solid ${selectedCity.city === loc.city ? RED : '#FEE2E2'}`,
                          borderRadius: '12px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => {
                          setSelectedCity(loc);
                          (e.currentTarget as HTMLElement).style.borderColor = RED;
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = '#FEE2E2';
                        }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <div style={{
                            width: '40px', height: '40px', borderRadius: '10px',
                            background: selectedCity.city === loc.city ? WHITE : RED_BG,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.1rem', flexShrink: 0,
                            border: `2px solid ${RED_DIM}`,
                          }}>🏢</div>
                          <div style={{ flex: 1 }}>
                            <p style={{
                              fontWeight: 700, color: DARK,
                              fontSize: isMobile ? '0.9rem' : '1rem',
                              marginBottom: '4px',
                              fontFamily: "'Cormorant Garamond', serif",
                            }}>{loc.city}</p>
                            <p style={{
                              color: MUTED, fontSize: '0.75rem',
                              lineHeight: 1.4, marginBottom: '2px',
                            }}>📍 {loc.address}</p>
                            <p style={{
                              color: RED, fontSize: '0.68rem', fontWeight: 600,
                            }}>🕐 {loc.hours}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Карта ресторанов */}
                <div>
                  <p style={{
                    fontSize: '0.75rem', color: MUTED, marginBottom: '6px',
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    🗺️ Our restaurant locations
                  </p>
                  <div style={{
                    borderRadius: '12px', overflow: 'hidden',
                    border: '2px solid #FEE2E2',
                    height: isMobile ? '250px' : '450px',
                    background: '#F9FAFB',
                    position: 'sticky', top: '20px',
                  }}>
                    <iframe
                      src={getRestaurantMapUrl()}
                      width="100%"
                      height="100%"
                      style={{ border: 'none' }}
                      title="Our locations"
                      loading="lazy"
                    />
                  </div>
                  <p style={{
                    fontSize: '0.72rem', color: RED, marginTop: '6px',
                    textAlign: 'center', fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                  }}>
                    📍 {selectedCity.city} — {selectedCity.address}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// База канадских адресов
const CANADA_ADDRESSES = [
  // Vancouver
  '1234 Robson Street, Vancouver, BC',
  '567 Granville Street, Vancouver, BC',
  '890 Burrard Street, Vancouver, BC',
  '234 Davie Street, Vancouver, BC',
  '456 Denman Street, Vancouver, BC',
  '789 Main Street, Vancouver, BC',
  '321 West Broadway, Vancouver, BC',
  '654 Commercial Drive, Vancouver, BC',
  '987 West 4th Avenue, Vancouver, BC',
  '1111 Yaletown, Vancouver, BC',
  '222 Water Street, Gastown, Vancouver, BC',
  '333 West 10th Avenue, Kitsilano, Vancouver, BC',
  
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
  '987 Kensington Avenue, Toronto, ON',
  '111 Distillery Lane, Toronto, ON',
  '222 Yorkville Avenue, Toronto, ON',
  
  // Montreal
  '890 Saint-Catherine St W, Montreal, QC',
  '123 Saint-Laurent Boulevard, Montreal, QC',
  '456 Sherbrooke Street, Montreal, QC',
  '789 Saint-Denis Street, Montreal, QC',
  '234 Mont-Royal Avenue, Montreal, QC',
  '567 Rue de la Commune, Old Montreal, QC',
  
  // Calgary
  '345 17th Ave SW, Calgary, AB',
  '123 Stephen Avenue, Calgary, AB',
  '456 Kensington Road NW, Calgary, AB',
  '789 8th Avenue SW, Calgary, AB',
  
  // Ottawa
  '678 Rideau Street, Ottawa, ON',
  '123 Bank Street, Ottawa, ON',
  '456 York Street, ByWard Market, Ottawa, ON',
  '789 Richmond Road, Westboro, Ottawa, ON',
  
  // Edmonton
  '123 Whyte Avenue, Edmonton, AB',
  '456 Jasper Avenue, Edmonton, AB',
  
  // Others
  '123 Portage Avenue, Winnipeg, MB',
  '456 Osborne Street, Winnipeg, MB',
  '123 Grande Allée, Quebec City, QC',
  '123 Spring Garden Road, Halifax, NS',
  '123 Government Street, Victoria, BC',
];

export default DeliveryModal;