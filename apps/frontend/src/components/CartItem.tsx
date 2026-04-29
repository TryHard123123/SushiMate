import { CartItem as CartItemType } from '../context/CartContext';
import { useCart } from '../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { dispatch } = useCart();

  const handleUpdateQuantity = (quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: item.id });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity } });
    }
  };

  const handleRemove = () => {
    dispatch({ type: 'REMOVE_ITEM', payload: item.id });
  };

  // Получаем URL картинки (если есть, иначе плейсхолдер)
  const imageUrl = item.image && item.image !== '' 
    ? item.image 
    : 'https://via.placeholder.com/80x80?text=🍣';

  return (
    <div className="glass-card rounded-[24px] p-4 mb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 overflow-hidden rounded-3xl bg-gray-800 shadow-inner flex-shrink-0">
          <img 
            src={imageUrl} 
            alt={item.name} 
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80?text=🍣';
            }}
          />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{item.name}</h3>
          <p className="text-orange-400 text-sm font-semibold">{item.price.toFixed(2)} AED each</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 flex-wrap justify-between lg:justify-end">
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
            className="bg-gray-800 hover:bg-gray-700 border border-orange-500/50 text-white w-9 h-9 rounded-full font-bold text-lg transition-colors"
          >
            -
          </button>
          <span className="text-white font-bold text-xl min-w-[30px] text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white w-9 h-9 rounded-full font-bold text-lg transition-all shadow-lg"
          >
            +
          </button>
        </div>
        <button
          onClick={handleRemove}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full transition-colors text-sm font-semibold"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;