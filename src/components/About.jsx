'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate, stagger, splitText } from 'animejs';
import {
  PiTargetDuotone,
  PiEyeDuotone,
  PiBookOpenTextDuotone,
  PiUsersDuotone,
  PiGlobeHemisphereEastDuotone,
  PiStarFourFill,
  PiNewspaperClippingDuotone,
} from 'react-icons/pi';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const stats = [
  { value: 4, suffix: '+', label: 'Konuşmacı' },
  { value: 430, suffix: '+', label: 'Katılımcı' },
  { value: 4, suffix: '+', label: 'Oturum' },
  { value: 1, suffix: '', label: 'Gün' },
];

const featureArticles = [
  {
    icon: PiTargetDuotone,
    kicker: 'BAŞ YAZI · I',
    title: 'Misyonumuz',
    lead: 'Bölgenin enerjisini sahnenin merkezine taşımak.',
    text: "Doğu Anadolu Bölgesi'nin teknoloji ve girişimcilik potansiyelini ortaya çıkarmak, genç yetenekleri desteklemek ve bölgesel kalkınmaya katkıda bulunmak için yenilikçi bir platform oluşturuyoruz.",
  },
  {
    icon: PiEyeDuotone,
    kicker: 'BAŞ YAZI · II',
    title: 'Vizyonumuz',
    lead: "Doğu'yu inovasyonun merkezine taşımak.",
    text: "Doğu Anadolu'yu teknoloji ve inovasyonun merkezi haline getirmek, genç girişimcilere ilham vermek ve bölgenin dijital dönüşümüne öncülük etmek.",
  },
];

const newsItems = [
  {
    icon: PiBookOpenTextDuotone,
    column: 'KOLON A',
    title: 'Üniversitemiz',
    text: "İnönü Üniversitesi'nin geniş akademik kapasitesiyle düzenlenen bu zirve, bölgedeki en büyük teknoloji etkinliklerinden biri olmayı hedefliyor.",
  },
  {
    icon: PiUsersDuotone,
    column: 'KOLON B',
    title: 'Hedef Kitlemiz',
    text: 'Bölgemizdeki üniversite öğrencileri, yazılım ve mühendislik alanlarında büyük bir gelişim isteği içindedir. Bu zirve onlara sektörle tanışma fırsatı sunuyor.',
  },
  {
    icon: PiGlobeHemisphereEastDuotone,
    column: 'KOLON C',
    title: 'Etki Alanımız',
    text: 'Konuşmacıların bilgi birikimi ve deneyimleri, bölgedeki tüm gençler için yol gösterici nitelikte olacaktır. Sadece bir etkinlik değil, bölgesel bir dönüşüm hareketi.',
  },
];

function NewspaperStat({ value, suffix, label, index }) {
  const numberRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const node = numberRef.current;
    if (!node) return undefined;

    const counter = { v: 0 };
    let played = false;

    const trigger = ScrollTrigger.create({
      trigger: node,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        if (played) return;
        played = true;
        frameRef.current = animate(counter, {
          v: value,
          duration: 1600,
          ease: 'out(3)',
          delay: index * 90,
          onUpdate: () => {
            node.textContent = String(Math.floor(counter.v));
          },
          onComplete: () => {
            node.textContent = String(value);
          },
        });
      },
    });

    return () => {
      trigger.kill();
      if (frameRef.current && typeof frameRef.current.revert === 'function') {
        frameRef.current.revert();
      }
    };
  }, [value, index]);

  return (
    <div className="np-stat" data-stat-index={index}>
      <div className="np-stat-num">
        <span ref={numberRef}>0</span>
        <span className="np-stat-suffix">{suffix}</span>
      </div>
      <div className="np-stat-rule" />
      <div className="np-stat-label">{label}</div>
    </div>
  );
}

