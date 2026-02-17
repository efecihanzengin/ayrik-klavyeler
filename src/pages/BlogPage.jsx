import { ArrowRight, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'

const posts = [
  {
    title: '2026 Minimal Siluet Rehberi',
    excerpt: 'Gunluk kombinlerde sade ama guclu durus olusturan ana parca secimlerini inceliyoruz.',
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    readTime: '6 dk',
  },
  {
    title: 'Kumas Kalitesi Nasil Anlasilir?',
    excerpt: 'Online alisveriste materyal kalitesini urun sayfasindan analiz etmenin pratik yontemleri.',
    image:
      'https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=1200&q=80',
    readTime: '5 dk',
  },
  {
    title: 'Capsule Gardrop: 12 Parca Ile 30 Kombin',
    excerpt: 'Az ama etkili urun secimiyle uzun vadede daha islevsel bir dolap nasil kurulur?',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    readTime: '7 dk',
  },
]

const BlogPage = () => {
  return (
    <div className="page-enter space-y-8">
      <section className="page-shell">
        <div className="surface-card p-8 sm:p-10">
          <p className="section-subtitle">Journal</p>
          <h1 className="mt-2 text-4xl font-bold text-ink sm:text-5xl">Stil, materyal ve urun secimi notlari.</h1>
          <p className="mt-4 max-w-2xl text-sm text-muted">
            Ekip tarafindan hazirlanan bu notlar, urun seciminde daha bilincli karar vermeni hedefler.
          </p>
        </div>
      </section>

      <section className="page-shell">
        <div className="grid gap-5 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.title} className="surface-card-soft overflow-hidden">
              <img src={post.image} alt={post.title} className="h-56 w-full object-cover" />

              <div className="p-5">
                <p className="mb-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  <Clock3 className="h-3.5 w-3.5" />
                  {post.readTime}
                </p>
                <h2 className="text-2xl font-bold text-ink">{post.title}</h2>
                <p className="mt-2 text-sm text-muted">{post.excerpt}</p>

                <button type="button" className="btn-secondary mt-5 w-full justify-center">
                  Yaziyi Oku
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="page-shell">
        <div className="surface-card-soft flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-lg font-bold text-ink">Yeni yazilar yayinlandiginda haber al.</p>
            <p className="text-sm text-muted">Bultene kayit olarak stil notlarini kacirma.</p>
          </div>
          <Link to="/contact" className="btn-primary">
            Bultene Katil
          </Link>
        </div>
      </section>
    </div>
  )
}

export default BlogPage
