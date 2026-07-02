'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const partners = [
  { name: 'Büyükşehir Belediyesi', image: '/logo/malatyabüyüksehir.jpeg', index: '01' },
  { name: 'İnönü Üniversitesi', image: '/logo/inönüv2.png', index: '02' },
  { name: 'Malatya Turgut Özal Üniversitesi', image: '/logo/turgutözallogo.png', index: '03' },
  { name: 'Fırat Üniversitesi', image: '/logo/fıratlogo.png', index: '04' },
  { name: 'Yeşilyurt Kent Konseyi', image: '/logo/yesilyurtkentkonseyi.png', index: '05' },
];

export default function Partners() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const root = sectionRef.current;
    if (!root) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      // Horizontal rule reveal
      gsap.from('.pt-eyebrow-line', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.pt-eyebrow', start: 'top 88%', once: true },
      });

      // Eyebrow text
      gsap.from('.pt-eyebrow-label', {
        opacity: 0,
        x: -16,
        duration: 0.7,
        delay: 0.25,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.pt-eyebrow', start: 'top 88%', once: true },
      });
      gsap.from('.pt-eyebrow-count', {
        opacity: 0,
        x: 16,
        duration: 0.7,
        delay: 0.25,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.pt-eyebrow', start: 'top 88%', once: true },
      });

      // Big display heading — clip reveal
      gsap.from('.pt-heading-inner', {
        y: '105%',
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.pt-heading', start: 'top 88%', once: true },
      });

      // Sub-deck
      gsap.from('.pt-deck', {
        opacity: 0,
        y: 20,
        duration: 0.9,
        delay: 0.35,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.pt-heading', start: 'top 88%', once: true },
      });

      // Divider
      gsap.from('.pt-divider', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.1,
        delay: 0.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.pt-divider', start: 'top 92%', once: true },
      });

      // Partner cards — stagger slide up
      gsap.from('.pt-card', {
        opacity: 0,
        y: 48,
        duration: 1,
        stagger: 0.1,
        ease: 'power4.out',
        scrollTrigger: { trigger: '.pt-grid', start: 'top 85%', once: true },
      });

      // Card inner lines (left border)
      gsap.from('.pt-card-line', {
        scaleY: 0,
        transformOrigin: 'top center',
        duration: 0.8,
        stagger: 0.1,
        delay: 0.35,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.pt-grid', start: 'top 85%', once: true },
      });

      // Bottom endline
      gsap.from('.pt-footer-rule', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.pt-footer', start: 'top 94%', once: true },
      });
      gsap.from('.pt-footer-text', {
        opacity: 0,
        y: 8,
        duration: 0.7,
        delay: 0.3,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.pt-footer', start: 'top 94%', once: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="pt-section" id="paydaslar" ref={sectionRef}>
      <div className="pt-noise" aria-hidden="true" />

      <div className="container pt-container">
        {/* Eyebrow */}
        <div className="pt-eyebrow">
          <span className="pt-eyebrow-line" />
          <span className="pt-eyebrow-label">PAYDAŞLAR</span>
          <span className="pt-eyebrow-dot" aria-hidden="true" />
          <span className="pt-eyebrow-count">0{partners.length} KURUM</span>
          <span className="pt-eyebrow-line" />
        </div>

        {/* Heading */}
        <div className="pt-heading-wrap">
          <div className="pt-heading">
            <div className="pt-heading-clip">
              <h2 className="pt-heading-inner">Birlikte&nbsp;İnşa</h2>
            </div>
            <div className="pt-heading-clip">
              <h2 className="pt-heading-inner pt-heading-inner--outline">Ediyoruz.</h2>
            </div>
          </div>
          <p className="pt-deck">
            Bu zirveyi olanaklı kılan güçlü kurumların desteğiyle&nbsp;—
            <br className="pt-deck-br" />
            bölgenin geleceğini birlikte yazıyoruz.
          </p>
        </div>

        <div className="pt-divider" aria-hidden="true" />

        {/* Partner grid */}
        <ul className="pt-grid" role="list">
          {partners.map((partner) => (
            <li className="pt-card" key={partner.name}>
              <span className="pt-card-line" aria-hidden="true" />
              <span className="pt-card-index" aria-hidden="true">{partner.index}</span>
              <div className="pt-card-logo-wrap">
                <img
                  src={partner.image}
                  alt={partner.name}
                  className="pt-card-logo"
                  loading="lazy"
                />
              </div>
              <p className="pt-card-name">{partner.name}</p>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="pt-footer">
          <span className="pt-footer-rule" />
          <span className="pt-footer-text">— Doğu Anadolu Zirvesi · 11 Mayıs 2026 —</span>
          <span className="pt-footer-rule" />
        </div>
      </div>
    </section>
  );
}
