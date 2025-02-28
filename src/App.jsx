import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageContent from './layout/PageContent'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import PricingPage from './pages/PricingPage'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'
import BlogPage from './pages/BlogPage'
import LegalPage from './pages/LegalPage'
import SignUpPage from './pages/SignUpPage'
import AuthPage from './pages/AuthPage'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { verifyToken, checkAuthStatus } from './store/actions/clientActions';
import Layout from './layout/Layout';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import OrderPage from './pages/OrderPage';
import ProtectedRoute from './components/ProtectedRoute';
import PreviousOrdersPage from './pages/PreviousOrdersPage';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:gender/:categoryName/:categoryId" element={<ShopPage />} />
          <Route path="/shop/:gender/:categoryName/:categoryId/:productNameSlug/:productId" element={<ProductDetail />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route 
            path="/order" 
            element={
              <ProtectedRoute>
                <OrderPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-orders" 
            element={
              <ProtectedRoute>
                <PreviousOrdersPage />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
      <ToastContainer />
    </Router>
  )
}

export default App
