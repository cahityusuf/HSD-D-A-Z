import { useRef, useCallback } from 'react';

/**
 * Magnetic hover effect — element follows cursor within bounds.
 * @param {number} strength - pull strength multiplier (0.2 = subtle, 0.5 = strong)
 * @returns {{ onMouseMove, onMouseLeave, ref }}
 */
export default function useMagnetic(strength = 0.3) {
  const ref = useRef(null);

  const onMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    el.style.transition = 'transform 0.15s ease-out';
  }, [strength]);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    el.style.transform = 'translate(0, 0)';
    el.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}

/**
 * MagneticWrap — wraps any children with magnetic hover behavior.
 * Usage: <MagneticWrap strength={0.3}><button>Click</button></MagneticWrap>
 */
export function MagneticWrap({ children, strength = 0.3, className = '', style = {} }) {
  const { ref, onMouseMove, onMouseLeave } = useMagnetic(strength);

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className}
      style={{ display: 'inline-block', ...style }}
    >
      {children}
    </div>
  );
}
