import { Link, useParams } from 'react-router-dom'

const ProductList = ({ products }) => {
  const { gender, categoryName, categoryId } = useParams()

  const createSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  if (!products || products.length === 0) {
    return (
      <div className="surface-card p-12 text-center">
        <p className="text-sm text-muted">Secilen kriterlerde urun bulunamadi.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => {
        const safeGender = gender || 'urunler'
        const safeCategory = categoryName || 'tum'
        const safeCategoryId = categoryId || product.category_id || product.category?.id || '0'

        return (
          <article
            key={product.id}
            className="group surface-card-soft overflow-hidden transition-transform duration-300 hover:-translate-y-1"
          >
            <Link
              to={`/shop/${safeGender}/${safeCategory}/${safeCategoryId}/${createSlug(product.name)}/${product.id}`}
              className="block"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={product.images?.[0]?.url}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">
                  ★ {product.rating.toFixed(1)}
                </div>
              </div>

              <div className="space-y-2 p-4">
                <h3 className="line-clamp-1 text-base font-semibold text-ink transition-colors group-hover:text-accent">
                  {product.name}
                </h3>
                <p className="line-clamp-2 min-h-[2.5rem] text-sm text-muted">{product.description}</p>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-lg font-bold text-ink">{product.price.toFixed(2)} TL</p>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Detay</span>
                </div>
              </div>
            </Link>
          </article>
        )
      })}
    </div>
  )
}

export default ProductList
