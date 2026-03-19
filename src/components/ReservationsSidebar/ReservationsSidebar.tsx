'use client';

import { styled } from '@pigment-css/react';

import { useTranslations } from '@/context/LocaleContext';
import RestaurantUtensils from '@/icons/RestaurantUtensils';
import {
  border,
  foreground,
  radiusMd,
  red600,
  rose600,
  shadowCard,
  shadowSm,
  slate600,
  white,
} from '@/tokens';

// ─── Styled ────────────────────────────────────────────────────────────────────

const StatsCard = styled('div')({
  backgroundColor: white,
  border: `1px solid ${border}`,
  borderRadius: radiusMd,
  padding: '20px',
  boxShadow: shadowSm,
});

const StatsTitle = styled('h3')({
  fontSize: '15px',
  fontWeight: 600,
  color: foreground,
  margin: '0 0 16px',
});

const StatsList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0',
});

const StatsRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 0',
  borderBottom: `1px solid ${border}`,
  '&:last-child': {
    borderBottom: 'none',
  },
});

const StatsLabel = styled('span')({
  fontSize: '14px',
  color: slate600,
});

const StatsValue = styled('span')({
  fontSize: '14px',
  fontWeight: 600,
  color: foreground,
});

const LoyaltyCard = styled('div')({
  backgroundColor: rose600,
  borderRadius: radiusMd,
  padding: '20px',
  color: white,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  boxShadow: shadowCard,
});

const LoyaltyTitle = styled('h3')({
  fontSize: '16px',
  fontWeight: 400,
  margin: 0,
  color: white,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  '& svg g': { stroke: white },
});

const LoyaltySubtitle = styled('p')({
  fontSize: '16px',
  fontWeight: 400,
  margin: 0,
  opacity: 0.85,
  color: white,
});

const ProgressBarWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
});

const ProgressLabels = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '12px',
  color: white,
  opacity: 0.9,
});

const ProgressTrack = styled('div')({
  height: '6px',
  backgroundColor: 'rgba(255,255,255,0.3)',
  borderRadius: '100px',
  overflow: 'hidden',
});

const ProgressFill = styled('div')({
  height: '100%',
  backgroundColor: white,
  borderRadius: '100px',
  transition: 'width 0.4s ease',
});

const LoyaltyDesc = styled('p')({
  fontSize: '12px',
  margin: 0,
  opacity: 0.85,
  color: white,
  lineHeight: '18px',
});

// ─── Props ─────────────────────────────────────────────────────────────────────

export interface ReservationsSidebarProps {
  totalCount: number;
  cancelledCount: number;
  completedCount: number;
  loyaltyPoints: number;
  totalSpent: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

const LOYALTY_MAX = 200;

export default function ReservationsSidebar({
  totalCount,
  cancelledCount,
  completedCount,
  loyaltyPoints,
  totalSpent,
}: ReservationsSidebarProps) {
  const t = useTranslations();
  const progressPct = Math.min((loyaltyPoints / LOYALTY_MAX) * 100, 100);

  return (
    <>
      <StatsCard>
        <StatsTitle>{t.reservations.statistics}</StatsTitle>
        <StatsList>
          <StatsRow>
            <StatsLabel>{t.reservations.totalReservations}</StatsLabel>
            <StatsValue>{totalCount}</StatsValue>
          </StatsRow>
          <StatsRow>
            <StatsLabel>{t.reservations.visits}</StatsLabel>
            <StatsValue>{completedCount}</StatsValue>
          </StatsRow>
          <StatsRow>
            <StatsLabel>{t.reservations.cancelled}</StatsLabel>
            <StatsValue style={{ color: red600 }}>{cancelledCount}</StatsValue>
          </StatsRow>
          <StatsRow>
            <StatsLabel>{t.reservations.spent}</StatsLabel>
            <StatsValue>{totalSpent}</StatsValue>
          </StatsRow>
        </StatsList>
      </StatsCard>

      <LoyaltyCard>
        <div>
          <LoyaltyTitle>
            <RestaurantUtensils />
            {t.reservations.loyaltyTitle}
          </LoyaltyTitle>
          <LoyaltySubtitle>{t.reservations.loyaltyStatus}</LoyaltySubtitle>
        </div>
        <ProgressBarWrapper>
          <ProgressLabels>
            <span>
              {loyaltyPoints} {t.reservations.loyaltyPoints}
            </span>
            <span>
              {LOYALTY_MAX}
              {t.reservations.loyaltyUpTo}
            </span>
          </ProgressLabels>
          <ProgressTrack>
            <ProgressFill style={{ width: `${progressPct}%` }} />
          </ProgressTrack>
        </ProgressBarWrapper>
        <LoyaltyDesc>
          {t.reservations.loyaltyDescPre} {Math.max(LOYALTY_MAX - loyaltyPoints, 0)}{' '}
          {t.reservations.loyaltyDescPost}
        </LoyaltyDesc>
      </LoyaltyCard>
    </>
  );
}
