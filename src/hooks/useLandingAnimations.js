import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { animate, stagger } from 'animejs';

export function useLandingAnimations(isLoading) {
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;

    hasAnimated.current = true;
    const animeInstances = [];

    const ctx = gsap.context(() => {
      gsap.from('.hero-title-word', {
        opacity: 0,
        y: 36,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
      });
      gsap.from('.hero-title-accent', {
        opacity: 0,
        scale: 0.92,
        duration: 0.9,
        delay: 0.35,
        ease: 'back.out(1.4)',
      });
      gsap.from('.hero-date, .hero-slogan, .hero-buttons', {
        opacity: 0,
        y: 20,
        duration: 0.65,
        stagger: 0.08,
        delay: 0.48,
        ease: 'power2.out',
      });
      gsap.from('.navbar-desktop-links > a', {
        opacity: 0,
        y: -10,
        duration: 0.5,
        stagger: 0.06,
        delay: 0.12,
        ease: 'power2.out',
      });
    });

    const countdownItems = document.querySelectorAll('.countdown-item');
    if (countdownItems.length) {
      animeInstances.push(
        animate(countdownItems, {
          translateY: [14, 0],
          opacity: [0.55, 1],
          duration: 720,
          delay: stagger(90, { start: 520 }),
          ease: 'out(3)',
        }),
      );
    }

    const gradient = document.querySelector('.global-bg-gradient');
    if (gradient) {
      animeInstances.push(
        animate(gradient, {
          opacity: [0.6, 1],
          duration: 8000,
          ease: 'inOutSine',
          loop: true,
          alternate: true,
        }),
      );
    }

    return () => {
      ctx.revert();
      animeInstances.forEach((instance) => {
        if (instance && typeof instance.revert === 'function') {
          instance.revert();
        }
      });
    };
  }, []);
}
