import axios from 'axios';

const API_URL = 'https://sushimate.net:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Товары
export const getProducts = () => api.get('/products');
export const getProduct = (id: string) => api.get(`/products/${id}`);

// Заказы
export const createOrder = (orderData: any) => api.post('/orders', orderData);
export const getOrders = () => api.get('/orders');
export const updateOrderStatus = (id: string, status: string) => 
  api.put(`/orders/${id}/status`, { status });

export default api;