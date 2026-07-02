'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  PiMicrophoneStageDuotone,
  PiUsersThreeDuotone,
  PiSparkleDuotone,
  PiCertificateDuotone,
} from 'react-icons/pi';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const reasons = [
  {
    icon: <PiMicrophoneStageDuotone />,
    title: 'Uzman Konuşmacılar',
    desc: 'Alanında öncü isimlerden yapay zeka, yazılım ve girişimcilik üzerine ilham verici konuşmalar.',
    badge: 'Konuşmacılar',
    accent: '#dc2626',
  },
  {
    icon: <PiUsersThreeDuotone />,
    title: 'Ağ Kurma',
    desc: 'Akademisyenler, sektör temsilcileri ve öğrencilerle tanışma ve iş birliği fırsatını yakalayın.',
    badge: 'Bağlantı',
    accent: '#ef4444',
  },
  {
    icon: <PiSparkleDuotone />,
    title: 'İlham Verici İçerik',
    desc: 'Teknoloji dünyasındaki yenilikçi projeler ve uygulamalar hakkında derinlemesine bilgi edinin.',
    badge: 'İlham',
    accent: '#f87171',
  },
  {
    icon: <PiCertificateDuotone />,
    title: 'Sertifika Kazanın',
    desc: 'Doğu Anadolu Zirvesi katılımınızdan ötürü adınıza özel hazırlanmış sertifika kazanın.',
    badge: 'Ödül',
    accent: '#b91c1c',
  },
];

// Timeline design (total = 14 units → 7000px scroll, ~500px per unit)
// Phase 1  0.0 →  2.8  : zoom in from above (veil fades, cube scales 0.14→1)
// Phase 2  2.8 →  4.6  : tilt from top-view to side-view (rotateX -88→-14)
// Phase 3  4.6 → 10.0  : rotateY 0 → -270 (4 content faces)
// Phase 4 10.0 → 11.5  : tilt to bottom view (rotateX -14 → 90), header out
// Phase 5 11.5 → 14.0  : zoom into bottom face + outro overlay fills screen
const TL_TOTAL   = 14;
const P3_START   = 4.6  / TL_TOTAL; // ~0.329
const P3_END     = 10.0 / TL_TOTAL; // ~0.714

