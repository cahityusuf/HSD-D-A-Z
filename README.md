# DAZ Frontend - Doğu Anadolu Zirvesi Web Platformu

Bu dizin, Doğu Anadolu Zirvesi (DAZ) projesinin React ve Vite kullanılarak geliştirilen ön yüz (frontend) uygulamasını içerir. HSD İnönü Üniversitesi topluluğu tarafından tasarlanan bu platform, modern web standartları ve performans odaklı bir mimari ile inşa edilmiştir.

## Yerel Kurulum ve Başlatma

Geliştirme ortamınızda projeyi ayağa kaldırmak için aşağıdaki komutları sırasıyla çalıştırın:

1. Bağımlılıkları yükleyin:  
   ```bash
   npm install
   ```

2. Geliştirme sunucusunu (Vite) başlatın:
   ```bash
   npm run dev
   ```

3. Tarayıcınızda [http://localhost:5173](http://localhost:5173) adresine gidin.

## Kullanılan Teknolojiler ve Kütüphaneler

- **React 19**: En güncel React sürümü ile modern bileşen yapısı.
- **Vite**: Hızlı modül değişimi (HMR) ve optimize edilmiş derleme süreci.
- **Vanilla CSS**: Global değişkenler ve modüler yapılandırma ile düşük yük devri.
- **React Icons / Phospor Icons**: Vektörel ve performanslı ikon kütüphanesi.
- **tsparticles**: Arkaplan için dinamik ve etkileşimli parçacık sistemi.
- **ESLint**: Kod standartlarının korunması ve statik analiz.

## Proje Dizini ve Mimari

Frontend uygulaması aşağıdaki klasör yapısına göre organize edilmiştir:

- `/src/components`: Uygulamanın temel yapı taşlarını oluşturan fonksiyonel bileşenler (Navbar, Footer, Hero, vb.).
- `/src/contexts`: Uygulama genelinde paylaşılan durumlar (örn. Tema yönetimi).
- `/src/hooks`: Tekrar kullanılabilir mantıksal birimler (örn. Manyetik efektler, Kaydırma tetikleyicileri).
- `/src/assets`: Statik medya dosyaları ve görseller.
- `index.html`: Uygulamanın ana HTML giriş noktası.
- `vite.config.js`: Vite özelleştirmeleri ve eklenti yapılandırmaları.

## Geliştirme Notları

- **Duyarlılık (Responsive)**: Tüm CSS dosyaları mobil-öncelikli (mobile-first) yaklaşımla yazılmıştır.
- **Animasyonlar**: Performans kaybını önlemek amacıyla mümkün olduğunca CSS Transitions ve Intersection Observer API tercih edilmiştir.
- **Kod Standartları**: Proje genelinde ESLint kuralları uygulanmaktadır. Katkı sağlarken lint hatalarının giderildiğinden emin olunmalıdır.

## Yapı (Build) ve Dağıtım

Prodüksiyon versiyonunu oluşturmak için:

```bash
npm run build
```

Bu komut sonucunda `dist/` klasörü içerisinde optimize edilmiş, dağıtıma hazır dosyalar oluşturulacaktır.

---

HSD İnönü Üniversitesi Geliştirici Ekibi
