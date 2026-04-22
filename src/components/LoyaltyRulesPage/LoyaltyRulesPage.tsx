'use client';

import { styled } from '@pigment-css/react';

import Footer from '@/components/Footer';
import HeaderPrimary from '@/components/HeaderPrimary';
import MainButton from '@/components/MainButton/MainButton';
import { useTranslations } from '@/context/LocaleContext';
import type { Locale } from '@/i18n/config';
import { localePath } from '@/i18n/routing';
import RestaurantUtensilsIcon from '@/icons/RestaurantUtensils';
import {
  background,
  border,
  foreground,
  muted,
  primary,
  radiusMd,
  slate100,
  slate200,
  slate50,
  white,
} from '@/tokens';

const Page = styled('div')({
  minHeight: '100vh',
  background,
  display: 'flex',
  flexDirection: 'column',
});

const Main = styled('main')({
  flex: 1,
  padding: '32px 20px 64px',
  maxWidth: '880px',
  width: '100%',
  margin: '0 auto',
  '@media (min-width: 768px)': { padding: '56px 24px 80px' },
});

const Hero = styled('section')({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  marginBottom: '24px',
});

const HeroTag = styled('span')({
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: primary,
});

const HeroTitle = styled('h1')({
  fontSize: '28px',
  fontWeight: 800,
  color: foreground,
  margin: 0,
  lineHeight: 1.15,
  letterSpacing: '-0.01em',
  '@media (min-width: 768px)': { fontSize: '40px' },
});

const HeroLead = styled('p')({
  fontSize: '15px',
  color: muted,
  margin: 0,
  lineHeight: 1.55,
  maxWidth: '640px',
});

const Section = styled('section')({
  background: white,
  border: `1px solid ${border}`,
  borderRadius: radiusMd,
  padding: '20px 20px 24px',
  marginBottom: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  '@media (min-width: 768px)': { padding: '28px' },
});

const SectionTitle = styled('h2')({
  fontSize: '18px',
  fontWeight: 700,
  color: foreground,
  margin: 0,
});

const Body = styled('p')({
  fontSize: '14px',
  color: foreground,
  margin: 0,
  lineHeight: 1.6,
});

const StepsGrid = styled('ol')({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '12px',
  padding: 0,
  margin: 0,
  listStyle: 'none',
  '@media (min-width: 640px)': { gridTemplateColumns: 'repeat(3, 1fr)' },
});

const Step = styled('li')({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  padding: '16px',
  borderRadius: '12px',
  background: slate50,
  border: `1px solid ${slate100}`,
});

const StepNum = styled('span')({
  fontSize: '12px',
  fontWeight: 700,
  color: primary,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
});

const StepTitle = styled('span')({
  fontSize: '14px',
  fontWeight: 700,
  color: foreground,
});

const StepBody = styled('span')({
  fontSize: '13px',
  color: muted,
  lineHeight: 1.5,
});

const TierGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '10px',
  '@media (min-width: 640px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
  '@media (min-width: 960px)': { gridTemplateColumns: 'repeat(4, 1fr)' },
});

const TierCard = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  padding: '16px',
  borderRadius: '12px',
  border: `1px solid ${border}`,
  background: white,
  position: 'relative',
});

const TierName = styled('span')({
  fontSize: '15px',
  fontWeight: 700,
  color: foreground,
});

const TierRange = styled('span')({
  fontSize: '12px',
  color: muted,
});

const TierDiscount = styled('span')({
  fontSize: '20px',
  fontWeight: 800,
  color: primary,
  letterSpacing: '-0.01em',
  marginTop: '4px',
});

