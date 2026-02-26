'use client';

import { styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { reservationsMyCancelCreate } from '@/api/generated';
import { ReservationList } from '@/api/generated/interfaces';
import ProfileHeader from '@/components/ProfileHeader';
import { ReservationCardSkeleton, ReservationCardVariant } from '@/components/ReservationCard';
import ReservationDetailModal from '@/components/ReservationDetailModal';
import ReservationsSidebar from '@/components/ReservationsSidebar';
import { ReservationsSidebarProps } from '@/components/ReservationsSidebar/ReservationsSidebar';
import ReservationsTabNav from '@/components/ReservationsTabNav';
import { useAuth } from '@/context/AuthContext';
import { useTranslations } from '@/context/LocaleContext';
import {
  getMockRestaurantData,
  MOCK_MODE,
  MOCK_PROFILE,
  useActiveReservations,
  useHistoryReservations,
} from '@/hooks/useReservations';
import { Locale } from '@/i18n/config';
import ClockIcon from '@/icons/Clock';
import HistoryIcon from '@/icons/History';
import {
  background,
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

// ─── Layout ────────────────────────────────────────────────────────────────────

const PageWrapper = styled('div')({
  minHeight: '100vh',
  backgroundColor: background,
});

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

interface ReservationsPageProps {
  locale: Locale;
}

export default function ReservationsPage({ locale }: ReservationsPageProps) {
  const t = useTranslations();
  const router = useRouter();

  const { user, isLoading: authLoading, logout } = useAuth();

  const [activePage, setActivePage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [allActive, setAllActive] = useState<ReservationList[]>([]);
  const [allHistory, setAllHistory] = useState<ReservationList[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    reservations: activeData,
    count: activeCount,
    hasMore: activeHasMore,
    isLoading: activeLoading,
    mutate: mutateActive,
  } = useActiveReservations(activePage);

  const {
    reservations: historyData,
    count: historyCount,
    hasMore: historyHasMore,
    isLoading: historyLoading,
    mutate: mutateHistory,
  } = useHistoryReservations(historyPage);

  // Accumulate pages
  useEffect(() => {
    if (!activeLoading && activeData.length > 0) {
      setAllActive(prev =>
        activePage === 1
          ? activeData
          : [...prev, ...activeData.filter(r => !prev.find(p => p.id === r.id))]
      );
    }
    if (activePage === 1 && !activeLoading && activeData.length === 0) {
      setAllActive(prev => (prev.length === 0 ? prev : []));
    }
  }, [activeData, activePage, activeLoading]);

  useEffect(() => {
    if (!historyLoading && historyData.length > 0) {
      setAllHistory(prev =>
        historyPage === 1
          ? historyData
          : [...prev, ...historyData.filter(r => !prev.find(p => p.id === r.id))]
      );
    }
    if (historyPage === 1 && !historyLoading && historyData.length === 0) {
      setAllHistory(prev => (prev.length === 0 ? prev : []));
    }
  }, [historyData, historyPage, historyLoading]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const handleCancel = useCallback(
    async (id: string) => {
      await reservationsMyCancelCreate(id);
      setActivePage(1);
      setHistoryPage(1);
      setAllActive([]);
      setAllHistory([]);
      mutateActive();
      mutateHistory();
      showToast(t.reservations.cancelSuccess);
    },
    [mutateActive, mutateHistory, showToast, t.reservations.cancelSuccess]
  );

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${locale}/login`);
    }
  }, [authLoading, user, router, locale]);

  if (authLoading || !user) return null;

  const displayName = MOCK_MODE
    ? MOCK_PROFILE.name
    : user.full_name || `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();
  const displayEmail = MOCK_MODE ? MOCK_PROFILE.email : user.email;
  const displayPhone = MOCK_MODE ? MOCK_PROFILE.phone : user.phone_number;
  const displayLocation = MOCK_MODE ? MOCK_PROFILE.location : null;

  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase();

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

  return (
    <PageWrapper>
      <ProfileHeader
        displayName={displayName}
        displayEmail={displayEmail}
        displayPhone={displayPhone}
        displayLocation={displayLocation}
        initials={initials}
        avatar={user.avatar}
        locale={locale}
        logout={logout}
        onHome={() => router.push(`/${locale}`)}
      />

      <ReservationsTabNav />

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
                      <ReservationCardVariant
                        key={r.id}
                        reservation={r}
                        onClick={setSelectedId}
                        {...(getMockRestaurantData(r.id) ?? {})}
                      />
                    ))}
                    {activeHasMore ? (
                      <LoadMoreText onClick={() => setActivePage(p => p + 1)}>
                        {t.reservations.loadMore}
                      </LoadMoreText>
                    ) : activePage > 1 ? (
                      <LoadMoreText
                        onClick={() => {
                          setActivePage(1);
                          setAllActive([]);
                        }}
                      >
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
                      <ReservationCardVariant
                        key={r.id}
                        reservation={r}
                        onClick={setSelectedId}
                        {...(getMockRestaurantData(r.id) ?? {})}
                      />
                    ))}
                    {historyHasMore ? (
                      <LoadMoreText onClick={() => setHistoryPage(p => p + 1)}>
                        {t.reservations.loadMore}
                      </LoadMoreText>
                    ) : historyPage > 1 ? (
                      <LoadMoreText
                        onClick={() => {
                          setHistoryPage(1);
                          setAllHistory([]);
                        }}
                      >
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
        restaurantName={selectedId ? getMockRestaurantData(selectedId)?.restaurantName : undefined}
        restaurantImage={
          selectedId ? getMockRestaurantData(selectedId)?.restaurantImage : undefined
        }
        restaurantSubtitle={(() => {
          const d = selectedId ? getMockRestaurantData(selectedId) : null;
          return d ? `${d.restaurantCity} · ${d.restaurantCuisine}` : undefined;
        })()}
        restaurantRating={(() => {
          const d = selectedId ? getMockRestaurantData(selectedId) : null;
          return d ? parseFloat(d.restaurantRating) || undefined : undefined;
        })()}
      />

      {toast && <Toast>{toast}</Toast>}
    </PageWrapper>
  );
}
