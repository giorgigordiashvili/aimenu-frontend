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
  const copy = (t as unknown as { legal?: { privacyTitle?: string; privacyIntro?: string } }).legal;
  return buildMetadata({
    locale,
    path: '/privacy',
    title: copy?.privacyTitle,
    description: copy?.privacyIntro,
  });
}

export default async function PrivacyRoute({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = getDictionary(locale);
  const copy = (t as unknown as {
    legal?: Record<string, string>;
  }).legal ?? {};
  // Localised body. Strings live in i18n so future legal review can edit
  // them without touching code. Markdown-style paragraphs split on \n\n.
  const sections: Array<{ h: string; p: string }> = [
    { h: copy.privacyDataHeading ?? 'What we collect', p: copy.privacyDataBody ?? '' },
    { h: copy.privacyUseHeading ?? 'How we use it', p: copy.privacyUseBody ?? '' },
    { h: copy.privacyShareHeading ?? 'Sharing', p: copy.privacyShareBody ?? '' },
    { h: copy.privacyRightsHeading ?? 'Your rights', p: copy.privacyRightsBody ?? '' },
    { h: copy.privacyContactHeading ?? 'Contact', p: copy.privacyContactBody ?? '' },
  ];

  return (
    <LegalPage
      locale={locale}
      title={copy.privacyTitle ?? 'Privacy policy'}
      updated={copy.lastUpdated ?? 'Last updated: today'}
      draftNote={copy.draftNotice ?? 'Draft — for review by counsel.'}
    >
      <p>{copy.privacyIntro ?? ''}</p>
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
