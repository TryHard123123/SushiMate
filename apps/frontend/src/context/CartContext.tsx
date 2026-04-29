import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface Product {
  _id?: string | number;
  id: number;
  name: string;
  description: string;
  fullDescription?: string;
  price: number;
  image: string;  // Это поле должно быть строкой с URL
  images?: string[];
  category: string;
  rating?: number;
  reviewCount?: number;
  isHit?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  appliedPromo: string | null;
  discountPercent: number;
  products: Product[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'LOAD_PRODUCTS'; payload: Product[] }
  | { type: 'APPLY_PROMO'; payload: { code: string; discountPercent: number } }
  | { type: 'REMOVE_PROMO' }
  | { type: 'LOAD_PROMO'; payload: { appliedPromo: string | null; discountPercent: number } };

const initialState: CartState = {
  items: [],
  total: 0,
  appliedPromo: null,
  discountPercent: 0,
  products: []
};

function calculateTotal(items: CartItem[], discountPercent: number): number {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = discountPercent > 0 ? subtotal * (discountPercent / 100) : 0;
  return subtotal - discount;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
      case 'ADD_ITEM': {
        // Нормализуем ID товара
        const normalizedItem = {
          ...action.payload,
          id: action.payload.id || Number(action.payload._id) || Date.now()
        };
        
        const existingItem = state.items.find(item => item.id === normalizedItem.id);
        let newItems;
        if (existingItem) {
          newItems = state.items.map(item =>
            item.id === normalizedItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          newItems = [...state.items, { ...normalizedItem, quantity: 1 }];
        }
        const total = calculateTotal(newItems, state.discountPercent);
        return { ...state, items: newItems, total };
      }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const total = calculateTotal(newItems, state.discountPercent);
      return { ...state, items: newItems, total };
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      const total = calculateTotal(newItems, state.discountPercent);
      return { ...state, items: newItems, total };
    }
    
    case 'CLEAR_CART':
      return { ...initialState, products: state.products };
      
    case 'LOAD_CART': {
      const total = calculateTotal(action.payload, state.discountPercent);
      return { ...state, items: action.payload, total };
    }
    
    case 'LOAD_PRODUCTS':
      return { ...state, products: action.payload };
    
    case 'APPLY_PROMO': {
      const total = calculateTotal(state.items, action.payload.discountPercent);
      return { 
        ...state, 
        appliedPromo: action.payload.code, 
        discountPercent: action.payload.discountPercent, 
        total 
      };
    }
    
    case 'REMOVE_PROMO': {
      const total = calculateTotal(state.items, 0);
      return { ...state, appliedPromo: null, discountPercent: 0, total };
    }
    
    case 'LOAD_PROMO': {
      const total = calculateTotal(state.items, action.payload.discountPercent);
      return { 
        ...state, 
        appliedPromo: action.payload.appliedPromo, 
        discountPercent: action.payload.discountPercent, 
        total 
      };
    }
    
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Загрузка корзины из localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('sushimate_cart');
      if (savedCart) {
        const items = JSON.parse(savedCart);
        if (Array.isArray(items) && items.length > 0) {
          dispatch({ type: 'LOAD_CART', payload: items });
          console.log('✅ Cart loaded from localStorage:', items.length, 'items');
        }
      }
      
      const savedPromo = localStorage.getItem('sushimate_promo');
      if (savedPromo) {
        const promo = JSON.parse(savedPromo);
        if (promo.appliedPromo) {
          dispatch({ type: 'LOAD_PROMO', payload: promo });
        }
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  }, []);

  // Сохранение корзины
  useEffect(() => {
    try {
      localStorage.setItem('sushimate_cart', JSON.stringify(state.items));
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  }, [state.items]);

  // Сохранение промокода
  useEffect(() => {
    try {
      localStorage.setItem('sushimate_promo', JSON.stringify({ 
        appliedPromo: state.appliedPromo, 
        discountPercent: state.discountPercent 
      }));
    } catch (error) {
      console.error('Failed to save promo:', error);
    }
  }, [state.appliedPromo, state.discountPercent]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};