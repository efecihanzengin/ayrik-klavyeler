import { Menu, Search, ShoppingCart, User, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../store/actions/clientActions'
import { toast } from 'react-toastify'
import { fetchCategories } from '../store/actions/productActions'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false)
  const user = useSelector(state => state.client.user)
  const categories = useSelector(state => state.product.categories)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const getCategories = async () => {
      const result = await dispatch(fetchCategories());
      console.log('Fetch result:', result);
    };
    
    getCategories();
  }, [dispatch]);

  // Debug için log ekleyelim
  console.log('Categories in Header:', categories)

  // Kategorileri cinsiyete göre grupla ve her gruptan 5 tane al
  const groupedCategories = categories.reduce((acc, category) => {
    const gender = category.gender === 'k' ? 'Kadın' : 'Erkek';
    if (!acc[gender]) {
      acc[gender] = [];
    }
    acc[gender].push(category);
    return acc;
  }, {});

  // Her cinsiyet için en çok 5 kategori al
  Object.keys(groupedCategories).forEach(gender => {
    groupedCategories[gender] = groupedCategories[gender].slice(0, 5);
  });

  // Debug için grouped categories'i de kontrol edelim
  console.log('Grouped Categories:', groupedCategories)

  const handleLogout = () => {
    dispatch(logoutUser())
    toast.success('Successfully logged out!')
    navigate('/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16 justify-between md:justify-start">
          {/* Logo - Sol Kısım */}
          <div className="flex-none">
            <Link to="/" className="text-xl font-bold">Ayrik Klavyeler</Link>
          </div>
          
          {/* Navigation - Orta Kısım */}
          <div className="hidden md:flex flex-1 justify-center">
            <nav className="space-x-12">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              
              {/* Shop Dropdown */}
              <div className="relative inline-block text-left">
                <button
                  className="flex items-center text-gray-600 hover:text-gray-900"
                  onClick={() => setIsShopMenuOpen(!isShopMenuOpen)}
                  onMouseEnter={() => setIsShopMenuOpen(true)}
                >
                  Shop
                  <ChevronDown className="ml-1 w-4 h-4" />
                </button>

                {isShopMenuOpen && (
                  <div 
                    className="absolute left-0 mt-2 w-96 bg-white border shadow-lg rounded-md z-50"
                    onMouseLeave={() => setIsShopMenuOpen(false)}
                  >
                    <div className="grid grid-cols-2 gap-8 p-6">
                      {Object.entries(groupedCategories).map(([gender, cats]) => (
                        <div key={gender} className="bg-white">
                          <h3 className="font-semibold text-gray-900 mb-4">{gender}</h3>
                          <ul className="space-y-2">
                            {cats.map(cat => (
                              <li key={cat.id}>
                                <Link 
                                  to={`/shop/${gender.toLowerCase()}/${cat.code.split(':')[1]}/${cat.id}`}
                                  className="text-gray-600 hover:text-gray-900 block py-1"
                                >
                                  {cat.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link to="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
              <Link to="/pages" className="text-gray-600 hover:text-gray-900">Pages</Link>
            </nav>
          </div>

          {/* Icons - Sağ Kısım */}
          <div className="flex items-center space-x-4">
            {user?.name ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm">{user.name}</span>
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
            <Search className="w-6 h-6 cursor-pointer" />
            <ShoppingCart className="w-6 h-6 cursor-pointer" />
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus:outline-none md:hidden"
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
              <Link to="/signup" className="text-blue-500 hover:text-blue-600">Login / Register</Link>
              <Search className="w-6 h-6 cursor-pointer" />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header