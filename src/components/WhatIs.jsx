'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  PiBookOpenDuotone,
  PiUsersThreeDuotone,
  PiTrendUpDuotone,
  PiCaretDownBold,
} from 'react-icons/pi';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const cards = [
  {
    icon: <PiBookOpenDuotone />,
    title: 'Stratejik Bir Adım',
    text: 'HSD İnönü, HSD Turgut Özal ve HSD Fırat Toplulukları tarafından düzenlenen Teknoloji ve Yenilik Zirvesi, yalnızca bir etkinlik değil; bölgenin teknoloji ve girişimcilik anlamında sahip olduğu büyük potansiyelin görünür kılınmasına yönelik stratejik bir adımdır. Bu zirve, yerel dinamiklerin ulusal ve küresel teknoloji trendleriyle buluştuğu, gençlerin ilham aldığı ve kendine yol çizdiği bir platform olmayı amaçlamaktadır.',
  },
  {
    icon: <PiUsersThreeDuotone />,
    title: 'Gençlerle Sektör Buluşması',
    text: 'Bölgemizdeki üniversite öğrencileri, özellikle yazılım ve mühendislik alanlarında büyük bir gelişim isteği içindedir ancak sektörle doğrudan temas edebilecekleri fırsatlar oldukça sınırlıdır. Bu noktada, alanında öncü ve vizyoner isimlerin katılımı, yalnızca bilgi paylaşımı anlamına gelmeyecek; aynı zamanda gençlerin kariyer motivasyonunu, girişimcilik hayallerini ve teknolojik üretkenliklerini tetikleyecektir.',
  },
  {
    icon: <PiTrendUpDuotone />,
    title: 'Bölgesel Dönüşüm Hareketi',
    text: 'Davet edeceğimiz konuşmacıların bilgi birikimi ve deneyimleri, İnönü Üniversitesi başta olmak üzere bölgedeki tüm gençler için yol gösterici nitelikte olacaktır. Katılımlarıyla, sadece bir etkinliğe değil, aynı zamanda bölgesel bir dönüşüm hareketine katkı sağlamış olacaklardır.',
  },
];

export default function WhatIs() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const headerRef = useRef(null);
  const paragraphsRef = useRef([]);
  const progressRef = useRef(null);

  // Mobile accordion fallback
  const [activeIndex, setActiveIndex] = useState(0);
  const toggleAccordion = (index) => {
    if (window.innerWidth <= 768) {
      setActiveIndex(activeIndex === index ? -1 : index);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mm = gsap.matchMedia();

    mm.add('all', (context) => {
      const { isMobile } = context.conditions || {};
      const paragraphs = paragraphsRef.current.filter(Boolean);
      const dots = progressRef.current
        ? Array.from(progressRef.current.querySelectorAll('.whatis-dot'))
        : [];

      // Initial states
      gsap.set(headerRef.current, {
        yPercent: isMobile ? 30 : 60,
        opacity: 0,
        filter: 'blur(28px)',
      });
      gsap.set(paragraphs, {
        xPercent: 130,
        opacity: 0,
        filter: 'blur(28px)',
      });
      gsap.set(dots, { scale: 0.6, opacity: 0.3 });

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: isMobile ? '+=2800' : '+=4200', // Shorter scroll on mobile for better UX
          scrub: 1,
          pin: pinRef.current,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1: Title rises from below with blur
      tl.to(
        headerRef.current,
        {
          yPercent: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.1,
        },
        0,
      );

      // Phase 2..N: Each paragraph slides in from right, holds, slides out left
      paragraphs.forEach((p, i) => {
        const phaseStart = 1.3 + i * 1.6;

        // Light up the active dot
        if (dots[i]) {
          tl.to(
            dots[i],
            {
              scale: 1,
              opacity: 1,
              duration: 0.4,
              ease: 'power2.out',
            },
            phaseStart - 0.2,
          );
        }

        // Enter from right
        tl.to(
          p,
          {
            xPercent: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1,
          },
          phaseStart,
        );

        // Hold in center
        tl.to(p, { duration: 0.4, xPercent: 0 }, phaseStart + 1);

        // Exit to left (except last)
        if (i < paragraphs.length - 1) {
          tl.to(
            p,
            {
              xPercent: -130,
              opacity: 0,
              filter: 'blur(28px)',
              duration: 1,
              ease: 'power2.in',
            },
            phaseStart + 1.4,
          );

          if (dots[i]) {
            tl.to(
              dots[i],
              {
                scale: 0.6,
                opacity: 0.3,
                duration: 0.4,
              },
              phaseStart + 1.4,
            );
          }
        }
      });

      // Force a refresh after a short delay to ensure layout is ready
      setTimeout(() => ScrollTrigger.refresh(), 500);

      return () => {
        // cleanup
      };
    }, {
      isMobile: '(max-width: 768px)',
      isDesktop: '(min-width: 769px)'
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="whatis" id="nedir" ref={sectionRef}>
      <div className="whatis-pin" ref={pinRef}>
        <div className="container whatis-stage">
          <div className="whatis-header" ref={headerRef}>
            <h2 className="section-title whatis-title">
              Teknoloji ve Yenilik Zirvesi <span>Nedir?</span>
            </h2>
            <p className="section-subtitle whatis-subtitle">
              Bölgenin en büyük teknoloji ve girişimcilik buluşması
            </p>
          </div>

          <div className="whatis-paragraphs">
            {cards.map((card, i) => (
              <article
                key={i}
                className="whatis-paragraph"
                ref={(el) => (paragraphsRef.current[i] = el)}
              >
                <div className="whatis-paragraph-icon">{card.icon}</div>
                <h3 className="whatis-paragraph-title">{card.title}</h3>
                <p className="whatis-paragraph-text">{card.text}</p>
              </article>
            ))}
          </div>

          <div className="whatis-progress" ref={progressRef} aria-hidden="true">
            {cards.map((_, i) => (
              <span key={i} className="whatis-dot" />
            ))}
          </div>
        </div>
      </div>


    </section>
  );
}
