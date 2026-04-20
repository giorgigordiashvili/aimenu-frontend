import { defaultLocale, isValidLocale, type Locale } from './config';

/**
 * Build an internal href for the given locale.
 * The default locale is hidden from URLs (e.g. `ka` → `/restaurants`, `en` → `/en/restaurants`).
 */
export function localePath(locale: Locale | string | undefined, path: string = '/'): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const effectiveLocale = isValidLocale(locale ?? '') ? (locale as Locale) : defaultLocale;

  if (effectiveLocale === defaultLocale) {
    return normalizedPath;
  }

  return normalizedPath === '/' ? `/${effectiveLocale}` : `/${effectiveLocale}${normalizedPath}`;
}

/**
 * Split a pathname into its locale prefix (if any) and the remainder.
 * Unprefixed paths return `locale: null` and `pathWithoutLocale` equal to the input.
 */
export function stripLocale(pathname: string): {
  locale: Locale | null;
  pathWithoutLocale: string;
} {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && isValidLocale(segments[0])) {
    const rest = segments.slice(1);
    return {
      locale: segments[0] as Locale,
      pathWithoutLocale: rest.length ? `/${rest.join('/')}` : '/',
    };
  }
  return { locale: null, pathWithoutLocale: pathname || '/' };
}
