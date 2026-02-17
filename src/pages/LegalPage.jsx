const sections = [
  {
    title: 'Kullanim Kosullari',
    body: 'Platformu kullanan tum ziyaretciler urun, siparis ve iade sureclerine ait kosullari kabul etmis sayilir. Hizmet akislarinda suistimal tespit edilirse hesap kisitlanabilir.',
  },
  {
    title: 'Gizlilik Politikasi',
    body: 'Kullanici verileri sadece siparis islemleri, odeme dogrulama ve destek surecleri icin kullanilir. Veriler ilgili mevzuat kapsaminda saklanir ve ucuncu taraflarla izinsiz paylasilmaz.',
  },
  {
    title: 'Iade ve Degisim',
    body: 'Teslimat sonrasi belirlenen sure icinde urun iadesi veya degisimi talep edilebilir. Uygunluk durumu urun kondisyonu ve fatura bilgileri ile birlikte degerlendirilir.',
  },
  {
    title: 'Odeme ve Guvenlik',
    body: 'Odeme adimlarinda guvenlik katmanlari aktif tutulur. Supheli islemler otomatik denetime alinarak kullaniciya bilgilendirme gecilir.',
  },
]

const LegalPage = () => {
  return (
    <div className="page-enter space-y-8">
      <section className="page-shell">
        <div className="surface-card p-8 sm:p-10">
          <p className="section-subtitle">Legal</p>
          <h1 className="mt-2 text-4xl font-bold text-ink sm:text-5xl">Yasal metinler ve politika ozeti</h1>
          <p className="mt-4 max-w-2xl text-sm text-muted">
            Buradaki metinler portfolio demonstrasyonu icin sadelestirilmis bilgilendirme icerigidir.
          </p>
        </div>
      </section>

      <section className="page-shell">
        <div className="space-y-4">
          {sections.map((section, index) => (
            <article key={section.title} className="surface-card-soft p-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">0{index + 1}</p>
              <h2 className="text-2xl font-bold text-ink">{section.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{section.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default LegalPage
