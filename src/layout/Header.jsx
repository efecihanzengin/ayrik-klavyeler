import {
  ChevronDown,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingBag,
  User2,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { logoutUser } from '../store/slices/clientSlice'
import { fetchCategories } from '../store/slices/productSlice'
import CartDropdown from '../components/CartDropdown'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isShopOpen, setIsShopOpen] = useState(false)
  const [isUserOpen, setIsUserOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const user = useSelector((state) => state.client.user)
  const categories = useSelector((state) => state.product.categories)
  const cart = useSelector((state) => state.cart.cart)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const shopRef = useRef(null)
  const userRef = useRef(null)

  const isLoggedIn = user && Object.keys(user).length > 0

  const totalItems = useMemo(
    () => cart.reduce((total, item) => total + item.count, 0),
    [cart],
  )

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    const onClickOutside = (event) => {
      if (shopRef.current && !shopRef.current.contains(event.target)) {
        setIsShopOpen(false)
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setIsUserOpen(false)
      }
    }

    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const womenCategories = categories.filter((cat) => cat.gender === 'k')
  const menCategories = categories.filter((cat) => cat.gender === 'e')

  const createCategoryPath = (category) => {
    const categorySlug = category.code?.split(':')[1] || 'kategori'
    const genderSlug = category.gender === 'k' ? 'kadin' : 'erkek'
    return `/shop/${genderSlug}/${categorySlug}/${category.id}`
  }

  const handleLogout = () => {
    dispatch(logoutUser())
    setIsUserOpen(false)
    toast.success('Basariyla cikis yapildi.')
    navigate('/')
  }

  const closeMobileMenu = () => {
    setIsMenuOpen(false)
    setIsShopOpen(false)
  }

  return (
    <header className="glass-nav fixed inset-x-0 top-0 z-50">
      <div className="page-shell">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="group flex items-center gap-3">
            <span className="rounded-full border border-soft bg-white px-3 py-1 text-[11px] font-bold tracking-[0.22em] text-ink">
              AK
            </span>
            <div className="leading-tight">
              <p className="font-['Syne'] text-lg font-bold tracking-tight">Ayrik Klavyeler</p>
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Design-first commerce</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <Link to="/" className="text-sm font-semibold text-muted transition-colors hover:text-ink">
              Ana Sayfa
            </Link>

            <div ref={shopRef} className="relative">
              <button
                type="button"
                onClick={() => setIsShopOpen((prev) => !prev)}
                className="inline-flex items-center gap-1 text-sm font-semibold text-muted transition-colors hover:text-ink"
              >
                Magaza
                <ChevronDown className={`h-4 w-4 transition-transform ${isShopOpen ? 'rotate-180' : ''}`} />
              </button>

              {isShopOpen && (
                <div className="surface-card absolute left-1/2 top-[calc(100%+14px)] z-50 w-[560px] -translate-x-1/2 p-5">
                  <div className="mb-4 flex items-center justify-between border-b border-soft pb-3">
                    <p className="font-['Syne'] text-lg font-bold">Kategoriler</p>
                    <Link
                      to="/shop"
                      onClick={() => setIsShopOpen(false)}
                      className="text-xs font-semibold uppercase tracking-[0.2em] text-accent"
                    >
                      Tum urunler
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Kadin</p>
                      <div className="space-y-2">
                        {womenCategories.length > 0 ? (
                          womenCategories.map((category) => (
                            <Link
                              key={category.id}
                              to={createCategoryPath(category)}
                              onClick={() => setIsShopOpen(false)}
                              className="block rounded-xl px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-[#ece8dc]"
                            >
                              {category.title}
                            </Link>
                          ))
                        ) : (
                          <p className="text-sm text-muted">Kategori yukleniyor...</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Erkek</p>
                      <div className="space-y-2">
                        {menCategories.length > 0 ? (
                          menCategories.map((category) => (
                            <Link
                              key={category.id}
                              to={createCategoryPath(category)}
                              onClick={() => setIsShopOpen(false)}
                              className="block rounded-xl px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-[#ece8dc]"
                            >
                              {category.title}
                            </Link>
                          ))
                        ) : (
                          <p className="text-sm text-muted">Kategori yukleniyor...</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link to="/about" className="text-sm font-semibold text-muted transition-colors hover:text-ink">
              Hakkimizda
            </Link>
            <Link to="/blog" className="text-sm font-semibold text-muted transition-colors hover:text-ink">
              Blog
            </Link>
            <Link to="/contact" className="text-sm font-semibold text-muted transition-colors hover:text-ink">
              Iletisim
            </Link>
            <Link to="/legal" className="text-sm font-semibold text-muted transition-colors hover:text-ink">
              Yasal
            </Link>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="rounded-full border border-soft bg-white p-2.5 text-muted transition-colors hover:text-ink"
              aria-label="Magazada ara"
            >
              <Search className="h-5 w-5" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCartOpen((prev) => !prev)}
                className="relative rounded-full border border-soft bg-white p-2.5 text-muted transition-colors hover:text-ink"
                aria-label="Sepet"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </button>
              <CartDropdown isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            </div>

            {isLoggedIn ? (
              <div ref={userRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-soft bg-white px-4 py-2 text-sm font-semibold text-ink"
                >
                  <User2 className="h-4 w-4" />
                  <span className="max-w-[130px] truncate">{user.name || user.email}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isUserOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserOpen && (
                  <div className="surface-card absolute right-0 top-[calc(100%+10px)] w-56 p-2">
                    <Link
                      to="/my-orders"
                      onClick={() => setIsUserOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-[#ece8dc]"
                    >
                      <Package className="h-4 w-4" />
                      Siparislerim
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#9e2e2e] transition-colors hover:bg-[#f8e8e8]"
                    >
                      <LogOut className="h-4 w-4" />
                      Cikis Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth" className="btn-primary px-5 py-2.5 text-xs uppercase tracking-[0.16em]">
                Giris / Kayit
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex rounded-full border border-soft bg-white p-2.5 text-ink md:hidden"
            aria-label="Menuyu ac"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-soft bg-[#faf8f2] md:hidden">
          <div className="page-shell py-6">
            <div className="space-y-4">
              <Link to="/" onClick={closeMobileMenu} className="block text-base font-semibold text-ink">
                Ana Sayfa
              </Link>

              <button
                type="button"
                onClick={() => setIsShopOpen((prev) => !prev)}
                className="flex w-full items-center justify-between text-left text-base font-semibold text-ink"
              >
                Magaza
                <ChevronDown className={`h-5 w-5 transition-transform ${isShopOpen ? 'rotate-180' : ''}`} />
              </button>

              {isShopOpen && (
                <div className="space-y-5 rounded-2xl border border-soft bg-white p-4">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Kadin</p>
                    <div className="space-y-1.5">
                      {womenCategories.map((category) => (
                        <Link
                          key={category.id}
                          to={createCategoryPath(category)}
                          onClick={closeMobileMenu}
                          className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-[#ece8dc]"
                        >
                          {category.title}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Erkek</p>
                    <div className="space-y-1.5">
                      {menCategories.map((category) => (
                        <Link
                          key={category.id}
                          to={createCategoryPath(category)}
                          onClick={closeMobileMenu}
                          className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-[#ece8dc]"
                        >
                          {category.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <Link to="/about" onClick={closeMobileMenu} className="block text-base font-semibold text-ink">
                Hakkimizda
              </Link>
              <Link to="/blog" onClick={closeMobileMenu} className="block text-base font-semibold text-ink">
                Blog
              </Link>
              <Link to="/contact" onClick={closeMobileMenu} className="block text-base font-semibold text-ink">
                Iletisim
              </Link>
              <Link to="/legal" onClick={closeMobileMenu} className="block text-base font-semibold text-ink">
                Yasal
              </Link>
              <Link to="/cart" onClick={closeMobileMenu} className="block text-base font-semibold text-ink">
                Sepet ({totalItems})
              </Link>

              {isLoggedIn ? (
                <>
                  <Link to="/my-orders" onClick={closeMobileMenu} className="block text-base font-semibold text-ink">
                    Siparislerim
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      closeMobileMenu()
                      handleLogout()
                    }}
                    className="text-left text-base font-semibold text-[#9e2e2e]"
                  >
                    Cikis Yap
                  </button>
                </>
              ) : (
                <Link to="/auth" onClick={closeMobileMenu} className="btn-primary w-full justify-center">
                  Giris / Kayit
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
