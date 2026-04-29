import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { promoCodes } from '../config/promocodes';

const Cart = () => {
  const { state, dispatch } = useCart();
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState('');

  const handleClearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const handleApplyPromo = () => {
    const code = promoInput.toUpperCase();
    if (state.appliedPromo === code) {
      setPromoMessage('Promocode already applied');
      return;
    }
    const promo = promoCodes[code];
    if (promo) {
      dispatch({ type: 'APPLY_PROMO', payload: { code, discountPercent: promo.discountPercent } });
      setPromoMessage(`Promocode applied! ${promo.discountPercent}% discount`);
      setPromoInput('');
    } else {
      setPromoMessage('Invalid promocode');
    }
  };

  const handleRemovePromo = () => {
    dispatch({ type: 'REMOVE_PROMO' });
    setPromoMessage('');
  };

  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = state.discountPercent > 0 ? subtotal * (state.discountPercent / 100) : 0;

  return (
    <div className="container mx-auto px-4 py-16 fade-in">
      <h1 className="text-4xl font-bold text-center mb-12 text-slate-900">Your Cart</h1>
      {state.items.length === 0 ? (
        <div className="text-center">
          <p className="text-xl mb-8">Your cart is empty</p>
          <Link to="/menu" className="bg-primary hover:bg-secondary text-white px-8 py-3 rounded-full font-semibold transition-colors">
            Browse Menu
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-8">
            {state.items.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8 glass-card rounded-[28px] p-6">
            <button
              onClick={handleClearCart}
              className="glass-button rounded-full px-6 py-3 text-sm font-semibold"
            >
              Clear Cart
            </button>
            <div className="text-right">
              <p className="text-slate-600">Subtotal: {subtotal.toFixed(2)} AED</p>
              {discount > 0 && (
                <p className="text-green-600">Discount ({state.discountPercent}%): -{discount.toFixed(2)} AED</p>
              )}
              <p className="text-2xl font-bold text-slate-900">Total: {state.total.toFixed(2)} AED</p>
            </div>
          </div>
        <div className="mb-8 glass-card rounded-[28px] p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Promo Code</h3>
        {state.appliedPromo ? (
            <div className="flex items-center justify-between">
            <p className="text-green-400">✓ {state.appliedPromo} applied ({state.discountPercent}% off)</p>
            <button
                onClick={handleRemovePromo}
                className="text-red-400 hover:text-red-300 underline"
            >
                Remove
            </button>
            </div>
        ) : (
            <div className="flex gap-4">
            <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Enter promo code (e.g., SALE15)"
                className="flex-1 px-4 py-3 rounded-xl border border-orange-500/30 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
            />
            <button
                onClick={handleApplyPromo}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg"
            >
                Apply
            </button>
            </div>
        )}
        {promoMessage && !state.appliedPromo && (
            <p className="text-red-400 mt-2 text-sm">{promoMessage}</p>
        )}
        </div>
          <div className="text-center">
            <Link
              to="/checkout"
              className="glass-button rounded-full px-8 py-3 font-semibold"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;