'use client';

import { styled } from '@pigment-css/react';

import PendingReviewsSection from '@/components/PendingReviewsSection';
import ReviewCard from '@/components/ReviewCard';
import { useTranslations } from '@/context/LocaleContext';
import { useMyReviews } from '@/hooks/useReviews';
import { border, foreground, muted, radiusMd, slate100 } from '@/tokens';

const PageInner = styled('div')({
  maxWidth: '960px',
  margin: '0 auto',
  padding: '16px 16px 40px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  '@media (min-width: 768px)': {
    padding: '24px 0 60px',
  },
});

const Title = styled('h2')({
  fontSize: '20px',
  fontWeight: 700,
  color: foreground,
  margin: 0,
});

const Empty = styled('div')({
  padding: '40px 20px',
  textAlign: 'center',
  color: muted,
  background: '#ffffff',
  borderRadius: radiusMd,
  border: `1px dashed ${border}`,
});

const Skeleton = styled('div')({
  height: '120px',
  borderRadius: radiusMd,
  background: slate100,
});

export default function MyReviewsPage() {
  const t = useTranslations();
  const copy = t.reviews;
  const { results, isLoading, mutate } = useMyReviews(1);

  return (
    <PageInner>
      <PendingReviewsSection onSubmitted={() => void mutate()} />

      <div>
        <Title>{copy.myReviewsTitle}</Title>
      </div>

      {isLoading && (
        <>
          <Skeleton />
          <Skeleton />
        </>
      )}

      {!isLoading && results.length === 0 && <Empty>{copy.myReviewsEmpty}</Empty>}

      {results.map(r => (
        <ReviewCard key={r.id} review={r} />
      ))}
    </PageInner>
  );
}
