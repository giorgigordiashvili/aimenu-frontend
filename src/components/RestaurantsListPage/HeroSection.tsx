'use client';

import { styled } from '@pigment-css/react';

import { useTranslations } from '@/context/LocaleContext';
import { rose500, white } from '@/tokens';

import SearchFilters, { SearchFiltersValue } from './SearchFilters';

// ── Styled ────────────────────────────────────────────────────────────────────

const Hero = styled('section')({
  position: 'relative',
  // zIndex: 2 ensures the section's stacking context is above the restaurant
  // grid that follows it, so overflowing dropdowns render on top correctly.
  zIndex: 2,
  backgroundImage: 'url(/demo/RestaurantCardImage.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: '64px 20px 96px',
  '@media (min-width: 768px)': {
    padding: '80px 80px 112px',
  },
});

/** Dark overlay so text stays readable over the background image */
const Overlay = styled('div')({
  position: 'absolute',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.55)',
  zIndex: 0,
  pointerEvents: 'none',
});

const HeroContent = styled('div')({
  position: 'relative',
  zIndex: 1,
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
  color: '#E2E8F0',
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

  return (
    <Hero>
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
