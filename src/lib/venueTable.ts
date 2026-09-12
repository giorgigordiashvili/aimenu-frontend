// The physical table the guest scanned at a shared venue, plus each member
// restaurant's own table code for it. Kept in sessionStorage next to the
// per-restaurant TableContext; a small event lets React read it live.

export interface VenueTableContext {
  venueSlug: string;
  venueName: string;
  /** The venue QR code that was scanned. */
  code: string;
  tableNumber: string;
  /** restaurant slug -> that restaurant's own table code (null when not mirrored). */
  memberCodes: Record<string, string | null>;
  storedAt: number;
}

const KEY = 'venueTable.v1';
const EVENT = 'venueTable:changed';
const MAX_AGE_MS = 12 * 60 * 60 * 1000;

export function readVenueTable(): VenueTableContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as VenueTableContext;
    if (!parsed?.venueSlug || Date.now() - (parsed.storedAt ?? 0) > MAX_AGE_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeVenueTable(ctx: Omit<VenueTableContext, 'storedAt'>): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify({ ...ctx, storedAt: Date.now() }));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* storage unavailable (private mode) — the page still works without it */
  }
}

export function clearVenueTable(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* ignore */
  }
}

export function subscribeVenueTable(cb: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

/** Link to a member restaurant, carrying its own table code when we have one. */
export function restaurantHref(
  localePrefixedPath: string,
  ctx: VenueTableContext | null,
  restaurantSlug: string
): string {
  const code = ctx?.memberCodes?.[restaurantSlug];
  return code
    ? `${localePrefixedPath}?table=${encodeURIComponent(code)}&via=venue`
    : localePrefixedPath;
}
