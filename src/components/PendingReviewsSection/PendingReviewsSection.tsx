'use client';

import { styled } from '@pigment-css/react';
import { useState } from 'react';

import type { EligibleOrder, Review } from '@/api/reviews';
import MainButton from '@/components/MainButton/MainButton';
import WriteReviewModal from '@/components/WriteReviewModal';
import { useTranslations } from '@/context/LocaleContext';
import { usePendingReviews } from '@/hooks/useReviews';
import { border, foreground, muted, radiusMd, slate100, white } from '@/tokens';

const Wrapper = styled('section')({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

const Title = styled('h3')({
  fontSize: '16px',
  fontWeight: 700,
  color: foreground,
  margin: 0,
});

const Subtitle = styled('p')({
  fontSize: '13px',
  color: muted,
  margin: 0,
});

const Row = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px',
  borderRadius: radiusMd,
  background: white,
  border: `1px solid ${border}`,
});

const Thumb = styled('div')({
  width: '48px',
  height: '48px',
  borderRadius: '10px',
  background: slate100,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  flexShrink: 0,
});

const Info = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  flex: 1,
});

const Name = styled('span')({
  fontSize: '14px',
  fontWeight: 600,
  color: foreground,
});

const Meta = styled('span')({
  fontSize: '12px',
  color: muted,
});

interface Props {
  onSubmitted?: (review: Review) => void;
}

export default function PendingReviewsSection({ onSubmitted }: Props) {
  const t = useTranslations();
  const copy = t.reviews;
  const { orders, isLoading, mutate } = usePendingReviews();
  const [selected, setSelected] = useState<EligibleOrder | null>(null);

  if (isLoading || orders.length === 0) return null;

  return (
    <Wrapper>
      <div>
        <Title>{copy.pendingTitle}</Title>
        <Subtitle>{copy.pendingSubtitle}</Subtitle>
      </div>
      {orders.map(order => (
        <Row key={order.id}>
          <Thumb
            style={
              order.restaurant_logo
                ? { backgroundImage: `url(${order.restaurant_logo})` }
                : undefined
            }
          />
          <Info>
            <Name>{order.restaurant_name}</Name>
            <Meta>
              {order.order_number} · {order.total} ₾
            </Meta>
          </Info>
          <MainButton
            variant='rose_cta'
            size='small'
            title={copy.writeCta}
            onClick={() => setSelected(order)}
          />
        </Row>
      ))}
      <WriteReviewModal
        open={!!selected}
        order={selected}
        onClose={() => setSelected(null)}
        onSubmitted={review => {
          setSelected(null);
          void mutate();
          onSubmitted?.(review);
        }}
      />
    </Wrapper>
  );
}
