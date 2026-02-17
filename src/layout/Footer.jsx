import { Instagram, Linkedin, Mail, MapPin, Phone, Send, Youtube } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-soft bg-[#ece8dc]">
      <div className="page-shell py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div className="surface-card p-6">
            <p className="section-subtitle mb-3">Newsletter</p>
            <h3 className="mb-3 text-2xl font-bold text-ink">Yeni koleksiyonlari ilk sen gor.</h3>
            <p className="mb-6 text-sm text-muted">
              Haftalik drop bildirimleri, style notlari ve kampanyalari tek mailde gonderiyoruz.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input type="email" placeholder="E-posta adresin" className="input-field flex-1" />
              <button type="button" className="btn-primary whitespace-nowrap px-5">
                <Send className="h-4 w-4" />
                Katil
              </button>
            </div>

            <div className="mt-6 space-y-2 text-sm text-muted">
              <p className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +90 (212) 555 01 03
              </p>
              <p className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4" />
                hello@ayrikklavyeler.com
              </p>
              <p className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Nispetiye Cad. No:45 Istanbul
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="surface-card-soft p-6">
              <h4 className="mb-4 text-lg font-bold text-ink">Marka</h4>
              <div className="space-y-2.5 text-sm text-muted">
                <Link to="/about" className="block transition-colors hover:text-ink">
                  Hakkimizda
                </Link>
                <Link to="/blog" className="block transition-colors hover:text-ink">
                  Blog
                </Link>
                <Link to="/contact" className="block transition-colors hover:text-ink">
                  Iletisim
                </Link>
                <Link to="/legal" className="block transition-colors hover:text-ink">
                  Yasal metinler
                </Link>
              </div>
            </div>

            <div className="surface-card-soft p-6">
              <h4 className="mb-4 text-lg font-bold text-ink">Alisveris</h4>
              <div className="space-y-2.5 text-sm text-muted">
                <Link to="/shop" className="block transition-colors hover:text-ink">
                  Tum urunler
                </Link>
                <Link to="/pricing" className="block transition-colors hover:text-ink">
                  Fiyatlandirma
                </Link>
                <Link to="/cart" className="block transition-colors hover:text-ink">
                  Sepetim
                </Link>
                <Link to="/my-orders" className="block transition-colors hover:text-ink">
                  Siparislerim
                </Link>
              </div>
            </div>

            <div className="surface-card-soft p-6">
              <h4 className="mb-4 text-lg font-bold text-ink">Takip Et</h4>
              <div className="space-y-2.5 text-sm text-muted">
                <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-ink">
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
                <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-ink">
                  <Youtube className="h-4 w-4" />
                  YouTube
                </a>
                <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-ink">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-soft pt-5 text-xs uppercase tracking-[0.18em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>2026 Ayrik Klavyeler. Tum haklari saklidir.</p>
          <p>Built for modern commerce experiences.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
