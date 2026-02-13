'use client';

import { styled } from '@pigment-css/react';

import MainButton from '@/components/MainButton/MainButton';
import HeartOutlined from '@/icons/HeartOutline';
import LocationIcon from '@/icons/Location';
import Star from '@/icons/Star';
import { border, foreground, muted, radiusMd, shadowCard, white, yellow500 } from '@/tokens';

import { FavoriteButton, FavoriteYellow, PriceWrapper, RestaurantCardProps } from './shared';

const Image = styled('img')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  zIndex: -1,
  transition: 'transform 0.3s ease',
});

const ContentTop = styled('div')({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  zIndex: 1,
  width: '100%',
  height: '160px',
  padding: '8px',
  overflow: 'hidden',
});

const FavoriteGroup = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
});

const FilterRatingGroup = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const ContentBottom = styled('div')({
  padding: '12px',
  marginTop: '24px',
});

const ContentGroup = styled('div')({
  border: `1px solid ${border}`,
  borderRadius: radiusMd,
  width: '264px',
  height: 'fit-content',
  cursor: 'pointer',
  backgroundColor: white,
  overflow: 'hidden',
  '&:hover': {
    boxShadow: shadowCard,
  },
  '&:hover img': {
    transform: 'scale(1.1)',
  },
  '@media (max-width: 768px)': {
    width: '100%',
  },
});

const BottomGroup = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const RestaurantTitle = styled('span')({
  fontFamily: 'Inter',
  fontSize: '14px',
  fontWeight: '400',
  lineHeight: '20px',
  color: foreground,
  '@media (max-width: 768px)': {
    width: '100%',
    fontSize: '18px',
    fontWeight: '700',
    lineHeight: '28px',
  },
});

const LocationContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  color: muted,
  fontFamily: 'Inter',
  fontSize: '10px',
  fontWeight: '400',
  lineHeight: '15px',
  paddingTop: '12px',
  '@media (max-width: 768px)': {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
  },
});

const LocationIconWrapper = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '12px',
  height: '12px',
  '& svg': {
    width: '100%',
    height: '100%',
  },
  '@media (max-width: 768px)': {
    width: '16px',
    height: '16px',
  },
});

const ButtonGroup = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginTop: '24px',
});

interface DefaultVariantProps extends Omit<RestaurantCardProps, 'variant' | 'descriptionText'> {
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function DefaultVariant({
  filterText,
  rating = 4.5,
  showFavoriteYellow = true,
  showFavoriteButton = true,
  showRating = true,
  showFilterText = true,
  imageSrc = '/RestaurantCardImage.jpg',
  restaurantTitle,
  locationText,
  detailsVariant = 'filled',
  showDetailsButton = true,
  showBookButton = true,
  isFavorite,
  onToggleFavorite,
}: DefaultVariantProps) {
  return (
    <ContentGroup>
      <ContentTop>
        <Image src={imageSrc} alt='Restaurant' />
        <FavoriteGroup>
          {showFavoriteYellow && (
            <FavoriteYellow>
              <Star color={foreground} size={12} />
              რჩეული
            </FavoriteYellow>
          )}
          {showFavoriteButton && (
            <FavoriteButton onClick={onToggleFavorite}>
              <HeartOutlined variant={isFavorite ? 'filled' : 'outlined'} />
            </FavoriteButton>
          )}
        </FavoriteGroup>
        <FilterRatingGroup>
          {showFilterText && filterText && (
            <MainButton variant='secondary' title={filterText} size='extra_small' />
          )}
          {showRating && (
            <MainButton
              variant='secondary'
              title={String(rating)}
              size='extra_small'
              icon={() => <Star color={yellow500} size={10} />}
            />
          )}
        </FilterRatingGroup>
      </ContentTop>
      <ContentBottom>
        <BottomGroup>
          {restaurantTitle && <RestaurantTitle>{restaurantTitle}</RestaurantTitle>}
          <PriceWrapper>
            <MainButton variant='outline' title='₾₾₾' size='extra_small' />
          </PriceWrapper>
        </BottomGroup>
        {locationText && (
          <LocationContainer>
            <LocationIconWrapper>
              <LocationIcon color={muted} size={12} />
            </LocationIconWrapper>
            {locationText}
          </LocationContainer>
        )}
        <ButtonGroup>
          {showDetailsButton && (
            <MainButton
              variant={detailsVariant === 'filled' ? 'slate_cta' : 'outline'}
              title='დეტალები'
              size='small'
              fullWidth
            />
          )}
          {showBookButton && (
            <MainButton variant='rose_cta' title='დაჯავშნა' size='small' fullWidth />
          )}
        </ButtonGroup>
      </ContentBottom>
    </ContentGroup>
  );
}
