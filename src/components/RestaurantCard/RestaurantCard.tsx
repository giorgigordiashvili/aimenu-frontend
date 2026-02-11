'use client';

import { styled } from '@pigment-css/react';
import { useState } from 'react';

import MainButton from '@/components/MainButton/MainButton';
import HeartOutlined from '@/icons/HeartOutlined';
import LocationIcon from '@/icons/Location';
import Star from '@/icons/Star';

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

const FilterButton = styled('div')({
  width: 'fit-content',
  height: 'auto',
  padding: '2px 4px',
  backgroundColor: '#ffffffE6',
  color: '#0F172B',
  borderRadius: '8px',
  fontSize: '10px',
  fontWeight: '500',
  lineHeight: '15px',
});

const FavoriteYellow = styled('div')({
  padding: '4px 8px',
  backgroundColor: '#F0B100',
  borderRadius: '8px',
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

const FavoriteButton = styled('div')({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#ffffffE6',
  marginLeft: 'auto',
  '&:hover': {
    backgroundColor: '#ffffff',
  },
});

const Rating = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  width: 'min-content',
  height: 'min-content',
  backgroundColor: '#ffffffE6',
  padding: '2px 6px',
  borderRadius: '50px',
  fontFamily: 'Inter',
  fontSize: '10px',
  fontWeight: '500',
  lineHeight: '15px',
  color: '#0F172B',
  marginLeft: 'auto',
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
  border: '1px solid #E2E8F0',
  borderRadius: '14px',
  width: '264px',
  height: 'fit-content',
  backgroundColor: '#FFFFFF',
  overflow: 'hidden',
  '&:hover': {
    boxShadow: '0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)',
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
  color: '#0F172B',
  '@media (max-width: 768px)': {
    width: '100%',
  },
});

const PriceWrapper = styled('div')({
  flexShrink: 0,
  whiteSpace: 'nowrap',
});

const LocationContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  color: '#62748E',
  fontFamily: 'Inter',
  fontSize: '10px',
  fontWeight: '400',
  lineHeight: '15px',
  paddingTop: '12px',
});

const ButtonGroup = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginTop: '24px',
});

interface RestaurantCardProps {
  filterText?: string;
  rating?: number;
  showFavoriteYellow?: boolean;
  showFavoriteButton?: boolean;
  showRating?: boolean;
  showFilterText?: boolean;
  imageSrc?: string;
  restaurantTitle?: string;
  locationText?: string;
  detailsVariant?: 'filled' | 'outlined';
  showDetailsButton?: boolean;
  showBookButton?: boolean;
}

function RestaurantCard({
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
}: RestaurantCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <ContentGroup>
      <ContentTop>
        <Image src={imageSrc} alt='Restaurant' />
        <FavoriteGroup>
          {showFavoriteYellow && (
            <FavoriteYellow>
              <Star color='#0F172B' size={12} />
              რჩეული
            </FavoriteYellow>
          )}
          {showFavoriteButton && (
            <FavoriteButton onClick={() => setIsFavorite(prev => !prev)}>
              <HeartOutlined variant={isFavorite ? 'filled' : 'outlined'} />
            </FavoriteButton>
          )}
        </FavoriteGroup>
        <FilterRatingGroup>
          {showFilterText && filterText && <FilterButton>{filterText}</FilterButton>}
          {showRating && (
            <Rating>
              <Star color='#F0B100' size={10} />
              {rating}
            </Rating>
          )}
        </FilterRatingGroup>
      </ContentTop>
      <ContentBottom>
        <BottomGroup>
          {restaurantTitle && <RestaurantTitle>{restaurantTitle}</RestaurantTitle>}
          <PriceWrapper>
            <MainButton variant='outline' title='₾₾₾' size='small' />
          </PriceWrapper>
        </BottomGroup>
        {locationText && (
          <LocationContainer>
            <LocationIcon color='#62748E' size={12} />
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

export default RestaurantCard;