export default function About() {
  const sectionRef = useRef(null);
  const mastheadRef = useRef(null);
  const headlineRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const root = sectionRef.current;
    if (!root) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const animeInstances = [];
    const splitInstances = [];

    const ctx = gsap.context(() => {
      // ---- FOLIO BAR (top metadata) ----
      gsap.from('.np-folio-line', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.np-folio', start: 'top 90%', once: true },
      });
      gsap.from('.np-folio-item', {
        opacity: 0,
        y: 6,
        duration: 0.5,
        stagger: 0.06,
        delay: 0.25,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.np-folio', start: 'top 90%', once: true },
      });

      // ---- MASTHEAD (split chars rise) ----
      const masthead = mastheadRef.current;
      if (masthead) {
        const split = splitText(masthead, { chars: true, words: true });
        splitInstances.push(split);
        if (split.chars && split.chars.length) {
          split.chars.forEach((c) => {
            c.style.display = 'inline-block';
            c.style.transform = 'translateY(110%) rotate(6deg)';
            c.style.opacity = '0';
          });

          ScrollTrigger.create({
            trigger: masthead,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              const charInst = animate(split.chars, {
                translateY: ['110%', '0%'],
                rotate: [6, 0],
                opacity: [0, 1],
                duration: 1100,
                delay: stagger(28),
                ease: 'out(4)',
              });
              animeInstances.push(charInst);
            },
          });
        }
      }

      gsap.from('.np-masthead-rule', {
        scaleX: 0,
        transformOrigin: 'center center',
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.np-masthead', start: 'top 85%', once: true },
      });

      gsap.from('.np-tagline', {
        opacity: 0,
        y: 10,
        letterSpacing: '0.5em',
        duration: 1,
        delay: 0.4,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.np-masthead', start: 'top 85%', once: true },
      });

      // ---- SECTION LABEL ----
      gsap.from('.np-section-label-rule', {
        scaleX: 0,
        transformOrigin: 'center center',
        duration: 0.9,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.np-section-label', start: 'top 90%', once: true },
      });
      gsap.from('.np-section-label-text', {
        opacity: 0,
        y: 8,
        duration: 0.7,
        delay: 0.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.np-section-label', start: 'top 90%', once: true },
      });

      // ---- LEAD HEADLINE (word stagger) ----
      const headline = headlineRef.current;
      if (headline) {
        const splitH = splitText(headline, { words: true, chars: false });
        splitInstances.push(splitH);
        if (splitH.words && splitH.words.length) {
          splitH.words.forEach((w) => {
            w.style.display = 'inline-block';
            w.style.transform = 'translateY(36px)';
            w.style.opacity = '0';
            w.style.filter = 'blur(10px)';
          });

          ScrollTrigger.create({
            trigger: headline,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              const inst = animate(splitH.words, {
                translateY: [36, 0],
                opacity: [0, 1],
                filter: ['blur(10px)', 'blur(0px)'],
                duration: 900,
                delay: stagger(60),
                ease: 'out(3)',
              });
              animeInstances.push(inst);
            },
          });
        }
      }

      gsap.from('.np-lead-kicker, .np-lead-deck, .np-lead-byline', {
        opacity: 0,
        y: 14,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.np-lead', start: 'top 80%', once: true },
      });

      // ---- LEAD BODY (drop cap + columns) ----
      gsap.from('.np-dropcap', {
        scale: 0,
        rotate: -20,
        duration: 1,
        ease: 'back.out(2.2)',
        scrollTrigger: { trigger: '.np-columns', start: 'top 80%', once: true },
      });
      gsap.from('.np-column-text', {
        opacity: 0,
        y: 24,
        filter: 'blur(8px)',
        duration: 1,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.np-columns', start: 'top 80%', once: true },
      });

      // ---- PULL QUOTE (sweep + mark) ----
      gsap.from('.np-pull-mark', {
        scale: 0,
        rotate: -20,
        opacity: 0,
        duration: 0.9,
        ease: 'back.out(2)',
        scrollTrigger: { trigger: '.np-pull', start: 'top 85%', once: true },
      });
      gsap.from('.np-pull-text', {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.np-pull', start: 'top 85%', once: true },
      });
      gsap.fromTo(
        '.np-pull-sweep',
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'expo.out',
          delay: 0.25,
          scrollTrigger: { trigger: '.np-pull', start: 'top 85%', once: true },
        },
      );
      gsap.from('.np-pull-cite', {
        opacity: 0,
        y: 8,
        duration: 0.7,
        delay: 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.np-pull', start: 'top 85%', once: true },
      });

      // ---- FEATURE ARTICLES (Mission / Vision) ----
      gsap.utils.toArray('.np-feature').forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 30,
          duration: 1,
          delay: i * 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
        gsap.from(el.querySelector('.np-feature-rule'), {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 0.9,
          delay: 0.25 + i * 0.08,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });

      // ---- BY THE NUMBERS ----
      gsap.from('.np-numbers-rule', {
        scaleX: 0,
        transformOrigin: 'center center',
        duration: 0.9,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.np-numbers', start: 'top 85%', once: true },
      });
      gsap.from('.np-numbers-title', {
        opacity: 0,
        y: 10,
        duration: 0.7,
        delay: 0.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.np-numbers', start: 'top 85%', once: true },
      });
      gsap.from('.np-stat', {
        opacity: 0,
        y: 24,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.np-numbers', start: 'top 85%', once: true },
      });

      // ---- NEWS GRID ----
      gsap.utils.toArray('.np-news').forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 28,
          duration: 0.9,
          delay: i * 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });

      // ---- ENDMARK ----
      gsap.from('.np-endmark', {
        opacity: 0,
        scale: 0.6,
        rotate: -12,
        duration: 0.9,
        ease: 'back.out(1.8)',
        scrollTrigger: { trigger: '.np-endmark', start: 'top 92%', once: true },
      });
    }, root);

    return () => {
      ctx.revert();
      animeInstances.forEach((i) => i?.revert?.());
      splitInstances.forEach((i) => i?.revert?.());
    };
  }, []);

  return (
    <section className="about np-paper" id="hakkimizda" ref={sectionRef}>
      <div className="np-grain" aria-hidden="true" />

      <div className="container np-page">
        {/* ---- Folio bar ---- */}
        <div className="np-folio" aria-hidden="true">
          <span className="np-folio-line" />
          <span className="np-folio-item">CİLT I</span>
          <span className="np-folio-dot">•</span>
          <span className="np-folio-item">SAYI N° 01</span>
          <span className="np-folio-dot">•</span>
          <span className="np-folio-item">11 MAYIS 2026 · PZT</span>
          <span className="np-folio-dot">•</span>
          <span className="np-folio-item">MALATYA</span>
          <span className="np-folio-dot">•</span>
          <span className="np-folio-item">ÜCRETSİZ EDİSYON</span>
          <span className="np-folio-line" />
        </div>

        {/* ---- Masthead ---- */}
        <header className="np-masthead">
          <span className="np-masthead-rule np-masthead-rule--top" />
          <h2 className="np-masthead-title" ref={mastheadRef}>
            Doğu Anadolu Gazetesi
          </h2>
          <span className="np-masthead-rule np-masthead-rule--bottom" />
          <div className="np-tagline">
            <PiStarFourFill className="np-tagline-star" aria-hidden="true" />
            <span>Bölgenin Sesi · Geleceğin Yazıldığı Sayfalar</span>
            <PiStarFourFill className="np-tagline-star" aria-hidden="true" />
          </div>
        </header>

        {/* ---- Section label ---- */}
        <div className="np-section-label">
          <span className="np-section-label-rule" />
          <span className="np-section-label-text">
            <PiNewspaperClippingDuotone aria-hidden="true" /> Hakkımızda · Editörden
          </span>
          <span className="np-section-label-rule" />
        </div>

        {/* ---- Lead headline ---- */}
        <header className="np-lead">
          <p className="np-lead-kicker">— MANŞET —</p>
          <h1 className="np-lead-headline" ref={headlineRef}>
            Doğu&apos;nun Yeni Şafağı: <em>Teknoloji</em> &amp; <em>İnovasyon</em> Yazılıyor
          </h1>
          <p className="np-lead-deck">
            Doğu Anadolu Zirvesi, bölgenin teknoloji ve girişimcilik potansiyelini sahnenin
            merkezine taşıyor; üniversite gençliğini sektörün vizyoner isimleriyle aynı sayfada
            buluşturuyor.
          </p>
          <p className="np-lead-byline">
            <span className="np-lead-byline-label">YAZAN</span>
            <strong>HSD İNÖNÜ EDİTÖRYALİ</strong>
            <span className="np-lead-byline-sep">/</span>
            <span>İnönü, Turgut Özal &amp; Fırat Toplulukları</span>
            <span className="np-lead-byline-sep">/</span>
            <span>Malatya, 11 Mayıs 2026</span>
          </p>
        </header>

        {/* ---- 3-column lead body ---- */}
        <div className="np-columns">
          <div className="np-column">
            <p className="np-column-text">
              <span className="np-dropcap" aria-hidden="true">
                D
              </span>
              oğu Anadolu Zirvesi, bölgenin uzun yıllardır biriktirdiği teknolojik ve girişimci
              enerjiyi dünyaya açan bir manşettir. HSD İnönü, HSD Turgut Özal ve HSD Fırat
              topluluklarının ortaklığında, üniversite gençliğini sektörle aynı sahnede
              buluşturuyoruz.
            </p>
          </div>
          <div className="np-column">
            <p className="np-column-text">
              Yazılım, bulut, yapay zeka ve girişimcilik kulislerinde tecrübe biriktirmiş davetli
              konuşmacılar, akademinin ışığı ile bölgenin enerjisini birleştiriyor. Her oturum,
              gencin defterine düşen yeni bir not, yeni bir yön oluyor.
            </p>
          </div>
          <div className="np-column">
            <p className="np-column-text">
              Bizim için bu etkinlik, yalnızca tek bir günün ajandası değil; Doğu Anadolu&apos;nun
              yeni çağında atılan ilk imzadır. Bir sonraki sayfayı birlikte yazıyoruz — yan tarafta,
              sıraya geçmiş manşetlerle.
            </p>
          </div>
        </div>

        {/* ---- Pull quote ---- */}
        <blockquote className="np-pull">
          <span className="np-pull-sweep" aria-hidden="true" />
          <span className="np-pull-mark" aria-hidden="true">
            “
          </span>
          <p className="np-pull-text">
            Doğu&apos;nun gücü; akademinin disiplini, gençliğin cesareti ve teknolojinin hızıyla
            buluştuğunda manşete çıkıyor.
          </p>
          <footer className="np-pull-cite">— Editörden, Cilt I / Sayı 01</footer>
        </blockquote>

        {/* ---- Mission & Vision feature articles ---- */}
        <div className="np-feature-grid">
          {featureArticles.map((item) => {
            const Icon = item.icon;
            return (
              <article className="np-feature" key={item.title}>
                <header className="np-feature-head">
                  <span className="np-feature-kicker">
                    <PiStarFourFill aria-hidden="true" /> {item.kicker}
                  </span>
                  <h3 className="np-feature-title">{item.title}</h3>
                  <p className="np-feature-lead">{item.lead}</p>
                  <span className="np-feature-rule" />
                </header>
                <div className="np-feature-body">
                  <span className="np-feature-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <p>{item.text}</p>
                </div>
              </article>
            );
          })}
        </div>

        {/* ---- By the numbers ---- */}
        <section className="np-numbers" aria-labelledby="np-numbers-title">
          <div className="np-numbers-head">
            <span className="np-numbers-rule" />
            <h3 className="np-numbers-title" id="np-numbers-title">
              Rakamlarla Zirve
            </h3>
            <span className="np-numbers-rule" />
          </div>
          <div className="np-numbers-grid">
            {stats.map((stat, i) => (
              <NewspaperStat
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                index={i}
              />
            ))}
          </div>
        </section>

        {/* ---- News (info) grid ---- */}
        <div className="np-news-grid">
          {newsItems.map((item) => {
            const Icon = item.icon;
            return (
              <article className="np-news" key={item.title}>
                <span className="np-news-column">{item.column}</span>
                <h4 className="np-news-title">{item.title}</h4>
                <span className="np-news-rule" />
                <p className="np-news-text">{item.text}</p>
                <span className="np-news-icon" aria-hidden="true">
                  <Icon />
                </span>
              </article>
            );
          })}
        </div>

        {/* ---- End mark ---- */}
        <div className="np-endmark" aria-hidden="true">
          <span className="np-endmark-rule" />
          <span className="np-endmark-text">— 30 —</span>
          <span className="np-endmark-rule" />
        </div>
      </div>
    </section>
  );
}
