# E-Ticaret Projesi - README

## Proje Hakkında

Bu proje, modern bir e-ticaret platformu olarak tasarlanmış ve geliştirilmiştir. Kullanıcıların ürünleri göz atabildiği, sepete ekleyebildiği, sipariş verebildiği ve geçmiş siparişlerini takip edebildiği kapsamlı bir alışveriş deneyimi sunar.

## Canlı Demo

Projeyi canlı olarak incelemek için: [Ayrık Klavyeler E-Ticaret](https://ayrik-klavyeler.vercel.app/)

## Kullanılan Teknolojiler

Bu projede aşağıdaki teknolojileri kullandım:

- **React**: Kullanıcı arayüzü geliştirmek için React kütüphanesini kullandım
- **Redux**: Uygulama genelinde state yönetimi için Redux kullandım
- **React Router**: Sayfa yönlendirme ve korumalı rotalar için React Router kullandım
- **Axios**: API istekleri için Axios kütüphanesini kullandım
- **Tailwind CSS**: Hızlı ve responsive tasarım için Tailwind CSS kullandım
- **React Toastify**: Kullanıcı bildirimleri için React Toastify kullandım
- **Lucide React**: Modern ve şık ikonlar için Lucide React kullandım
- **React Hook Form**: Form yönetimi ve validasyon için React Hook Form kullandım

## Projenin Özellikleri

### Kullanıcı Kimlik Doğrulama

- Kullanıcı kayıt ve giriş işlemleri
- JWT token tabanlı kimlik doğrulama
- Korumalı sayfalar için kimlik doğrulama kontrolü

### Ürün Yönetimi

- Tüm ürünlerin listelendiği sayfa
- Kategori bazlı filtreleme
- Ürün detay sayfası
- Slider ile öne çıkan ürünlerin gösterimi

### Sepet Yönetimi

- Ürünleri sepete ekleme, çıkarma ve miktar güncelleme
- Sepet içeriğini görüntüleme
- Seçilen ürünlerin toplam tutarını hesaplama

### Adres ve Kart Yönetimi

- Kullanıcı adreslerini ekleme, düzenleme ve silme
- Kredi kartı bilgilerini ekleme, düzenleme ve silme
- Bilgilerin güvenli şekilde saklanması ve yönetilmesi

### Sipariş İşlemleri

- Adım adım sipariş oluşturma (adres ve ödeme bilgileri seçimi)
- Sipariş onaylama ve tamamlama
- Geçmiş siparişleri görüntüleme ve sipariş detaylarını inceleme

### Responsive Tasarım

- Mobil, tablet ve masaüstü cihazlarla uyumlu tasarım
- Modern ve kullanıcı dostu arayüz

## API Entegrasyonu

Bu proje, RESTful API ile iletişim kurar ve aşağıdaki endpoint'leri kullanır:

- Kullanıcı işlemleri: `/auth`, `/user`
- Ürün işlemleri: `/products`, `/categories`
- Sepet işlemleri: `/cart`
- Adres işlemleri: `/user/address`
- Kart işlemleri: `/user/card`
- Sipariş işlemleri: `/order`

## Öğrendiklerim ve Zorluklar

Bu projeyi geliştirirken:

- Redux ile state yönetimini daha iyi anladım
- API ile veri alışverişi ve token tabanlı kimlik doğrulama konusunda deneyim kazandım
- React Router ile korumalı rotaların nasıl oluşturulacağını öğrendim
- Tailwind CSS ile hızlı ve responsive tasarımlar oluşturmayı deneyimledim
- Form yönetimi ve validasyon işlemlerini React Hook Form ile nasıl yapılacağını öğrendim
- React içinde modal ve dropdown menü gibi etkileşimli bileşenlerin nasıl oluşturulacağını öğrendim

Karşılaştığım en büyük zorluk, token tabanlı kimlik doğrulama sistemi ve API entegrasyonu oldu. Bu konuları çözerken yazılım geliştirme becerilerimi önemli ölçüde geliştirdim.

## Gelecekteki Geliştirmeler

Gelecekte eklemek istediğim özellikler:

- Arama fonksiyonu
- Ürün derecelendirme ve inceleme sistemi
- Favorilere ekleme özelliği
- Daha gelişmiş filtreleme seçenekleri
- Çoklu dil desteği
- Tema değiştirme seçeneği

---

Bu proje [Workintech](https://www.workintech.com.tr/) eğitim programı kapsamında geliştirilmiştir.
