import { X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import axiosInstance from '../api/axios'

const CardForm = ({ onClose, onSuccess, card = null }) => {
  const isEditing = Boolean(card)

  const [formData, setFormData] = useState({
    card_no: card?.card_no || '',
    expire_month: card?.expire_month || '',
    expire_year: card?.expire_year || '',
    name_on_card: card?.name_on_card || '',
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const formatCardNumber = (value) => {
    const onlyNumbers = value.replace(/[^\d]/g, '')
    return onlyNumbers.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
  }

  const handleCardNumberChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      card_no: formatCardNumber(event.target.value),
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setLoading(true)

      const cardData = {
        ...formData,
        card_no: formData.card_no.replace(/\s/g, ''),
        expire_month: Number.parseInt(formData.expire_month, 10),
        expire_year: Number.parseInt(formData.expire_year, 10),
      }

      if (isEditing) {
        await axiosInstance.put('/user/card', {
          id: card.id,
          ...cardData,
        })
        toast.success('Kart guncellendi.')
      } else {
        await axiosInstance.post('/user/card', cardData)
        toast.success('Kart eklendi.')
      }

      if (onSuccess) {
        onSuccess()
      }
      onClose()
    } catch {
      toast.error(isEditing ? 'Kart guncellenemedi.' : 'Kart eklenemedi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="surface-card w-full max-w-xl p-6 sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-ink">{isEditing ? 'Karti Duzenle' : 'Yeni Kart'}</h2>
        <button type="button" onClick={onClose} className="rounded-full bg-[#ece8dc] p-2 text-muted">
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">Kart Uzerindeki Isim</label>
          <input
            type="text"
            name="name_on_card"
            value={formData.name_on_card}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">Kart Numarasi</label>
          <input
            type="text"
            name="card_no"
            value={formData.card_no}
            onChange={handleCardNumberChange}
            className="input-field"
            placeholder="XXXX XXXX XXXX XXXX"
            maxLength={19}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink">Son Kullanma Ayi</label>
            <select name="expire_month" value={formData.expire_month} onChange={handleChange} className="input-field" required>
              <option value="">Ay sec</option>
              {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                <option key={month} value={month}>
                  {month < 10 ? `0${month}` : month}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-ink">Son Kullanma Yili</label>
            <select name="expire_year" value={formData.expire_year} onChange={handleChange} className="input-field" required>
              <option value="">Yil sec</option>
              {Array.from({ length: 20 }, (_, index) => new Date().getFullYear() + index).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
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

export default CardForm
