// Cookie / analytics consent. Persisted in localStorage AND a 1-year
// cookie so the SSR layer can choose to skip rendering the banner if
// the user already decided.

export interface ConsentState {
  /** Strictly necessary cookies — JWT, cart, table session. Always true. */
  necessary: true;
  /** Analytics — currently Microsoft Clarity. */
  analytics: boolean;
  /** Marketing / third-party trackers. Currently unused; kept for future. */
  marketing: boolean;
  /** ISO timestamp of when the user last set consent. */
  decidedAt: string | null;
}

export const CONSENT_VERSION = 1;
export const CONSENT_STORAGE_KEY = `aimenu_consent_v${CONSENT_VERSION}`;
export const CONSENT_COOKIE_NAME = `aimenu_consent_v${CONSENT_VERSION}`;

const DEFAULT_STATE: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  decidedAt: null,
};

const listeners = new Set<(c: ConsentState) => void>();

function readFromStorage(): ConsentState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      necessary: true,
      analytics: !!parsed.analytics,
      marketing: !!parsed.marketing,
      decidedAt: typeof parsed.decidedAt === 'string' ? parsed.decidedAt : null,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

let cached: ConsentState | null = null;

export function getConsent(): ConsentState {
  if (cached) return cached;
  cached = readFromStorage();
  return cached;
}

export function hasDecided(): boolean {
  return getConsent().decidedAt !== null;
}

export function hasAnalyticsConsent(): boolean {
  return getConsent().analytics;
}

export function setConsent(next: { analytics: boolean; marketing: boolean }): void {
  if (typeof window === 'undefined') return;
  const state: ConsentState = {
    necessary: true,
    analytics: next.analytics,
    marketing: next.marketing,
    decidedAt: new Date().toISOString(),
  };
  cached = state;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage blocked — best-effort only
  }
  // Mirror to a 1-year cookie so the SSR layer could read it later.
  // SameSite=Lax + Secure to play nicely with HTTPS.
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify({ a: state.analytics ? 1 : 0, m: state.marketing ? 1 : 0 })
  )}; Max-Age=${oneYear}; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
  listeners.forEach(l => l(state));
}

export function subscribeConsent(cb: (c: ConsentState) => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function acceptAll(): void {
  setConsent({ analytics: true, marketing: true });
}

export function rejectOptional(): void {
  setConsent({ analytics: false, marketing: false });
}
