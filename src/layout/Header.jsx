import { Menu, Search, ShoppingCart, User, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../store/actions/clientActions'
import { toast } from 'react-toastify'
import { fetchCategories } from '../store/actions/productActions'
import CartDropdown from '../components/CartDropdown'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const user = useSelector(state => state.client.user)
  const categories = useSelector(state => state.product.categories)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const cart = useSelector(state => state.cart.cart)
  
  const totalItems = cart.reduce((total, item) => total + item.count, 0)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  // Kategorileri cinsiyete göre ayır
  const womenCategories = categories.filter(cat => cat.gender === 'k')
  const menCategories = categories.filter(cat => cat.gender === 'e')

  const handleLogout = () => {
    dispatch(logoutUser())
    toast.success('Successfully logged out!')
    navigate('/')
  }

  const handleAuthClick = () => {
    console.log('Auth button clicked')
    navigate('/auth')
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold">
              Ayrik Klavyeler
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>

            {/* Shop Dropdown - Bu kısmı koruyoruz */}
            <div className="relative group">
              <button className="flex items-center text-gray-600 group-hover:text-gray-900">
                Shop
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>

              {/* Invisible bridge to prevent mouse gap */}
              <div className="absolute h-4 w-full -bottom-4"></div>

              <div className="absolute hidden group-hover:block w-[400px] bg-white shadow-lg rounded-md top-full pt-4">
                <Link to="/shop" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 mb-2">
                  Tüm Ürünler
                </Link>
                
                <div className="grid grid-cols-2 gap-4 p-4">
                  {/* Kadın Kategorileri */}
                  <div>
                    <div className="font-medium text-gray-900 mb-2">Kadın</div>
                    {womenCategories.map(category => (
                      <Link
                        key={category.id}
                        to={`/shop/kadin/${category.code.split(':')[1]}/${category.id}`}
                        className="block py-1 text-gray-600 hover:text-gray-900"
                      >
                        {category.title}
                      </Link>
                    ))}
                  </div>

                  {/* Erkek Kategorileri */}
                  <div>
                    <div className="font-medium text-gray-900 mb-2">Erkek</div>
                    {menCategories.map(category => (
                      <Link
                        key={category.id}
                        to={`/shop/erkek/${category.code.split(':')[1]}/${category.id}`}
                        className="block py-1 text-gray-600 hover:text-gray-900"
                      >
                        {category.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link to="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link to="/blog" className="text-gray-600 hover:text-gray-900">
              Blog
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
            <Link to="/pages" className="text-gray-600 hover:text-gray-900">
              Pages
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900">
              <Search className="w-6 h-6" />
            </button>
            
            {/* Sepet butonu ve dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="text-gray-600 hover:text-gray-900 relative"
              >
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
              
              <CartDropdown
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
              />
            </div>

            {/* Auth/User button - ESKİ HALİNE DÖNÜYORUZ */}
            {user && Object.keys(user).length > 0 ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm">{user.name || user.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/auth" className="text-blue-500 hover:text-blue-600">
                Login / Register
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-md md:hidden">
          <nav className="max-w-7xl mx-auto py-8">
            <div className="flex flex-col items-center space-y-6 text-gray-600">
              <Link to="/" className="text-lg hover:text-gray-900">Home</Link>
              <Link to="/shop" className="text-lg hover:text-gray-900">Shop</Link>
              <Link to="/about" className="text-lg hover:text-gray-900">About</Link>
              <Link to="/blog" className="text-lg hover:text-gray-900">Blog</Link>
              <Link to="/contact" className="text-lg hover:text-gray-900">Contact</Link>
              <Link to="/pages" className="text-lg hover:text-gray-900">Pages</Link>
              
              {/* Mobile Auth Link - Bunu da düzeltiyoruz */}
              {user && Object.keys(user).length > 0 ? (
                <button
                  onClick={handleLogout}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Logout
                </button>
              ) : (
                <Link to="/auth" className="text-blue-500 hover:text-blue-600">
                  Login / Register
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header