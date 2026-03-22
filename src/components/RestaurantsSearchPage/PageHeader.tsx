'use client';

import { styled } from '@pigment-css/react';

import SearchIcon from '@/icons/Search';
import { border, foreground, slate400, slate50, white } from '@/tokens';

// ── Styled ────────────────────────────────────────────────────────────────────

const HeaderSection = styled('div')({
  background: slate50,
  padding: '24px 0',
  '@media (min-width: 768px)': {
    padding: '32px 0',
  },
});

const HeaderInner = styled('div')({
  maxWidth: '1120px',
  margin: '0 auto',
  padding: '0 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  '@media (min-width: 768px)': {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

const TitleBlock = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

const Title = styled('h1')({
  fontSize: '32px',
  fontWeight: 700,
  color: foreground,
  margin: 0,
  lineHeight: '1.2',
});

const Subtitle = styled('p')({
  fontSize: '16px',
  color: slate400,
  marginTop: '4px',
  marginBottom: 0,
});

const SearchBox = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  border: `1px solid ${border}`,
  borderRadius: '12px',
  padding: '10px 16px',
  background: white,
  '@media (min-width: 768px)': {
    minWidth: '280px',
  },
});

const SearchInput = styled('input')({
  border: 'none',
  outline: 'none',
  flex: 1,
  fontSize: '14px',
  color: foreground,
  background: 'transparent',
  fontFamily: 'inherit',
});

const IconWrap = styled('span')({
  display: 'flex',
  alignItems: 'center',
  color: slate400,
  flexShrink: 0,
});

// ── Types ─────────────────────────────────────────────────────────────────────

interface PageHeaderProps {
  searchValue: string;
  onSearchChange: (v: string) => void;
  onSearchSubmit: () => void;
  title: string;
  subtitle: string;
  searchPlaceholder?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PageHeader({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  title,
  subtitle,
  searchPlaceholder = 'ძიება...',
}: PageHeaderProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit();
    }
  };

  return (
    <HeaderSection>
      <HeaderInner>
        <TitleBlock>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </TitleBlock>

        <SearchBox>
          <IconWrap>
            <SearchIcon width={18} height={18} />
          </IconWrap>
          <SearchInput
            type='text'
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={searchPlaceholder}
          />
        </SearchBox>
      </HeaderInner>
    </HeaderSection>
  );
}
