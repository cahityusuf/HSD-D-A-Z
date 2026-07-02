import {
  PiInstagramLogoDuotone,
} from 'react-icons/pi';

const quickLinks = [
  { href: '#anasayfa', label: 'Ana Sayfa' },
  { href: '#hakkimizda', label: 'Hakkımızda' },
  { href: '#konusmacilar', label: 'Konuşmacılar' },
  { href: '#paydaslar', label: 'Paydaşlar' },
  { href: '#iletisim', label: 'İletişim' },
];

const socialLinks = [
  {
    href: 'https://www.instagram.com/hsdinonu/',
    label: 'HSD İnönü',
  },
  {
    href: 'https://www.instagram.com/hsdmtu/',
    label: 'HSD MTÜ',
  },
  {
    href: 'https://www.instagram.com/hsdfirat/',
    label: 'HSD Fırat',
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-mega-brand" aria-hidden="true">
          <div className="footer-mega-brand-track">
            <span>TEKNOLOJİ VE YENİLİK ZİRVESİ</span>
            <span>TEKNOLOJİ VE YENİLİK ZİRVESİ</span>
          </div>
        </div>

        <div className="footer-main">
          <div className="footer-brand">
            <p className="footer-description">
              Bölgenin teknoloji ve girişimcilik potansiyelini ortaya çıkarmayı hedefleyen lider
              dijital platform.
            </p>
            <div className="footer-social">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  aria-label={link.label}
                  title={link.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  <PiInstagramLogoDuotone />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="footer-links-wrapper">
            <div className="footer-links-col">
              <h4 className="footer-heading">Keşfet</h4>
              <div className="footer-links">
                {quickLinks.slice(0, 3).map((link) => (
                  <a key={link.href} href={link.href}>{link.label}</a>
                ))}
              </div>
            </div>

            <div className="footer-links-col">
              <h4 className="footer-heading">Bağlantılar</h4>
              <div className="footer-links">
                {quickLinks.slice(3).map((link) => (
                  <a key={link.href} href={link.href}>{link.label}</a>
                ))}
              </div>
            </div>

            <div className="footer-links-col">
              <h4 className="footer-heading">İletişim</h4>
              <div className="footer-links">
                <a href="mailto:huaweidevgroups44@gmail.com" className="footer-mail">
                  huaweidevgroups44@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="copyright">© 2026. Tüm hakları saklıdır.</span>
          <div className="footer-dev">
            <span className="footer-dev-dot" />
            <span>HUAWEI STUDENT DEVELOPERS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
