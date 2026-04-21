import type { MetadataRoute } from 'next';

import { restaurantsList } from '@/api/generated/api';
import { defaultLocale, locales } from '@/i18n/config';
import { languageAlternates, localeUrl } from '@/lib/seo';

// Static URLs that exist for every locale. Path is locale-agnostic; the
// alternates block emits the per-locale URLs.
const STATIC_PATHS: Array<{ path: string; changeFrequency: 'daily' | 'weekly' | 'monthly'; priority: number }> = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/restaurants', changeFrequency: 'daily', priority: 0.9 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/privacy', changeFrequency: 'monthly', priority: 0.2 },
  { path: '/terms', changeFrequency: 'monthly', priority: 0.2 },
];

/**
 * Generated at request time. Lists every static page once + every public
 * restaurant detail page, all with hreflang alternates so Google indexes
 * the right URL per language.
 *
 * If the API is unreachable we still return the static URLs — better a
 * partial sitemap than a 500.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map(({ path, changeFrequency, priority }) => ({
    url: localeUrl(defaultLocale, path),
    lastModified: now,
    changeFrequency,
    priority,
    alternates: { languages: languageAlternates(path) },
  }));

  try {
    // Pull a generous page so we cover all live restaurants — there are
    // currently ~3, this scales to a few hundred without paginating.
    const data = await restaurantsList(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      1,
      500
    );
    for (const r of data.results ?? []) {
      const path = `/restaurant/${r.slug}`;
      entries.push({
        url: localeUrl(defaultLocale, path),
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: { languages: languageAlternates(path) },
      });
    }
  } catch {
    // API down → ship the static skeleton. Log so we notice.
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[sitemap] restaurants list fetch failed');
    }
  }

  // Tell ISR to cache for ~1 hour so we don't hammer the API on every
  // crawl. Locales array kept around so future tweaks (e.g. emitting
  // separate <url> entries per locale) have it in scope.
  void locales;
  return entries;
}

// Cache the sitemap for an hour so back-to-back crawls don't re-hit the API.
export const revalidate = 3600;
