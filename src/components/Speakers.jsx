'use client';

/* eslint-disable react/no-unknown-property */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useThree, useFrame } from '@react-three/fiber';
import { Image } from '@react-three/drei';
import FluidGlass from './FluidGlass';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const speakers = [
  {
    name: 'Deniz Yalçın',
    role: 'Cloud Engineer',
    company: 'Vodafone',
    tags: ['Cloud', 'DevOps', 'Vodafone'],
    bio: 'Vodafone tarafındaki cloud engineering deneyimleriyle bulut teknolojileri, modern altyapı ve kariyer yolculuğu üzerine içgörüler paylaşacak.',
    image: encodeURI('/konuşmacı1.jpeg'),
  },
  {
    name: 'Betül Gündüz Odabaşı',
    role: 'Eğitim & Organizasyonel Gelişim Şefi',
    company: 'İstikbal Mobilya · Profesyonel Koç',
    tags: ['Liderlik', 'Koçluk', 'Gelişim'],
    bio: 'Eğitim, organizasyonel gelişim ve profesyonel koçluk alanlarındaki deneyimleriyle kişisel gelişim ve liderlik üzerine konuşacak.',
    image: encodeURI('/konuşmacı2.jpeg'),
  },
  {
    name: 'Fazıl Göleç',
    role: 'IT Proje Yöneticisi',
    company: 'Erciyes Holding',
    tags: ['IT', 'Proje Yönetimi', 'Holding'],
    bio: 'Erciyes Holding bünyesinde IT Proje Yöneticisi olarak görev yapan Fazıl Göleç, proje yönetimi ve bilgi teknolojileri alanındaki deneyimlerini aktaracak.',
    image: encodeURI('/fazılgölec.jpeg'),
  },
  {
    name: 'Tuncay Erol',
    role: 'Yazılım & Yapay Zeka Eğitmeni',
    company: 'Bağımsız · Eğitmen',
    tags: ['Yazılım', 'Yapay Zeka', 'Eğitim'],
    bio: 'Yazılım ve yapay zeka eğitimi alanındaki deneyimleriyle teknoloji üretimi, öğrenme süreçleri ve gelecek yetkinlikleri üzerine paylaşım yapacak.',
    image: '/tuncayerol.jpeg',
  },
];

const PHOTO_X_NORM = 0.44; // alternating photo X position (normalized [-1..1])
const N_SPEAKERS = speakers.length;

