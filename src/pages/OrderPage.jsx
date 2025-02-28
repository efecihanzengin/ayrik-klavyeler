import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import AddressForm from '../components/AddressForm';
import CardForm from '../components/CardForm';
import { Edit, Trash2, Plus, Check, CreditCard } from 'lucide-react';
import { clearCart } from "../store/actions/cartActions";

const OrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(1); // 1: Adres, 2: Ödeme
  const [addresses, setAddresses] = useState([]);
  const [cards, setCards] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [selectedInstallment, setSelectedInstallment] = useState('single');
  const [loading, setLoading] = useState({
    addresses: true,
    cards: true,
    checkout: false
  });
  const [error, setError] = useState({
    addresses: null,
    cards: null
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const cart = useSelector(state => state.cart.cart);
  const user = useSelector(state => state.client.user);

  useEffect(() => {
    fetchAddresses();
    fetchCards();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(prev => ({ ...prev, addresses: true }));
      setError(prev => ({ ...prev, addresses: null }));
      
      const response = await axiosInstance.get('/user/address');
      
      console.log('Adresler başarıyla alındı:', response.data);
      setAddresses(response.data);
      
      // İlk adresi otomatik olarak seç
      if (response.data.length > 0 && !selectedAddress) {
        setSelectedAddress(response.data[0].id);
      }
    } catch (err) {
      console.error('Address loading error:', err);
      setError(prev => ({ 
        ...prev, 
        addresses: 'Adresler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.' 
      }));
      toast.error('Adresler yüklenirken hata oluştu');
    } finally {
      setLoading(prev => ({ ...prev, addresses: false }));
    }
  };

  const fetchCards = async () => {
    try {
      setLoading(prev => ({ ...prev, cards: true }));
      setError(prev => ({ ...prev, cards: null }));
      
      const response = await axiosInstance.get('/user/card');
      
      console.log('Kartlar başarıyla alındı:', response.data);
      setCards(response.data);
      
      // İlk kartı otomatik olarak seç
      if (response.data.length > 0 && !selectedCard) {
        setSelectedCard(response.data[0].id);
      }
    } catch (err) {
      console.error('Card loading error:', err);
      setError(prev => ({ 
        ...prev, 
        cards: 'Kartlar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.' 
      }));
      toast.error('Kartlar yüklenirken hata oluştu');
    } finally {
      setLoading(prev => ({ ...prev, cards: false }));
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddressForm(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await axiosInstance.delete(`/user/address/${addressId}`);
      toast.success('Adres başarıyla silindi');
      
      // Seçili adresi güncelle
      if (selectedAddress === addressId) {
        setSelectedAddress(null);
      }
      
      fetchAddresses();
    } catch (err) {
      toast.error('Adres silinirken hata oluştu');
    }
  };

  const handleAddCard = () => {
    setEditingCard(null);
    setShowCardForm(true);
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setShowCardForm(true);
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await axiosInstance.delete(`/user/card/${cardId}`);
      toast.success('Kart başarıyla silindi');
      
      // Seçili kartı güncelle
      if (selectedCard === cardId) {
        setSelectedCard(null);
      }
      
      fetchCards();
    } catch (err) {
      toast.error('Kart silinirken hata oluştu');
    }
  };

  const continueToPayment = () => {
    if (!selectedAddress) {
      toast.error('Lütfen bir teslimat adresi seçin');
      return;
    }
    setActiveStep(2);
  };

  const goBackToAddresses = () => {
    setActiveStep(1);
  };

  const formatCartProducts = () => {
    return cart
      .filter(item => item.checked)
      .map(item => {
        let detail = "";
        if (item.product.color) {
          detail += item.product.color;
        }
        if (item.product.size) {
          detail += detail ? ` - ${item.product.size}` : item.product.size;
        }
        
        if (!detail) {
          detail = "standart";
        }
        
        return {
          product_id: item.product.id,
          count: item.count,
          detail: detail
        };
      });
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast.error('Lütfen bir teslimat adresi seçin');
      return;
    }
    
    if (selectedPaymentMethod === 'card' && !selectedCard && cards.length > 0) {
      toast.error('Lütfen bir kart seçin');
      return;
    }
    
    if (!termsAccepted) {
      toast.error('Lütfen koşulları kabul edin');
      return;
    }
    
    try {
      setLoading(prev => ({ ...prev, checkout: true }));
      
      const selectedCardData = cards.find(card => card.id === selectedCard);
      if (!selectedCardData && selectedPaymentMethod === 'card') {
        toast.error('Kart bilgisi bulunamadı');
        return;
      }
      
      const { total } = calculateTotals();
      
      const orderData = {
        address_id: selectedAddress,
        order_date: new Date().toISOString(),
        card_no: selectedCardData?.card_no.replace(/\s/g, '') || "0000000000000000",
        card_name: selectedCardData?.name_on_card || "Cash Payment",
        card_expire_month: selectedCardData?.expire_month || 1,
        card_expire_year: selectedCardData?.expire_year || 2030,
        card_ccv: 123,
        price: Number(total.toFixed(2)),
        products: formatCartProducts()
      };
      
      console.log("Sipariş verileri:", orderData);
      
      if (orderData.products.length === 0) {
        toast.error('Sepetinizde ürün bulunmamaktadır');
        setLoading(prev => ({ ...prev, checkout: false }));
        return;
      }
      
      const response = await axiosInstance.post('/order', orderData);
      
      console.log('Sipariş başarıyla oluşturuldu:', response.data);
      
      setOrderSuccess(true);
      
      dispatch(clearCart());
      
      toast.success('Siparişiniz başarıyla oluşturuldu!');
      
      setTimeout(() => {
        navigate('/');
      }, 5000);
      
    } catch (err) {
      console.error('Sipariş hatası:', err);
      toast.error('Sipariş oluşturulurken bir hata oluştu');
    } finally {
      setLoading(prev => ({ ...prev, checkout: false }));
    }
  };

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

  const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return '';
    const last4 = cardNumber.slice(-4);
    return `**** **** **** ${last4}`;
  };

  if (orderSuccess) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16 mb-16 min-h-screen">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-green-600 mb-4">Siparişiniz Başarıyla Oluşturuldu!</h1>
          
          <p className="text-gray-600 mb-8">
            Siparişiniz için teşekkür ederiz. Sipariş takibinizi hesabım bölümünden yapabilirsiniz.
          </p>
          
          <button
            onClick={() => navigate('/')}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            Alışverişe Devam Et
          </button>
          
          <p className="text-sm text-gray-500 mt-6">
            Birkaç saniye içinde otomatik olarak ana sayfaya yönlendirileceksiniz.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 mb-16 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Sipariş Oluştur</h1>
        
        <div className="flex mb-8 border-b">
          <div 
            className={`pb-4 px-4 ${activeStep === 1 ? 'text-orange-500 border-b-2 border-orange-500 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveStep(1)}
          >
            1. Teslimat Adresi
          </div>
          <div 
            className={`pb-4 px-4 ${activeStep === 2 ? 'text-orange-500 border-b-2 border-orange-500 font-medium' : 'text-gray-500'}`}
          >
            2. Ödeme Seçenekleri
          </div>
        </div>
        
        {activeStep === 1 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Adres Bilgileri</h2>
              <button
                onClick={handleAddAddress}
                className="flex items-center gap-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                <Plus size={16} />
                <span>Yeni Adres Ekle</span>
              </button>
            </div>
            
            {loading.addresses ? (
              <div className="bg-white border border-gray-200 rounded-lg p-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : error.addresses ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 mb-4">{error.addresses}</p>
                <button 
                  onClick={fetchAddresses}
                  className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
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
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                  Adres Ekle
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {addresses.map((address) => (
                  <div 
                    key={address.id} 
                    className={`bg-white border rounded-lg p-4 flex justify-between transition-colors
                      ${selectedAddress === address.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                    onClick={() => setSelectedAddress(address.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center
                          ${selectedAddress === address.id ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}
                        >
                          {selectedAddress === address.id && <Check size={12} color="white" />}
                        </div>
                      </div>
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
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAddress(address);
                        }}
                        className="text-blue-500 hover:text-blue-700"
                        aria-label="Düzenle"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAddress(address.id);
                        }}
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
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={continueToPayment}
                className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={addresses.length === 0 || loading.addresses || !selectedAddress}
              >
                Ödemeye Devam Et
              </button>
            </div>
          </div>
        )}
        
        {activeStep === 2 && (
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Adres Bilgileri</h3>
                    <button
                      onClick={goBackToAddresses}
                      className="text-blue-500 text-sm hover:underline"
                    >
                      Değiştir
                    </button>
                  </div>
                  
                  {selectedAddress && addresses.length > 0 && (
                    <div className="text-sm text-gray-600">
                      {(() => {
                        const address = addresses.find(a => a.id === selectedAddress);
                        if (!address) return null;
                        
                        return (
                          <>
                            <div className="font-medium">{address.title}</div>
                            <div>{address.name} {address.surname}</div>
                            <div>{address.phone}</div>
                            <div>{address.neighborhood}</div>
                            <div>{address.district}/{address.city}</div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold mb-4">Ödeme Seçenekleri</h3>
                  
                  <div className="mb-4">
                    <div 
                      className="flex items-center p-3 border rounded-lg mb-2 cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedPaymentMethod('card')}
                    >
                      <input 
                        type="radio" 
                        id="cardPayment"
                        name="paymentMethod"
                        checked={selectedPaymentMethod === 'card'}
                        onChange={() => setSelectedPaymentMethod('card')}
                        className="mr-2"
                      />
                      <label htmlFor="cardPayment" className="cursor-pointer">
                        Kart ile Öde
                      </label>
                    </div>
                    
                    {selectedPaymentMethod === 'card' && (
                      <div className="pl-6 mt-4">
                        <h4 className="font-medium mb-3">Kart Bilgileri</h4>
                        
                        {loading.cards ? (
                          <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-orange-500"></div>
                          </div>
                        ) : error.cards ? (
                          <div className="text-red-500 text-sm mb-2">
                            {error.cards}
                            <button 
                              onClick={fetchCards}
                              className="ml-2 text-blue-500 hover:underline"
                            >
                              Tekrar Dene
                            </button>
                          </div>
                        ) : cards.length === 0 ? (
                          <div className="text-center py-4">
                            <p className="text-gray-500 mb-2">Henüz kayıtlı kartınız bulunmamaktadır.</p>
                            <button
                              onClick={handleAddCard}
                              className="text-blue-500 hover:underline"
                            >
                              Kart Ekle
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                              {cards.map(card => (
                                <div 
                                  key={card.id}
                                  className={`border rounded-lg p-4 cursor-pointer transition-colors
                                    ${selectedCard === card.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                                  onClick={() => setSelectedCard(card.id)}
                                >
                                  <div className="flex justify-between mb-2">
                                    <div className="flex items-center">
                                      <CreditCard size={16} className="mr-2 text-gray-600" />
                                      <span className="font-medium">{card.name_on_card}</span>
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditCard(card);
                                        }}
                                        className="text-blue-500 hover:text-blue-700"
                                      >
                                        <Edit size={14} />
                                      </button>
                                      
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteCard(card.id);
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                  
                                  <div className="text-sm text-gray-600">
                                    {maskCardNumber(card.card_no)}
                                  </div>
                                  
                                  <div className="text-xs text-gray-500 mt-1">
                                    {card.expire_month < 10 ? '0' + card.expire_month : card.expire_month}/{card.expire_year}
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <button
                              onClick={handleAddCard}
                              className="flex items-center text-blue-500 hover:underline"
                            >
                              <Plus size={16} className="mr-1" />
                              <span>Başka bir kart ile ödeme yap</span>
                            </button>
                            
                            <div className="mt-6">
                              <h4 className="font-medium mb-3">Taksit Seçenekleri</h4>
                              
                              <div className="border rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-4 py-3 text-left">Taksit Sayısı</th>
                                      <th className="px-4 py-3 text-right">Aylık Ödeme</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y">
                                    <tr 
                                      className={`cursor-pointer hover:bg-gray-50 ${selectedInstallment === 'single' ? 'bg-orange-50' : ''}`}
                                      onClick={() => setSelectedInstallment('single')}
                                    >
                                      <td className="px-4 py-3">
                                        <div className="flex items-center">
                                          <input 
                                            type="radio" 
                                            checked={selectedInstallment === 'single'} 
                                            onChange={() => setSelectedInstallment('single')}
                                            className="mr-2"
                                          />
                                          <span>Tek Çekim</span>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 text-right font-medium text-orange-500">
                                        {total.toFixed(2)} TL
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <input 
                      type="checkbox"
                      id="termsCheck"
                      checked={termsAccepted}
                      onChange={() => setTermsAccepted(!termsAccepted)}
                      className="mt-1"
                    />
                    <label htmlFor="termsCheck" className="text-sm text-gray-600">
                      <span className="text-blue-500 hover:underline cursor-pointer">Ön Bilgilendirme Koşulları</span>'nı ve 
                      <span className="text-blue-500 hover:underline cursor-pointer"> Mesafeli Satış Sözleşmesi</span>'ni 
                      okudum, onaylıyorum.
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/3">
                <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
                  <h2 className="text-xl font-semibold mb-6">Sipariş Özeti</h2>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ürünün Toplamı</span>
                      <span>{subtotal.toFixed(2)} TL</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kargo Toplam</span>
                      <span>{shippingCost.toFixed(2)} TL</span>
                    </div>
                    
                    {shippingDiscount !== 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>150 TL ve Üzeri Kargo Bedava (Satıcı Karşılar)</span>
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
                  
                  <button 
                    onClick={handleCheckout}
                    disabled={
                      !selectedAddress || 
                      (selectedPaymentMethod === 'card' && !selectedCard && cards.length > 0) || 
                      !termsAccepted ||
                      loading.checkout
                    }
                    className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {loading.checkout ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        <span>İşleniyor...</span>
                      </div>
                    ) : "Ödeme Yap"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showAddressForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <AddressForm 
            onClose={() => setShowAddressForm(false)}
            onSuccess={fetchAddresses}
            address={editingAddress}
          />
        </div>
      )}
      
      {showCardForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <CardForm 
            onClose={() => setShowCardForm(false)}
            onSuccess={fetchCards}
            card={editingCard}
          />
        </div>
      )}
    </div>
  );
};

export default OrderPage; 