'use client';

import { styled } from '@pigment-css/react';

import { useTranslations } from '@/context/LocaleContext';
import { white } from '@/tokens';

import SearchFilters, { SearchFiltersValue } from './SearchFilters';

// ── Styled ────────────────────────────────────────────────────────────────────

const Hero = styled('section')({
  position: 'relative',
  background: 'linear-gradient(135deg, #0F172B 0%, #1a2744 60%, #0f2035 100%)',
  padding: '64px 20px 96px',
  overflow: 'hidden',
  '@media (min-width: 768px)': {
    padding: '80px 80px 112px',
  },
});

// Decorative blurred circles
const BlobA = styled('div')({
  position: 'absolute',
  top: '-80px',
  right: '-60px',
  width: '360px',
  height: '360px',
  borderRadius: '50%',
  background: 'rgba(236, 0, 63, 0.12)',
  filter: 'blur(80px)',
  pointerEvents: 'none',
});

const BlobB = styled('div')({
  position: 'absolute',
  bottom: '20px',
  left: '-80px',
  width: '300px',
  height: '300px',
  borderRadius: '50%',
  background: 'rgba(59, 130, 246, 0.08)',
  filter: 'blur(80px)',
  pointerEvents: 'none',
});

const HeroContent = styled('div')({
  position: 'relative',
  zIndex: 1,
  maxWidth: '1280px',
  margin: '0 auto',
});

const Title = styled('h1')({
  fontSize: '32px',
  fontWeight: 800,
  color: white,
  lineHeight: '1.2',
  letterSpacing: '-0.5px',
  margin: '0 0 12px',
  '@media (min-width: 768px)': {
    fontSize: '48px',
    marginBottom: '16px',
  },
});

const Accent = styled('span')({
  color: '#EC003F',
});

const Subtitle = styled('p')({
  fontSize: '15px',
  fontWeight: 400,
  color: 'rgba(255,255,255,0.65)',
  lineHeight: '1.6',
  margin: '0 0 48px',
  maxWidth: '560px',
  '@media (min-width: 768px)': {
    fontSize: '17px',
    marginBottom: '56px',
  },
});

const FiltersWrap = styled('div')({
  position: 'relative',
  maxWidth: '900px',
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

  // Split the title at the last word to accent it visually
  const title = t.restaurantsList.heroTitle;
  const words = title.split(' ');
  const lastTwo = words.slice(-2).join(' ');
  const rest = words.slice(0, -2).join(' ');

  return (
    <Hero>
      <BlobA />
      <BlobB />
      <HeroContent>
        <Title>
          {rest} <Accent>{lastTwo}</Accent>
        </Title>
        <Subtitle>{t.restaurantsList.heroSubtitle}</Subtitle>
        <FiltersWrap>
          <SearchFilters
            value={filters}
            onChange={onFiltersChange}
            onSearch={onSearch}
          />
        </FiltersWrap>
      </HeroContent>
    </Hero>
  );
}
