import { useEffect, useState } from 'react';
import { PiCaretDownThin } from 'react-icons/pi';
import './ScrollIndicator.css';

export default function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let raf = 0;

    const compute = () => {
      raf = 0;
      const nedirEl = document.getElementById('nedir');
      const hakkimizdaEl = document.getElementById('hakkimizda');
      if (!nedirEl || !hakkimizdaEl) return;
      const wh = window.innerHeight;
      const nedirTop = nedirEl.getBoundingClientRect().top;
      const hakkimizdaTop = hakkimizdaEl.getBoundingClientRect().top;
      setIsVisible(nedirTop <= wh / 3 && hakkimizdaTop > wh / 2);
    };

    const handleScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(compute);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Section'lar lazy mount ediliyor → DOM'da ID ortaya çıkana kadar tekrar dene.
    let attempts = 0;
    const tryCompute = () => {
      const nedirEl = document.getElementById('nedir');
      const hakkimizdaEl = document.getElementById('hakkimizda');
      if (nedirEl && hakkimizdaEl) {
        compute();
      } else if (attempts++ < 20) {
        setTimeout(tryCompute, 250);
      }
    };
    tryCompute();

    const onResize = () => { handleScroll(); };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={`scroll-indicator ${isVisible ? 'visible' : ''}`} aria-hidden="true">
      <span className="scroll-text">KAYDIR</span>
      <div className="scroll-arrows">
        <PiCaretDownThin className="scroll-arrow a1" />
        <PiCaretDownThin className="scroll-arrow a2" />
        <PiCaretDownThin className="scroll-arrow a3" />
      </div>
    </div>
  );
}
