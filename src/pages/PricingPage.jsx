import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: '0 TL',
    subtitle: 'Klasik alisveris deneyimi',
    features: ['Standart urun akisi', 'Sepet ve odeme', 'Siparis takibi'],
    cta: 'Ucretsiz Basla',
    highlighted: false,
  },
  {
    name: 'Member+',
    price: '149 TL',
    subtitle: 'Aylik premium uye paketi',
    features: ['Oncelikli drop erisimi', 'Ekstra %10 uye indirimi', 'Hizli destek hatti'],
    cta: 'Member+ Ol',
    highlighted: true,
  },
  {
    name: 'Studio',
    price: 'Custom',
    subtitle: 'Kurumsal ve toplu satin alma',
    features: ['Toplu siparis yonetimi', 'Kurumsal faturalandirma', 'Ozel account manager'],
    cta: 'Teklif Al',
    highlighted: false,
  },
]

const PricingPage = () => {
  return (
    <div className="page-enter space-y-8">
      <section className="page-shell">
        <div className="surface-card p-8 sm:p-10">
          <p className="section-subtitle">Pricing</p>
          <h1 className="mt-2 text-4xl font-bold text-ink sm:text-5xl">Farkli kullanim tipleri icin net paketler.</h1>
          <p className="mt-4 max-w-2xl text-sm text-muted">
            Bu sayfa portfolio sunumu icin urunlestirme dusuncesini gosteren ornek paket modelini sunar.
          </p>
        </div>
      </section>

      <section className="page-shell">
        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative overflow-hidden rounded-[24px] border p-6 ${
                plan.highlighted
                  ? 'border-[#0f5c4a] bg-[#0f5c4a] text-white shadow-[0_18px_45px_rgba(15,92,74,0.35)]'
                  : 'border-soft bg-[#fffdf8] text-ink'
              }`}
            >
              {plan.highlighted && (
                <span className="mb-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em]">
                  Most Popular
                </span>
              )}

              <h2 className="text-2xl font-bold">{plan.name}</h2>
              <p className={`mt-1 text-sm ${plan.highlighted ? 'text-white/80' : 'text-muted'}`}>{plan.subtitle}</p>
              <p className="mt-5 text-4xl font-bold">{plan.price}</p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="inline-flex w-full items-center gap-2 text-sm">
                    <Check className="h-4 w-4" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`mt-8 w-full rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition-colors ${
                  plan.highlighted
                    ? 'bg-white text-ink hover:bg-[#f2f2f2]'
                    : 'bg-ink text-white hover:bg-black'
                }`}
              >
                {plan.cta}
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default PricingPage
