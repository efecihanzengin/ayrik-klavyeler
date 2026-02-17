import { ArrowRight, Compass, Gem, Layers3 } from 'lucide-react'
import { Link } from 'react-router-dom'

const principles = [
  {
    title: 'Intentional Design',
    text: 'Form, renk ve materyal secimi kullanim davranisina gore netlestirilir.',
    icon: Compass,
  },
  {
    title: 'Material Focus',
    text: 'Urun seciminde doku, dayaniklilik ve bakim kolayligi ana kriterdir.',
    icon: Gem,
  },
  {
    title: 'System Thinking',
    text: 'Tum deneyim; katalog, sepet, checkout ve siparis takibini bir sistem gibi ele alir.',
    icon: Layers3,
  },
]

const AboutPage = () => {
  return (
    <div className="page-enter space-y-8">
      <section className="page-shell">
        <div className="surface-card overflow-hidden p-8 sm:p-10">
          <p className="section-subtitle">About Brand</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-bold leading-tight text-ink sm:text-5xl">
            Ayrik Klavyeler, modern giyim deneyimini netlik ve kalite etrafinda kurar.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted">
            Bu proje bir e-commerce arayuzunden daha fazlasi olarak tasarlandi: urun kesfinden odemeye,
            odemeden siparis takibine kadar tek bir tutarli deneyim. Odak noktasi; hizli karar,
            guvenilir akis ve premium his.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="btn-primary">
              Koleksiyonu Incele
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="btn-secondary">
              Ekiple Iletisime Gec
            </Link>
          </div>
        </div>
      </section>

      <section className="page-shell">
        <div className="grid gap-4 md:grid-cols-3">
          {principles.map((item) => {
            const Icon = item.icon
            return (
              <article key={item.title} className="surface-card-soft p-6">
                <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f0ee] text-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-bold text-ink">{item.title}</h2>
                <p className="mt-2 text-sm text-muted">{item.text}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="page-shell">
        <div className="surface-card-soft grid gap-6 p-6 sm:grid-cols-3 sm:p-8">
          <div>
            <p className="text-3xl font-bold text-ink">30K+</p>
            <p className="mt-1 text-sm text-muted">Aylik ziyaretci etkilesimi</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-ink">120+</p>
            <p className="mt-1 text-sm text-muted">Secili urun ve kategori akisi</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-ink">99.9%</p>
            <p className="mt-1 text-sm text-muted">Core checkout akisi aktiflik hedefi</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
