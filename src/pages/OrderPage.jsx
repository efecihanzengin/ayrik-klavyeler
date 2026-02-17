import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Check,
  CreditCard,
  Edit,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Truck,
} from 'lucide-react'
import { toast } from 'react-toastify'
import axiosInstance from '../api/axios'
import AddressForm from '../components/AddressForm'
import CardForm from '../components/CardForm'
import { clearCart } from '../store/slices/cartSlice'

const OrderPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [activeStep, setActiveStep] = useState(1)
  const [addresses, setAddresses] = useState([])
  const [cards, setCards] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [selectedCard, setSelectedCard] = useState(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card')
  const [selectedInstallment, setSelectedInstallment] = useState('single')

  const [loading, setLoading] = useState({
    addresses: true,
    cards: true,
    checkout: false,
  })

  const [error, setError] = useState({
    addresses: null,
    cards: null,
  })

  const [showAddressForm, setShowAddressForm] = useState(false)
  const [showCardForm, setShowCardForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [editingCard, setEditingCard] = useState(null)

  const [termsAccepted, setTermsAccepted] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  const cart = useSelector((state) => state.cart.cart)

  useEffect(() => {
    fetchAddresses()
    fetchCards()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchAddresses = async () => {
    try {
      setLoading((prev) => ({ ...prev, addresses: true }))
      setError((prev) => ({ ...prev, addresses: null }))

      const response = await axiosInstance.get('/user/address')
      setAddresses(response.data)

      if (response.data.length > 0 && !selectedAddress) {
        setSelectedAddress(response.data[0].id)
      }
    } catch {
      setError((prev) => ({
        ...prev,
        addresses: 'Adresler yuklenirken bir hata olustu.',
      }))
      toast.error('Adresler yuklenemedi.')
    } finally {
      setLoading((prev) => ({ ...prev, addresses: false }))
    }
  }

  const fetchCards = async () => {
    try {
      setLoading((prev) => ({ ...prev, cards: true }))
      setError((prev) => ({ ...prev, cards: null }))

      const response = await axiosInstance.get('/user/card')
      setCards(response.data)

      if (response.data.length > 0 && !selectedCard) {
        setSelectedCard(response.data[0].id)
      }
    } catch {
      setError((prev) => ({
        ...prev,
        cards: 'Kartlar yuklenirken bir hata olustu.',
      }))
      toast.error('Kartlar yuklenemedi.')
    } finally {
      setLoading((prev) => ({ ...prev, cards: false }))
    }
  }

  const handleAddAddress = () => {
    setEditingAddress(null)
    setShowAddressForm(true)
  }

  const handleEditAddress = (address) => {
    setEditingAddress(address)
    setShowAddressForm(true)
  }

  const handleDeleteAddress = async (addressId) => {
    try {
      await axiosInstance.delete(`/user/address/${addressId}`)
      toast.success('Adres silindi.')

      if (selectedAddress === addressId) {
        setSelectedAddress(null)
      }

      fetchAddresses()
    } catch {
      toast.error('Adres silinemedi.')
    }
  }

  const handleAddCard = () => {
    setEditingCard(null)
    setShowCardForm(true)
  }

  const handleEditCard = (card) => {
    setEditingCard(card)
    setShowCardForm(true)
  }

  const handleDeleteCard = async (cardId) => {
    try {
      await axiosInstance.delete(`/user/card/${cardId}`)
      toast.success('Kart silindi.')

      if (selectedCard === cardId) {
        setSelectedCard(null)
      }

      fetchCards()
    } catch {
      toast.error('Kart silinemedi.')
    }
  }

  const continueToPayment = () => {
    if (!selectedAddress) {
      toast.error('Lutfen teslimat adresi sec.')
      return
    }

    setActiveStep(2)
  }

  const goBackToAddresses = () => {
    setActiveStep(1)
  }

  const formatCartProducts = () => {
    return cart
      .filter((item) => item.checked)
      .map((item) => {
        let detail = ''

        if (item.product.color) {
          detail += item.product.color
        }

        if (item.product.size) {
          detail += detail ? ` - ${item.product.size}` : item.product.size
        }

        if (!detail) {
          detail = 'standart'
        }

        return {
          product_id: item.product.id,
          count: item.count,
          detail,
        }
      })
  }

  const calculateTotals = () => {
    const subtotal = cart
      .filter((item) => item.checked)
      .reduce((total, item) => total + item.product.price * item.count, 0)

    const shippingCost = subtotal > 0 ? 29.99 : 0
    const freeShippingThreshold = 150
    const shippingDiscount = subtotal >= freeShippingThreshold ? -shippingCost : 0
    const total = subtotal + shippingCost + shippingDiscount

    return { subtotal, shippingCost, shippingDiscount, total }
  }

  const { subtotal, shippingCost, shippingDiscount, total } = calculateTotals()

  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast.error('Lutfen teslimat adresi sec.')
      return
    }

    if (selectedPaymentMethod === 'card' && cards.length > 0 && !selectedCard) {
      toast.error('Lutfen bir kart sec.')
      return
    }

    if (!termsAccepted) {
      toast.error('Lutfen kosullari kabul et.')
      return
    }

    const products = formatCartProducts()
    if (products.length === 0) {
      toast.error('Sepetinde secili urun yok.')
      return
    }

    const selectedCardData = cards.find((card) => card.id === selectedCard)

    try {
      setLoading((prev) => ({ ...prev, checkout: true }))

      const orderData = {
        address_id: selectedAddress,
        order_date: new Date().toISOString(),
        card_no:
          selectedPaymentMethod === 'card'
            ? selectedCardData?.card_no?.replace(/\s/g, '') || '0000000000000000'
            : '0000000000000000',
        card_name: selectedPaymentMethod === 'card' ? selectedCardData?.name_on_card || 'Unknown' : 'Cash Payment',
        card_expire_month: selectedPaymentMethod === 'card' ? selectedCardData?.expire_month || 1 : 1,
        card_expire_year: selectedPaymentMethod === 'card' ? selectedCardData?.expire_year || 2030 : 2030,
        card_ccv: 123,
        price: Number(total.toFixed(2)),
        products,
      }

      await axiosInstance.post('/order', orderData)
      dispatch(clearCart())
      setOrderSuccess(true)
      toast.success('Siparis olusturuldu.')

      setTimeout(() => {
        navigate('/')
      }, 5000)
    } catch {
      toast.error('Siparis olusturulurken hata olustu.')
    } finally {
      setLoading((prev) => ({ ...prev, checkout: false }))
    }
  }

  const selectedAddressData = addresses.find((address) => address.id === selectedAddress)

  const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return '**** **** **** ****'
    const last4 = cardNumber.slice(-4)
    return `**** **** **** ${last4}`
  }

  if (orderSuccess) {
    return (
      <div className="page-enter">
        <section className="page-shell">
          <div className="surface-card mx-auto max-w-xl p-10 text-center">
            <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f0ee] text-[#0f5c4a]">
              <Check className="h-8 w-8" />
            </span>
            <h1 className="mt-4 text-3xl font-bold text-ink">Siparisin basariyla olusturuldu</h1>
            <p className="mt-3 text-sm text-muted">
              Siparis detaylarini &quot;Siparislerim&quot; ekranindan takip edebilirsin. Birkac saniye sonra ana sayfaya
              yonlendirileceksin.
            </p>
            <button type="button" onClick={() => navigate('/')} className="btn-primary mt-6">
              Alisverise Don
            </button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page-enter">
      <section className="page-shell space-y-6">
        <div className="surface-card p-6 sm:p-8">
          <p className="section-subtitle">Checkout</p>
          <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">Siparis Olustur</h1>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                activeStep === 1 ? 'bg-ink text-white' : 'bg-[#ece8dc] text-muted'
              }`}
            >
              1. Teslimat
            </button>
            <button
              type="button"
              onClick={() => {
                if (selectedAddress) setActiveStep(2)
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                activeStep === 2 ? 'bg-ink text-white' : 'bg-[#ece8dc] text-muted'
              }`}
            >
              2. Odeme
            </button>
          </div>
        </div>

        {activeStep === 1 ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-ink">Teslimat Adresi</h2>
              <button type="button" onClick={handleAddAddress} className="btn-primary">
                <Plus className="h-4 w-4" />
                Yeni Adres
              </button>
            </div>

            {loading.addresses ? (
              <div className="surface-card flex min-h-[220px] items-center justify-center">
                <div className="h-9 w-9 animate-spin rounded-full border-2 border-soft border-t-accent" />
              </div>
            ) : error.addresses ? (
              <div className="surface-card p-8 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#a12f2f]">Error</p>
                <p className="mt-2 text-ink">{error.addresses}</p>
                <button type="button" onClick={fetchAddresses} className="btn-secondary mt-4">
                  <RefreshCw className="h-4 w-4" />
                  Tekrar Dene
                </button>
              </div>
            ) : addresses.length === 0 ? (
              <div className="surface-card p-10 text-center">
                <p className="text-lg font-semibold text-ink">Kayitli adres bulunamadi.</p>
                <p className="mt-2 text-sm text-muted">Siparis verebilmek icin once bir adres ekle.</p>
                <button type="button" onClick={handleAddAddress} className="btn-primary mt-5">
                  Adres Ekle
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {addresses.map((address) => (
                  <article
                    key={address.id}
                    className={`surface-card-soft cursor-pointer p-4 transition-colors ${
                      selectedAddress === address.id ? 'border-[#0f5c4a] bg-[#e8f0ee]' : ''
                    }`}
                    onClick={() => setSelectedAddress(address.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                            selectedAddress === address.id
                              ? 'border-[#0f5c4a] bg-[#0f5c4a] text-white'
                              : 'border-soft bg-white text-transparent'
                          }`}
                        >
                          <Check className="h-3 w-3" />
                        </span>

                        <div className="text-sm">
                          <p className="font-semibold text-ink">{address.title}</p>
                          <p className="text-muted">{address.name} {address.surname}</p>
                          <p className="text-muted">{address.phone}</p>
                          <p className="text-muted">{address.neighborhood}</p>
                          <p className="text-muted">{address.district}/{address.city}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            handleEditAddress(address)
                          }}
                          className="rounded-full p-2 text-muted transition-colors hover:bg-white hover:text-ink"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            handleDeleteAddress(address.id)
                          }}
                          className="rounded-full p-2 text-muted transition-colors hover:bg-[#f9e6e6] hover:text-[#a12f2f]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={continueToPayment}
                disabled={addresses.length === 0 || loading.addresses || !selectedAddress}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-45"
              >
                Odemeye Devam Et
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-5">
              <div className="surface-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-bold text-ink">Teslimat Ozeti</h3>
                  <button type="button" onClick={goBackToAddresses} className="btn-secondary px-4 py-2">
                    Degistir
                  </button>
                </div>

                {selectedAddressData ? (
                  <div className="mt-4 text-sm text-muted">
                    <p className="font-semibold text-ink">{selectedAddressData.title}</p>
                    <p>{selectedAddressData.name} {selectedAddressData.surname}</p>
                    <p>{selectedAddressData.phone}</p>
                    <p>{selectedAddressData.neighborhood}</p>
                    <p>{selectedAddressData.district}/{selectedAddressData.city}</p>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-muted">Secili adres bulunamadi.</p>
                )}
              </div>

              <div className="surface-card p-5">
                <h3 className="text-xl font-bold text-ink">Odeme Secenekleri</h3>

                <div className="mt-4 space-y-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('card')}
                    className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold ${
                      selectedPaymentMethod === 'card'
                        ? 'border-[#0f5c4a] bg-[#e8f0ee] text-ink'
                        : 'border-soft bg-[#fffdf8] text-muted'
                    }`}
                  >
                    Kart ile Ode
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('cash')}
                    className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold ${
                      selectedPaymentMethod === 'cash'
                        ? 'border-[#0f5c4a] bg-[#e8f0ee] text-ink'
                        : 'border-soft bg-[#fffdf8] text-muted'
                    }`}
                  >
                    Kapida Odeme
                  </button>
                </div>

                {selectedPaymentMethod === 'card' && (
                  <div className="mt-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Kayitli kartlar</p>
                      <button type="button" onClick={handleAddCard} className="btn-secondary px-4 py-2">
                        <Plus className="h-4 w-4" />
                        Kart Ekle
                      </button>
                    </div>

                    {loading.cards ? (
                      <div className="surface-card-soft flex min-h-[120px] items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-soft border-t-accent" />
                      </div>
                    ) : error.cards ? (
                      <div className="surface-card-soft p-4 text-sm text-[#a12f2f]">
                        {error.cards}
                        <button type="button" onClick={fetchCards} className="btn-secondary ml-3 px-4 py-1.5">
                          Tekrar Dene
                        </button>
                      </div>
                    ) : cards.length === 0 ? (
                      <div className="surface-card-soft p-6 text-center text-sm text-muted">
                        Kayitli kart bulunamadi. Yeni kart ekleyerek devam edebilirsin.
                      </div>
                    ) : (
                      <>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {cards.map((card) => (
                            <article
                              key={card.id}
                              className={`surface-card-soft cursor-pointer p-4 ${
                                selectedCard === card.id ? 'border-[#0f5c4a] bg-[#e8f0ee]' : ''
                              }`}
                              onClick={() => setSelectedCard(card.id)}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                                    <CreditCard className="h-4 w-4" />
                                    {card.name_on_card}
                                  </p>
                                  <p className="mt-1 text-xs text-muted">{maskCardNumber(card.card_no)}</p>
                                  <p className="text-xs text-muted">
                                    {card.expire_month < 10 ? `0${card.expire_month}` : card.expire_month}/{card.expire_year}
                                  </p>
                                </div>

                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation()
                                      handleEditCard(card)
                                    }}
                                    className="rounded-full p-1.5 text-muted transition-colors hover:bg-white hover:text-ink"
                                  >
                                    <Edit className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation()
                                      handleDeleteCard(card.id)
                                    }}
                                    className="rounded-full p-1.5 text-muted transition-colors hover:bg-[#f9e6e6] hover:text-[#a12f2f]"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            </article>
                          ))}
                        </div>

                        <div>
                          <p className="mb-2 text-sm font-semibold text-ink">Taksit Secenegi</p>
                          <button
                            type="button"
                            onClick={() => setSelectedInstallment('single')}
                            className={`w-full rounded-2xl border px-4 py-3 text-left text-sm ${
                              selectedInstallment === 'single'
                                ? 'border-[#0f5c4a] bg-[#e8f0ee] text-ink'
                                : 'border-soft bg-white text-muted'
                            }`}
                          >
                            Tek cekim - {total.toFixed(2)} TL
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="surface-card-soft p-4">
                <label className="inline-flex items-start gap-2 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={() => setTermsAccepted((prev) => !prev)}
                    className="mt-1"
                  />
                  On bilgilendirme kosullari ve mesafeli satis sozlesmesini okudum, onayliyorum.
                </label>
              </div>
            </div>

            <aside className="surface-card h-fit p-6 lg:sticky lg:top-28">
              <h2 className="text-2xl font-bold text-ink">Siparis Ozeti</h2>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Urun Toplami</span>
                  <span className="font-semibold text-ink">{subtotal.toFixed(2)} TL</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Kargo</span>
                  <span className="font-semibold text-ink">{shippingCost.toFixed(2)} TL</span>
                </div>
                {shippingDiscount !== 0 && (
                  <div className="flex items-center justify-between text-[#0f5c4a]">
                    <span>Kargo indirimi</span>
                    <span className="font-semibold">{shippingDiscount.toFixed(2)} TL</span>
                  </div>
                )}
              </div>

              <div className="my-5 border-t border-soft pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Toplam</span>
                  <span className="text-2xl font-bold text-ink">{total.toFixed(2)} TL</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={
                  !selectedAddress ||
                  (selectedPaymentMethod === 'card' && cards.length > 0 && !selectedCard) ||
                  !termsAccepted ||
                  loading.checkout
                }
                className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-45"
              >
                {loading.checkout ? 'Isleniyor...' : 'Odemeyi Tamamla'}
              </button>

              <div className="mt-4 space-y-2 text-xs text-muted">
                <p className="inline-flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  Guvenli odeme adimi
                </p>
                <p className="inline-flex items-center gap-1">
                  <Truck className="h-4 w-4 text-accent" />
                  Hizli kargo destegi
                </p>
              </div>
            </aside>
          </div>
        )}
      </section>

      {showAddressForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <AddressForm
            onClose={() => setShowAddressForm(false)}
            onSuccess={fetchAddresses}
            address={editingAddress}
          />
        </div>
      )}

      {showCardForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <CardForm onClose={() => setShowCardForm(false)} onSuccess={fetchCards} card={editingCard} />
        </div>
      )}
    </div>
  )
}

export default OrderPage
