import { useState } from 'react';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

const AddressForm = ({ onClose, onSuccess, address = null }) => {
  const isEditing = !!address;
  
  const [formData, setFormData] = useState({
    title: address?.title || '',
    name: address?.name || '',
    surname: address?.surname || '',
    phone: address?.phone || '',
    city: address?.city || '',
    district: address?.district || '',
    neighborhood: address?.neighborhood || '',
    address: address?.address || '',
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (isEditing) {
        // Düzenleme işlemi
        await axiosInstance.put('/user/address', {
          id: address.id,
          ...formData
        });
        toast.success('Adres başarıyla güncellendi');
      } else {
        // Ekleme işlemi
        await axiosInstance.post('/user/address', formData);
        toast.success('Adres başarıyla eklendi');
      }
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Adres kayıt hatası:', err);
      toast.error(isEditing ? 'Adres güncellenirken hata oluştu' : 'Adres eklenirken hata oluştu');
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
      
      <h2 className="text-xl font-bold mb-6">{isEditing ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Adres Başlığı</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Örn: Ev, İş"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ad</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Soyad</label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Telefon</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="05XXXXXXXXX"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Şehir</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">İlçe</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Mahalle</label>
            <input
              type="text"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Detaylı Adres</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="3"
              placeholder="Sokak, bina no, daire no..."
              required
            />
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
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'İşleniyor...' : isEditing ? 'Güncelle' : 'Ekle'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm; 