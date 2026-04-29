import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import Profile from './pages/Profile';
import Policy from './pages/Policy';
import Terms from './pages/Terms';
import ProductModal from './components/ProductModal';
import Toast from './components/Toast';
import { CartProvider, useCart } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { ProfileProvider } from './context/ProfileContext';
import { LoyaltyProvider } from './context/LoyaltyContext';
import { Product } from './context/CartContext';
import { getProducts } from './services/api';
import OrderDetails from './pages/OrderDetails';
import Payment from './pages/Payment';
import OrderSuccess from './pages/OrderSuccess';

const ProductsLoader = ({ children }: { children: React.ReactNode }) => {
  const { dispatch } = useCart();
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await getProducts();
        // getProducts возвращает { data: products } или сам массив
        const products = Array.isArray(response) ? response : response.data;
        if (Array.isArray(products)) {
          dispatch({ type: 'LOAD_PRODUCTS', payload: products });
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };
    loadProducts();
  }, [dispatch]);
  return <>{children}</>;
};


function AppContent() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleOpenModal = (product: Product) => { setSelectedProduct(product); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setSelectedProduct(null); };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route path="/" element={<Home onOpenModal={handleOpenModal} />} />
            <Route path="/menu" element={<Menu onOpenModal={handleOpenModal} />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </main>
        <Footer />
        <ProductModal product={selectedProduct} isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </Router>
  );
}

function App() {
  return (
    <LoyaltyProvider>
      <CartProvider>
        <OrderProvider>
          <ProfileProvider>
            <ProductsLoader>
              <AppContent />
            </ProductsLoader>
          </ProfileProvider>
        </OrderProvider>
      </CartProvider>
    </LoyaltyProvider>
  );
}

export default App;
