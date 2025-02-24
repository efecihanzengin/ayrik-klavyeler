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
import { verifyToken } from './store/actions/clientActions';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const autoLogin = async () => {
      // localStorage'da token var mı kontrol et
      const token = localStorage.getItem('token');
      
      if (token) {
        const result = await dispatch(verifyToken());
        
        if (result.success) {
          toast.success('Automatically logged in!');
        } else {
          // Token geçersizse sessizce temizle
          localStorage.removeItem('token');
        }
      }
    };

    autoLogin();
  }, [dispatch]);

  return (
    <Router>
      <PageContent>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/shop/:gender/:category/:id" element={<ShopPage />} />
        </Routes>
      </PageContent>
      <ToastContainer />
    </Router>
  )
}

export default App
