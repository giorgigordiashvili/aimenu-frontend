'use client';

import { styled } from '@pigment-css/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Slim navigation progress bar pinned to the very top of the viewport.
// Listens for:
//   - clicks on any <a> pointing at a same-origin URL (covers every
//     `<Link>` and raw anchor alike) → starts the bar
//   - `top-progress:start` custom events dispatched from programmatic
//     navigations that don't bubble a click (router.push inside an
//     onClick handler we control) → starts the bar
// Ends the bar automatically once `usePathname` / `useSearchParams`
// changes, meaning the new route has committed.

const BAR_COLOR = '#ED013F';

const Track = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: '2px',
  zIndex: 9999,
  pointerEvents: 'none',
  background: 'transparent',
});

const Fill = styled('div')({
  height: '100%',
  width: '100%',
  background: BAR_COLOR,
  boxShadow: `0 0 8px ${BAR_COLOR}, 0 0 2px ${BAR_COLOR}`,
  transformOrigin: '0 50%',
  willChange: 'transform, opacity',
  transition: 'transform 200ms ease-out, opacity 200ms linear',
});

function isSameOriginNav(el: HTMLElement | null): string | null {
  if (!el) return null;
  const anchor = el.closest('a');
  if (!anchor) return null;
  const href = anchor.getAttribute('href');
  if (!href) return null;
  // Hash jumps / downloads / external links don't navigate the SPA.
  if (anchor.target && anchor.target !== '_self') return null;
  if (anchor.hasAttribute('download')) return null;
  if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return null;
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return null;
    // Same page — don't animate.
    if (url.pathname === window.location.pathname && url.search === window.location.search) {
      return null;
    }
    return url.pathname + url.search;
  } catch {
    return null;
  }
}

export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0); // 0..1
  const [visible, setVisible] = useState(false);
  const trickleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setVisible(true);
    setProgress(p => (p > 0 && p < 0.8 ? p : 0.08));
    if (trickleRef.current) clearInterval(trickleRef.current);
    // Ease toward 85% while we wait for the new route to commit. Bigger
    // gaps at the start, smaller as we approach the cap — matches the
    // shape of nprogress so it feels familiar.
    trickleRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 0.85) return p;
        const remaining = 0.85 - p;
        return p + remaining * 0.08;
      });
    }, 180);
  };

  const finish = () => {
    if (trickleRef.current) {
      clearInterval(trickleRef.current);
      trickleRef.current = null;
    }
    setProgress(1);
    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 260);
  };

  // Listen to global clicks + the explicit custom event + history
  // pushState so programmatic `router.push` navigations (card clicks,
  // form redirects) also show progress.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      if (isSameOriginNav(target)) start();
    };
    const onStartEvent = () => start();
    const onPopState = () => finish();

    // Patch history.pushState / replaceState so any router.push that
    // doesn't route through an anchor click still triggers the bar.
    const originalPush = window.history.pushState;
    const originalReplace = window.history.replaceState;
    window.history.pushState = function (...args) {
      start();
      return originalPush.apply(this, args);
    };
    window.history.replaceState = function (...args) {
      start();
      return originalReplace.apply(this, args);
    };

    document.addEventListener('click', onClick, true);
    window.addEventListener('top-progress:start', onStartEvent);
    window.addEventListener('popstate', onPopState);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('top-progress:start', onStartEvent);
      window.removeEventListener('popstate', onPopState);
      window.history.pushState = originalPush;
      window.history.replaceState = originalReplace;
    };
  }, []);

  // Pathname / query change == route committed.
  const firstRenderRef = useRef(true);
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    finish();
  }, [pathname, searchParams]);

  useEffect(() => {
    return () => {
      if (trickleRef.current) clearInterval(trickleRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <Track aria-hidden='true'>
      <Fill
        style={{
          transform: `scaleX(${progress})`,
          opacity: progress >= 1 ? 0 : 1,
        }}
      />
    </Track>
  );
}
