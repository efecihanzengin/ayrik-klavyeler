import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft, ChevronRight } from 'lucide-react';
import { removeFromCart, updateCartItem } from '../store/actions/cartActions';

const CartPage = () => {
  const cart = useSelector(state => state.cart.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Toplam hesaplamaları
  const subtotal = cart
    .filter(item => item.checked)
    .reduce((total, item) => total + (item.product.price * item.count), 0);
  
  const shippingCost = subtotal > 0 ? 29.99 : 0;
  const freeShippingThreshold = 150;
  const shippingDiscount = subtotal >= freeShippingThreshold ? -shippingCost : 0;
  const grandTotal = subtotal + shippingCost + shippingDiscount;

  // Checkbox değişikliğini handle et
  const handleCheckboxChange = (productId, checked) => {
    dispatch(updateCartItem(productId, { checked }));
  };

  // Ürün miktarını güncelle
  const updateCount = (productId, currentCount, increment) => {
    const newCount = increment ? currentCount + 1 : currentCount - 1;
    if (newCount > 0) {
      dispatch(updateCartItem(productId, { count: newCount }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      {/* Üst başlık ve geri dönüş */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/shop"
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Alışverişe Devam Et
        </Link>
        <h1 className="text-2xl font-bold">Sepetim ({cart.length} Ürün)</h1>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">Sepetinizde ürün bulunmamaktadır.</p>
          <Link
            to="/shop"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sol taraf - Ürün listesi */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={cart.every(item => item.checked)}
                        onChange={(e) => {
                          cart.forEach(item => {
                            handleCheckboxChange(item.product.id, e.target.checked);
                          });
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left">Ürün</th>
                    <th className="px-6 py-4 text-center">Fiyat</th>
                    <th className="px-6 py-4 text-center">Adet</th>
                    <th className="px-6 py-4 text-center">Toplam</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <tr key={item.product.id}>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={(e) => handleCheckboxChange(item.product.id, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              {item.product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.product.description.slice(0, 50)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        ₺{item.product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => updateCount(item.product.id, item.count, false)}
                            disabled={item.count <= 1}
                            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center">{item.count}</span>
                          <button
                            onClick={() => updateCount(item.product.id, item.count, true)}
                            className="p-1 rounded hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-medium">
                        ₺{(item.product.price * item.count).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => dispatch(removeFromCart(item.product.id))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sağ taraf - Sipariş özeti */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Sipariş Özeti</h2>
              
              {/* Fiyat detayları */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ürünün Toplamı</span>
                  <span className="font-medium">{subtotal.toFixed(2)} TL</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Kargo Toplam</span>
                  <span className="font-medium">{shippingCost.toFixed(2)} TL</span>
                </div>

                {subtotal >= freeShippingThreshold && (
                  <div className="flex justify-between text-green-600">
                    <span>150 TL ve Üzeri Kargo Bedava (Satıcı Karşılar)</span>
                    <span>{shippingDiscount.toFixed(2)} TL</span>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="font-semibold">Toplam</span>
                    <span className="font-semibold text-xl text-orange-500">
                      {grandTotal.toFixed(2)} TL
                    </span>
                  </div>
                </div>
              </div>

              {/* İndirim kodu alanı */}
              <div className="mb-6">
                <button 
                  className="flex items-center justify-between w-full py-3 px-4 border rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-500 transition-colors"
                >
                  <span>İNDİRİM KODU GİR</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Sepeti onayla butonu */}
              <button
                disabled={!cart.some(item => item.checked) || subtotal === 0}
                onClick={() => navigate('/order')}
                className="w-full bg-orange-500 text-white py-4 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>Sepeti Onayla</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage; 