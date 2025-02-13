import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageContent from './layout/PageContent'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import PricingPage from './pages/PricingPage'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'
import BlogPage from './pages/BlogPage'
import LegalPage from './pages/LegalPage'

function App() {
  return (
    <Router>
      <PageContent>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/legal" element={<LegalPage />} />
        </Routes>
      </PageContent>
    </Router>
  )
}

export default App
