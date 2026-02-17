import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Package, RefreshCw, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosInstance from '../api/axios'

const PreviousOrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedOrders, setExpandedOrders] = useState({})

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await axiosInstance.get('/order')
      const sortedOrders = response.data.sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
      setOrders(sortedOrders)
    } catch {
      setError('Siparisler yuklenemedi. Lutfen tekrar dene.')
      toast.error('Siparisler yuklenemedi.')
    } finally {
      setLoading(false)
    }
  }

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatStatus = (status) => {
    if (!status) return 'Hazirlaniyor'

    const map = {
      completed: 'Tamamlandi',
      processing: 'Isleniyor',
      pending: 'Beklemede',
      cancelled: 'Iptal',
    }

    return map[status] || status
  }

  const statusClassName = (status) => {
    const map = {
      completed: 'bg-[#e8f0ee] text-[#0f5c4a]',
      processing: 'bg-[#edf3fb] text-[#24588a]',
      pending: 'bg-[#f8f1df] text-[#8a5b14]',
      cancelled: 'bg-[#f9e6e6] text-[#a12f2f]',
    }

    return map[status] || 'bg-[#ece8dc] text-ink'
  }

  return (
    <div className="page-enter">
      <section className="page-shell space-y-6">
        <div className="surface-card p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="section-subtitle">Orders</p>
              <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">Siparislerim</h1>
              <p className="mt-2 text-sm text-muted">Tum siparislerini tarih sirasina gore inceleyebilirsin.</p>
            </div>

            <button type="button" onClick={fetchOrders} className="btn-secondary">
              <RefreshCw className="h-4 w-4" />
              Yenile
            </button>
          </div>
        </div>

        {loading ? (
          <div className="surface-card flex min-h-[280px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-soft border-t-accent" />
          </div>
        ) : error ? (
          <div className="surface-card p-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#a12f2f]">Error</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">{error}</h2>
            <button type="button" onClick={fetchOrders} className="btn-primary mt-5">
              Tekrar Dene
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="surface-card p-12 text-center">
            <Package className="mx-auto mb-3 h-10 w-10 text-muted" />
            <h2 className="text-2xl font-bold text-ink">Henuz siparisin yok</h2>
            <p className="mt-2 text-sm text-muted">Magazaya gidip ilk siparisini olusturabilirsin.</p>
            <Link to="/shop" className="btn-primary mt-6 inline-flex">
              Alisverise Basla
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="surface-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleOrderExpand(order.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[#f7f4ec]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#ece8dc] text-ink">
                      <ShoppingBag className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Siparis #{order.id}</p>
                      <p className="truncate text-sm text-ink">{formatDate(order.order_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName(order.status)}`}>
                      {formatStatus(order.status)}
                    </span>
                    <span className="text-sm font-bold text-ink">{order.price.toFixed(2)} TL</span>
                    {expandedOrders[order.id] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </button>

                {expandedOrders[order.id] && (
                  <div className="border-t border-soft bg-[#fffdf8] p-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="surface-card-soft p-4 text-sm">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">Siparis bilgisi</p>
                        <p className="text-ink">Tarih: {formatDate(order.order_date)}</p>
                        <p className="mt-1 text-ink">Durum: {formatStatus(order.status)}</p>
                        <p className="mt-1 text-ink">Toplam: {order.price.toFixed(2)} TL</p>
                      </div>

                      <div className="surface-card-soft p-4 text-sm">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">Teslimat bilgisi</p>
                        {order.address ? (
                          <>
                            <p className="font-semibold text-ink">{order.address.title}</p>
                            <p className="text-ink">{order.address.name} {order.address.surname}</p>
                            <p className="text-ink">{order.address.phone}</p>
                            <p className="text-ink">{order.address.neighborhood}</p>
                            <p className="text-ink">{order.address.district}/{order.address.city}</p>
                          </>
                        ) : (
                          <p className="text-muted">Adres bilgisi bulunamadi.</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {order.products.map((item, index) => {
                        const image = item.product?.images?.[0]?.url || item.product?.images?.[0]
                        return (
                          <div key={`${order.id}-${index}`} className="surface-card-soft flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                              {image ? (
                                <img src={image} alt={item.product?.name || 'Urun'} className="h-14 w-14 rounded-xl object-cover" />
                              ) : (
                                <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[#ece8dc]">
                                  <ShoppingBag className="h-5 w-5 text-muted" />
                                </span>
                              )}
                              <div>
                                <p className="text-sm font-semibold text-ink">{item.product?.name || `Urun #${item.product_id}`}</p>
                                <p className="text-xs text-muted">Detay: {item.detail || 'Standart'}</p>
                              </div>
                            </div>

                            <div className="text-right text-sm">
                              <p className="text-muted">Adet: {item.count}</p>
                              <p className="font-semibold text-ink">
                                {item.product ? (item.product.price * item.count).toFixed(2) : '--'} TL
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default PreviousOrdersPage
