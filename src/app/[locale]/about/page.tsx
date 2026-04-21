import type { Metadata } from 'next';

import AboutPage from '@/components/AboutPage';
import { defaultLocale, isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { buildMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = getDictionary(locale);
  const seo = (t as unknown as { seo?: Record<string, string> }).seo ?? {};
  return buildMetadata({
    locale,
    path: '/about',
    title: seo.aboutTitle,
    description: seo.aboutDescription,
  });
}

export default function AboutRoute() {
  return <AboutPage />;
}
