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
      // Explicit allow for social-graph scrapers so Facebook's debugger
      // stops suggesting "This response code could be due to a robots.txt
      // block." The path set here mirrors the wildcard above minus the
      // private areas a crawler shouldn't index anyway.
      { userAgent: 'facebookexternalhit', allow: '/' },
      { userAgent: 'Facebot', allow: '/' },
      { userAgent: 'Twitterbot', allow: '/' },
      { userAgent: 'LinkedInBot', allow: '/' },
      { userAgent: 'Slackbot-LinkExpanding', allow: '/' },
      { userAgent: 'WhatsApp', allow: '/' },
      { userAgent: 'TelegramBot', allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
