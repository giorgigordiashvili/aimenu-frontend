'use client';

import { styled } from '@pigment-css/react';
import { useState } from 'react';

import { LoyaltyListSkeleton } from '@/components/Skeleton';
import { useTranslations } from '@/context/LocaleContext';
import { useLoyaltyCounters, type LoyaltyCounterRow } from '@/hooks/useLoyalty';
import { background, border, foreground, muted, radiusMd, white } from '@/tokens';

import LoyaltyCard from './LoyaltyCard';
import LoyaltyRedeemModal from './LoyaltyRedeemModal';

const Root = styled('div')({
  backgroundColor: background,
  padding: '24px 16px 64px',
  '@media (min-width: 768px)': { padding: '24px 24px 64px' },
});

const Inner = styled('div')({
  maxWidth: '1100px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const Header = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  padding: '8px 4px',
});

const Title = styled('h1')({
  fontSize: '22px',
  fontWeight: 700,
  color: foreground,
  margin: 0,
});

const Subtitle = styled('p')({
  fontSize: '14px',
  color: muted,
  margin: 0,
});

const Grid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '16px',
});

const Empty = styled('div')({
  padding: '48px 24px',
  borderRadius: radiusMd,
  border: `1px dashed ${border}`,
  backgroundColor: white,
  color: muted,
  textAlign: 'center',
  fontSize: '14px',
});

export default function LoyaltyPage() {
  const t = useTranslations();
  const { counters, isLoading, mutate } = useLoyaltyCounters();
  const [activeCounter, setActiveCounter] = useState<LoyaltyCounterRow | null>(null);

  return (
    <Root>
      <Inner>
        <Header>
          <Title>{t.loyalty.title}</Title>
          <Subtitle>{t.loyalty.subtitle}</Subtitle>
        </Header>

        {isLoading ? (
          <LoyaltyListSkeleton count={3} />
        ) : counters.length === 0 ? (
          <Empty>{t.loyalty.empty}</Empty>
        ) : (
          <Grid>
            {counters.map(row => (
              <LoyaltyCard key={row.id} row={row} onClaim={() => setActiveCounter(row)} />
            ))}
          </Grid>
        )}
      </Inner>

      {activeCounter ? (
        <LoyaltyRedeemModal
          row={activeCounter}
          onClose={() => {
            setActiveCounter(null);
            mutate();
          }}
        />
      ) : null}
    </Root>
  );
}
