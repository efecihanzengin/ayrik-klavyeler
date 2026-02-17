import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { removeFromCart, updateCartItem } from '../store/slices/cartSlice'

const CartPage = () => {
  const cart = useSelector((state) => state.cart.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const subtotal = cart
    .filter((item) => item.checked)
    .reduce((total, item) => total + item.product.price * item.count, 0)

  const shippingCost = subtotal > 0 ? 29.99 : 0
  const freeShippingThreshold = 150
  const shippingDiscount = subtotal >= freeShippingThreshold ? -shippingCost : 0
  const grandTotal = subtotal + shippingCost + shippingDiscount

  const isAllChecked = cart.length > 0 && cart.every((item) => item.checked)

  const handleCheckboxChange = (productId, checked) => {
    dispatch(updateCartItem(productId, { checked }))
  }

  const updateCount = (productId, currentCount, increment) => {
    const next = increment ? currentCount + 1 : currentCount - 1
    if (next > 0) {
      dispatch(updateCartItem(productId, { count: next }))
    }
  }

  return (
    <div className="page-enter">
      <section className="page-shell">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="section-subtitle">Cart</p>
            <h1 className="mt-2 text-3xl font-bold text-ink">Sepetim ({cart.length})</h1>
          </div>

          <Link to="/shop" className="btn-secondary">
            Magazaya Don
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="surface-card p-12 text-center">
            <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-muted" />
            <h2 className="text-2xl font-bold text-ink">Sepetin bos</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              Urun ekleyerek odeme akisina gecip siparisini tamamlayabilirsin.
            </p>
            <Link to="/shop" className="btn-primary mt-6">
              Alisverise Basla
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              <div className="surface-card-soft flex items-center justify-between px-4 py-3 text-sm">
                <label className="inline-flex items-center gap-2 font-semibold text-ink">
                  <input
                    type="checkbox"
                    checked={isAllChecked}
                    onChange={(event) => {
                      cart.forEach((item) => {
                        handleCheckboxChange(item.product.id, event.target.checked)
                      })
                    }}
                  />
                  Tum urunleri sec
                </label>
                <p className="text-muted">{cart.filter((item) => item.checked).length} urun secili</p>
              </div>

              {cart.map((item) => (
                <article key={item.product.id} className="surface-card overflow-hidden p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={(event) => handleCheckboxChange(item.product.id, event.target.checked)}
                        className="mt-2"
                      />

                      <img
                        src={item.product.images?.[0]?.url}
                        alt={item.product.name}
                        className="h-24 w-24 rounded-2xl object-cover"
                      />

                      <div className="min-w-0 space-y-1">
                        <h2 className="line-clamp-1 text-lg font-semibold text-ink">{item.product.name}</h2>
                        <p className="line-clamp-2 text-sm text-muted">{item.product.description}</p>
                        <p className="text-sm font-semibold text-ink">{item.product.price.toFixed(2)} TL</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                      <div className="inline-flex items-center gap-2 rounded-full border border-soft bg-[#f7f4ec] p-1">
                        <button
                          type="button"
                          onClick={() => updateCount(item.product.id, item.count, false)}
                          disabled={item.count <= 1}
                          className="rounded-full p-1.5 text-ink transition-colors hover:bg-white disabled:opacity-50"
                          aria-label="Adet azalt"
                        >
                          <Minus className="h-4 w-4" />
                        </button>

                        <span className="w-8 text-center text-sm font-semibold">{item.count}</span>

                        <button
                          type="button"
                          onClick={() => updateCount(item.product.id, item.count, true)}
                          className="rounded-full p-1.5 text-ink transition-colors hover:bg-white"
                          aria-label="Adet arttir"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <p className="text-lg font-bold text-ink">{(item.product.price * item.count).toFixed(2)} TL</p>
                        <button
                          type="button"
                          onClick={() => dispatch(removeFromCart(item.product.id))}
                          className="rounded-full p-2 text-muted transition-colors hover:bg-[#f9e6e6] hover:text-[#a12f2f]"
                          aria-label="Urunu kaldir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="surface-card h-fit p-6 lg:sticky lg:top-28">
              <h2 className="mb-4 text-2xl font-bold text-ink">Siparis Ozeti</h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Urun toplam</span>
                  <span className="font-semibold text-ink">{subtotal.toFixed(2)} TL</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Kargo</span>
                  <span className="font-semibold text-ink">{shippingCost.toFixed(2)} TL</span>
                </div>

                {shippingDiscount !== 0 && (
                  <div className="flex items-center justify-between text-[#0f5c4a]">
                    <span>150 TL uzeri kargo indirimi</span>
                    <span className="font-semibold">{shippingDiscount.toFixed(2)} TL</span>
                  </div>
                )}
              </div>

              <div className="my-5 border-t border-soft pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Genel toplam</span>
                  <span className="text-2xl font-bold text-ink">{grandTotal.toFixed(2)} TL</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/order')}
                disabled={!cart.some((item) => item.checked) || subtotal === 0}
                className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-45"
              >
                Sepeti Onayla
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="mt-3 text-center text-xs text-muted">Guvenli odeme ve hizli teslimat destegi</p>
            </aside>
          </div>
        )}
      </section>
    </div>
  )
}

export default CartPage
