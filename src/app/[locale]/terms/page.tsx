import type { Metadata } from 'next';

import LegalPage from '@/components/LegalPage';
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
  const copy = (t as unknown as { legal?: { termsTitle?: string; termsIntro?: string } }).legal;
  return buildMetadata({
    locale,
    path: '/terms',
    title: copy?.termsTitle,
    description: copy?.termsIntro,
  });
}

export default async function TermsRoute({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = getDictionary(locale);
  const copy =
    (
      t as unknown as {
        legal?: Record<string, string>;
      }
    ).legal ?? {};
  const sections: Array<{ h: string; p: string }> = [
    { h: copy.termsServiceHeading ?? 'Service', p: copy.termsServiceBody ?? '' },
    { h: copy.termsAccountHeading ?? 'Accounts', p: copy.termsAccountBody ?? '' },
    { h: copy.termsOrdersHeading ?? 'Orders & payments', p: copy.termsOrdersBody ?? '' },
    { h: copy.termsRefundsHeading ?? 'Cancellations & refunds', p: copy.termsRefundsBody ?? '' },
    { h: copy.termsLiabilityHeading ?? 'Liability', p: copy.termsLiabilityBody ?? '' },
    { h: copy.termsContactHeading ?? 'Contact', p: copy.termsContactBody ?? '' },
  ];

  return (
    <LegalPage
      locale={locale}
      title={copy.termsTitle ?? 'Terms of service'}
      updated={copy.lastUpdated ?? 'Last updated: today'}
      draftNote={copy.draftNotice ?? 'Draft — for review by counsel.'}
    >
      <p>{copy.termsIntro ?? ''}</p>
      {sections.map((s, i) => (
        <section key={i}>
          <h2>{s.h}</h2>
          {s.p.split('\n\n').map((para, j) => (
            <p key={j}>{para}</p>
          ))}
        </section>
      ))}
    </LegalPage>
  );
}
