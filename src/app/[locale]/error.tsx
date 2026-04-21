'use client';

import { styled } from '@pigment-css/react';
import { useEffect } from 'react';

import Footer from '@/components/Footer';
import HeaderPrimary from '@/components/HeaderPrimary';
import MainButton from '@/components/MainButton/MainButton';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import { localePath } from '@/i18n/routing';
import { foreground, slate400, slate50 } from '@/tokens';

// Per-route error boundary. Catches any unhandled exception thrown
// inside a Server Component or its hydrated client tree. Falls back to
// generic "we crashed, try again" copy so the user is never stuck on a
// blank page. The actual stack lands in the browser console (and
// Clarity's session recording when consent is given).

const PageWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: slate50,
});

const ContentSection = styled('section')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 24px',
  textAlign: 'center',
});

const Title = styled('h1')({
  fontSize: 22,
  fontWeight: 700,
  color: foreground,
  margin: '24px 0 8px',
});

const Subtitle = styled('p')({
  fontSize: 15,
  color: slate400,
  maxWidth: 440,
  margin: 0,
});

const ButtonRow = styled('div')({
  display: 'flex',
  gap: 12,
  marginTop: 32,
  flexWrap: 'wrap',
  justifyContent: 'center',
});

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: Props) {
  const { locale } = useLocale();
  const t = useTranslations();
  const copy = (t as unknown as { errorPage?: Record<string, string> }).errorPage ?? {};

  useEffect(() => {
    // Log so the developer console shows it; Next masks the stack in prod
    // by default but the digest prints either way.
    if (process.env.NODE_ENV !== 'production') console.error('[ErrorBoundary]', error);
  }, [error]);

  return (
    <PageWrapper>
      <HeaderPrimary />
      <ContentSection>
        <Title>{copy.title ?? 'Something went wrong'}</Title>
        <Subtitle>
          {copy.message ?? 'We hit an unexpected error. Please try again.'}
          {error.digest ? ` (id: ${error.digest})` : ''}
        </Subtitle>
        <ButtonRow>
          <MainButton variant='outline' title={copy.retry ?? 'Try again'} onClick={() => reset()} />
          <MainButton
            variant='rose_cta'
            title={copy.goHome ?? 'Back home'}
            onClick={() => {
              window.location.href = localePath(locale);
            }}
          />
        </ButtonRow>
      </ContentSection>
      <Footer locale={locale} />
    </PageWrapper>
  );
}
