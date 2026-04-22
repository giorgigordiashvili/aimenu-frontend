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
  transition: 'background-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease',
  '&:hover': {
    backgroundColor: white,
    // Faint red halo + slight lift so the affordance reads clearly. When
    // the button is already filled (isFavorited) the icon colour stays
    // the brand red; on an unfavourited state the icon tints red on
    // hover too so the click target telegraphs the destructive action.
    color: '#EC003F',
    boxShadow: '0 4px 12px rgba(236, 0, 63, 0.25)',
    transform: 'scale(1.08)',
  },
  '&:hover svg': {
    color: '#EC003F',
    stroke: '#EC003F',
  },
  '&:active': {
    transform: 'scale(0.96)',
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
  imageBlurhash?: string;
  restaurantTitle?: string;
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
  /** Render the "Loyalty partner" badge when the restaurant has opted
   *  into the platform-wide loyalty program. */
  showLoyaltyBadge?: boolean;
  /** Localised label rendered next to the badge icon. */
  loyaltyBadgeLabel?: string;
  /** Extra sentence shown in the hover tooltip so users understand what
   *  the star badge stands for. */
  loyaltyBadgeHint?: string;
}
