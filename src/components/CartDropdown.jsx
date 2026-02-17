import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { removeFromCart, updateCartItem } from '../store/slices/cartSlice'

const CartDropdown = ({ isOpen, onClose }) => {
  const cart = useSelector((state) => state.cart.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const totalAmount = cart.reduce((total, item) => total + item.product.price * item.count, 0)

  if (!isOpen) {
    return null
  }

  return (
    <div className="surface-card absolute right-0 top-[calc(100%+10px)] z-50 w-[360px] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-['Syne'] text-lg font-bold">Sepet ({cart.length})</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-[#ece8dc] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em]"
        >
          Kapat
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-soft bg-[#f7f4ec] px-4 py-8 text-center">
          <ShoppingBag className="mx-auto mb-2 h-6 w-6 text-muted" />
          <p className="text-sm text-muted">Sepetin su an bos.</p>
        </div>
      ) : (
        <>
          <div className="max-h-[340px] space-y-3 overflow-auto pr-1">
            {cart.map((item) => (
              <div key={item.product.id} className="surface-card-soft flex items-start gap-3 p-3">
                <img
                  src={item.product.images?.[0]?.url}
                  alt={item.product.name}
                  className="h-16 w-16 rounded-xl object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{item.product.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{item.product.price.toFixed(2)} TL</p>

                  <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-soft bg-white px-2 py-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (item.count > 1) {
                          dispatch(updateCartItem(item.product.id, { count: item.count - 1 }))
                        }
                      }}
                      className="rounded-full p-1 hover:bg-[#ece8dc]"
                      aria-label="Adet azalt"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>

                    <span className="w-5 text-center text-xs font-semibold">{item.count}</span>

                    <button
                      type="button"
                      onClick={() => dispatch(updateCartItem(item.product.id, { count: item.count + 1 }))}
                      className="rounded-full p-1 hover:bg-[#ece8dc]"
                      aria-label="Adet arttir"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => dispatch(removeFromCart(item.product.id))}
                  className="rounded-full p-1.5 text-muted transition-colors hover:bg-[#f9e6e6] hover:text-[#a12f2f]"
                  aria-label="Urunu kaldir"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-soft pt-4">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-muted">Ara toplam</span>
              <span className="text-lg font-bold text-ink">{totalAmount.toFixed(2)} TL</span>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose()
                navigate('/cart')
              }}
              className="btn-primary w-full justify-center"
            >
              Sepete Git
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default CartDropdown
