import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'AiMenu - Restaurant Menu',
  description: 'Digital menu for restaurants',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Lock zoom to 1x — otherwise mobile Safari pinch-zooms the whole
  // layout and breaks the hero sheet + sticky bars. `user-scalable=no`
  // is for older WebViews; `maximum-scale=1` covers iOS 13+.
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
