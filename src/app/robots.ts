import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/seo';

// Standard robots.txt — let crawlers index public pages, keep private /
// transactional surfaces out of the index.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/profile',
          '/profile/',
          '/order-review',
          '/orders',
          '/payments/return',
          '/table/settle',
          '/login',
          '/register',
          '/registration',
          '/password-reset',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
