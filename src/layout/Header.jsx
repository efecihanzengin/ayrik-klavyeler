import { Menu, Search, ShoppingCart, User } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
              <Link to="/shop" className="text-gray-600 hover:text-gray-900">Shop</Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link to="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
              <Link to="/pages" className="text-gray-600 hover:text-gray-900">Pages</Link>
            </nav>
          </div>

          {/* Icons - Sağ Kısım */}
          <div className="flex-none flex items-center space-x-6">
            <Link to="/signup" className="hidden md:flex items-center text-blue-500 hover:text-blue-600">
              <User className="w-5 h-5 mr-2" />
              <span>Login / Register</span>
            </Link>
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