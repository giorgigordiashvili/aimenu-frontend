import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ScanPage from '@/components/ScanPage';
import { isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return { title: 'Scan' };
  const t = getDictionary(locale);
  return { title: `${t.scan.title} | AiMenu` };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  return <ScanPage />;
}
