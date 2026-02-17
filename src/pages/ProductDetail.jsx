import { ArrowLeft, Loader2, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { addToCart } from '../store/slices/cartSlice'
import { clearProductDetail, fetchProductDetail } from '../store/slices/productSlice'

const ProductDetail = () => {
  const { productId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const product = useSelector((state) => state.product.selectedProduct)
  const fetchState = useSelector((state) => state.product.productFetchState)

  useEffect(() => {
    dispatch(fetchProductDetail(productId))

    return () => {
      dispatch(clearProductDetail())
    }
  }, [dispatch, productId])

  const handleAddToCart = () => {
    dispatch(addToCart(product))
  }

  if (fetchState === 'FETCHING') {
    return (
      <div className="page-shell flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </div>
    )
  }

  if (fetchState === 'FAILED' || !product) {
    return (
      <div className="page-shell py-16">
        <div className="surface-card mx-auto max-w-xl p-10 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-[#a12f2f]">Error</p>
          <h1 className="mb-2 text-2xl font-bold">Urun verisi yuklenemedi</h1>
          <p className="mb-6 text-sm text-muted">Baglanti sorunu veya gecersiz urun kaydi olabilir.</p>
          <button type="button" onClick={() => navigate(-1)} className="btn-primary">
            <ArrowLeft className="h-4 w-4" />
            Geri Don
          </button>
        </div>
      </div>
    )
  }

  const imageUrl =
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80'

  return (
    <div className="page-enter">
      <section className="page-shell">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-soft bg-white px-4 py-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Geri Don
        </button>

        <div className="surface-card overflow-hidden">
          <div className="grid gap-8 p-6 lg:grid-cols-[1fr_1fr] lg:p-8">
            <div className="overflow-hidden rounded-[24px] bg-[#e4dfd1]">
              <img src={imageUrl} alt={product.name} className="h-full w-full object-cover" />
            </div>

            <div className="flex flex-col">
              <span className="chip mb-4 w-fit">Product detail</span>
              <h1 className="text-3xl font-bold text-ink sm:text-4xl">{product.name}</h1>

              <div className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-[#ece8dc] px-3 py-1 text-sm font-semibold text-ink">
                <Sparkles className="h-4 w-4 text-accent" />
                {product.rating.toFixed(1)} rating
              </div>

              <p className="mt-5 text-sm leading-relaxed text-muted">{product.description}</p>

              <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-y border-soft py-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">Fiyat</p>
                  <p className="text-3xl font-bold text-ink">{product.price.toFixed(2)} TL</p>
                </div>
                <div
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${
                    product.stock > 0 ? 'bg-[#e8f0ee] text-[#0f5c4a]' : 'bg-[#f8e8e8] text-[#a12f2f]'
                  }`}
                >
                  {product.stock > 0 ? `${product.stock} adet stokta` : 'Stokta yok'}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="surface-card-soft flex items-center gap-2 p-3 text-sm">
                  <Truck className="h-4 w-4 text-accent" />
                  Hizli kargo
                </div>
                <div className="surface-card-soft flex items-center gap-2 p-3 text-sm">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  Guvenli odeme
                </div>
                <div className="surface-card-soft flex items-center gap-2 p-3 text-sm">
                  <Sparkles className="h-4 w-4 text-accent" />
                  Premium secim
                </div>
              </div>

              <button
                type="button"
                disabled={product.stock === 0}
                onClick={handleAddToCart}
                className={`mt-7 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition-colors ${
                  product.stock > 0 ? 'bg-ink text-white hover:bg-black' : 'cursor-not-allowed bg-gray-300 text-gray-600'
                }`}
              >
                {product.stock > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProductDetail
