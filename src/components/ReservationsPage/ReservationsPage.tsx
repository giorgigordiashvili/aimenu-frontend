'use client';

import { styled } from '@pigment-css/react';
import { useCallback, useState } from 'react';

import { reservationsMyCancelCreate } from '@/api/generated';
import ReservationCard, { ReservationCardSkeleton } from '@/components/ReservationCard';
import ReservationDetailModal from '@/components/ReservationDetailModal';
import ReservationsSidebar from '@/components/ReservationsSidebar';
import { ReservationsSidebarProps } from '@/components/ReservationsSidebar/ReservationsSidebar';
import { useAuth } from '@/context/AuthContext';
import { useTranslations } from '@/context/LocaleContext';
import { getMockRestaurantData } from '@/hooks/useReservations';
import { useReservationsPagination } from '@/hooks/useReservationsPagination';
import { useToast } from '@/hooks/useToast';

import ClockIcon from '@/icons/Clock';
import HistoryIcon from '@/icons/History';
import {
  blackAlpha10,
  border,
  foreground,
  radiusMd,
  rose600,
  shadowCard,
  slate500,
  slate900,
  white,
} from '@/tokens';

const PageInner = styled('div')({
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '0 16px 40px',
  '@media (min-width: 768px)': {
    padding: '0',
  },
});

const ContentLayout = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  paddingBottom: '24px',
  maxWidth: '1100px',
  margin: '0 auto',
  width: '100%',
  '@media (min-width: 768px)': {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: '28px',
  },
});

const MainColumn = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  minWidth: 0,
});

const MobileSidebar = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  '@media (min-width: 768px)': {
    display: 'none',
  },
});

const DesktopSidebar = styled('div')({
  display: 'none',
  '@media (min-width: 768px)': {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '280px',
    flexShrink: 0,
  },
});

// ─── Section ───────────────────────────────────────────────────────────────────

const Section = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '28px',
});

const SectionDivider = styled('div')({
  height: '1px',
  backgroundColor: blackAlpha10,
});

const SectionHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const SectionTitle = styled('h2')({
  fontSize: '16px',
  fontWeight: 700,
  color: foreground,
  margin: 0,
});

const CardList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const EmptyState = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 20px',
  background: white,
  borderRadius: radiusMd,
  border: `1px solid ${border}`,
  gap: '8px',
  textAlign: 'center',
});

const EmptyText = styled('p')({
  fontSize: '14px',
  color: slate500,
  margin: 0,
});

const LoadMoreText = styled('button')({
  display: 'block',
  width: '100%',
  textAlign: 'center',
  fontSize: '14px',
  fontWeight: 500,
  color: slate500,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '8px 0',
  '&:hover': {
    color: slate900,
  },
});

// ─── Toast ─────────────────────────────────────────────────────────────────────

const Toast = styled('div')({
  position: 'fixed',
  bottom: '24px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: slate900,
  color: white,
  padding: '12px 20px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 500,
  zIndex: 400,
  whiteSpace: 'nowrap',
  boxShadow: shadowCard,
});

// ─── Main Component ────────────────────────────────────────────────────────────

