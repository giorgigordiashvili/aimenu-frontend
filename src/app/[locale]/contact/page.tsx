import type { Metadata } from 'next';

import ContactPage from '@/components/ContactPage';
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
    path: '/contact',
    title: seo.contactTitle,
    description: seo.contactDescription,
  });
}

export default function ContactRoute() {
  return <ContactPage />;
}
