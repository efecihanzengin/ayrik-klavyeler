import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchCategories } from '../store/slices/productSlice'

const heroSlides = [
  {
    id: 1,
    badge: 'New Season',
    title: 'Clarity In Form, Quality In Fabric.',
    description:
      'Tasarin ve isciligi merkezde tutan secili urunler. Giyimde sade ama iddiali bir dil.',
    cta: 'Koleksiyonu Kesfet',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=80',
  },
  {
    id: 2,
    badge: 'Limited Drop',
    title: 'Modern Wardrobe, Strong Presence.',
    description:
      'Sinirli stoklar, net siluetler ve guncel dokularla olusan rafine bir secki.',
    cta: 'Dropu Incele',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=80',
  },
  {
    id: 3,
    badge: 'Crafted Daily',
    title: 'For Fast Days And Intentional Nights.',
    description:
      'Gunluk tempoya uyum saglayan ama detaylariyla fark yaratan premium parcalar.',
    cta: 'Hemen Alisverise Basla',
    image:
      'https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=1800&q=80',
  },
]

const featureItems = [
  {
    title: 'Quality-First Selection',
    description: 'Tum urunler secili materyal kalitesi ve uzun omur kriteriyle listelenir.',
  },
  {
    title: 'Fast & Reliable Delivery',
    description: 'Siparis takipli kargo, hizli cikis ve net bilgilendirme standardi.',
  },
  {
    title: 'Secure Checkout',
    description: 'Satin alma adimlari sade, odeme akislarinda guvenlik odakli deneyim.',
  },
]

const HomePage = () => {
  const dispatch = useDispatch()
  const categories = useSelector((state) => state.product.categories)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const topCategories = [...categories]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5)

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4200,
    arrows: true,
    pauseOnHover: true,
  }

  return (
    <div className="page-enter space-y-16 pb-8">
      <section className="page-shell">
        <div className="slider-container overflow-hidden rounded-[30px] border border-soft shadow-[0_16px_50px_rgba(14,14,14,0.13)]">
          <Slider {...sliderSettings}>
            {heroSlides.map((slide) => (
              <div key={slide.id}>
                <div className="relative h-[520px] w-full sm:h-[620px]">
                  <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/20" />

                  <div className="absolute inset-0 flex items-end sm:items-center">
                    <div className="max-w-3xl p-6 pb-12 text-white sm:p-14">
                      <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] backdrop-blur-sm">
                        <Sparkles className="h-3.5 w-3.5" />
                        {slide.badge}
                      </p>

                      <h1 className="mb-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                        {slide.title}
                      </h1>

                      <p className="mb-8 max-w-2xl text-sm text-white/85 sm:text-base">{slide.description}</p>

                      <div className="flex flex-wrap items-center gap-3">
                        <Link to="/shop" className="btn-primary">
                          {slide.cta}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link to="/about" className="btn-secondary border-white/20 bg-white/10 text-white backdrop-blur-sm">
                          Marka Hikayesi
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      <section className="page-shell">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-subtitle">Curated Categories</p>
            <h2 className="section-title mt-2">Top kategoriler</h2>
          </div>
          <Link to="/shop" className="btn-secondary w-fit">
            Tum urunleri gor
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {topCategories.length === 0 ? (
          <div className="surface-card p-12 text-center">
            <p className="text-muted">Kategori verisi yukleniyor...</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {topCategories.map((category, index) => {
              const categorySlug = category.code?.split(':')[1] || 'kategori'
              const genderSlug = category.gender === 'k' ? 'kadin' : 'erkek'
              const isLarge = index === 0

              return (
                <Link
                  key={category.id}
                  to={`/shop/${genderSlug}/${categorySlug}/${category.id}`}
                  className={`group relative overflow-hidden rounded-[24px] border border-soft shadow-[0_14px_34px_rgba(20,20,20,0.12)] ${
                    isLarge ? 'sm:col-span-2 sm:row-span-2 min-h-[360px]' : 'min-h-[170px]'
                  }`}
                >
                  <img
                    src={
                      category.img ||
                      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80'
                    }
                    alt={category.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="mb-1 text-xs uppercase tracking-[0.16em] text-white/80">
                      {category.gender === 'k' ? 'Kadin' : 'Erkek'}
                    </p>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-['Syne'] text-xl font-bold leading-tight">{category.title}</h3>
                      <span className="inline-flex items-center rounded-full bg-white/15 px-2 py-1 text-xs font-semibold backdrop-blur-sm">
                        ★ {category.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      <section className="page-shell">
        <div className="grid gap-4 md:grid-cols-3">
          {featureItems.map((item, index) => (
            <article key={item.title} className="surface-card-soft p-6">
              <p className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
                0{index + 1}
              </p>
              <h3 className="mb-2 text-xl font-bold text-ink">{item.title}</h3>
              <p className="text-sm text-muted">{item.description}</p>
            </article>
          ))}
        </div>

        <div className="surface-card mt-6 overflow-hidden p-8 sm:p-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-subtitle">Performance</p>
              <h3 className="mt-2 text-3xl font-bold text-ink">Portfolio-ready commerce case</h3>
              <p className="mt-3 max-w-xl text-sm text-muted">
                Gercek auth, checkout, siparis gecmisi ve dinamik urun akislariyla calisan bir showcase.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-[#e8f0ee] px-4 py-2 text-sm font-semibold text-accent">
              <TrendingUp className="h-4 w-4" />
              End-to-end user journey enabled
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
