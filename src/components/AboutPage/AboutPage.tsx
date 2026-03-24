'use client';

import { styled } from '@pigment-css/react';
import Image from 'next/image';

import Footer from '@/components/Footer';
import HeaderPrimary from '@/components/HeaderPrimary';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import {
  foreground,
  rose500,
  rose600,
  shadowCard,
  slate250,
  slate400,
  slate50,
  white,
} from '@/tokens';

// ── Styled Components ────────────────────────────────────────────────────────

const PageWrapper = styled('div')({
  minHeight: '100vh',
  background: slate50,
  display: 'flex',
  flexDirection: 'column',
});

const HeroSection = styled('section')({
  position: 'relative',
  backgroundImage: 'url(/demo/RestaurantCardImage.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: '44px 24px 80px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  '@media (max-width: 768px)': {
    padding: '32px 16px 60px',
  },
});

const Overlay = styled('div')({
  position: 'absolute',
  inset: 0,
  background: 'rgba(0,0,0,0.55)',
  zIndex: 0,
});

const HeroContent = styled('div')({
  position: 'relative',
  zIndex: 1,
  maxWidth: 1120,
  margin: '0 auto',
  width: '100%',
});

const StoryBadge = styled('span')({
  background: rose600,
  borderRadius: '50px',
  color: white,
  fontSize: 14,
  fontWeight: 500,
  padding: '6px 16px',
  display: 'inline-block',
});

const HeroTitle = styled('h1')({
  marginTop: 16,
  fontSize: 60,
  fontWeight: 800,
  lineHeight: 1.1,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  color: white,
  '@media (max-width: 768px)': {
    marginTop: 24,
    fontSize: 26,
  },
});

const HeroTitleRose = styled('span')({
  color: rose500,
});

const HeroSubtitle = styled('p')({
  marginTop: 28,
  marginBottom: 0,
  fontSize: 18,
  color: slate250,
  maxWidth: 640,
  lineHeight: 1.6,
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
        <Overlay />
        <HeroContent>
          <StoryBadge>{t.about.heroStoryBadge}</StoryBadge>
          <HeroTitle>
            <span>{t.about.heroTitleWhite}</span>{' '}
            <HeroTitleRose>{t.about.heroTitleRose}</HeroTitleRose>
          </HeroTitle>
          <HeroSubtitle>{t.about.heroSubtitle}</HeroSubtitle>
        </HeroContent>
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
