/**
 * Minimal plural-form picker for the three locales we ship.
 *
 * We interpolate with `.replace('{count}', n)` rather than ICU, so the
 * component has to choose the right string itself. Rules:
 *
 * - `en` — two forms: one / other.
 * - `ru` — three forms: one (1, 21, 31…), few (2–4, 22–24…), many (rest).
 * - `ka` — Georgian takes the singular noun after any numeral, so one form
 *   covers every count and callers can pass `other` alone.
 */
export type PluralCategory = 'one' | 'few' | 'other';

export function pluralCategory(locale: string, n: number): PluralCategory {
  const count = Math.abs(n);
  if (locale === 'ka') return 'other';
  if (locale === 'ru') {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return 'one';
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'few';
    return 'other';
  }
  return count === 1 ? 'one' : 'other';
}

/**
 * Pick a template by plural category and interpolate `{count}`.
 * Falls back down the chain (few → other, one → other) when a locale
 * doesn't define the more specific form.
 */
export function plural(
  locale: string,
  n: number,
  forms: { one?: string; few?: string; other: string }
): string {
  const cat = pluralCategory(locale, n);
  const tpl = (cat === 'one' ? forms.one : cat === 'few' ? forms.few : undefined) ?? forms.other;
  return tpl.replace('{count}', String(n));
}
