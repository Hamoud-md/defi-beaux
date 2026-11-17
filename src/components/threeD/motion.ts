import { useEffect, useRef, useState } from 'react';

/**
 * Authoritative reduced-motion state for the whole application.
 *
 * The App component mirrors the user toggle (and the OS preference) on the
 * <html> element through the `data-reduced-motion` attribute. Reading that
 * attribute keeps the 3D layers perfectly in sync with the explicit
 * accessibility switch offered in the header (requirement A12).
 */
export function useReducedMotionFlag(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof document === 'undefined') {
      return false;
    }
    const attribute = document.documentElement.getAttribute('data-reduced-motion');
    if (attribute === 'true') return true;
    if (attribute === 'false') return false;
    return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;
  });

  useEffect(() => {
    const root = document.documentElement;
    const update = (): void => {
      const attribute = root.getAttribute('data-reduced-motion');
      if (attribute !== null) {
        setReduced(attribute === 'true');
        return;
      }
      setReduced(
        typeof window !== 'undefined' && typeof window.matchMedia === 'function'
          ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
          : false
      );
    };

    update();

    if (typeof MutationObserver === 'undefined') {
      return;
    }

    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['data-reduced-motion'] });
    return () => observer.disconnect();
  }, []);

  return reduced;
}

interface TiltOptions {
  /** Maximum rotation applied around the Y axis, in degrees. */
  maxY?: number;
  /** Maximum rotation applied around the X axis, in degrees. */
  maxX?: number;
}

/**
 * Pointer-driven parallax tilt for 3D stages.
 *
 * The hook writes `--tilt-x` / `--tilt-y` CSS custom properties directly on
 * the element, avoiding any React re-render on pointer movement. It is
 * automatically disabled for coarse pointers and when reduced motion is
 * requested.
 */
export function useTilt3D<T extends HTMLElement>(
  enabled = true,
  options: TiltOptions = {}
): React.RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const reduced = useReducedMotionFlag();
  const maxY = options.maxY ?? 8;
  const maxX = options.maxX ?? 6;

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled || reduced) {
      return;
    }

    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    let frame = 0;

    const handleMove = (event: PointerEvent): void => {
      if (frame) return;
      const schedule =
        typeof window.requestAnimationFrame === 'function'
          ? window.requestAnimationFrame
          : (cb: FrameRequestCallback): number =>
              window.setTimeout(() => cb(Date.now()), 16) as unknown as number;
      frame = schedule(() => {
        frame = 0;
        const rect = element.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
        const relativeY = (event.clientY - rect.top) / rect.height - 0.5;
        element.style.setProperty('--tilt-y', `${(relativeX * maxY).toFixed(2)}deg`);
        element.style.setProperty('--tilt-x', `${(-relativeY * maxX).toFixed(2)}deg`);
      });
    };

    const handleLeave = (): void => {
      element.style.setProperty('--tilt-y', '0deg');
      element.style.setProperty('--tilt-x', '0deg');
    };

    element.addEventListener('pointermove', handleMove);
    element.addEventListener('pointerleave', handleLeave);

    return () => {
      element.removeEventListener('pointermove', handleMove);
      element.removeEventListener('pointerleave', handleLeave);
      if (frame && typeof window.cancelAnimationFrame === 'function') {
        window.cancelAnimationFrame(frame);
      }
      handleLeave();
    };
  }, [enabled, reduced, maxX, maxY]);

  return ref;
}
