'use client';

import { styled } from '@pigment-css/react';
import Image from 'next/image';

import Footer from '@/components/Footer';
import HeaderPrimary from '@/components/HeaderPrimary';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import LocationIcon from '@/icons/Location';
import People from '@/icons/People';
import RestaurantUtensils from '@/icons/RestaurantUtensils';
import {
  foreground,
  rose50,
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
  alignItems: 'center',
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
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
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
  textAlign: 'center',
});

const StatsSection = styled('section')({
  background: white,
  padding: '0 24px 64px',
  position: 'relative',
  zIndex: 1,
});

const StatsInner = styled('div')({
  maxWidth: 1120,
  margin: '0 auto',
  marginTop: -48,
  display: 'flex',
  gap: 24,
  position: 'relative',
  zIndex: 1,
  '@media (max-width: 768px)': {
    flexDirection: 'column',
  },
});

const StatCard = styled('div')({
  flex: 1,
  width: 358,
  height: 184,
  paddingTop: 32,
  paddingBottom: 24,
  paddingLeft: 8,
  paddingRight: 8,
  background: white,
  borderRadius: 16,
  boxShadow: shadowCard,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  boxSizing: 'border-box',
});

const IconCircle = styled('div')({
  width: 48,
  height: 48,
  borderRadius: '50%',
  background: rose50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

const StatNumber = styled('p')({
  fontSize: 40,
  fontWeight: 700,
  color: foreground,
  margin: 0,
  marginTop: 16,
});

const StatLabel = styled('p')({
  fontSize: 16,
  color: slate400,
  marginTop: 4,
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

// ── Stat Data ────────────────────────────────────────────────────────────────

const stats = [
  { Icon: RestaurantUtensils, number: '500+', key: 'statsRestaurants' as const },
  { Icon: People, number: '50k+', key: 'statsUsers' as const },
  { Icon: LocationIcon, number: '12', key: 'statsCities' as const },
];

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
          {stats.map((stat, i) => (
            <StatCard key={i}>
              <IconCircle>
                <stat.Icon width={24} height={24} style={{ color: rose600 }} />
              </IconCircle>
              <StatNumber>{stat.number}</StatNumber>
              <StatLabel>{t.about[stat.key]}</StatLabel>
            </StatCard>
          ))}
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
