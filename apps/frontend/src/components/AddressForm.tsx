import React, { useState, useEffect, useRef } from 'react';

interface AddressFormProps {
  onAddressChange: (addressData: {
    address: string;
    apartment: string;
    entrance: string;
    floor: string;
    latitude: number | null;
    longitude: number | null;
  }) => void;
}

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

const AddressForm: React.FC<AddressFormProps> = ({ onAddressChange }) => {
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [entrance, setEntrance] = useState('');
  const [floor, setFloor] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autocompleteService = useRef<any>(null);
  const geocoder = useRef<any>(null);

  // Загрузка Google Maps API
  useEffect(() => {
    if (!window.google && !document.querySelector('#google-maps-script')) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&v=weekly`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      
      script.onload = () => {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        geocoder.current = new window.google.maps.Geocoder();
      };
    } else if (window.google && !autocompleteService.current) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      geocoder.current = new window.google.maps.Geocoder();
    }
  }, []);

  // Поиск подсказок адресов
  const handleAddressInput = async (value: string) => {
    setAddress(value);
    setShowSuggestions(true);

    if (value.length > 2 && autocompleteService.current) {
      try {
        const request = {
          input: value,
          types: ['address'],
          componentRestrictions: { country: 'ae' } // Ограничиваем ОАЭ
        };
        
        autocompleteService.current.getPlacePredictions(request, (predictions: any[]) => {
          setSuggestions(predictions || []);
        });
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
    
    // Передаём родителю текущие данные
    onAddressChange({ address: value, apartment, entrance, floor, latitude, longitude });
  };

  // Выбор адреса из подсказок
  const selectAddress = (suggestion: any) => {
    setAddress(suggestion.description);
    setShowSuggestions(false);
    
    // Получаем координаты выбранного адреса
    if (geocoder.current) {
      geocoder.current.geocode({ address: suggestion.description }, (results: any[]) => {
        if (results && results[0]) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          setLatitude(lat);
          setLongitude(lng);
          onAddressChange({ 
            address: suggestion.description, 
            apartment, 
            entrance, 
            floor, 
            latitude: lat, 
            longitude: lng 
          });
        }
      });
    }
  };

  const handleApartmentChange = (value: string) => {
    setApartment(value);
    onAddressChange({ address, apartment: value, entrance, floor, latitude, longitude });
  };

  const handleEntranceChange = (value: string) => {
    setEntrance(value);
    onAddressChange({ address, apartment, entrance: value, floor, latitude, longitude });
  };

  const handleFloorChange = (value: string) => {
    setFloor(value);
    onAddressChange({ address, apartment, entrance, floor: value, latitude, longitude });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <label className="block text-sm font-medium mb-2 text-slate-700">
          Delivery Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => handleAddressInput(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Start typing your address in Dubai/Abu Dhabi..."
          className="w-full p-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
          required
        />
        
        {/* Подсказки адресов */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => selectAddress(suggestion)}
                className="w-full text-left px-4 py-2 hover:bg-orange-50 transition-colors text-sm"
              >
                {suggestion.description}
              </button>
            ))}
          </div>
        )}
        
        {/* Инструкция */}
        <p className="text-xs text-gray-500 mt-1">
          💡 Start typing your street name, building name, or area in Dubai/Abu Dhabi
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700">
            Apartment / Villa No.
          </label>
          <input
            type="text"
            value={apartment}
            onChange={(e) => handleApartmentChange(e.target.value)}
            placeholder="e.g., 304, Villa 12"
            className="w-full p-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700">
            Entrance
          </label>
          <input
            type="text"
            value={entrance}
            onChange={(e) => handleEntranceChange(e.target.value)}
            placeholder="e.g., A, B, 1"
            className="w-full p-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700">
            Floor
          </label>
          <input
            type="text"
            value={floor}
            onChange={(e) => handleFloorChange(e.target.value)}
            placeholder="e.g., 5, Ground"
            className="w-full p-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
          />
        </div>
      </div>

      {/* Отображение выбранных координат (скрыто, но можно показать для отладки) */}
      {latitude && longitude && (
        <p className="text-xs text-green-600 mt-2">
          ✓ Location verified on map
        </p>
      )}
    </div>
  );
};

export default AddressForm;