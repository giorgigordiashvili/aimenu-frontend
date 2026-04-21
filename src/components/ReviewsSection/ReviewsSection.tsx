'use client';

import { styled } from '@pigment-css/react';
import { useEffect, useState } from 'react';

import type { EligibleOrder, Review } from '@/api/reviews';
import MainButton from '@/components/MainButton/MainButton';
import ReviewCard from '@/components/ReviewCard';
import StarRating from '@/components/StarRating';
import WriteReviewModal from '@/components/WriteReviewModal';
import { useAuth } from '@/context/AuthContext';
import { useTranslations } from '@/context/LocaleContext';
import {
  usePendingReviews,
  useRestaurantReviewStats,
  useRestaurantReviews,
} from '@/hooks/useReviews';
import {
  background,
  border,
  foreground,
  muted,
  radiusMd,
  rose600,
  slate100,
  slate200,
  slate500,
  white,
} from '@/tokens';

const Section = styled('section')({
  marginTop: '16px',
  marginBottom: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const Head = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  flexWrap: 'wrap',
});

const Title = styled('h2')({
  fontSize: '20px',
  fontWeight: 700,
  color: foreground,
  margin: 0,
});

const StatsCard = styled('div')({
  display: 'flex',
  gap: '24px',
  padding: '16px 20px',
  border: `1px solid ${border}`,
  borderRadius: radiusMd,
  background: white,
  alignItems: 'flex-start',
  flexWrap: 'wrap',
});

const StatsAvg = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  minWidth: '120px',
});

const StatsNumber = styled('span')({
  fontSize: '36px',
  fontWeight: 800,
  color: foreground,
  lineHeight: 1,
});

const StatsTotal = styled('span')({
  fontSize: '13px',
  color: muted,
});

const Distribution = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  minWidth: '240px',
});

const DistRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '12px',
  color: muted,
});

const DistStar = styled('span')({
  width: '18px',
  textAlign: 'right',
});

const DistTrack = styled('div')({
  flex: 1,
  height: '6px',
  borderRadius: '999px',
  background: slate200,
  overflow: 'hidden',
});

const DistFill = styled('div')({
  height: '100%',
  borderRadius: '999px',
  background: rose600,
  transition: 'width 0.3s ease-out',
});

const DistCount = styled('span')({
  minWidth: '32px',
  textAlign: 'right',
  color: slate500,
});

const Empty = styled('div')({
  padding: '40px 20px',
  textAlign: 'center',
  color: muted,
  background: background,
  borderRadius: radiusMd,
  border: `1px dashed ${border}`,
});

const Skeleton = styled('div')({
  height: '120px',
  borderRadius: radiusMd,
  background: slate100,
});

const LoadMore = styled('button')({
  background: 'transparent',
  border: 'none',
  color: slate500,
  fontSize: '14px',
  fontWeight: 500,
  padding: '12px 0',
  cursor: 'pointer',
  alignSelf: 'center',
});

interface Props {
  slug: string;
}

export default function ReviewsSection({ slug }: Props) {
  const t = useTranslations();
  const copy = t.reviews;
  const { isAuthenticated } = useAuth();

  const [page, setPage] = useState(1);
  const [all, setAll] = useState<Review[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<EligibleOrder | null>(null);

  const { stats, mutate: mutateStats } = useRestaurantReviewStats(slug);
  const { results, hasMore, isLoading, mutate: mutateList } = useRestaurantReviews(slug, page);
  const { orders: pendingOrders, mutate: mutatePending } = usePendingReviews();

  // Keep a cumulative list as the user paginates. mutateList() refreshes
  // just the current page, so we reset when page === 1 and append otherwise.
  // IMPORTANT: setState must run in useEffect, not in render/useMemo, or
  // React raises "Cannot update during render" and the whole restaurant
  // page goes to the error boundary.
  useEffect(() => {
    if (page === 1) {
      setAll(results);
    } else if (results.length) {
      setAll(prev => {
        const seen = new Set(prev.map(r => r.id));
        const next = results.filter(r => !seen.has(r.id));
        return next.length ? [...prev, ...next] : prev;
      });
    }
  }, [results, page]);

  const eligibleForThis = pendingOrders.find(o => o.restaurant_slug === slug) ?? null;

  const total = stats?.total ?? 0;
  const dist = stats?.distribution ?? { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };

  return (
    <Section>
      <Head>
        <Title>{copy.sectionTitle}</Title>
        {isAuthenticated && eligibleForThis && (
          <MainButton
            variant='rose_cta'
            title={copy.writeCta}
            size='small'
            onClick={() => {
              setSelectedOrder(eligibleForThis);
              setModalOpen(true);
            }}
          />
        )}
      </Head>

      <StatsCard>
        <StatsAvg>
          <StatsNumber>{stats ? stats.average.toFixed(1) : '—'}</StatsNumber>
          <StarRating value={Math.round(stats?.average ?? 0)} readOnly size={16} />
          <StatsTotal>
            {total} {copy.totalReviews}
          </StatsTotal>
        </StatsAvg>
        <Distribution>
          {[5, 4, 3, 2, 1].map(k => {
            const count = dist[String(k) as '1' | '2' | '3' | '4' | '5'] ?? 0;
            const pct = total ? (count / total) * 100 : 0;
            return (
              <DistRow key={k}>
                <DistStar>{k}★</DistStar>
                <DistTrack>
                  <DistFill style={{ width: `${pct}%` }} />
                </DistTrack>
                <DistCount>{count}</DistCount>
              </DistRow>
            );
          })}
        </Distribution>
      </StatsCard>

      {isLoading && all.length === 0 && (
        <>
          <Skeleton />
          <Skeleton />
        </>
      )}

      {!isLoading && all.length === 0 && <Empty>{copy.empty}</Empty>}

      {all.map(r => (
        <ReviewCard key={r.id} review={r} />
      ))}

      {hasMore && (
        <LoadMore type='button' onClick={() => setPage(p => p + 1)}>
          {copy.loadMore}
        </LoadMore>
      )}

      <WriteReviewModal
        open={modalOpen}
        order={selectedOrder}
        onClose={() => setModalOpen(false)}
        onSubmitted={() => {
          setModalOpen(false);
          setPage(1);
          void mutateList();
          void mutateStats();
          void mutatePending();
        }}
      />
    </Section>
  );
}
