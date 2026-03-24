'use client';

import { useState } from 'react';
import { styled } from '@pigment-css/react';

import CompactVariant from './CompactVariant';
import DefaultVariant from './DefaultVariant';
import { RestaurantCardProps } from './shared';
import XlVariant from './XlVariant';

// ── Styled ────────────────────────────────────────────────────────────────────

const CardContainer = styled('div')({
  position: 'relative',
  '& > div': {
    width: '100%',
  },
});

// ── Component ─────────────────────────────────────────────────────────────────

function RestaurantCard({
  variant = 'default',
  isFavorited: controlledFavorited,
  onFavoriteToggle,
  ...props
}: RestaurantCardProps) {
  const [internalFavorited, setInternalFavorited] = useState(false);
  const isFavorited = controlledFavorited ?? internalFavorited;

  const onToggleFavorite = () => {
    setInternalFavorited(!isFavorited);
    onFavoriteToggle?.();
  };

  if (variant === 'compact') {
    return <CompactVariant {...props} />;
  }

  if (variant === 'xl') {
    return (
      <CardContainer>
        <XlVariant {...props} isFavorited={isFavorited} onToggleFavorite={onToggleFavorite} />
      </CardContainer>
    );
  }

  return (
    <CardContainer>
      <DefaultVariant {...props} isFavorited={isFavorited} onToggleFavorite={onToggleFavorite} />
    </CardContainer>
  );
}

export default RestaurantCard;
export type { RestaurantCardProps };