/* -------------------------------------------------------------------------- */
/*                  WebGL scene: photos + scroll-driven group                  */
/* -------------------------------------------------------------------------- */
function SpeakerScene({ progressRef, lensTargetRef }) {
  const { viewport, camera } = useThree();
  const groupRef = useRef(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const v = viewport.getCurrentViewport(camera, [0, 0, 0]);
    const n = N_SPEAKERS;
    const p = progressRef.current ?? 0;

    // Group Y: doğrudan scroll ile kilitli — lerp yok (parallax kayması olmasın)
    const targetGroupY = p * (n - 1) * v.height;
    groupRef.current.position.y = targetGroupY;

    /* ----- Lens X (alternating) with hold + fast transition ----- */
    const segLen = 1 / (n - 1);
    const seg = Math.min(n - 2, Math.floor(p / segLen + 1e-6));
    const local = Math.max(0, Math.min(1, (p - seg * segLen) / segLen));

    const HOLD_A = 0.12;
    const HOLD_B = 0.12;
    let t;
    if (local < HOLD_A) t = 0;
    else if (local > 1 - HOLD_B) t = 1;
    else t = (local - HOLD_A) / (1 - HOLD_A - HOLD_B);
    // smooth easeInOutCubic
    t = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const isMobile = window.innerWidth <= 768;
    const xA = isMobile ? 0 : (seg % 2 === 1 ? +PHOTO_X_NORM : -PHOTO_X_NORM);
    const xB = isMobile ? 0 : ((seg + 1) % 2 === 1 ? +PHOTO_X_NORM : -PHOTO_X_NORM);
    lensTargetRef.current.x = xA + (xB - xA) * t;
    lensTargetRef.current.y = isMobile ? -0.2 : 0;
  });

  return (
    <group ref={groupRef}>
      {speakers.map((sp, i) => {
        const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
        const reverse = i % 2 === 1;
        const x = reverse ? +PHOTO_X_NORM : -PHOTO_X_NORM;
        return (
          <Image
            key={sp.name}
            url={sp.image}
            position={[isMobile ? 0 : x * (viewport.width / 2), -i * viewport.height, 0]}
            scale={isMobile ? [viewport.width * 0.85, viewport.height * 0.6] : [viewport.width * 0.36, viewport.height * 0.78]}
          />
        );
      })}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Speakers                                   */
/* -------------------------------------------------------------------------- */
export default function Speakers() {
  const sectionRef = useRef(null);
  const rowsRef = useRef(null);
  const pinRef = useRef(null);
  const fluidRef = useRef(null);
  const progressRef = useRef(0);
  const lensTargetRef = useRef({ x: -PHOTO_X_NORM, y: 0 });
  const rowRefs = useRef([]);

  /* ── Scroll progress: viewport merkezi × satır yüksekliği (intro hariç) ── */
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    let raf = 0;
    let mounted = true;

    const tick = () => {
      if (!mounted) return;
      const rowsWrap = rowsRef.current;
      const pin = pinRef.current;
      const row0 = rowsWrap?.querySelector('.sp-row');
      const ih =
        pin?.clientHeight ||
        row0?.getBoundingClientRect().height ||
        window.visualViewport?.height ||
        window.innerHeight;

      const vv = window.visualViewport;
      const scrollCenter =
        window.scrollY + (vv?.offsetTop ?? 0) + (vv?.height ?? window.innerHeight) / 2;

      if (!rowsWrap) {
        progressRef.current = 0;
      } else {
        const rowsRect = rowsWrap.getBoundingClientRect();
        const rowsTopDoc = rowsRect.top + window.scrollY;
        const denom = (N_SPEAKERS - 1) * ih;
        let p = denom > 0 ? (scrollCenter - rowsTopDoc - ih / 2) / denom : 0;
        progressRef.current = Math.max(0, Math.min(1, p));
      }

      if (fluidRef.current?.setTarget) {
        fluidRef.current.setTarget(lensTargetRef.current.x, lensTargetRef.current.y);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  /* ── GSAP reveals on intro + each text row ── */
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const section = sectionRef.current;
    if (!section) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      gsap.from('.speakers__eyebrow', {
        opacity: 0,
        y: 12,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.speakers__intro', start: 'top 85%', once: true },
      });
      gsap.from('.speakers__title', {
        opacity: 0,
        y: 32,
        duration: 1,
        delay: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.speakers__intro', start: 'top 85%', once: true },
      });
      gsap.from('.speakers__sub', {
        opacity: 0,
        y: 16,
        duration: 0.8,
        delay: 0.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.speakers__intro', start: 'top 85%', once: true },
      });
      gsap.from('.speakers__rule', {
        scaleX: 0,
        transformOrigin: 'center',
        duration: 1.1,
        delay: 0.05,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.speakers__intro', start: 'top 85%', once: true },
      });

      rowRefs.current.forEach((row) => {
        if (!row) return;
        const children = row.querySelectorAll(':scope > *');
        gsap.from(children, {
          opacity: 0,
          y: 28,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 75%', once: true },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="speakers-fluid" id="konusmacilar" ref={sectionRef}>
      <div className="speakers__intro container">
        <span className="speakers__eyebrow">— Davetli İsimler · 2026 —</span>
        <h2 className="section-title speakers__title">
          Konuşmacılar<span className="speakers__title-dot">.</span>
        </h2>
        <p className="section-subtitle speakers__sub">
          Bölgenin sahnesine teknoloji, liderlik ve eğitim alanından dört vizyoner.
        </p>
        <div className="speakers__rule" aria-hidden="true" />
      </div>

      <div className="speakers-fluid__wrapper" style={{ position: 'relative' }}>
        {/* Pinned WebGL stage */}
        <div className="speakers-fluid__stage" ref={pinRef} aria-hidden="true">
        <div className="speakers-fluid__canvas">
          <FluidGlass
            ref={fluidRef}
            lensProps={{
              scale: 0.35,
              /* İnce cam + düşük IOR → merkez neredeyse doğrudan görüntü */
              ior: 1.02,
              thickness: 1.1,
              /* RGB kırılımı çok hafif (sadece eğri yüzeylerde / kenarlarda hissedilir) */
              chromaticAberration: 0.022,
              /* Shader içi thickness smear’ı kapat → orta alan daha keskin */
              anisotropicBlur: 0,
              roughness: 0,
              distortion: 0,
              samples: 4, // Reduced from 12 for massive performance gain since roughness is 0
            }}
          >
            <SpeakerScene
              progressRef={progressRef}
              lensTargetRef={lensTargetRef}
            />
          </FluidGlass>
        </div>
      </div>

      {/* Text rows — natural flow, alternating side, 100vh each (synced with WebGL group) */}
      <div className="speakers-fluid__rows" ref={rowsRef}>
        {speakers.map((sp, i) => {
          const reverse = i % 2 === 1;
          const num = String(i + 1).padStart(2, '0');
          return (
            <div
              key={sp.name}
              className={`sp-row ${reverse ? 'sp-row--reverse' : ''}`}
            >
              <div className="sp-row__mobile-image">
                <img src={sp.image} alt={sp.name} decoding="async" />
              </div>
              <div
                className="sp-row__info"
                ref={(el) => (rowRefs.current[i] = el)}
              >
                <span className="sp-row__kicker">
                  <span className="sp-row__kicker-dot" /> N° {num} / 04
                </span>
                <h3 className="sp-row__name">{sp.name}</h3>
                <p className="sp-row__role">
                  {sp.role}
                  <span className="sp-row__role-sep"> · </span>
                  <span className="sp-row__company">{sp.company}</span>
                </p>
                <span className="sp-row__divider" />
                <p className="sp-row__bio">{sp.bio}</p>
                <div className="sp-row__tags">
                  {sp.tags.map((t) => (
                    <span className="sp-row__tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </div>

      <div className="speakers__endmark" aria-hidden="true">
        <span className="speakers__endmark-rule" />
        <span className="speakers__endmark-text">— sahne sizin —</span>
        <span className="speakers__endmark-rule" />
      </div>
    </section>
  );
}