export default function WhyAttend() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);
  const veilRef    = useRef(null);
  const perspRef   = useRef(null);   // scaled for zoom (2-D, uniform)
  const cubeRef    = useRef(null);   // rotated (3-D)
  const tiltRef    = useRef(null);
  const headerRef  = useRef(null);
  const outroRef   = useRef(null);   // full-screen outro overlay

  /* ─── Master scroll-driven timeline ─── */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const persp  = perspRef.current;
    const cube   = cubeRef.current;
    const veil   = veilRef.current;
    const header = headerRef.current;
    const outro  = outroRef.current;

    if (!persp || !cube || !veil || !header || !outro) return;

    gsap.set(persp,  { scale: 0.14, transformOrigin: '50% 50%' });
    gsap.set(cube,   { rotateX: -88, rotateY: 0 });
    gsap.set(header, { opacity: 0, y: 24 });
    gsap.set(outro,  { opacity: 0 });

    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end:   'bottom bottom',
          scrub: isMobile ? 0.8 : 1.6,
          invalidateOnRefresh: true,
          onLeaveBack() {
            persp.style.willChange = 'auto';
            cube.style.willChange  = 'auto';
          },
          onEnter() {
            persp.style.willChange = 'transform';
            cube.style.willChange  = 'transform';
          },
          onUpdate(self) {
            if (self.progress < P3_START) { setActive(0); return; }
            if (self.progress >= P3_END)  { setActive(reasons.length - 1); return; }
            const p   = (self.progress - P3_START) / (P3_END - P3_START);
            const idx = Math.min(reasons.length - 1, Math.floor(p * reasons.length));
            setActive(prev => (prev === idx ? prev : idx));
          },
        },
      });

      // ── Phase 1 : zoom in from above (2-D scale → uniform) ──
      tl.to(veil,  { opacity: 0, duration: 1.0, ease: 'power3.in' }, 0)
        .to(persp, { scale: 1.0, duration: 2.8, ease: 'power2.inOut' }, 0);

      // ── Phase 2 : tilt cube to side-view ──
      tl.to(cube,   { rotateX: -14, duration: 1.8, ease: 'power3.inOut' }, 2.8)
        .to(header, { opacity: 1, y: 0, duration: 1.1, ease: 'power2.out' }, 3.4);

      // ── Phase 3 : rotate through 4 content faces ──
      tl.to(cube, { rotateY: -270, duration: 5.4, ease: 'none' }, 4.6);

      // ── Phase 4 : tilt + continue Y so bottom face faces camera ──
      // rotateY -270 → -360 (= 0°, same direction as phase 3), rotateX -14 → 90
      // Only at rotateY=0/360 + rotateX=90 does bottom face perfectly face camera.
      tl.to(cube,   { rotateX: 90, rotateY: -360, duration: 1.5, ease: 'power2.inOut' }, 10)
        .to(header, { opacity: 0, y: -16, duration: 0.7, ease: 'power2.in' }, 10);

      // ── Phase 5 : zoom into bottom face + outro overlay fills screen ──
      // outro overlay fades early — scale only needs to ~fill viewport before outro covers
      tl.to(persp, { scale: 7, duration: 2.5, ease: 'power3.in' }, 11.5)
        .to(outro,  { opacity: 1, duration: 1.2, ease: 'power2.in'  }, 12.2);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ─── Mouse parallax tilt (gentle, non-distracting) ─── */
  useEffect(() => {
    const tilt = tiltRef.current;
    const wrap = tilt?.parentElement;
    if (!tilt || !wrap) return;

    let raf = 0;
    const target  = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const tick = () => {
      current.x += (target.x - current.x) * 0.07;
      current.y += (target.y - current.y) * 0.07;
      tilt.style.transform = `rotateX(${current.x.toFixed(3)}deg) rotateY(${current.y.toFixed(3)}deg)`;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      const r  = wrap.getBoundingClientRect();
      target.x = -((e.clientY - r.top  - r.height / 2) / r.height) * 4;
      target.y =  ((e.clientX - r.left - r.width  / 2) / r.width)  * 4;
    };

    const onLeave = () => { target.x = 0; target.y = 0; };

    wrap.addEventListener('mousemove',  onMove);
    wrap.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      wrap.removeEventListener('mousemove',  onMove);
      wrap.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const activeAccent = reasons[active].accent;

  return (
    <section className="why-attend" id="neden" ref={sectionRef}>

      {/* White veil → fades as we zoom in */}
      <div className="why-veil" ref={veilRef} aria-hidden="true" />

      {/* Sticky viewport stage */}
      <div className="why-scene">

        {/* Header — absolute, centered at top-third, appears during tilt phase */}
        <header className="why-header" ref={headerRef}>
          <h2 className="section-title why-title">
            Neden <span>Katılmalısınız?</span>
          </h2>
          <p className="section-subtitle why-subtitle">
            Dört neden — her biri seni bir adım öteye taşıyacak.
          </p>
        </header>

        {/* 3-D Cube — centered in full scene */}
        <div className="why-cube-wrap">
        <div className="why-persp" ref={perspRef} style={{ '--accent': activeAccent }}>
          {/* Mouse-parallax wrapper */}
          <div className="why-tilt" ref={tiltRef}>
            {/* GSAP drives rotateX / rotateY / scale on this element */}
            <div className="why-cube" ref={cubeRef}>

              {/* ── TOP FACE: red + HSD logo ── */}
              <div className="why-face why-face-top">
                <div className="why-face-top-shine" />
                <div className="why-face-top-grid" />
                <img
                  src="/HSD-Beyaz-Logo.png"
                  alt="HSD Logo"
                  className="why-hsd-logo"
                  draggable="false"
                />
              </div>

              {/* ── BOTTOM FACE ── */}
              <div className="why-face why-face-bottom" />

              {/* ── 4 SIDE CONTENT FACES ── */}
              {reasons.map((r, i) => (
                <div
                  key={i}
                  className={`why-face why-face-s${i}${i === active ? ' active' : ''}`}
                  style={{ '--accent': r.accent }}
                >
                  <div className="wf-glow"   aria-hidden="true" />
                  <div className="wf-grid"   aria-hidden="true" />

                  <div className="wf-badge">
                    <span className="wf-badge-num">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="wf-badge-label">{r.badge}</span>
                  </div>

                  <div className="wf-body">
                    <span className="wf-icon">{r.icon}</span>
                    <h3 className="wf-title">{r.title}</h3>
                    <p  className="wf-desc">{r.desc}</p>
                  </div>

                  {/* Corner decorations */}
                  <span className="wf-c wf-c-tl" aria-hidden="true" />
                  <span className="wf-c wf-c-tr" aria-hidden="true" />
                  <span className="wf-c wf-c-bl" aria-hidden="true" />
                  <span className="wf-c wf-c-br" aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>

        {/* Bottom progress line — absolute bottom of sticky scene */}
        <div className="why-progress-track" aria-hidden="true">
          <div
            className="why-progress-fill"
            style={{
              width: `${((active + 1) / reasons.length) * 100}%`,
              background: reasons[active].accent,
            }}
          />
        </div>

        {/* Outro overlay — fades in with About section's background color */}
        <div className="why-outro" ref={outroRef} aria-hidden="true" />
      </div>
    </section>
  );
}
