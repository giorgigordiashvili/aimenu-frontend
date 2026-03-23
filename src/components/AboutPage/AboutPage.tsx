'use client';

import { styled } from '@pigment-css/react';
import Image from 'next/image';

import Footer from '@/components/Footer';
import HeaderPrimary from '@/components/HeaderPrimary';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import { foreground, rose500, shadowCard, slate400, slate50, white } from '@/tokens';

// ── Styled Components ────────────────────────────────────────────────────────

const PageWrapper = styled('div')({
  minHeight: '100vh',
  background: slate50,
  display: 'flex',
  flexDirection: 'column',
});

const HeroSection = styled('section')({
  background: white,
  padding: '80px 24px',
  textAlign: 'center',
});

const HeroInner = styled('div')({
  maxWidth: 1120,
  margin: '0 auto',
  textAlign: 'center',
});

const PageTitle = styled('h1')({
  fontSize: 48,
  fontWeight: 700,
  color: foreground,
  margin: 0,
  '@media (max-width: 768px)': {
    fontSize: 32,
  },
});

const PageSubtitle = styled('p')({
  fontSize: 18,
  color: slate400,
  margin: '16px auto 0',
  maxWidth: 640,
});

const StatsSection = styled('section')({
  background: slate50,
  padding: '64px 24px',
});

const StatsInner = styled('div')({
  maxWidth: 1120,
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 24,
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
  },
});

const StatCard = styled('div')({
  background: white,
  borderRadius: 16,
  padding: '32px 24px',
  textAlign: 'center',
  boxShadow: shadowCard,
});

const StatNumber = styled('p')({
  fontSize: 40,
  fontWeight: 700,
  color: rose500,
  margin: 0,
});

const StatLabel = styled('p')({
  fontSize: 16,
  color: slate400,
  marginTop: 8,
  marginBottom: 0,
});

const MissionSection = styled('section')({
  background: white,
  padding: '80px 24px',
});

const MissionInner = styled('div')({
  maxWidth: 1120,
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 64,
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
    gap: 32,
  },
});

const MissionText = styled('div')({});

const MissionTitle = styled('h2')({
  fontSize: 32,
  fontWeight: 700,
  color: foreground,
  marginBottom: 16,
  marginTop: 0,
});

const MissionBody = styled('p')({
  fontSize: 16,
  lineHeight: 1.7,
  color: slate400,
  margin: 0,
});

const MissionImage = styled('div')({
  borderRadius: 16,
  overflow: 'hidden',
  position: 'relative',
  minHeight: 300,
});

// ── Component ────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const { locale } = useLocale();
  const t = useTranslations();

  return (
    <PageWrapper>
      <HeaderPrimary />

      <HeroSection>
        <HeroInner>
          <PageTitle>{t.about.title}</PageTitle>
          <PageSubtitle>{t.about.subtitle}</PageSubtitle>
        </HeroInner>
      </HeroSection>

      <StatsSection>
        <StatsInner>
          <StatCard>
            <StatNumber>500+</StatNumber>
            <StatLabel>{t.about.statsRestaurants}</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>25</StatNumber>
            <StatLabel>{t.about.statsCities}</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>50,000+</StatNumber>
            <StatLabel>{t.about.statsUsers}</StatLabel>
          </StatCard>
        </StatsInner>
      </StatsSection>

      <MissionSection>
        <MissionInner>
          <MissionText>
            <MissionTitle>{t.about.mission}</MissionTitle>
            <MissionBody>{t.about.missionText}</MissionBody>
          </MissionText>
          <MissionImage>
            <Image
              src='/demo/RestaurantCardImage.jpg'
              alt='Mission'
              fill
              style={{ objectFit: 'cover' }}
            />
          </MissionImage>
        </MissionInner>
      </MissionSection>

      <Footer locale={locale} />
    </PageWrapper>
  );
}