const RuleList = styled('ul')({
  margin: 0,
  paddingLeft: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const RuleItem = styled('li')({
  fontSize: '14px',
  color: foreground,
  lineHeight: 1.55,
});

const Note = styled('p')({
  fontSize: '13px',
  color: muted,
  margin: 0,
  padding: '12px 14px',
  borderRadius: '10px',
  background: slate50,
  border: `1px dashed ${slate200}`,
  lineHeight: 1.55,
});

const CtaRow = styled('div')({
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
});

interface Props {
  locale: Locale;
}

export default function LoyaltyRulesPage({ locale }: Props) {
  const t = useTranslations();
  const copy = t.loyaltyRules;
  const tierCopy = t.platformLoyalty.tiers;

  const tiers: Array<{ name: string; range: string; discount: string }> = [
    { name: tierCopy.gourmand, range: copy.tiers.gourmandRange, discount: '0%' },
    { name: tierCopy.silver, range: copy.tiers.silverRange, discount: '5%' },
    { name: tierCopy.gold, range: copy.tiers.goldRange, discount: '10%' },
    { name: tierCopy.platinum, range: copy.tiers.platinumRange, discount: '15%' },
  ];

  return (
    <Page>
      <HeaderPrimary />
      <Main>
        <Hero>
          <HeroTag>{copy.tag}</HeroTag>
          <HeroTitle>{copy.title}</HeroTitle>
          <HeroLead>{copy.lead}</HeroLead>
        </Hero>

        <Section>
          <SectionTitle>{copy.howItWorksTitle}</SectionTitle>
          <StepsGrid>
            <Step>
              <StepNum>01</StepNum>
              <StepTitle>{copy.step1Title}</StepTitle>
              <StepBody>{copy.step1Body}</StepBody>
            </Step>
            <Step>
              <StepNum>02</StepNum>
              <StepTitle>{copy.step2Title}</StepTitle>
              <StepBody>{copy.step2Body}</StepBody>
            </Step>
            <Step>
              <StepNum>03</StepNum>
              <StepTitle>{copy.step3Title}</StepTitle>
              <StepBody>{copy.step3Body}</StepBody>
            </Step>
          </StepsGrid>
        </Section>

        <Section>
          <SectionTitle>{copy.tiersTitle}</SectionTitle>
          <Body>{copy.tiersIntro}</Body>
          <TierGrid>
            {tiers.map(tier => (
              <TierCard key={tier.name}>
                <TierName>{tier.name}</TierName>
                <TierRange>{tier.range}</TierRange>
                <TierDiscount>{tier.discount}</TierDiscount>
              </TierCard>
            ))}
          </TierGrid>
          <Note>{copy.tiersNote}</Note>
        </Section>

        <Section>
          <SectionTitle>{copy.earningTitle}</SectionTitle>
          <Body>{copy.earningIntro}</Body>
          <RuleList>
            <RuleItem>{copy.earningRule1}</RuleItem>
            <RuleItem>{copy.earningRule2}</RuleItem>
            <RuleItem>{copy.earningRule3}</RuleItem>
          </RuleList>
          <Note>{copy.earningNote}</Note>
        </Section>

        <Section>
          <SectionTitle>{copy.restaurantOptInTitle}</SectionTitle>
          <Body>{copy.restaurantOptInBody}</Body>
          <Note>
            <RestaurantUtensilsIcon
              width={14}
              height={14}
              style={{ verticalAlign: 'middle', marginRight: '6px' }}
            />
            {copy.restaurantOptInNote}
          </Note>
        </Section>

        <Section>
          <SectionTitle>{copy.fineprintTitle}</SectionTitle>
          <RuleList>
            <RuleItem>{copy.fineprint1}</RuleItem>
            <RuleItem>{copy.fineprint2}</RuleItem>
            <RuleItem>{copy.fineprint3}</RuleItem>
            <RuleItem>{copy.fineprint4}</RuleItem>
          </RuleList>
        </Section>

        <CtaRow>
          <a href={localePath(locale, '/profile/loyalty')}>
            <MainButton variant='rose_cta' title={copy.ctaPrimary} />
          </a>
          <a href={localePath(locale, '/restaurants?loyaltyOnly=1')}>
            <MainButton variant='outline' title={copy.ctaSecondary} />
          </a>
        </CtaRow>
      </Main>
      <Footer locale={locale} />
    </Page>
  );
}
