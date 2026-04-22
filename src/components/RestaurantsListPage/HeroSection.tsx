'use client';

import { keyframes, styled } from '@pigment-css/react';
import Image from 'next/image';

import { useTranslations } from '@/context/LocaleContext';
import { useInView } from '@/hooks/useInView';
import { rose500, slate200, slate900, white } from '@/tokens';

import SearchFilters, { SearchFiltersValue } from './SearchFilters';

// ── Styled ────────────────────────────────────────────────────────────────────

// Subtle fade + 8px slide so the landing feels "alive" on refresh
// without being distracting. Triggered by the `data-in-view` attribute
// that the IntersectionObserver hook flips on. `prefers-reduced-motion`
// users skip the animation entirely.
const heroFadeIn = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

const Hero = styled('section')({
  position: 'relative',
  // zIndex: 2 ensures the section's stacking context is above the restaurant
  // grid that follows it, so overflowing dropdowns render on top correctly.
  zIndex: 2,
  opacity: 0,
  transform: 'translateY(8px)',
  willChange: 'opacity, transform',
  '&[data-in-view="true"]': {
    animation: `${heroFadeIn} 450ms cubic-bezier(0.2, 0.7, 0.2, 1) forwards`,
  },
  '@media (prefers-reduced-motion: reduce)': {
    opacity: 1,
    transform: 'none',
    '&[data-in-view="true"]': { animation: 'none' },
  },
  // Dark placeholder fills the hero before the image paints, so there's no
  // flash of bright background during load.
  background: slate900,
  // Intentionally NOT `overflow: hidden` — the filter-bar dropdowns (city,
  // date, time, guests) are absolutely positioned below the bar and extend
  // past the section's bottom edge. A parent clip would cut them off.
  // Background image still stays contained via its own absolutely-positioned
  // BackgroundWrap (which has its own overflow:hidden).
  padding: '64px 20px 96px',
  '@media (min-width: 768px)': {
    padding: '80px 80px 112px',
  },
});

const BackgroundWrap = styled('div')({
  position: 'absolute',
  inset: 0,
  zIndex: 0,
  overflow: 'hidden',
});

/** Dark overlay so text stays readable over the background image */
const Overlay = styled('div')({
  position: 'absolute',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.55)',
  zIndex: 1,
  pointerEvents: 'none',
});

const HeroContent = styled('div')({
  position: 'relative',
  zIndex: 2,
  maxWidth: '1280px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
});

const TitleWrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  margin: '0 0 12px',
  '@media (min-width: 768px)': {
    marginBottom: '16px',
  },
});

const TitleLine = styled('h1')({
  fontSize: '26px',
  fontWeight: 800,
  color: white,
  lineHeight: '1.2',
  letterSpacing: '-0.5px',
  margin: 0,
  '@media (min-width: 768px)': {
    fontSize: '60px',
  },
});

const TitleLineAccent = styled('h1')({
  fontSize: '26px',
  fontWeight: 800,
  color: rose500,
  lineHeight: '1.2',
  letterSpacing: '-0.5px',
  margin: 0,
  '@media (min-width: 768px)': {
    fontSize: '60px',
  },
});

const Subtitle = styled('p')({
  fontSize: '12px',
  fontWeight: 400,
  color: slate200,
  lineHeight: '1.6',
  margin: '0 0 48px',
  maxWidth: '560px',
  '@media (min-width: 768px)': {
    fontSize: '18px',
    marginBottom: '56px',
  },
});

const FiltersWrap = styled('div')({
  position: 'relative',
  width: '100%',
  maxWidth: '1120px',
});

// ── Props ─────────────────────────────────────────────────────────────────────

interface HeroSectionProps {
  filters: SearchFiltersValue;
  onFiltersChange: (next: SearchFiltersValue) => void;
  onSearch: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function HeroSection({ filters, onFiltersChange, onSearch }: HeroSectionProps) {
  const t = useTranslations();
  const [heroRef, heroInView] = useInView<HTMLElement>();

  return (
    <Hero ref={heroRef} data-in-view={heroInView ? 'true' : undefined}>
      <BackgroundWrap>
        <Image
          src='/demo/RestaurantCardImage.jpg'
          alt=''
          fill
          priority
          sizes='100vw'
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
      </BackgroundWrap>
      <Overlay />
      <HeroContent>
        <TitleWrap>
          <TitleLine>{t.restaurantsList.heroTitleLine1}</TitleLine>
          <TitleLineAccent>{t.restaurantsList.heroTitleLine2}</TitleLineAccent>
        </TitleWrap>
        <Subtitle>{t.restaurantsList.heroSubtitle}</Subtitle>
        <FiltersWrap>
          <SearchFilters value={filters} onChange={onFiltersChange} onSearch={onSearch} />
        </FiltersWrap>
      </HeroContent>
    </Hero>
  );
}
