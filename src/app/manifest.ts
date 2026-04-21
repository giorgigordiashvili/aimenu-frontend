import type { MetadataRoute } from 'next';

// Web manifest — makes the site installable as a PWA on Android/iOS
// home screens. icons currently reuse /logo.png; swap in dedicated
// 192/512 PNGs when the brand has them.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'aimenu.ge',
    short_name: 'aimenu',
    description:
      'Discover and book Georgia\u2019s best restaurants. Browse menus, reserve a table, and order from your phone.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f172b',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    lang: 'ka',
    dir: 'ltr',
    categories: ['food', 'lifestyle'],
  };
}
