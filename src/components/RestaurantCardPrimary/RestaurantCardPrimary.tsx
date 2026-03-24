'use client';

import { useState } from 'react';
import { styled } from '@pigment-css/react';

import CompactVariant from './CompactVariant';
import DefaultVariant from './DefaultVariant';
import { RestaurantCardProps } from './shared';
import XlVariant from './XlVariant';
import { redBrand, shadowCard, white } from '@/tokens';

// ── Local overlay styled components ──────────────────────────────────────────

const CardContainer = styled('div')({
  position: 'relative',
  '& > div': {
    width: '100%',
  },
});

const CardHeartButton = styled('button')({
  position: 'absolute',
  top: 12,
  right: 12,
  zIndex: 2,
  background: white,
  border: 'none',
  borderRadius: '50%',
  width: 36,
  height: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: redBrand,
  boxShadow: shadowCard,
});

const HeartIcon = () => (
  <svg width={14} height={14} viewBox='0 0 24 24' fill='currentColor'>
    <path d='M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z' />
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────

function RestaurantCard({
  variant = 'default',
  isFavorite: controlledFavorite,
  onFavoriteToggle,
  ...props
}: RestaurantCardProps) {
  const [internalFavorite, setInternalFavorite] = useState(false);
  const isFavorite = controlledFavorite ?? internalFavorite;

  const onToggleFavorite = () => {
    const next = !isFavorite;
    setInternalFavorite(next);
    onFavoriteToggle?.(next);
  };

  if (variant === 'compact') {
    return <CompactVariant {...props} />;
  }

  if (variant === 'xl') {
    return (
      <CardContainer>
        <XlVariant {...props} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />
        {onFavoriteToggle && (
          <CardHeartButton
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite();
            }}
          >
            <HeartIcon />
          </CardHeartButton>
        )}
      </CardContainer>
    );
  }

  return (
    <CardContainer>
      <DefaultVariant {...props} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />
      {onFavoriteToggle && (
        <CardHeartButton
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite();
          }}
        >
          <HeartIcon />
        </CardHeartButton>
      )}
    </CardContainer>
  );
}

export default RestaurantCard;
export type { RestaurantCardProps };
