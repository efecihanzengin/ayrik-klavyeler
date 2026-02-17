import { X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import axiosInstance from '../api/axios'

const AddressForm = ({ onClose, onSuccess, address = null }) => {
  const isEditing = Boolean(address)

  const [formData, setFormData] = useState({
    title: address?.title || '',
    name: address?.name || '',
    surname: address?.surname || '',
    phone: address?.phone || '',
    city: address?.city || '',
    district: address?.district || '',
    neighborhood: address?.neighborhood || '',
    address: address?.address || '',
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setLoading(true)

      if (isEditing) {
        await axiosInstance.put('/user/address', {
          id: address.id,
          ...formData,
        })
        toast.success('Adres guncellendi.')
      } else {
        await axiosInstance.post('/user/address', formData)
        toast.success('Adres eklendi.')
      }

      if (onSuccess) {
        onSuccess()
      }
      onClose()
    } catch {
      toast.error(isEditing ? 'Adres guncellenemedi.' : 'Adres eklenemedi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="surface-card w-full max-w-xl p-6 sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-ink">{isEditing ? 'Adresi Duzenle' : 'Yeni Adres'}</h2>
        <button type="button" onClick={onClose} className="rounded-full bg-[#ece8dc] p-2 text-muted">
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">Adres Basligi</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ev, Is..."
            className="input-field"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink">Ad</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink">Soyad</label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">Telefon</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="05XXXXXXXXX"
            className="input-field"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink">Sehir</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink">Ilce</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">Mahalle</label>
          <input
            type="text"
            name="neighborhood"
            value={formData.neighborhood}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">Detayli Adres</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="input-field min-h-[110px]"
            placeholder="Sokak, bina, daire no"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
            Iptal
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Isleniyor...' : isEditing ? 'Guncelle' : 'Ekle'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddressForm
