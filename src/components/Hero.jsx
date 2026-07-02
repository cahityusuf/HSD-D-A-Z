import { useEffect, useRef, useState } from 'react';
import { FiCalendar } from 'react-icons/fi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EVENT_DATE = new Date('2026-05-11T10:00:00');

function getTimeLeft() {
  const diff = EVENT_DATE - Date.now();
  if (diff <= 0) return [0, 0, 0, 0];
  return [
    Math.floor(diff / 86400000),
    Math.floor(diff / 3600000) % 24,
    Math.floor(diff / 60000) % 60,
    Math.floor(diff / 1000) % 60,
  ];
}

export default function Hero() {
  const sectionRef = useRef(null);
  const countdownRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
  }, []);

  // Countdown — DOM direct update. isMobile dependency: view switch sonrası yeni DOM'a bağlan.
  useEffect(() => {
    const el = countdownRef.current;
    if (!el) return;
    const nums = el.querySelectorAll('.countdown-number');
    const update = () => {
      getTimeLeft().forEach((v, i) => {
        nums[i].textContent = String(v).padStart(2, '0');
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [isMobile]);

  // Parallax — sadece desktop
  useEffect(() => {
    if (isMobile) return undefined;

    const root = sectionRef.current;
    if (!root) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const layerBg = root.querySelector('.hero-layer--bg img');
    const layerMountain = root.querySelector('.hero-layer--mountain img');
    const layerCloud = root.querySelector('.hero-cloud-parallax');
    const content = root.querySelector('.hero-foreground');

    ScrollTrigger.config({ ignoreMobileResize: true });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.25,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        },
      });

      if (layerBg) tl.to(layerBg, { yPercent: -4, scale: 1.025, ease: 'none' }, 0);
      if (layerMountain) {
        tl.to(layerMountain, { yPercent: 4.5, xPercent: -0.15, scale: 1.015, ease: 'none' }, 0);
      }
      if (layerCloud) {
        tl.to(layerCloud, { yPercent: -25, scale: 1.018, force3D: true, ease: 'none' }, 0);
      }
      if (content) tl.to(content, { y: -22, opacity: 0.94, ease: 'none' }, 0);
    }, root);

    const imgs = root.querySelectorAll('.hero-layer img');
    const onImg = () => ScrollTrigger.refresh();
    imgs.forEach((img) => {
      if (img.complete) return;
      img.addEventListener('load', onImg, { once: true });
    });
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      imgs.forEach((img) => img.removeEventListener('load', onImg));
      ctx.revert();
    };
  }, [isMobile]);

  // --- MOBİL: tek arkaplan, animasyon yok ---
  if (isMobile) {
    return (
      <section className="hero hero--mobile" id="anasayfa" ref={sectionRef}>
        <div className="hero-mobile-bg" aria-hidden="true" />
        <div className="hero-countdown-stage">
          <div className="hero-countdown-zone">
            <div className="countdown" ref={countdownRef}>
              {['Gün', 'Saat', 'Dakika', 'Saniye'].map((label) => (
                <div className="countdown-item" key={label}>
                  <div className="countdown-number">00</div>
                  <div className="countdown-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="hero-vignette" aria-hidden="true" />
        <div className="hero-foreground">
          <div className="hero-content hero-content--top">
            <a href="#anasayfa" className="hero-logo" aria-label="Anasayfa">
              <img src="/HSD-Beyaz-Logo.png" alt="" width={180} height={73} decoding="async" draggable={false} />
            </a>
            <h1 className="hero-title">
              <span className="hero-title-line">
                <span className="hero-title-word">TEKNOLOJİ</span>
                <span className="hero-title-word">VE</span>
                <span className="hero-title-word">YENİLİK</span>
              </span>
              <span className="hero-title-accent">ZİRVESİ</span>
            </h1>
            <p className="hero-date">
              <span className="hero-date-chalk">
                <FiCalendar className="hero-date-icon" aria-hidden />
                <strong>11 Mayıs 2026</strong> <span className="hero-date-sep">·</span> Kongre ve Kültür Merkezi, Malatya
              </span>
            </p>
          </div>
        </div>
      </section>
    );
  }

  // --- DESKTOP: orijinal parallax ---
  return (
    <section className="hero" id="anasayfa" ref={sectionRef}>
      <div className="hero-viewport">
        <div className="hero-layers" aria-hidden="true">
          <div className="hero-layer hero-layer--bg">
            <img
              src="/hero-section-image/arkaplan_katman.png"
              alt=""
              decoding="async"
              draggable={false}
            />
          </div>
          <div className="hero-layer hero-layer--mountain">
            <img
              src="/hero-section-image/dag_katman.png"
              alt=""
              decoding="async"
              draggable={false}
            />
          </div>
          <div className="hero-layer hero-layer--cloud">
            <div className="hero-cloud-parallax">
              <img
                src="/hero-section-image/bulut_katman.png"
                alt=""
                decoding="async"
                draggable={false}
              />
            </div>
          </div>
        </div>
        <div className="hero-countdown-stage">
          <div className="hero-countdown-zone">
            <div className="countdown" ref={countdownRef}>
              {['Gün', 'Saat', 'Dakika', 'Saniye'].map((label) => (
                <div className="countdown-item" key={label}>
                  <div className="countdown-number">00</div>
                  <div className="countdown-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="hero-vignette" aria-hidden="true" />
        <div className="hero-foreground">
          <div className="hero-content hero-content--top">
            <a href="#anasayfa" className="hero-logo" aria-label="Anasayfa">
              <img src="/HSD-Beyaz-Logo.png" alt="" width={180} height={73} decoding="async" draggable={false} />
            </a>
            <h1 className="hero-title">
              <span className="hero-title-line">
                <span className="hero-title-word">TEKNOLOJİ</span>
                <span className="hero-title-word">VE</span>
                <span className="hero-title-word">YENİLİK</span>
              </span>
              <span className="hero-title-accent">ZİRVESİ</span>
            </h1>
            <p className="hero-date">
              <span className="hero-date-chalk">
                <FiCalendar className="hero-date-icon" aria-hidden />
                <strong>11 Mayıs 2026</strong> <span className="hero-date-sep">·</span> Kongre ve Kültür Merkezi, Malatya
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
