'use client';

import { styled } from '@pigment-css/react';
import { useState } from 'react';

import MainButton from '@/components/MainButton/MainButton';
import CalendarIcon from '@/icons/Calendar';
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
  '@media (max-width: 768px)': {
    width: '44px',
    height: '44px',
  },
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
    fontSize: '18px',
    fontWeight: '700',
    lineHeight: '28px',
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

// === XL Variant Styled Components ===

const XlContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  width: '1120px',
  height: '561px',
  borderRadius: '14px',
  border: '1px solid #E2E8F0',
  overflow: 'hidden',
  backgroundColor: '#FFFFFF',
  '&:hover': {
    boxShadow: '0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)',
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
  color: '#0F172B',
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
  color: '#45556C',
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
  color: '#62748E',
});

const XlDescription = styled('p')({
  fontFamily: 'Inter',
  fontSize: '16px',
  fontWeight: '400',
  lineHeight: '24px',
  color: '#62748E',
  margin: 0,
  marginBottom: '16px',
  
});

const XlButtonGroup = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginTop: '8px',
});

// === End XL Variant ===

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
  variant?: 'default' | 'xl';
  descriptionText?: string;
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
  variant = 'default',
  descriptionText,
}: RestaurantCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  if (variant === 'xl') {
    return (
      <XlContainer>
        <XlImageContainer>
          <XlImage src={imageSrc} alt='Restaurant' />
          {showFavoriteYellow && (
            <XlFavoriteYellowOverlay>
              <FavoriteYellow>
                <Star color='#0F172B' size={12} />
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
                <Star color='#F0B100' size={18} />
                {rating}
              </XlRating>
            )}
            {locationText && (
              <XlLocation>
                <LocationIcon color='#62748E' size={18} />
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
                icon={() => <CalendarIcon />}
              />
            )}
            {showFavoriteButton && (
              <MainButton
                variant='outline'
                title='შენახვა'
                size='large'
                icon={() => <HeartOutlined variant={isFavorite ? 'filled' : 'outlined'} />}
              />
            )}
          </XlButtonGroup>
        </XlContent>
      </XlContainer>
    );
  }

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
          {showFilterText && filterText && (
            <MainButton variant='secondary' title={filterText} size='extra_small' />
          )}
          {showRating && (
            <MainButton
              variant='secondary'
              title={String(rating)}
              size='extra_small'
              icon={() => <Star color='#F0B100' size={10} />}
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
              <LocationIcon color='#62748E' size={12} />
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

export default RestaurantCard;
