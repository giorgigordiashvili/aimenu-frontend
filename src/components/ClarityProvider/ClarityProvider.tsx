'use client';

import { useEffect } from 'react';

const CLARITY_PROJECT_ID = 'ugfe7kczrl';

export default function ClarityProvider() {
  useEffect(() => {
    // Clarity is observability, not critical-path. On slow 3G it competes
    // for bandwidth with the LCP image and adds ~600ms preconnect cost per
    // Lighthouse. Defer its bundle + init until the browser is idle so it
    // never blocks first paint or LCP.
    const schedule = (cb: () => void) => {
      const ric = (
        window as Window & {
          requestIdleCallback?: (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number;
        }
      ).requestIdleCallback;
      if (typeof ric === 'function') {
        ric(cb, { timeout: 4000 });
      } else {
        // Safari fallback — still push past the initial paint window.
        setTimeout(cb, 2000);
      }
    };

    schedule(() => {
      void import('@microsoft/clarity').then(mod => {
        mod.default.init(CLARITY_PROJECT_ID);
      });
    });
  }, []);

  return null;
}
