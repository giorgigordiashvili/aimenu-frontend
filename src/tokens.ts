/**
 * Design system tokens — mirrors the Pigment CSS theme in next.config.ts.
 * Import these instead of hardcoding hex values in styled components.
 */

// ── Slate ────────────────────────────────────────────────────────────────
export const slate50 = '#F8FAFC';
export const slate100 = '#F1F5F9';
export const slate200 = '#E2E8F0';
export const slate500 = '#62748E';
export const slate600 = '#475569';
export const slate900 = '#0F172B';

// ── Rose ─────────────────────────────────────────────────────────────────
export const rose600 = '#EC003F';
export const rose700 = '#BE123C';

// ── Yellow ───────────────────────────────────────────────────────────────
export const yellow500 = '#F0B100';

// ── Green ────────────────────────────────────────────────────────────────
export const green600 = '#16A34A';

// ── Red ──────────────────────────────────────────────────────────────────
export const red600 = '#DC2626';

// ── Sky ──────────────────────────────────────────────────────────────────
export const sky600 = '#0284C7';

// ── Neutrals ─────────────────────────────────────────────────────────────
export const white = '#FFFFFF';
export const whiteTranslucent = '#ffffffE6';

// ── Semantic aliases ─────────────────────────────────────────────────────
export const foreground = slate900;
export const background = slate50;
export const primary = rose600;
export const primaryHover = rose700;
export const muted = slate500;
export const border = slate200;

// ── Shadows ──────────────────────────────────────────────────────────────
export const shadowSm = '0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px -1px rgba(0, 0, 0, 0.1)';
export const shadowMd =
  '0px 16px 16px -8px rgba(12, 12, 13, 0.1), 0px 4px 4px -4px rgba(12, 12, 13, 0.05)';
export const shadowCard =
  '0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)';

// ── Border radius ────────────────────────────────────────────────────────
export const radiusSm = '8px';
export const radiusMd = '14px';
export const radiusLg = '26px';
export const radiusFull = '120px';
