import { products } from '../data/products';

// Товары
export const getProducts = () => Promise.resolve({ data: products });
export const getProduct = (id: string) => Promise.resolve({ data: products.find(p => p.id.toString() === id) });

// Заказы - сохраняем в localStorage
export const createOrder = (orderData: any) => {
  // Получаем существующие заказы
  const savedOrders = localStorage.getItem('sushimate_orders');
  const orders = savedOrders ? JSON.parse(savedOrders) : [];
  
  // Создаем новый заказ
  const newOrder = {
    _id: Date.now().toString(),
    id: Date.now().toString(),
    ...orderData,
    createdAt: new Date().toISOString(),
  };
  
  // Добавляем в начало массива
  orders.unshift(newOrder);
  
  // Сохраняем в localStorage
  localStorage.setItem('sushimate_orders', JSON.stringify(orders));
  
  console.log('✅ Order saved:', newOrder);
  
  // Возвращаем Promise с данными заказа
  return Promise.resolve({ data: newOrder });
};

export const getOrders = () => {
  const savedOrders = localStorage.getItem('sushimate_orders');
  const orders = savedOrders ? JSON.parse(savedOrders) : [];
  console.log('📋 Loading orders:', orders.length);
  return Promise.resolve({ data: orders });
};

export const updateOrderStatus = (id: string, status: string) => {
  const savedOrders = localStorage.getItem('sushimate_orders');
  const orders = savedOrders ? JSON.parse(savedOrders) : [];
  
  const updatedOrders = orders.map((order: any) => 
    order._id === id ? { ...order, status } : order
  );
  
  localStorage.setItem('sushimate_orders', JSON.stringify(updatedOrders));
  return Promise.resolve({ data: {} });
};

export default {};