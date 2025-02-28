import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import AddressForm from '../components/AddressForm';
import { Edit, Trash2, Plus } from 'lucide-react';

const OrderPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  
  const user = useSelector(state => state.client.user);
  const cart = useSelector(state => state.cart.cart);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Debug için token'ı manuel olarak ekleyelim ve kontrol edelim
      const token = localStorage.getItem('token');
      console.log('Kullanılan token:', token);
      
      const response = await axiosInstance.get('/user/address', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Adresler başarıyla alındı:', response.data);
      setAddresses(response.data);
    } catch (err) {
      console.error('Address loading error:', err);
      setError('Adresler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      toast.error('Adresler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Debug için user ve token durumunu kontrol et
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Current user:', user);
    console.log('Current token:', token);
  }, [user]);

  const handleAddAddress = () => {
    setSelectedAddress(null);
    setShowAddressForm(true);
  };

  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await axiosInstance.delete(`/user/address/${addressId}`);
      toast.success('Adres başarıyla silindi');
      fetchAddresses();
    } catch (err) {
      toast.error('Adres silinirken hata oluştu');
    }
  };

  const handleFormClose = () => {
    setShowAddressForm(false);
    setSelectedAddress(null);
  };

  const handleFormSuccess = () => {
    fetchAddresses();
  };

  // Sepet toplamını hesapla
  const calculateTotals = () => {
    const subtotal = cart
      .filter(item => item.checked)
      .reduce((total, item) => total + (item.product.price * item.count), 0);
    
    const shippingCost = subtotal > 0 ? 29.99 : 0;
    const freeShippingThreshold = 150;
    const shippingDiscount = subtotal >= freeShippingThreshold ? -shippingCost : 0;
    const total = subtotal + shippingCost + shippingDiscount;
    
    return { subtotal, shippingCost, shippingDiscount, total };
  };

  const { subtotal, shippingCost, shippingDiscount, total } = calculateTotals();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 mb-16 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Sipariş Oluştur</h1>
        
        {/* STEP 1: Adresler */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">1. Teslimat Adresi</h2>
            <button
              onClick={handleAddAddress}
              className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <Plus size={16} />
              <span>Yeni Adres Ekle</span>
            </button>
          </div>
          
          {loading ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchAddresses}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Tekrar Dene
              </button>
            </div>
          ) : addresses.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-2">Henüz kayıtlı adresiniz bulunmamaktadır.</p>
              <p className="text-gray-500 text-sm mb-4">Sipariş verebilmek için lütfen bir adres ekleyin.</p>
              <button
                onClick={handleAddAddress}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Adres Ekle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {addresses.map((address) => (
                <div 
                  key={address.id} 
                  className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between"
                >
                  <div>
                    <div className="font-medium">{address.title}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {address.name} {address.surname}
                    </div>
                    <div className="text-sm text-gray-600">
                      {address.phone}
                    </div>
                    <div className="text-sm text-gray-600">
                      {address.neighborhood}
                    </div>
                    <div className="text-sm text-gray-600">
                      {address.district}/{address.city}
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => handleEditAddress(address)}
                      className="text-blue-500 hover:text-blue-700"
                      aria-label="Düzenle"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Sil"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* STEP 2: Ödeme Yöntemi */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Ödeme Yöntemi</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <p className="text-gray-600">Önce teslimat adresinizi seçin.</p>
          </div>
        </div>
        
        {/* Sipariş Özeti */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Sipariş Özeti</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Ürün Toplamı</span>
              <span>{subtotal.toFixed(2)} TL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kargo</span>
              <span>{shippingCost.toFixed(2)} TL</span>
            </div>
            {shippingDiscount !== 0 && (
              <div className="flex justify-between text-green-600">
                <span>150 TL Üzeri Kargo Bedava</span>
                <span>{shippingDiscount.toFixed(2)} TL</span>
              </div>
            )}
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between font-semibold">
              <span>Toplam</span>
              <span className="text-orange-500 text-xl">{total.toFixed(2)} TL</span>
            </div>
          </div>
        </div>
        
        {/* Ödemeye Devam Et Butonu */}
        <div className="flex justify-end mt-6">
          <button 
            className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={addresses.length === 0 || loading || error}
          >
            Ödemeye Devam Et
          </button>
        </div>
      </div>

      {/* Adres Form Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <AddressForm 
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
            address={selectedAddress}
          />
        </div>
      )}
    </div>
  );
};

export default OrderPage; 