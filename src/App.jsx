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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
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
        </Routes>
      </PageContent>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  )
}

export default App
