import type { Metadata } from 'next';

import { defaultLocale, type Locale, locales } from '@/i18n/config';

// Production origin. Override via NEXT_PUBLIC_SITE_URL if you need to
// preview on a different host (Vercel preview, local tunnel, etc.).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aimenu.ge').replace(
  /\/$/,
  ''
);
export const SITE_NAME = 'aimenu.ge';
// Twitter handle is intentionally left unset — point metadata at the
// site, not a personal account, until a brand account exists.

/**
 * Convert an in-app path to a canonical absolute URL for the given
 * locale. The default locale (ka) is hidden from URLs, matching the
 * middleware.
 */
export function localeUrl(locale: Locale, path: string = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  const full = prefix + clean;
  const trimmed = full.replace(/\/+$/, '') || '/';
  return `${SITE_URL}${trimmed}`;
}

/**
 * Build `alternates.languages` for a route. Pass the path *without* a
 * locale prefix (e.g. `/restaurant/tiali`). Google recommends emitting
 * `x-default` too.
 */
export function languageAlternates(path: string = '/'): Record<string, string> {
  const out: Record<string, string> = {};
  for (const loc of locales) {
    out[loc] = localeUrl(loc, path);
  }
  out['x-default'] = localeUrl(defaultLocale, path);
  return out;
}

interface BuildMetadataArgs {
  locale: Locale;
  /** Path without locale prefix, e.g. `/restaurant/tiali`. */
  path?: string;
  title?: string;
  description?: string;
  /** Absolute URL for a page-specific OG image. */
  image?: string;
  /** Override site name in og:site_name — default `SITE_NAME`. */
  siteName?: string;
  /** Marks this page as noindex (e.g. private / transactional). */
  noindex?: boolean;
  /**
   * og:type. Next's typings only permit a small subset; we keep the prop
   * generic for callers but clamp to "website" / "article" before passing
   * it through. Use the JSON-LD payload (schema.org/Restaurant) for the
   * richer typing — that's where Google actually reads it.
   */
  ogType?: 'website' | 'article' | 'restaurant';
}

/**
 * Shared `generateMetadata` builder. Pass the locale + absolute path
 * and we fill in the title, description, canonical, hreflang, OG, and
 * Twitter card.
 */
export function buildMetadata({
  locale,
  path = '/',
  title,
  description,
  image,
  siteName = SITE_NAME,
  noindex = false,
  ogType = 'website',
}: BuildMetadataArgs): Metadata {
  const canonical = localeUrl(locale, path);
  const images = image ? [{ url: image }] : undefined;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: languageAlternates(path),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      locale,
      // Clamp to OpenGraph values Next's typings accept; "restaurant" is a
      // schema.org concept, not an OG one.
      type: ogType === 'article' ? 'article' : 'website',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: noindex
      ? { index: false, follow: false, nocache: true }
      : { index: true, follow: true },
  };
}
