'use client';

import { styled } from '@pigment-css/react';

import MainButton from '@/components/MainButton/MainButton';
import CalendarIcon from '@/icons/Calendar';
import HeartOutlined from '@/icons/HeartOutline';
import LocationIcon from '@/icons/Location';
import Star from '@/icons/Star';
import {
  border,
  foreground,
  muted,
  radiusMd,
  shadowCard,
  slate600,
  white,
  yellow500,
} from '@/tokens';

import { FavoriteYellow, PriceWrapper, RestaurantCardProps } from './shared';

const XlContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  maxWidth: '1120px',
  width: '100%',
  maxHeight: '561px',
  height: '100%',
  borderRadius: radiusMd,
  border: `1px solid ${border}`,
  overflow: 'hidden',
  cursor: 'pointer',
  backgroundColor: white,
  '&:hover': {
    boxShadow: shadowCard,
  },
  '&:hover img': {
    transform: 'scale(1.1)',
  },
});

const XlImageContainer = styled('div')({
  position: 'relative',
  width: '50%',
  height: '100%',
  overflow: 'hidden',
  flexShrink: 0,
});

const XlImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  transition: 'transform 0.3s ease',
});

const XlFavoriteYellowOverlay = styled('div')({
  position: 'absolute',
  top: '16px',
  left: '16px',
  zIndex: 1,
});

const XlContent = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '40px',
  flex: 1,
  gap: '8px',
});

const XlTopRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '4px',
});

const XlTitle = styled('h2')({
  fontFamily: 'Inter',
  fontSize: '30px',
  fontWeight: '700',
  lineHeight: '36px',
  color: foreground,
  margin: 0,
});

const XlRatingLocationRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '8px',
});

const XlRating = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontFamily: 'Inter',
  fontSize: '16px',
  fontWeight: '500',
  lineHeight: '24px',
  color: slate600,
  '& svg': {
    display: 'block',
  },
});

const XlLocation = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontFamily: 'Inter',
  fontSize: '16px',
  fontWeight: '400',
  lineHeight: '24px',
  color: muted,
});

const XlDescription = styled('p')({
  fontFamily: 'Inter',
  fontSize: '16px',
  fontWeight: '400',
  lineHeight: '24px',
  color: muted,
  margin: 0,
  marginBottom: '16px',
});

const XlButtonGroup = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginTop: '8px',
});

interface XlVariantProps extends Omit<
  RestaurantCardProps,
  'variant' | 'detailsVariant' | 'showDetailsButton'
> {
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function XlVariant({
  filterText,
  rating = 4.5,
  showFavoriteYellow = true,
  showFavoriteButton = true,
  showRating = true,
  showFilterText = true,
  imageSrc = '/RestaurantCardImage.jpg',
  restaurantTitle,
  locationText,
  showBookButton = true,
  descriptionText,
  isFavorite,
  onToggleFavorite,
}: XlVariantProps) {
  return (
    <XlContainer>
      <XlImageContainer>
        <XlImage src={imageSrc} alt={restaurantTitle || 'Restaurant'} />
        {showFavoriteYellow && (
          <XlFavoriteYellowOverlay>
            <FavoriteYellow>
              <Star color={foreground} size={12} />
              რჩეული
            </FavoriteYellow>
          </XlFavoriteYellowOverlay>
        )}
      </XlImageContainer>
      <XlContent>
        <XlTopRow>
          {showFilterText && filterText && (
            <MainButton variant='rose_cta' title={filterText} size='extra_small' />
          )}
          <PriceWrapper>
            <MainButton variant='outline' title='₾₾₾' size='extra_small' />
          </PriceWrapper>
        </XlTopRow>
        {restaurantTitle && <XlTitle>{restaurantTitle}</XlTitle>}
        <XlRatingLocationRow>
          {showRating && (
            <XlRating>
              <Star color={yellow500} size={18} />
              {rating}
            </XlRating>
          )}
          {locationText && (
            <XlLocation>
              <LocationIcon color={muted} size={18} />
              {locationText}
            </XlLocation>
          )}
        </XlRatingLocationRow>
        {descriptionText && <XlDescription>{descriptionText}</XlDescription>}
        <XlButtonGroup>
          {showBookButton && (
            <MainButton
              variant='rose_cta'
              title='დაჯავშნა'
              size='large'
              fullWidth
              icon={CalendarIcon}
            />
          )}
          {showFavoriteButton && (
            <MainButton
              variant='outline'
              title='შენახვა'
              size='large'
              icon={() => <HeartOutlined variant={isFavorite ? 'filled' : 'outlined'} />}
              onClick={onToggleFavorite}
            />
          )}
        </XlButtonGroup>
      </XlContent>
    </XlContainer>
  );
}
