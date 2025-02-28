import { useState } from 'react';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

const CardForm = ({ onClose, onSuccess, card = null }) => {
  const isEditing = !!card;
  
  const [formData, setFormData] = useState({
    card_no: card?.card_no || '',
    expire_month: card?.expire_month || '',
    expire_year: card?.expire_year || '',
    name_on_card: card?.name_on_card || '',
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Kart numarası formatı (4'er grup şeklinde)
  const formatCardNumber = (value) => {
    const regex = /^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/g;
    const onlyNumbers = value.replace(/[^\d]/g, '');
    
    return onlyNumbers.replace(regex, (regex, $1, $2, $3, $4) => {
      return [$1, $2, $3, $4].filter(group => !!group).join(' ');
    });
  };
  
  const handleCardNumberChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      card_no: formatCardNumber(value)
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Kart numarasından boşlukları temizle
      const cardData = {
        ...formData,
        card_no: formData.card_no.replace(/\s/g, ''),
        expire_month: parseInt(formData.expire_month),
        expire_year: parseInt(formData.expire_year)
      };
      
      if (isEditing) {
        // Düzenleme işlemi
        await axiosInstance.put('/user/card', {
          id: card.id,
          ...cardData
        });
        toast.success('Kart başarıyla güncellendi');
      } else {
        // Ekleme işlemi
        await axiosInstance.post('/user/card', cardData);
        toast.success('Kart başarıyla eklendi');
      }
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Kart kayıt hatası:', err);
      toast.error(isEditing ? 'Kart güncellenirken hata oluştu' : 'Kart eklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
      <button 
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        aria-label="Kapat"
      >
        <X size={20} />
      </button>
      
      <h2 className="text-xl font-bold mb-6">{isEditing ? 'Kartı Düzenle' : 'Yeni Kart Ekle'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Kart Üzerindeki İsim</label>
            <input
              type="text"
              name="name_on_card"
              value={formData.name_on_card}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Ad Soyad"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Kart Numarası</label>
            <input
              type="text"
              name="card_no"
              value={formData.card_no}
              onChange={handleCardNumberChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="XXXX XXXX XXXX XXXX"
              maxLength={19} // 16 rakam + 3 boşluk
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Son Kullanma Ayı</label>
              <select
                name="expire_month"
                value={formData.expire_month}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Ay Seçin</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>
                    {month < 10 ? `0${month}` : month}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Son Kullanma Yılı</label>
              <select
                name="expire_year"
                value={formData.expire_year}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Yıl Seçin</option>
                {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            İptal
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            disabled={loading}
          >
            {loading ? 'İşleniyor...' : isEditing ? 'Güncelle' : 'Ekle'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CardForm; 