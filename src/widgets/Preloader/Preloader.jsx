import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './Preloader.css';

const Preloader = ({ onComplete }) => {
  const preloaderRef = useRef(null);
  const percentRef = useRef(null);
  const logoRef = useRef(null);
  const curtainRef = useRef(null);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    // Lock scroll
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // Percentage counter animation
    const counter = { value: 0 };
    gsap.to(counter, {
      value: 100,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: () => {
        setPercentage(Math.floor(counter.value));
      },
      onComplete: () => {
        // Start exit animation
        const tl = gsap.timeline({
          onComplete: () => {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            if (onComplete) onComplete();
          }
        });

        tl.to(logoRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.8,
          ease: "power3.in"
        })
        .to(percentRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power3.in"
        }, "-=0.6")
        .to(preloaderRef.current, {
          y: "-100%",
          duration: 1.2,
          ease: "power4.inOut"
        })
        .set(preloaderRef.current, { display: 'none' });
      }
    });

    // Initial entrance for logo
    gsap.fromTo(logoRef.current, 
      { opacity: 0, scale: 0.9, y: 10 },
      { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.2 }
    );
  }, []); // Sadece mount anında bir kez çalışması yeterlidir.

  return (
    <div className="preloader" ref={preloaderRef}>
      <div className="preloader-content">
        <div className="preloader-text-wrapper" ref={logoRef}>
          <div className="preloader-title">
            <span className="preloader-title-line top">TEKNOLOJİ VE YENİLİK</span>
            <span className="preloader-title-line bottom">ZİRVESİ</span>
          </div>
        </div>
        <div className="preloader-percent-wrapper" ref={percentRef}>
          <span className="preloader-percent">{percentage}</span>
          <span className="preloader-symbol">%</span>
        </div>
      </div>
      <div className="preloader-curtain" ref={curtainRef}></div>
    </div>
  );
};

export default Preloader;
