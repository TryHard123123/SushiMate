export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  delivery: {
    streetAddress: string;
    building: string;
    apartment: string;
    entrance: string;
    floor: string;
    landmark: string;
    fullAddress: string;
    specialInstructions: string;
  };
  items: OrderItem[];
  subtotal: number;
  promoDiscount: number;
  pointsDiscount: number;
  total: number;
  promocode: string | null;
  pointsUsed: number;
  pointsEarned: number;
  status: 'pending' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
  timestamp: string;
  estimatedDelivery?: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
}