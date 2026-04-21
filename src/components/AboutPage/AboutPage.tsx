'use client';

import { styled } from '@pigment-css/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Footer from '@/components/Footer';
import HeaderPrimary from '@/components/HeaderPrimary';
import MainButton from '@/components/MainButton/MainButton';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import { localePath } from '@/i18n/routing';
import ChefHat from '@/icons/ChefHat';
import ClockIcon from '@/icons/Clock';
import LocationIcon from '@/icons/Location';
import People from '@/icons/People';
import RestaurantUtensils from '@/icons/RestaurantUtensils';
import Security from '@/icons/Security';
import StarOutline from '@/icons/StarOutline';
import {
  foreground,
  rose50,
  rose500,
  rose600,
  shadowCard,
  slate100,
  slate250,
  slate400,
  slate400c,
  slate50,
  slate500,
  slate900,
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
  '@media (max-width: 768px)': {
    width: '100%',
  },
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

// ── Mission Section ──────────────────────────────────────────────────────────

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
    gap: 40,
  },
});

const MissionTextCol = styled('div')({});

const MissionTitleBlock = styled('h2')({
  fontSize: 36,
  fontWeight: 700,
  lineHeight: 1.2,
  margin: 0,
  '@media (max-width: 768px)': {
    fontSize: 30,
  },
});

const MissionTitleLine1 = styled('span')({
  display: 'block',
  color: foreground,
});

const MissionTitleLine2 = styled('span')({
  display: 'block',
  color: rose500,
  whiteSpace: 'nowrap',
  '@media (max-width: 768px)': {
    whiteSpace: 'normal',
  },
});

const MissionPara = styled('p')({
  color: slate400c,
  fontSize: 18,
  lineHeight: 1.7,
  marginTop: 24,
  marginBottom: 0,
});

const FeaturesGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: 24,
  marginTop: 40,
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
  },
});

const FeatureItem = styled('div')({
  display: 'flex',
  gap: 12,
  alignItems: 'flex-start',
});

const FeatureIconBox = styled('div')({
  width: 40,
  height: 40,
  borderRadius: 10,
  background: slate100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

const FeatureTextCol = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
});

const FeatureTitle = styled('span')({
  fontSize: 16,
  fontWeight: 700,
  color: slate900,
});

const FeatureDesc = styled('span')({
  fontSize: 14,
  color: slate400,
});

const MissionImageWrapper = styled('div')({
  position: 'relative',
  display: 'inline-block',
  '@media (max-width: 768px)': {
    width: '100%',
  },
});

const BlurCircle = styled('div')({
  position: 'absolute',
  width: 100,
  height: 100,
  borderRadius: '50%',
  background: rose500,
  opacity: 0.8,
  filter: 'blur(40px)',
  bottom: -20,
  left: -20,
  zIndex: 0,
  pointerEvents: 'none',
});

// ── CTA Section ─────────────────────────────────────────────────────────────

const CtaSection = styled('section')({
  background: slate50,
  padding: '80px 24px',
  textAlign: 'center',
});

const CtaInner = styled('div')({
  maxWidth: 1120,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 32,
});

const CtaTitle = styled('h2')({
  fontSize: 30,
  fontWeight: 700,
  color: slate900,
  margin: 0,
});

const CtaSubtitle = styled('p')({
  fontSize: 16,
  color: slate500,
  margin: 0,
  maxWidth: 520,
  lineHeight: 1.6,
});

const CtaButtons = styled('div')({
  display: 'flex',
  gap: 16,
  flexWrap: 'wrap',
  justifyContent: 'center',
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
  const router = useRouter();

  const features = [
    { icon: StarOutline, title: t.about.feature1Title, desc: t.about.feature1Desc },
    { icon: ClockIcon, title: t.about.feature2Title, desc: t.about.feature2Desc },
    { icon: Security, title: t.about.feature3Title, desc: t.about.feature3Desc },
    { icon: ChefHat, title: t.about.feature4Title, desc: t.about.feature4Desc },
  ];

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
          <MissionTextCol>
            <MissionTitleBlock>
              <MissionTitleLine1>{t.about.missionTitleLine1}</MissionTitleLine1>
              <MissionTitleLine2>{t.about.missionTitleLine2}</MissionTitleLine2>
            </MissionTitleBlock>
            <MissionPara>{t.about.missionPara1}</MissionPara>
            <MissionPara>{t.about.missionPara2}</MissionPara>
            <FeaturesGrid>
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <FeatureItem key={i}>
                    <FeatureIconBox>
                      <Icon width={20} height={20} style={{ color: slate900 }} />
                    </FeatureIconBox>
                    <FeatureTextCol>
                      <FeatureTitle>{feature.title}</FeatureTitle>
                      <FeatureDesc>{feature.desc}</FeatureDesc>
                    </FeatureTextCol>
                  </FeatureItem>
                );
              })}
            </FeaturesGrid>
          </MissionTextCol>

          <MissionImageWrapper>
            <BlurCircle />
            <Image
              src='/demo/AboutPagePhoto.png'
              alt='About'
              width={528}
              height={792}
              style={{
                borderRadius: 16,
                width: '100%',
                height: 'auto',
                boxShadow: shadowCard,
                position: 'relative',
                zIndex: 1,
              }}
            />
          </MissionImageWrapper>
        </MissionInner>
      </MissionSection>

      <CtaSection>
        <CtaInner>
          <CtaTitle>{t.about.ctaTitle}</CtaTitle>
          <CtaSubtitle>{t.about.ctaSubtitle}</CtaSubtitle>
          <CtaButtons>
            <MainButton
              size='large'
              variant='rose_cta'
              rounded
              title={t.about.ctaBookButton}
              onClick={() => router.push(localePath(locale, '/restaurants'))}
            />
            <MainButton
              size='large'
              variant='outline'
              rounded
              title={t.about.ctaPartnerButton}
              onClick={() => router.push(localePath(locale, '/restaurant-signup'))}
            />
          </CtaButtons>
        </CtaInner>
      </CtaSection>

      <Footer locale={locale} />
    </PageWrapper>
  );
}
