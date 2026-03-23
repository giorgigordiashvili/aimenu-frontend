'use client';

import { styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';

import Footer from '@/components/Footer';
import HeaderPrimary from '@/components/HeaderPrimary';
import MainButton from '@/components/MainButton/MainButton';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import ArrowIcon from '@/icons/Arrow';
import Error404Icon from '@/icons/Error404';
import House from '@/icons/House';
import { foreground, slate400, slate50 } from '@/tokens';

// ── Styled Components ────────────────────────────────────────────────────────

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
  minHeight: 'calc(100vh - 64px - 200px)',
});

const IconWrap = styled('div')({
  color: foreground,
});

const Title = styled('h1')({
  fontSize: 16,
  fontWeight: 400,
  marginTop: 32,
  marginBottom: 0,
  color: foreground,
  textAlign: 'center',
});

const Subtitle = styled('p')({
  fontSize: 16,
  color: slate400,
  marginTop: 12,
  marginBottom: 0,
  textAlign: 'center',
  maxWidth: 400,
});

const ButtonRow = styled('div')({
  display: 'flex',
  gap: 12,
  marginTop: 40,
  flexWrap: 'wrap',
  justifyContent: 'center',
});

// ── Component ────────────────────────────────────────────────────────────────

export default function NotFoundPage() {
  const { locale } = useLocale();
  const t = useTranslations();
  const router = useRouter();

  return (
    <PageWrapper>
      <HeaderPrimary />

      <ContentSection>
        <IconWrap>
          <Error404Icon width={206} height={206} />
        </IconWrap>

        <Title>{t.notFound.title}</Title>
        <Subtitle>{t.notFound.message}</Subtitle>

        <ButtonRow>
          <MainButton
            variant='outline'
            title={t.notFound.backHome}
            onClick={() => router.back()}
            icon={ArrowIcon}
            iconPosition='left'
          />
          <MainButton
            variant='rose_cta'
            title={t.notFound.goHome}
            onClick={() => router.push(`/${locale}`)}
            icon={House}
            iconPosition='left'
          />
        </ButtonRow>
      </ContentSection>

      <Footer locale={locale} />
    </PageWrapper>
  );
}
