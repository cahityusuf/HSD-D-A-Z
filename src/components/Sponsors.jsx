'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Sponsors.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const tiers = [
  {
    label: 'Ana Sponsor',
    tag: 'ALTIN',
    tier: 'gold',
    items: [
      { name: 'Yeşilyurt Belediyesi', image: '/logo/yesilyurtbelediyesi.png' },
      { name: 'Malatya Teknokent', image: '/logo/malatyateknokenet.jpg' },
      { name: 'Matris Kurs', image: '/logo/matrislogo.jpg' },
      { name: 'Matris Coach', image: '/logo/matriscoachlogo.png' },
    ],
  },
  {
    label: 'Platin Sponsor',
    tag: 'PLATİN',
    tier: 'silver',
    items: [
      { name: 'English Time', image: '/logo/englishtime.jpg' },
      { name: 'Neşve', image: '/logo/nesvekafe.jpeg' },
      { name: 'Doğu Batı Kurs Merkezi', image: '/logo/dogubatıkurs.png' },
      { name: 'Acım Çiğköfte', image: '/logo/acimcigköfte.jpeg' },
      { name: 'ModaDil', image: '/logo/modadil.jpeg' },
      { name: 'Dilcim', image: '/logo/dilcim.jpeg' },
      { name: 'Boston', image: '/logo/bostondd.jpeg' },
      { name: 'MG Hotel', image: '/logo/mghillresidence.jpeg' },
      { name: 'Laser Tag', image: '/logo/lasertag.jpeg' },
      { name: 'Şirehan', image: '/logo/sirehan.jpeg' },
      { name: 'Terra Pizza', image: '/logo/terrapizza.jpeg' },
      { name: 'Luuq', image: '/logo/luuq.jpeg' },
      { name: 'Iceberry', image: '/logo/iceberrycafe.jpeg' },
      { name: 'Fitbull Gym', image: '/logo/fitbullgym.jpeg' },
      { name: 'Mr. Bon', image: '/logo/mrbon.jpeg' },
    ],
  },
  {
    label: 'Gümüş Sponsor',
    tag: 'GÜMÜŞ',
    tier: 'bronze',
    items: [
      { name: 'Kahve Durağı', image: '/logo/kahveduragi.jpeg' },
      { name: 'Vefa Bozacısı', image: '/logo/vefabozacisi.jpeg' },
      { name: 'Enjoy Bowling', image: '/logo/enjoybowling.jpeg' },
      { name: 'Mahzen', image: '/logo/mahzenoyun.jpeg' },
      { name: 'Neo Vista', image: '/logo/neovista.jpeg' },
      { name: 'Game Mood PlayStation Cafe', image: '/logo/gamemood.jpeg' },
      { name: 'Hanedan', image: '/logo/hanedan.jpeg' },
      { name: 'Nar Künefe', image: '/logo/narkünefe.jpeg' },
      { name: 'Murat Örnek', image: '/logo/muratörnek.jpeg' },
      { name: 'Pia Makarna', image: '/logo/piamakarna.jpeg' },
      { name: 'Gülbe Şekerleme', image: '/logo/gülbeseker.jpeg' },
    ],
  },
];

