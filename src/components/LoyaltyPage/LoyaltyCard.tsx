'use client';

import { styled } from '@pigment-css/react';

import { useTranslations } from '@/context/LocaleContext';
import type { LoyaltyCounterRow } from '@/hooks/useLoyalty';
import { border, foreground, muted, primary, radiusMd, slate500, white } from '@/tokens';

const Card = styled('div')({
  backgroundColor: white,
  border: `1px solid ${border}`,
  borderRadius: radiusMd,
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
});

const Head = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const LogoSquare = styled('div')({
  width: '44px',
  height: '44px',
  borderRadius: '10px',
  backgroundColor: '#F3F4F6',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  flexShrink: 0,
});

const NameBlock = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  minWidth: 0,
});

const RestaurantName = styled('span')({
  fontSize: '12px',
  color: muted,
  textTransform: 'uppercase',
  letterSpacing: '0.4px',
  fontWeight: 600,
});

const ProgramName = styled('span')({
  fontSize: '16px',
  color: foreground,
  fontWeight: 600,
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
});

const Subline = styled('p')({
  fontSize: '13px',
  color: muted,
  margin: 0,
  lineHeight: 1.4,
});

const Dots = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  padding: '10px 2px',
});

const Dot = styled('span')({
  width: '22px',
  height: '22px',
  borderRadius: '11px',
  backgroundColor: '#F3F4F6',
  border: `1px solid ${border}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: slate500,
  fontSize: '11px',
  fontWeight: 700,
  '&[data-filled="true"]': {
    backgroundColor: primary,
    borderColor: primary,
    color: white,
  },
});

const ClaimButton = styled('button')({
  backgroundColor: primary,
  color: white,
  border: 'none',
  borderRadius: '10px',
  padding: '12px 16px',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'transform .15s',
  '&:active': { transform: 'scale(0.98)' },
  '&:disabled': {
    backgroundColor: '#F3F4F6',
    color: slate500,
    cursor: 'not-allowed',
    transform: 'none',
  },
});

interface Props {
  row: LoyaltyCounterRow;
  onClaim: () => void;
}

function interp(s: string, values: Record<string, string | number>): string {
  return s.replace(/\{\{(\w+)\}\}/g, (_, k: string) => String(values[k] ?? ''));
}

export default function LoyaltyCard({ row, onClaim }: Props) {
  const t = useTranslations();
  const { program, punches, can_redeem, restaurant_name, restaurant_logo } = row;
  const filled = Math.min(punches, program.threshold);
  const slots = Array.from({ length: program.threshold }, (_, i) => i < filled);

  return (
    <Card>
      <Head>
        <LogoSquare
          style={restaurant_logo ? { backgroundImage: `url(${restaurant_logo})` } : undefined}
        />
        <NameBlock>
          <RestaurantName>{restaurant_name ?? ''}</RestaurantName>
          <ProgramName>{program.name}</ProgramName>
        </NameBlock>
      </Head>

      <Subline>
        {interp(t.loyalty.triggerLabel, {
          threshold: program.threshold,
          name: program.trigger_item_detail?.name ?? '',
        })}
      </Subline>
      <Subline>
        {interp(t.loyalty.rewardLabel, {
          quantity: program.reward_quantity,
          name: program.reward_item_detail?.name ?? '',
        })}
      </Subline>

      <Dots>
        {slots.map((f, i) => (
          <Dot key={i} data-filled={f ? 'true' : undefined}>
            {i + 1}
          </Dot>
        ))}
      </Dots>

      <ClaimButton type='button' disabled={!can_redeem} onClick={onClaim}>
        {can_redeem
          ? t.loyalty.claim
          : interp(t.loyalty.progress, { punches, threshold: program.threshold })}
      </ClaimButton>
    </Card>
  );
}
