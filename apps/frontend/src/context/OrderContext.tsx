import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order } from '../types/order';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrderById: (id: string) => Order | undefined;
  repeatOrder: (orderId: string) => void;
  refreshOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    refreshOrders();
  }, []);

  const refreshOrders = () => {
    const saved = localStorage.getItem('sushimate_orders');
    if (saved) {
      setOrders(JSON.parse(saved));
    }
  };

  const addOrder = (order: Order) => {
    const saved = localStorage.getItem('sushimate_orders');
    let existingOrders: Order[] = [];
    if (saved) {
      existingOrders = JSON.parse(saved);
    }
    const newOrders = [order, ...existingOrders];
    setOrders(newOrders);
    localStorage.setItem('sushimate_orders', JSON.stringify(newOrders));
    
    // Обновляем статистику в профиле
    const profileEvent = new CustomEvent('orderAdded');
    window.dispatchEvent(profileEvent);
  };

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  const repeatOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const itemsToAdd = order.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        description: '',
        image: '',
        images: [],
        category: '',
        fullDescription: ''
      }));
      localStorage.setItem('repeat_order_items', JSON.stringify(itemsToAdd));
      window.location.href = '/cart';
    }
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, getOrderById, repeatOrder, refreshOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
};