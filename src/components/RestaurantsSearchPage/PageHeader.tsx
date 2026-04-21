'use client';

import { styled } from '@pigment-css/react';

import SearchIcon from '@/icons/Search';
import {
  border,
  foreground,
  muted,
  rose600,
  rose700,
  slate100,
  slate400,
  white,
} from '@/tokens';

// ── Styled ────────────────────────────────────────────────────────────────────

// Hero-style backdrop with a soft pink→neutral gradient so the page has
// a clear visual anchor instead of opening on flat slate. The colours
// mirror the brand palette without competing with the card grid below.
const HeaderSection = styled('section')({
  position: 'relative',
  padding: '32px 16px 28px',
  background:
    'linear-gradient(180deg, #FFE4EC 0%, #FEF2F4 35%, #F8FAFC 100%)',
  overflow: 'hidden',
  '@media (min-width: 768px)': {
    padding: '56px 24px 44px',
  },
});

// Decorative blur behind the title — purely cosmetic, stays behind content.
const BlurCircle = styled('div')({
  position: 'absolute',
  width: '320px',
  height: '320px',
  borderRadius: '50%',
  background: 'rgba(236, 0, 63, 0.18)',
  filter: 'blur(80px)',
  top: '-120px',
  right: '-80px',
  pointerEvents: 'none',
  '@media (max-width: 768px)': {
    width: '220px',
    height: '220px',
    top: '-80px',
    right: '-60px',
  },
});

const HeaderInner = styled('div')({
  position: 'relative',
  maxWidth: '960px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: '12px',
});

const ResultPill = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '4px 12px',
  borderRadius: '100px',
  background: 'rgba(236, 0, 63, 0.1)',
  color: rose600,
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
});

const Title = styled('h1')({
  fontSize: '30px',
  fontWeight: 800,
  color: foreground,
  margin: 0,
  lineHeight: 1.1,
  letterSpacing: '-0.02em',
  '@media (min-width: 768px)': {
    fontSize: '44px',
  },
});

const Subtitle = styled('p')({
  fontSize: '15px',
  color: muted,
  margin: 0,
  maxWidth: '560px',
  lineHeight: 1.5,
  '@media (min-width: 768px)': {
    fontSize: '17px',
  },
});

// The search bar is the primary control on this page. Integrated submit
// button replaces the "hit Enter to search" blind interaction.
const SearchBox = styled('div')({
  marginTop: '8px',
  width: '100%',
  maxWidth: '640px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  height: '56px',
  padding: '0 4px 0 16px',
  border: `1px solid ${border}`,
  borderRadius: '100px',
  background: white,
  boxShadow: '0 2px 8px -4px rgba(15, 23, 43, 0.08)',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  '&:focus-within': {
    borderColor: rose600,
    boxShadow: '0 0 0 4px rgba(236, 0, 63, 0.12)',
  },
});

const IconWrap = styled('span')({
  display: 'flex',
  alignItems: 'center',
  color: slate400,
  flexShrink: 0,
});

const SearchInput = styled('input')({
  border: 'none',
  outline: 'none',
  flex: 1,
  fontSize: '16px',
  lineHeight: '20px',
  color: foreground,
  background: 'transparent',
  fontFamily: 'inherit',
  // iOS Safari kicks off a zoom-to-input if font-size < 16px.
  minWidth: 0,
  '&::placeholder': {
    color: slate400,
  },
});

const ClearButton = styled('button')({
  appearance: 'none',
  border: 'none',
  background: 'transparent',
  padding: '0',
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  cursor: 'pointer',
  color: muted,
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  '&:hover': {
    background: slate100,
    color: foreground,
  },
});

const SubmitButton = styled('button')({
  appearance: 'none',
  border: 'none',
  height: '48px',
  padding: '0 22px',
  borderRadius: '100px',
  background: rose600,
  color: white,
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background 0.15s ease, transform 0.1s ease',
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  '&:hover': {
    background: rose700,
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
  '&:focus-visible': {
    outline: `2px solid ${rose700}`,
    outlineOffset: '2px',
  },
  '@media (max-width: 520px)': {
    padding: '0 14px',
  },
});

// ── Types ─────────────────────────────────────────────────────────────────────

interface PageHeaderProps {
  title: string;
  subtitle: string;
  /** Total matched restaurants — shown above the title as a chip. */
  resultCount?: number;
  /** Copy template with "{count}" placeholder. */
  resultCountTemplate?: string;
  /** Copy shown when there are zero results (no interpolation). */
  resultCountZeroLabel?: string;
  searchValue: string;
  onSearchChange: (v: string) => void;
  onSearchSubmit: () => void;
  searchPlaceholder?: string;
  clearLabel?: string;
  submitLabel?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PageHeader({
  title,
  subtitle,
  resultCount,
  resultCountTemplate,
  resultCountZeroLabel,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = 'ძიება...',
  clearLabel = 'Clear',
  submitLabel = 'Search',
}: PageHeaderProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearchSubmit();
  };

  const countLabel = (() => {
    if (resultCount === undefined) return null;
    if (resultCount === 0 && resultCountZeroLabel) return resultCountZeroLabel;
    if (resultCountTemplate) return resultCountTemplate.replace('{count}', String(resultCount));
    return null;
  })();

  return (
    <HeaderSection>
      <BlurCircle aria-hidden='true' />
      <HeaderInner>
        {countLabel && <ResultPill>{countLabel}</ResultPill>}
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>

        <SearchBox>
          <IconWrap aria-hidden='true'>
            <SearchIcon width={18} height={18} />
          </IconWrap>
          <SearchInput
            type='search'
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
          />
          {searchValue && (
            <ClearButton
              type='button'
              onClick={() => {
                onSearchChange('');
                onSearchSubmit();
              }}
              aria-label={clearLabel}
            >
              ✕
            </ClearButton>
          )}
          <SubmitButton type='button' onClick={onSearchSubmit} aria-label={submitLabel}>
            {submitLabel}
          </SubmitButton>
        </SearchBox>
      </HeaderInner>
    </HeaderSection>
  );
}
