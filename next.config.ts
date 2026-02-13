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
      background: '#F8FAFC',
      foreground: '#0F172B',
      primary: '#EC003F',
      primaryLight: '#FFF1F2',
      secondary: '#7CCF00',
      white: '#FFFFFF',
      slate: {
        50: '#F8FAFC',
        100: '#F1F5F9',
        200: '#E2E8F0',
        500: '#62748E',
        600: '#475569',
        900: '#0F172B',
      },
      rose: {
        600: '#EC003F',
        700: '#BE123C',
      },
      yellow: {
        500: '#F0B100',
      },
      green: {
        600: '#16A34A',
      },
      red: {
        600: '#DC2626',
      },
      sky: {
        600: '#0284C7',
      },
      gray: {
        100: '#F1F5F9',
        200: '#E2E8F0',
        400: '#9C9C9C',
        500: '#62748E',
      },
    },
    shadows: {
      sm: '0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px -1px rgba(0, 0, 0, 0.1)',
      md: '0px 16px 16px -8px rgba(12, 12, 13, 0.1), 0px 4px 4px -4px rgba(12, 12, 13, 0.05)',
      card: '0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
    borderRadius: {
      sm: '8px',
      md: '14px',
      lg: '26px',
      full: '120px',
    },
  },
});