export default function ReservationsPage() {
  const t = useTranslations();

  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { toast, showToast } = useToast();

  const {
    allActive,
    allHistory,
    activeCount,
    historyCount,
    activeHasMore,
    historyHasMore,
    activeLoading,
    historyLoading,
    activePage,
    historyPage,
    loadMoreActive,
    collapseActive,
    loadMoreHistory,
    collapseHistory,
    resetPagination,
  } = useReservationsPagination();

  const handleCancel = useCallback(
    async (id: string) => {
      await reservationsMyCancelCreate(id);
      resetPagination();
      showToast(t.reservations.cancelSuccess);
    },
    [resetPagination, showToast, t.reservations.cancelSuccess]
  );

  if (!user) return null;

  const allLoaded = [...allActive, ...allHistory];
  const cancelledCount = allLoaded.filter(
    r => String(r.status).toLowerCase() === 'cancelled'
  ).length;
  const completedCount = allLoaded.filter(
    r => String(r.status).toLowerCase() === 'completed'
  ).length;
  const totalCount = (activeCount || 0) + (historyCount || 0);
  const loyaltyPoints = user.profile?.loyalty_points ?? 0;
  const totalSpent = user.profile?.total_spent ?? '0';

  const sidebarProps: ReservationsSidebarProps = {
    totalCount,
    cancelledCount,
    completedCount,
    loyaltyPoints,
    totalSpent,
  };

  const selectedRestaurant = selectedId ? getMockRestaurantData(selectedId) : null;

  return (
    <>
      <PageInner>
        <ContentLayout>
          <MainColumn>
            {/* Active Reservations */}
            <Section>
              <SectionHeader>
                <ClockIcon color={rose600} />
                <SectionTitle>{t.reservations.activeReservations}</SectionTitle>
              </SectionHeader>
              <CardList>
                {activeLoading && allActive.length === 0 ? (
                  <>
                    <ReservationCardSkeleton />
                    <ReservationCardSkeleton />
                  </>
                ) : allActive.length === 0 ? (
                  <EmptyState>
                    <EmptyText>{t.reservations.noUpcoming}</EmptyText>
                  </EmptyState>
                ) : (
                  <>
                    {allActive.map(r => (
                      <ReservationCard
                        key={r.id}
                        variant='alt'
                        reservation={r}
                        onClick={setSelectedId}
                        {...(getMockRestaurantData(r.id) ?? {})}
                      />
                    ))}
                    {activeHasMore ? (
                      <LoadMoreText onClick={loadMoreActive}>
                        {t.reservations.loadMore}
                      </LoadMoreText>
                    ) : activePage > 1 ? (
                      <LoadMoreText onClick={collapseActive}>
                        {t.reservations.loadLess}
                      </LoadMoreText>
                    ) : null}
                  </>
                )}
              </CardList>
            </Section>

            <SectionDivider />

            {/* History */}
            <Section>
              <SectionHeader>
                <HistoryIcon />
                <SectionTitle>{t.reservations.history}</SectionTitle>
              </SectionHeader>
              <CardList>
                {historyLoading && allHistory.length === 0 ? (
                  <>
                    <ReservationCardSkeleton />
                    <ReservationCardSkeleton />
                  </>
                ) : allHistory.length === 0 ? (
                  <EmptyState>
                    <EmptyText>{t.reservations.noPast}</EmptyText>
                  </EmptyState>
                ) : (
                  <>
                    {allHistory.map(r => (
                      <ReservationCard
                        key={r.id}
                        variant='alt'
                        reservation={r}
                        onClick={setSelectedId}
                        {...(getMockRestaurantData(r.id) ?? {})}
                      />
                    ))}
                    {historyHasMore ? (
                      <LoadMoreText onClick={loadMoreHistory}>
                        {t.reservations.loadMore}
                      </LoadMoreText>
                    ) : historyPage > 1 ? (
                      <LoadMoreText onClick={collapseHistory}>
                        {t.reservations.loadLess}
                      </LoadMoreText>
                    ) : null}
                  </>
                )}
              </CardList>
            </Section>

            <MobileSidebar>
              <ReservationsSidebar {...sidebarProps} />
            </MobileSidebar>
          </MainColumn>

          <DesktopSidebar>
            <ReservationsSidebar {...sidebarProps} />
          </DesktopSidebar>
        </ContentLayout>
      </PageInner>

      <ReservationDetailModal
        reservationId={selectedId}
        onClose={() => setSelectedId(null)}
        onConfirmCancel={handleCancel}
        restaurantName={selectedRestaurant?.restaurantName}
        restaurantImage={selectedRestaurant?.restaurantImage}
        restaurantSubtitle={
          selectedRestaurant
            ? `${selectedRestaurant.restaurantCity} · ${selectedRestaurant.restaurantCuisine}`
            : undefined
        }
        restaurantRating={
          selectedRestaurant
            ? parseFloat(selectedRestaurant.restaurantRating) || undefined
            : undefined
        }
      />

      {toast && <Toast>{toast.message}</Toast>}
    </>
  );
}
