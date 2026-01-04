import { withPigment } from '@pigment-css/nextjs-plugin';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.aimenu.ge',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'restaurant-media.fra1.digitaloceanspaces.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 420, 640, 750, 828],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  compress: true,
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withPigment(nextConfig, {
  theme: {
    colors: {
      background: '#f8fafc',
      foreground: '#0f172a',
      primary: '#ec003f',
      primaryLight: '#fff1f2',
      secondary: '#7ccf00',
      gray: {
        100: '#f1f5f9',
        200: '#e2e8f0',
        400: '#9c9c9c',
        500: '#62748e',
      },
      white: '#ffffff',
    },
    shadows: {
      sm: '0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px -1px rgba(0, 0, 0, 0.1)',
      md: '0px 16px 16px -8px rgba(12, 12, 13, 0.1), 0px 4px 4px -4px rgba(12, 12, 13, 0.05)',
    },
    borderRadius: {
      sm: '8px',
      md: '14px',
      lg: '26px',
      full: '120px',
    },
  },
});
