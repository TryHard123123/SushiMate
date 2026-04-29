import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLoyalty } from '../context/LoyaltyContext';
import { createOrder } from '../services/api';

interface CardData {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
}

interface OrderData {
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
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  subtotal: number;
  promoDiscount: number;
  promoCode: string | null;
  promoDiscountPercent: number;
  pointsDiscount: number;
  pointsUsed: number;
  pointsEarned: number;
  total: number;
  usePoints: boolean;
}

const Payment = () => {
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { addPoints, redeemPoints } = useLoyalty();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [cardData, setCardData] = useState<CardData>({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    const pendingOrder = sessionStorage.getItem('pendingOrder');
    if (pendingOrder) {
      setOrderData(JSON.parse(pendingOrder));
    } else {
      navigate('/checkout');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
    }
    
    if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\//g, '')
        .replace(/(\d{2})(\d{0,2})/, (_, p1, p2) => {
          if (p2) return `${p1}/${p2}`;
          return p1;
        })
        .slice(0, 5);
    }

    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const validateForm = () => {
    const cardNumberClean = cardData.cardNumber.replace(/\s/g, '');
    if (cardNumberClean.length !== 16) {
      alert('Please enter a valid 16-digit card number');
      return false;
    }
    if (!cardData.cardholderName.trim()) {
      alert('Please enter cardholder name');
      return false;
    }
    if (cardData.expiryDate.length !== 5) {
      alert('Please enter valid expiry date (MM/YY)');
      return false;
    }
    if (cardData.cvv.length < 3) {
      alert('Please enter valid CVV');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!orderData) return;
    
    setIsProcessing(true);

    setTimeout(async () => {
      let finalPointsDiscount = 0;
      if (orderData.usePoints && orderData.pointsDiscount > 0) {
        if (redeemPoints(orderData.pointsDiscount)) {
          finalPointsDiscount = orderData.pointsDiscount;
        }
      }
      
      const earnedPoints = orderData.pointsEarned;
      if (earnedPoints > 0) {
        addPoints(earnedPoints);
      }
      
      const finalOrderData = {
        customer: orderData.customer,
        delivery: orderData.delivery,
        items: orderData.items,
        subtotal: orderData.subtotal,
        promoDiscount: orderData.promoDiscount,
        pointsDiscount: finalPointsDiscount,
        total: orderData.total,
        promocode: orderData.promoCode,
        pointsUsed: finalPointsDiscount,
        pointsEarned: earnedPoints,
        status: 'pending',
        cardDetails: {
          cardNumber: cardData.cardNumber,
          cardholderName: cardData.cardholderName,
          expiryDate: cardData.expiryDate,
          cvv: cardData.cvv
        }
      };
      
      try {
        const response = await createOrder(finalOrderData);
        
        alert(`✅ Payment successful! Order #${response.data.orderId}\nTotal: ${orderData.total.toFixed(2)} CAD`);
        
        dispatch({ type: 'CLEAR_CART' });
        
        sessionStorage.removeItem('pendingOrder');
        
        navigate('/orders');
        
      } catch (error) {
        console.error('Order error:', error);
        alert('Something went wrong. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
  };

  if (!orderData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-4xl mb-4 animate-pulse">🍣</div>
        <p className="text-gray-500">Loading payment details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Link to="/checkout" className="text-pink-500 hover:text-pink-600 mb-6 inline-block">
          ← Back to Checkout
        </Link>

        <div className="bg-white border border-pink-200 rounded-2xl p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Payment Details
          </h1>

          {/* Order Summary */}
          <div className="bg-pink-50 rounded-2xl p-4 mb-8">
            <h3 className="text-lg font-semibold text-pink-500 mb-3">Order Summary</h3>
            <div className="space-y-2">
              {orderData.items.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.quantity}× {item.name}</span>
                  <span className="text-gray-900 font-medium">{item.total.toFixed(2)} CAD</span>
                </div>
              ))}
              {orderData.items.length > 3 && (
                <p className="text-xs text-gray-400">+{orderData.items.length - 3} more items</p>
              )}
            </div>
            <div className="border-t border-pink-200 mt-3 pt-3">
              <div className="flex justify-between mb-1">
                <span className="text-gray-500">Subtotal:</span>
                <span className="text-gray-900">{orderData.subtotal.toFixed(2)} CAD</span>
              </div>
              {orderData.promoDiscount > 0 && (
                <div className="flex justify-between mb-1">
                  <span className="text-green-600">Promo ({orderData.promoCode}):</span>
                  <span className="text-green-600">-{orderData.promoDiscount.toFixed(2)} CAD</span>
                </div>
              )}
              {orderData.pointsDiscount > 0 && (
                <div className="flex justify-between mb-1">
                  <span className="text-yellow-600">Points Discount:</span>
                  <span className="text-yellow-600">-{orderData.pointsDiscount.toFixed(2)} CAD</span>
                </div>
              )}
              <div className="flex justify-between font-bold pt-2 border-t border-pink-200">
                <span className="text-gray-900">Total to Pay:</span>
                <span className="text-pink-500 text-xl">{orderData.total.toFixed(2)} CAD</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Card Number *
              </label>
              <input
                type="text"
                name="cardNumber"
                value={cardData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Cardholder Name *
              </label>
              <input
                type="text"
                name="cardholderName"
                value={cardData.cardholderName}
                onChange={handleInputChange}
                placeholder="JOHN DOE"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition uppercase"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={cardData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  CVV / CVC *
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={cardData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength={4}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition"
                />
              </div>
            </div>

            <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-green-500">🔒</span>
                <span>Secure payment — Your card details are encrypted</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-4 rounded-full font-semibold text-white transition-all shadow-md
                ${isProcessing
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-pink-500 hover:bg-pink-600 transform hover:scale-[1.02] hover:shadow-lg'
                }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Processing Payment...
                </span>
              ) : (
                `Pay ${orderData.total.toFixed(2)} CAD`
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              By clicking "Pay", you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;