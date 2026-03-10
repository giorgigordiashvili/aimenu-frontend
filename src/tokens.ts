/**
 * Design system tokens — mirrors the Pigment CSS theme in next.config.ts.
 * Import these instead of hardcoding hex values in styled components.
 */

// ── Slate ────────────────────────────────────────────────────────────────
export const slate25 = '#FBFDFD';
export const slate50 = '#F8FAFC';
export const slate100 = '#F1F5F9';
export const slate200 = '#E2E8F0';
export const slate300 = '#CBD5E1';
export const slate400 = '#94A3B8';
export const slate500 = '#62748E';
export const slate600 = '#475569';
export const slate900 = '#0F172B';
export const slate950 = '#090909';

// ── Icon colors ──────────────────────────────────────────────────────────
export const iconStroke = '#90A1B9';

// ── Rose ─────────────────────────────────────────────────────────────────
export const rose25 = '#FFFBFB';
export const rose50 = '#FFF0F3';
export const rose100 = '#FFE0E8';
export const rose200 = '#FFE4E6';
export const rose600 = '#EC003F';
export const rose700 = '#BE123C';
export const rose800 = '#C70036';

// ── Yellow ───────────────────────────────────────────────────────────────
export const yellow500 = '#F0B100';

// ── Green ────────────────────────────────────────────────────────────────
export const green50 = '#F0FDF4';
export const green500 = '#8CC63E';
export const green600 = '#16A34A';
// Original lime colors - do not change without checking all usages
export const lime500 = '#9AE600';
export const lime600 = '#7AB234';
// Additional Tailwind-style lime shades if needed
export const lime400 = '#84CC16';
export const lime700 = '#65A30D';

// ── Red ──────────────────────────────────────────────────────────────────
export const red50 = '#FEE2E2';
export const red600 = '#DC2626';

// ── Blue ─────────────────────────────────────────────────────────────────
export const blue50 = '#EFF6FF';
export const blue500 = '#3B82F6';

// ── Sky ──────────────────────────────────────────────────────────────────
export const sky600 = '#0284C7';

// ── Neutrals ─────────────────────────────────────────────────────────────
export const white = '#FFFFFF';
export const whiteTranslucent = '#ffffffE6';
export const blackAlpha10 = '#0000001A';

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
