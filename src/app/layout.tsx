import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'AiMenu - Restaurant Menu',
  description: 'Digital menu for restaurants',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
