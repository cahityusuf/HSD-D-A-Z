import { PiArrowUpRightLight, PiMapPinLight } from 'react-icons/pi';
import './Contact.css';

const venueName = 'Malatya Kongre ve Kültür Merkezi';
const mapQuery = encodeURIComponent(venueName);
const mapDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;
const email = 'huaweidevgroups44@gmail.com';

export default function Contact() {
  return (
    <section className="contact-premium" id="iletisim">
      <div className="contact-premium-glow"></div>
      
      <div className="container contact-premium-container">
        
        {/* Section Heading */}
        <div className="contact-premium-header reveal">
          <h2 className="contact-huge-text">İLETİŞİM<span className="dot">.</span></h2>
          <div className="contact-premium-line"></div>
        </div>

        <div className="contact-premium-grid reveal">
          
          {/* Location Block (Clickable for Directions) */}
          <a 
            href={mapDirectionsUrl} 
            target="_blank" 
            rel="noreferrer" 
            className="contact-block contact-block-location group"
          >
            <div className="contact-block-top">
              <span className="contact-block-label">LOKASYON</span>
              <PiArrowUpRightLight className="contact-block-icon" />
            </div>
            <div className="contact-block-content">
              <h3>{venueName}</h3>
              <p>Malatya, Türkiye</p>
            </div>
            <div className="contact-block-hover-layer">
              <div className="hover-layer-content">
                <PiMapPinLight className="contact-hover-icon" />
                <span>YOL TARİFİ AL</span>
              </div>
            </div>
          </a>

          {/* Email Block */}
          <a 
            href={`mailto:${email}`} 
            className="contact-block contact-block-email group"
          >
            <div className="contact-block-top">
              <span className="contact-block-label">E-POSTA</span>
              <PiArrowUpRightLight className="contact-block-icon" />
            </div>
            <div className="contact-block-content">
              <h3>{email.split('@')[0]}@</h3>
              <p>{email.split('@')[1]}</p>
            </div>
            <div className="contact-block-hover-layer">
              <div className="hover-layer-content">
                <PiArrowUpRightLight className="contact-hover-icon" />
                <span>MAİL GÖNDER</span>
              </div>
            </div>
          </a>
          
          {/* Socials Block */}
          <div className="contact-block contact-block-social">
             <div className="contact-block-top">
              <span className="contact-block-label">ÜNİVERSİTE HESAPLARI</span>
            </div>
            <div className="contact-social-links">
              <a href="https://www.instagram.com/hsdinonu/" className="social-link" target="_blank" rel="noreferrer">
                <span>İnönü Üniv. Instagram</span>
                <PiArrowUpRightLight />
              </a>
              <div className="contact-premium-line-subtle"></div>
              <a href="https://www.instagram.com/hsdmtu/" className="social-link" target="_blank" rel="noreferrer">
                <span>Turgut Özal Üniv. Instagram</span>
                <PiArrowUpRightLight />
              </a>
              <div className="contact-premium-line-subtle"></div>
              <a href="https://www.instagram.com/hsdfirat/" className="social-link" target="_blank" rel="noreferrer">
                <span>Fırat Üniv. Instagram</span>
                <PiArrowUpRightLight />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
