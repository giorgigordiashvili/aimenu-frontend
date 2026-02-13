'use client';

import { useState } from 'react';

import CompactVariant from './CompactVariant';
import DefaultVariant from './DefaultVariant';
import { RestaurantCardProps } from './shared';
import XlVariant from './XlVariant';

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
    return <XlVariant {...props} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />;
  }

  return <DefaultVariant {...props} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />;
}

export default RestaurantCard;
export type { RestaurantCardProps };
