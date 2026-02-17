import { Mail, MapPin, MessageSquare, PhoneCall } from 'lucide-react'

const ContactPage = () => {
  return (
    <div className="page-enter">
      <section className="page-shell">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          <aside className="surface-card p-7 sm:p-8">
            <p className="section-subtitle">Contact</p>
            <h1 className="mt-2 text-4xl font-bold text-ink">Bizimle iletisime gec.</h1>
            <p className="mt-3 text-sm text-muted">
              Urun, siparis veya is birlikleri icin mesaj birakabilirsin. Ekibimiz en gec 24 saat icinde donus yapar.
            </p>

            <div className="mt-8 space-y-4 text-sm">
              <p className="inline-flex items-center gap-2 text-muted">
                <PhoneCall className="h-4 w-4 text-accent" />
                +90 (212) 555 01 03
              </p>
              <p className="inline-flex items-center gap-2 text-muted">
                <Mail className="h-4 w-4 text-accent" />
                support@ayrikklavyeler.com
              </p>
              <p className="inline-flex items-center gap-2 text-muted">
                <MapPin className="h-4 w-4 text-accent" />
                Nispetiye Cad. No:45 Besiktas / Istanbul
              </p>
            </div>
          </aside>

          <div className="surface-card p-7 sm:p-8">
            <h2 className="mb-5 text-2xl font-bold text-ink">Mesaj Gonder</h2>

            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-ink">Ad</label>
                  <input type="text" className="input-field" placeholder="Adin" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-ink">Soyad</label>
                  <input type="text" className="input-field" placeholder="Soyadin" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-ink">Email</label>
                <input type="email" className="input-field" placeholder="email@ornek.com" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-ink">Konu</label>
                <input type="text" className="input-field" placeholder="Siparis, iade, is birligi..." />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-ink">Mesajin</label>
                <textarea className="input-field min-h-[140px]" placeholder="Mesajini yaz..." />
              </div>

              <button type="button" className="btn-primary w-full justify-center">
                <MessageSquare className="h-4 w-4" />
                Mesaji Gonder
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
