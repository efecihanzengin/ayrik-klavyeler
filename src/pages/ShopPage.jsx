import { Loader2, Search, SlidersHorizontal } from 'lucide-react'
import { memo, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactPaginate from 'react-paginate'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import ProductList from '../components/ProductList'
import { fetchProducts } from '../store/slices/productSlice'

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

const MemoizedProductList = memo(ProductList)

const SORT_OPTIONS = [
  { value: '', label: 'Varsayilan siralama' },
  { value: 'price:asc', label: 'Fiyat: Dusukten yuksege' },
  { value: 'price:desc', label: 'Fiyat: Yuksekten dusuge' },
  { value: 'rating:desc', label: 'Puan: Yuksekten dusuge' },
  { value: 'rating:asc', label: 'Puan: Dusukten yuksege' },
]

const sortProducts = (products, sortOption) => {
  if (!sortOption) {
    return products
  }

  const [field, direction] = sortOption.split(':')

  return [...products].sort((a, b) => {
    let comparison = 0

    if (field === 'price') {
      comparison = a.price - b.price
    }

    if (field === 'rating') {
      comparison = a.rating - b.rating
    }

    return direction === 'asc' ? comparison : -comparison
  })
}

const ShopPage = () => {
  const dispatch = useDispatch()
  const { gender, categoryName, categoryId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(searchParams.get('filter') || '')
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || '')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const itemsPerPage = 25
  const pageFromQuery = Number.parseInt(searchParams.get('page') || '1', 10)
  const [currentPage, setCurrentPage] = useState(Number.isNaN(pageFromQuery) ? 0 : Math.max(pageFromQuery - 1, 0))

  const products = useSelector((state) => state.product.productList)
  const total = useSelector((state) => state.product.total)
  const fetchState = useSelector((state) => state.product.fetchState)

  useEffect(() => {
    const pageNumber = Number.parseInt(searchParams.get('page') || '1', 10)
    const parsed = Number.isNaN(pageNumber) ? 1 : pageNumber
    setCurrentPage(Math.max(parsed - 1, 0))
  }, [searchParams])

  useEffect(() => {
    const next = new URLSearchParams(searchParams)

    if (debouncedSearchTerm) {
      next.set('filter', debouncedSearchTerm)
    } else {
      next.delete('filter')
    }

    if (sortOption) {
      next.set('sort', sortOption)
    } else {
      next.delete('sort')
    }

    if (next.get('page') !== '1') {
      next.set('page', '1')
    }

    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true })
    }
  }, [debouncedSearchTerm, sortOption, searchParams, setSearchParams])

  useEffect(() => {
    const params = {
      limit: itemsPerPage,
      offset: currentPage * itemsPerPage,
    }

    if (categoryId) {
      params.category = categoryId
    }

    if (debouncedSearchTerm) {
      params.filter = debouncedSearchTerm
    }

    if (sortOption) {
      params.sort = sortOption
    }

    dispatch(fetchProducts(params))
  }, [dispatch, categoryId, debouncedSearchTerm, sortOption, currentPage])

  const pageCount = Math.ceil(total / itemsPerPage)
  const sortedProducts = useMemo(() => sortProducts(products, sortOption), [products, sortOption])

  const handlePageChange = (selectedItem) => {
    const selectedPage = selectedItem.selected
    setCurrentPage(selectedPage)

    const params = new URLSearchParams(searchParams)
    params.set('page', String(selectedPage + 1))
    setSearchParams(params)
  }

  const categoryLabel = categoryName
    ? categoryName.replace(/-/g, ' ')
    : 'Tum urunler'

  const genderLabel =
    gender === 'kadin' ? 'Kadin' : gender === 'erkek' ? 'Erkek' : 'Secili Koleksiyon'

  if (fetchState === 'FETCHING') {
    return (
      <div className="page-shell flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="page-enter space-y-8">
      <section className="page-shell">
        <div className="surface-card overflow-hidden p-6 sm:p-8">
          <p className="section-subtitle">Catalog</p>
          <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">{categoryLabel}</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            {genderLabel} kategorisinde filtrelenmis urunler. Arama ve siralama ile hizli secim yapabilirsin.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            <Link to="/" className="rounded-full bg-[#ece8dc] px-3 py-1.5 transition-colors hover:text-ink">
              Ana Sayfa
            </Link>
            <span>/</span>
            <Link to="/shop" className="rounded-full bg-[#ece8dc] px-3 py-1.5 transition-colors hover:text-ink">
              Magaza
            </Link>
            {gender && (
              <>
                <span>/</span>
                <span className="rounded-full bg-[#ece8dc] px-3 py-1.5">{genderLabel}</span>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="page-shell">
        <div className="surface-card p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:max-w-md">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Urun ara"
                  className="input-field pl-11"
                />
              </div>

              <div className="relative w-full sm:w-[280px]">
                <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <select
                  value={sortOption}
                  onChange={(event) => setSortOption(event.target.value)}
                  className="input-field appearance-none pl-11"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="rounded-full bg-[#ece8dc] px-4 py-2 text-sm font-semibold text-ink">
              {total} urun bulundu
            </p>
          </div>
        </div>
      </section>

      <section className="page-shell">
        <MemoizedProductList products={sortedProducts} />
      </section>

      {pageCount > 1 && (
        <section className="page-shell pb-6">
          <div className="surface-card-soft flex flex-col items-center gap-4 p-5">
            <ReactPaginate
              previousLabel="Onceki"
              nextLabel="Sonraki"
              breakLabel="..."
              pageCount={pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={3}
              onPageChange={handlePageChange}
              forcePage={currentPage}
              containerClassName="flex flex-wrap items-center justify-center gap-2"
              pageClassName=""
              pageLinkClassName="rounded-full border border-soft px-4 py-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
              previousLinkClassName="rounded-full border border-soft px-4 py-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
              nextLinkClassName="rounded-full border border-soft px-4 py-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
              breakClassName="px-2 text-sm text-muted"
              activeLinkClassName="!border-none !bg-ink !text-white"
              disabledClassName="opacity-40 pointer-events-none"
            />

            <p className="text-xs uppercase tracking-[0.14em] text-muted">
              Gosterilen: {currentPage * itemsPerPage + 1} - {Math.min((currentPage + 1) * itemsPerPage, total)}
            </p>
          </div>
        </section>
      )}
    </div>
  )
}

export default ShopPage