export default function Sponsors() { 
  
  const sectionRef = useRef(null);
  const overlayRef = useRef(null);
  const expandedRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedData, setExpandedData] = useState(null); // { image, name, label }

  /* ── EXPAND on click ── */
  const openCard = useCallback((tierIdx, itemIdx, e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const overlay = overlayRef.current;
    const panel = expandedRef.current;
    if (!overlay || !panel) return;

    const sponsor = tiers[tierIdx].items[itemIdx];
    const tier = tiers[tierIdx];

    // Set state first so React renders the img with correct src
    setExpandedData({ image: sponsor.image, name: sponsor.name, label: tier.label });

    // Lock scroll
    document.body.style.overflow = 'hidden';
    setIsOpen(true);

    gsap.set(panel, {
      x: rect.left + rect.width / 2 - window.innerWidth / 2,
      y: rect.top + rect.height / 2 - window.innerHeight / 2,
      scale: 0.25, opacity: 0, display: 'flex',
    });

    gsap.to(overlay, { opacity: 1, duration: 0.3, ease: 'power2.out',
      onStart: () => { overlay.style.pointerEvents = 'auto'; },
    });

    gsap.to(panel, { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.3)' });
  }, []);

  const closeCard = useCallback(() => {
    const overlay = overlayRef.current;
    const panel = expandedRef.current;
    if (!overlay || !panel) return;

    gsap.to(panel, { scale: 0.5, opacity: 0, duration: 0.3, ease: 'power3.in' });
    gsap.to(overlay, { opacity: 0, duration: 0.25, delay: 0.08, ease: 'power2.in',
      onComplete: () => {
        overlay.style.pointerEvents = 'none';
        document.body.style.overflow = '';
        setIsOpen(false);
      },
    });
  }, []);

  /* ── ESC close ── */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && isOpen) closeCard(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeCard]);

  /* ── GSAP scroll reveals ── */
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const root = sectionRef.current;
    if (!root) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      gsap.from('.sp-hero-label', {
        opacity: 0, y: 12, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.sp-hero', start: 'top 85%', once: true },
      });

      gsap.from('.sp-hero-title span', {
        y: '110%', duration: 1.1, stagger: 0.12, ease: 'expo.out',
        scrollTrigger: { trigger: '.sp-hero', start: 'top 85%', once: true },
      });

      gsap.from('.sp-hero-line', {
        scaleX: 0, transformOrigin: 'center', duration: 1.2, delay: 0.4, ease: 'expo.out',
        scrollTrigger: { trigger: '.sp-hero', start: 'top 85%', once: true },
      });

      gsap.from('.sp-hero-sub', {
        opacity: 0, y: 16, duration: 0.8, delay: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: '.sp-hero', start: 'top 85%', once: true },
      });

      tiers.forEach((_, idx) => {
        const sel = `.sp-band[data-tier="${idx}"]`;
        const pills = root.querySelectorAll(`${sel} .sp-pill`);
        const label = root.querySelector(`${sel} .sp-band-label`);

        if (label) gsap.set(label, { opacity: 0, x: -20 });
        if (pills.length) gsap.set(pills, { opacity: 0, y: 30, scale: 0.9 });

        if (label) {
          gsap.to(label, {
            opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: sel, start: 'top 90%', once: true },
          });
        }

        if (pills.length) {
          gsap.to(pills, {
            opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.04, ease: 'power4.out',
            scrollTrigger: { trigger: sel, start: 'top 88%', once: true },
          });
        }
      });

      gsap.from('.sp-bottom-cta', {
        opacity: 0, y: 20, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.sp-bottom-cta', start: 'top 92%', once: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="sp-section" id="sponsorlar" ref={sectionRef}>
      {/* Hero */}
      <div className="sp-hero">
        <span className="sp-hero-label">Sponsorlar</span>
        <h2 className="sp-hero-title">
          <span className="sp-hero-title-clip"><span>Güçlü</span></span>
          <span className="sp-hero-title-clip"><span>Destekçiler</span></span>
        </h2>
        <div className="sp-hero-line" aria-hidden="true" />
        <p className="sp-hero-sub">Etkinliğimize destek veren değerli markalar</p>
      </div>

      {/* Tier Bands */}
      {tiers.map((tier, tierIdx) => (
        <div className="sp-band" key={tier.label} data-tier={tierIdx}>
          <div className="sp-band-head">
            <span className="sp-band-label">{tier.label}</span>
            <span className="sp-band-tag" data-level={tier.tier}>{tier.tag}</span>
          </div>
          <div className={`sp-band-flow sp-band-flow--${tier.tier}`}>
            {tier.items.map((sponsor, i) => (
              <button
                className={`sp-pill sp-pill--${tier.tier}`}
                key={i}
                onClick={(e) => openCard(tierIdx, i, e)}
                type="button"
              >
                <img src={sponsor.image} alt={sponsor.name} className="sp-pill-img" loading="lazy" />
                <span className="sp-pill-name">{sponsor.name}</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Bottom CTA */}
      <div className="sp-bottom-cta">
        <div className="sp-cta-rule" aria-hidden="true" />
        <div className="sp-cta-inner">
          <p className="sp-cta-question">Siz de bu güçlü topluluğun<br/>bir parçası olmak ister misiniz?</p>
          <a href="#iletisim" className="sp-cta-link">
            <span className="sp-cta-link-text">Bize Ulaşın</span>
            <span className="sp-cta-link-arrow">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M3 15L15 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M6 3H15V12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </a>
        </div>
        <div className="sp-cta-rule" aria-hidden="true" />
      </div>

      {/* Overlay */}
      <div className="sp-overlay" ref={overlayRef} onClick={closeCard}>
        <div className="sp-ex" ref={expandedRef} onClick={(e) => e.stopPropagation()}>
          <button className="sp-ex-close" onClick={closeCard} aria-label="Kapat">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
          {expandedData && (
            <>
              <span className="sp-ex-tag">{expandedData.label}</span>
              <div className="sp-ex-img-wrap">
                <img src={expandedData.image} alt={expandedData.name} className="sp-ex-img" />
              </div>
              <span className="sp-ex-name">{expandedData.name}</span>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
