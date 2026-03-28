'use client';

import { styled } from '@pigment-css/react';

import { radiusSm, white, whiteTranslucent, yellow500 } from '@/tokens';

export const FavoriteYellow = styled('div')({
  padding: '4px 8px',
  backgroundColor: yellow500,
  borderRadius: radiusSm,
  fontFamily: 'Inter',
  fontSize: '10px',
  fontWeight: '500',
  lineHeight: '15px',
  width: 'fit-content',
  height: 'min-content',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const FavoriteButton = styled('button')({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  cursor: 'pointer',
  border: 'none',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: whiteTranslucent,
  marginLeft: 'auto',
  '&:hover': {
    backgroundColor: white,
  },
  '@media (max-width: 768px)': {
    width: '44px',
    height: '44px',
  },
});

export const PriceWrapper = styled('div')({
  flexShrink: 0,
  whiteSpace: 'nowrap',
});

export interface RestaurantCardProps {
  /** Card click / Details button destination */
  href?: string;
  /** Amenity names to display as pills below description */
  amenities?: string[];
  /** e.g. '₾', '₾₾', '₾₾₾' – defaults to '₾₾₾' if omitted */
  priceLevel?: string;
  /** i18n label for the Details button – defaults to 'დეტალები' */
  detailsLabel?: string;
  /** i18n label for the Book button – defaults to 'დაჯავშნა' */
  bookLabel?: string;
  /** i18n label for the featured badge – defaults to 'რჩეული' */
  favoriteLabel?: string;

  filterText?: string;
  rating?: number;
  showFavoriteYellow?: boolean;
  showFavoriteButton?: boolean;
  showRating?: boolean;
  showFilterText?: boolean;
  imageSrc?: string;
  restaurantTitle?: string;
  restaurantDescription?: string;
  locationText?: string;
  detailsVariant?: 'filled' | 'outlined';
  showDetailsButton?: boolean;
  showBookButton?: boolean;
  variant?: 'default' | 'xl' | 'compact';
  descriptionText?: string;
  /** Controlled favorite state. When omitted the component manages its own state. */
  isFavorited?: boolean;
  /** Called when the user toggles the favorite. */
  onFavoriteToggle?: () => void;
}
