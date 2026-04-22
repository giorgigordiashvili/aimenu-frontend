import { useEffect, useRef, useState } from 'react';

/**
 * IntersectionObserver wrapper that flips to `true` the first time the
 * target enters the viewport and stays true afterwards. Intended for
 * one-shot scroll-reveal animations — we don't want cards re-animating
 * every time they scroll back into view.
 */
export function useInView<T extends Element = HTMLElement>(options?: {
  rootMargin?: string;
  threshold?: number;
}): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // SSR guard + safety for very old browsers.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
            break;
          }
        }
      },
      {
        // Slight negative margin so the reveal fires a touch before the
        // element reaches the fold — feels more natural than waiting
        // until it's fully on-screen.
        rootMargin: options?.rootMargin ?? '0px 0px -10% 0px',
        threshold: options?.threshold ?? 0.05,
      }
    );
    observer.observe(node);
    return () => observer.disconnect();
    // options are captured once — we don't intend to re-observe on changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, inView];
}
