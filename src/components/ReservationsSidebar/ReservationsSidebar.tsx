'use client';

import { styled } from '@pigment-css/react';

import { useTranslations } from '@/context/LocaleContext';
import { border, foreground, radiusMd, red600, shadowSm, slate600, white } from '@/tokens';

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

export interface ReservationsSidebarProps {
  totalCount: number;
  cancelledCount: number;
  completedCount: number;
  totalSpent: string;
}

export default function ReservationsSidebar({
  totalCount,
  cancelledCount,
  completedCount,
  totalSpent,
}: ReservationsSidebarProps) {
  const t = useTranslations();

  return (
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
  );
}
