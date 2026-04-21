'use client';

import { styled } from '@pigment-css/react';

import SearchIcon from '@/icons/Search';
import {
  border,
  foreground,
  muted,
  rose600,
  slate100,
  slate400,
  slate50,
  white,
} from '@/tokens';

// ── Styled ────────────────────────────────────────────────────────────────────

const HeaderSection = styled('section')({
  background: slate50,
  padding: '20px 0 4px',
  '@media (min-width: 768px)': {
    padding: '32px 0 4px',
  },
});

const HeaderInner = styled('div')({
  maxWidth: '1120px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const TitleRow = styled('div')({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: '16px',
  flexWrap: 'wrap',
});

const TitleBlock = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

const Title = styled('h1')({
  fontSize: '24px',
  fontWeight: 700,
  color: foreground,
  margin: 0,
  lineHeight: '1.2',
  '@media (min-width: 768px)': {
    fontSize: '32px',
  },
});

const Subtitle = styled('p')({
  fontSize: '14px',
  color: muted,
  margin: '4px 0 0',
  '@media (min-width: 768px)': {
    fontSize: '16px',
  },
});

const ResultCount = styled('span')({
  fontSize: '13px',
  color: muted,
  fontWeight: 500,
  lineHeight: 1,
  flexShrink: 0,
});

// The search bar is the primary control on this page, so it lives right in
// the hero. Full width, tall (52px) to match finger-friendly targets on
// mobile. On ≥1024 it caps at ~560px so the hero doesn't feel stretched.
const SearchBox = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  height: '52px',
  padding: '0 14px',
  border: `1px solid ${border}`,
  borderRadius: '16px',
  background: white,
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  '&:focus-within': {
    borderColor: rose600,
    boxShadow: `0 0 0 3px ${slate100}`,
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
});

const ClearButton = styled('button')({
  appearance: 'none',
  border: 'none',
  background: 'transparent',
  padding: '6px 10px',
  borderRadius: '8px',
  cursor: 'pointer',
  color: muted,
  fontSize: '13px',
  fontWeight: 500,
  '&:hover': {
    background: slate100,
    color: foreground,
  },
});

// ── Types ─────────────────────────────────────────────────────────────────────

interface PageHeaderProps {
  title: string;
  subtitle: string;
  /** Total matched restaurants — shown next to the title. */
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
      <HeaderInner>
        <TitleRow>
          <TitleBlock>
            <Title>{title}</Title>
            <Subtitle>{subtitle}</Subtitle>
          </TitleBlock>
          {countLabel && <ResultCount>{countLabel}</ResultCount>}
        </TitleRow>

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
        </SearchBox>
      </HeaderInner>
    </HeaderSection>
  );
}
