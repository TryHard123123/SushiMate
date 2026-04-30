import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import OrderPage from './pages/OrderPage';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import OrderDetails from './pages/OrderDetails';
import Profile from './pages/Profile';
import Policy from './pages/Policy';
import Terms from './pages/Terms';
import OrderSuccess from './pages/OrderSuccess';
import ProductModal from './components/ProductModal';
import { CartProvider, useCart } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { ProfileProvider } from './context/ProfileContext';
import { LoyaltyProvider } from './context/LoyaltyContext';
import { Product } from './context/CartContext';
import { getProducts } from './services/api';

const ProductsLoader = ({ children }: { children: React.ReactNode }) => {
  const { dispatch } = useCart();
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await getProducts();
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

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/order" element={<OrderPage onOpenModal={handleOpenModal} />} />
            <Route path="/" element={<Home onOpenModal={handleOpenModal} />} />
            <Route path="/order" element={<OrderPage onOpenModal={handleOpenModal} />} />
            <Route path="/menu" element={<OrderPage onOpenModal={handleOpenModal} />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </main>
        <Footer />
        <ProductModal product={selectedProduct} isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
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