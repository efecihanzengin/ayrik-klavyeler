import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateCartItem } from '../store/actions/cartActions';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartDropdown = ({ isOpen, onClose }) => {
  const cart = useSelector(state => state.cart.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalAmount = cart.reduce((total, item) => {
    return total + (item.product.price * item.count);
  }, 0);

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Sepetim ({cart.length} Ürün)</h3>
        
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Sepetiniz boş</p>
        ) : (
          <>
            <div className="max-h-96 overflow-auto">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-4 py-4 border-b">
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <h4 className="text-sm font-medium">{item.product.name}</h4>
                    <p className="text-sm text-gray-500">₺{item.product.price.toFixed(2)}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          if (item.count > 1) {
                            dispatch(updateCartItem(item.product.id, { count: item.count - 1 }));
                          }
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      
                      <span className="w-8 text-center">{item.count}</span>
                      
                      <button
                        onClick={() => {
                          dispatch(updateCartItem(item.product.id, { count: item.count + 1 }));
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => dispatch(removeFromCart(item.product.id))}
                    className="p-2 hover:bg-red-50 hover:text-red-500 rounded"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Toplam:</span>
                <span className="font-semibold">₺{totalAmount.toFixed(2)}</span>
              </div>
              
              <button
                onClick={() => {
                  onClose();
                  navigate('/cart');
                }}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Sepete Git
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDropdown; 