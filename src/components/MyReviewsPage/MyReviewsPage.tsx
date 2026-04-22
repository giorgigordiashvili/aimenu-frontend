'use client';

import { styled } from '@pigment-css/react';

import PendingReviewsSection from '@/components/PendingReviewsSection';
import ReviewCard from '@/components/ReviewCard';
import { useTranslations } from '@/context/LocaleContext';
import { useMyReviews } from '@/hooks/useReviews';
import {
  background,
  border,
  foreground,
  muted,
  radiusMd,
  slate100,
  slate200,
  white,
} from '@/tokens';

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
  gap: '20px',
});

const Title = styled('h2')({
  fontSize: '20px',
  fontWeight: 700,
  color: foreground,
  margin: 0,
  padding: '4px 0 0',
});

const Empty = styled('div')({
  padding: '40px 20px',
  textAlign: 'center',
  color: muted,
  background: white,
  borderRadius: radiusMd,
  border: `1px dashed ${border}`,
});

// Shimmering skeleton — the existing project convention uses the same
// 1.4s keyframe so review cards fade in matching the loyalty / grid
// placeholders above the fold.
const SkeletonRow = styled('div')({
  height: '140px',
  borderRadius: radiusMd,
  border: `1px solid ${border}`,
  background: `linear-gradient(90deg, ${slate100} 0%, ${slate200} 50%, ${slate100} 100%)`,
  backgroundSize: '200% 100%',
  animation: 'reviewsShimmer 1.4s infinite',
  '@keyframes reviewsShimmer': {
    '0%': { backgroundPosition: '200% 0' },
    '100%': { backgroundPosition: '-200% 0' },
  },
});

export default function MyReviewsPage() {
  const t = useTranslations();
  const copy = t.reviews;
  const { results, isLoading, mutate } = useMyReviews(1);

  return (
    <Root>
      <Inner>
        <PendingReviewsSection onSubmitted={() => void mutate()} />

        <Title>{copy.myReviewsTitle}</Title>

        {isLoading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : results.length === 0 ? (
          <Empty>{copy.myReviewsEmpty}</Empty>
        ) : (
          results.map(r => <ReviewCard key={r.id} review={r} />)
        )}
      </Inner>
    </Root>
  );
}
