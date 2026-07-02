import { useEffect, useState } from 'react';

const navLinks = [
  { href: '#nedir', label: 'Nedir?' },
  { href: '#neden', label: 'Neden Katılmalı' },
  { href: '#hakkimizda', label: 'Hakkımızda' },
  { href: '#konusmacilar', label: 'Konuşmacılar' },
  { href: '#paydaslar', label: 'Paydaşlar' },
  { href: '#sponsorlar', label: 'Sponsorlar' },
  { href: '#iletisim', label: 'İletişim' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      setMenuOpen(false);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll Spy Logic
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0
    };

    const handleIntersect = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const sectionIds = navLinks.map(link => link.href.substring(1));
    
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const closeMenu = () => setMenuOpen(false);
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeMenu();
    };

    window.addEventListener('scroll', closeMenu, { passive: true });
    window.addEventListener('resize', closeMenu);
    window.addEventListener('hashchange', closeMenu);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('scroll', closeMenu);
      window.removeEventListener('resize', closeMenu);
      window.removeEventListener('hashchange', closeMenu);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const getSectionOffset = (sectionId) => {
    if (sectionId === 'nedir') return window.innerHeight * 1.8;
    if (sectionId === 'neden') return window.innerHeight * 1.55;
    return 0;
  };

  const handleLinkClick = (event, href) => {
    event.preventDefault();
    setMenuOpen(false);

    const sectionId = href.substring(1);
    const target = document.getElementById(sectionId);
    if (!target) return;

    const baseTop = target.getBoundingClientRect().top + window.scrollY;
    const top = Math.max(0, baseTop + getSectionOffset(sectionId));

    window.scrollTo({ top, behavior: 'smooth' });
    window.history.replaceState(null, '', href);
    setActiveSection(sectionId);
  };

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      {/* Toggle button - Always fixed-friendly outside trackers */}
      <button
        className={`navbar-toggle${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menü"
        type="button"
      >
        <span /><span /><span />
      </button>

      {/* Full-screen Menu - Absolute/Fixed friendly */}
      <div className={`navbar-mobile-links${menuOpen ? ' open' : ''}`}>
        {navLinks.map((link) => (
          <a 
            key={link.href} 
            href={link.href} 
            onClick={(event) => handleLinkClick(event, link.href)}
            className={activeSection === link.href.substring(1) ? 'active' : ''}
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="navbar-track">
        <div className={`navbar-pill${scrolled ? ' is-active' : ''}`}>
          {/* Desktop links placeholder - visible only on desktop via CSS */}
          <div className="navbar-desktop-links">
            {navLinks.map((link) => (
              <a 
                key={link.href} 
                href={link.href} 
                onClick={(event) => handleLinkClick(event, link.href)}
                className={activeSection === link.href.substring(1) ? 'active' : ''}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="navbar-menu-backdrop"
          aria-label="Menüyü kapat"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  );
}
