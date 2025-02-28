import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import { ChevronDown, ChevronUp, Package, ShoppingBag, Clock, Calendar, DollarSign } from 'lucide-react';

const PreviousOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});
  const user = useSelector(state => state.client.user);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get('/order');
      console.log('Siparişler başarıyla alındı:', response.data);
      
      // Siparişleri tersten sıralayalım (en yeni en üstte)
      const sortedOrders = response.data.sort((a, b) => {
        return new Date(b.order_date) - new Date(a.order_date);
      });
      
      setOrders(sortedOrders);
    } catch (err) {
      console.error('Siparişler yüklenirken hata:', err);
      setError('Siparişleriniz yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      toast.error('Siparişler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Tarih formatını düzenleyen yardımcı fonksiyon
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  // Sipariş durumu rengini belirleyen yardımcı fonksiyon
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16 mb-16 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Siparişlerim</h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchOrders}
              className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              Tekrar Dene
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-full">
              <Package size={32} className="text-gray-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Henüz Siparişiniz Bulunmuyor</h2>
            <p className="text-gray-600 mb-6">
              Mağazamızdan henüz bir alışveriş yapmadınız. Hemen alışverişe başlayarak indirimli ürünleri keşfedin.
            </p>
            <a 
              href="/shop" 
              className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 inline-block"
            >
              Alışverişe Başla
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Sipariş Özeti Başlığı */}
                <div 
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleOrderExpand(order.id)}
                >
                  <div className="flex items-center">
                    <div className="bg-orange-100 p-2 rounded-full mr-4">
                      <ShoppingBag size={20} className="text-orange-500" />
                    </div>
                    <div>
                      <p className="font-medium">Sipariş #{order.id}</p>
                      <p className="text-sm text-gray-600">{formatDate(order.order_date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium mr-4 ${getStatusColor(order.status || 'processing')}`}>
                      {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'İşleniyor'}
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-medium">{order.price.toFixed(2)} TL</p>
                      <p className="text-xs text-gray-600">{order.products.length} Ürün</p>
                    </div>
                    {expandedOrders[order.id] ? (
                      <ChevronUp size={20} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-500" />
                    )}
                  </div>
                </div>
                
                {/* Sipariş Detayları (Açılır Panel) */}
                {expandedOrders[order.id] && (
                  <div className="border-t border-gray-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Sipariş Bilgileri */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center">
                          <Clock size={16} className="mr-2" />
                          Sipariş Bilgileri
                        </h3>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-gray-600">Sipariş Tarihi:</div>
                            <div>{formatDate(order.order_date)}</div>
                            <div className="text-gray-600">Sipariş Durumu:</div>
                            <div className={`font-medium ${order.status === 'cancelled' ? 'text-red-600' : ''}`}>
                              {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'İşleniyor'}
                            </div>
                            <div className="text-gray-600">Ödeme Yöntemi:</div>
                            <div>Kredi Kartı</div>
                            <div className="text-gray-600">Toplam Tutar:</div>
                            <div className="font-medium">{order.price.toFixed(2)} TL</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Teslimat Bilgileri */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center">
                          <Package size={16} className="mr-2" />
                          Teslimat Bilgileri
                        </h3>
                        <div className="bg-gray-50 p-3 rounded-md">
                          {order.address ? (
                            <div className="text-sm">
                              <p className="font-medium">{order.address.title}</p>
                              <p>{order.address.name} {order.address.surname}</p>
                              <p>{order.address.phone}</p>
                              <p>{order.address.neighborhood}</p>
                              <p>{order.address.district}/{order.address.city}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-600">Adres bilgisi bulunamadı</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Siparişteki Ürünler */}
                    <div className="mt-6">
                      <h3 className="font-semibold mb-3 flex items-center">
                        <ShoppingBag size={16} className="mr-2" />
                        Ürünler
                      </h3>
                      <div className="border rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Detay</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Adet</th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Fiyat</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {order.products.map((item, index) => (
                              <tr key={index}>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    {/* Ürün görseli, varsa gösterilir */}
                                    {item.product && item.product.images && item.product.images[0] ? (
                                      <img 
                                        src={item.product.images[0]}
                                        alt={item.product ? item.product.name : 'Ürün'}
                                        className="w-12 h-12 object-contain mr-3"
                                      />
                                    ) : (
                                      <div className="w-12 h-12 bg-gray-100 flex items-center justify-center mr-3">
                                        <ShoppingBag size={20} className="text-gray-400" />
                                      </div>
                                    )}
                                    <div>
                                      <p className="text-sm font-medium">
                                        {item.product ? item.product.name : `Ürün #${item.product_id}`}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {item.product ? `Ürün Kodu: ${item.product.id}` : `Ürün ID: ${item.product_id}`}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {item.detail || 'Standart'}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                                  {item.count}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-medium">
                                  {item.product ? 
                                    (item.product.price * item.count).toFixed(2) : 
                                    '—'} TL
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviousOrdersPage; 