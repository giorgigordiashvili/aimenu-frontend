'use client';

import { styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';

import MainButton from '@/components/MainButton/MainButton';
import Heart from '@/icons/Heart';
import LocationIcon from '@/icons/Location';
import Star from '@/icons/Star';
import {
  blackAlpha10,
  border,
  foreground,
  iconStroke,
  muted,
  radiusMd,
  redBrand,
  shadowCard,
  slate100,
  slate400,
  slate400c,
  slate50,
  white,
  yellow500,
} from '@/tokens';

import { FavoriteButton, FavoriteYellow, RestaurantCardProps } from './shared';

const AmenitiesList = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
  marginTop: '8px',
});

const AmenityPill = styled('span')({
  fontSize: '10px',
  fontWeight: 500,
  lineHeight: '15px',
  color: muted,
  background: slate100,
  borderRadius: '20px',
  padding: '2px 8px',
  whiteSpace: 'nowrap',
});

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
  fontSize: '16px',
  fontWeight: '700',
  lineHeight: '24px',
  letterSpacing: -0.31,
  color: foreground,
  '@media (max-width: 768px)': {
    width: '100%',
    fontSize: '18px',
    fontWeight: '700',
    lineHeight: '28px',
  },
});

const PriceIndicator = styled('p')({
  padding: '2px 6px',
  backgroundColor: slate50,
  border: `1px solid ${blackAlpha10}`,
  borderRadius: '4px',
  minWidth: 'fit-content',

  fontSize: 10,
  lineHeight: '15px',
  fontWeight: 500,
  color: iconStroke,
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
  paddingTop: '4px',
  '@media (max-width: 768px)': {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
  },
});

const DescriptionContainer = styled('div')({
  paddingTop: '6px',
  marginTop: '10px',
});

const RestaurantDescription = styled('p')({
  fontSize: 12,
  fontWeight: 400,
  lineHeight: '16px',
  color: slate400c,
  margin: 0,
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
  marginTop: '20px',
});

interface DefaultVariantProps extends Omit<
  RestaurantCardProps,
  'variant' | 'descriptionText' | 'amenities'
> {
  amenities?: string[];
  isFavorited: boolean;
  onToggleFavorite: () => void;
}

export default function DefaultVariant({
  filterText,
  rating = 4.5,
  showFavoriteYellow = true,
  showFavoriteButton: _showFavoriteButton = true,
  showRating = true,
  showFilterText = true,
  imageSrc = '/RestaurantCardImage.jpg',
  restaurantTitle,
  restaurantDescription = 'უნიკალური გარემო ძველ თბილისში, სადაც ტრადიციული გემოები ახლებურადაა წარმოჩენილი.',
  locationText,
  detailsVariant = 'filled',
  showDetailsButton = true,
  showBookButton = true,
  isFavorited,
  onToggleFavorite,
  href,
  priceLevel = '₾₾₾',
  detailsLabel = 'დეტალები',
  bookLabel = 'დაჯავშნა',
  favoriteLabel = 'რჩეული',
  amenities,
}: DefaultVariantProps) {
  const router = useRouter();

  const handleCardClick = () => {
    if (href) router.push(href);
  };

  const stopAndDetails = () => {
    if (href) router.push(href);
  };
  const stopAndBook = () => {
    if (href) router.push(`${href}/book`);
  };
  const stopAndFavorite = () => {
    onToggleFavorite();
  };

  return (
    <ContentGroup onClick={handleCardClick}>
      <ContentTop>
        <Image src={imageSrc} alt={restaurantTitle || 'Restaurant'} />
        <FavoriteGroup>
          {showFavoriteYellow && (
            <FavoriteYellow>
              <Star color={foreground} size={12} />
              {favoriteLabel}
            </FavoriteYellow>
          )}
          <FavoriteButton
            onClick={e => {
              e.stopPropagation();
              stopAndFavorite();
            }}
            style={{ color: isFavorited ? redBrand : slate400 }}
          >
            {isFavorited ? (
              <Heart width={14} height={14} fill='currentColor' stroke='currentColor' />
            ) : (
              <Heart width={14} height={14} />
            )}
          </FavoriteButton>
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
          <PriceIndicator>{priceLevel}</PriceIndicator>
        </BottomGroup>
        {locationText && (
          <LocationContainer>
            <LocationIconWrapper>
              <LocationIcon color={muted} size={12} />
            </LocationIconWrapper>
            {locationText}
          </LocationContainer>
        )}
        <DescriptionContainer>
          {restaurantDescription && (
            <RestaurantDescription>{restaurantDescription}</RestaurantDescription>
          )}
          {amenities && amenities.length > 0 && (
            <AmenitiesList>
              {amenities.slice(0, 3).map((name, i) => (
                <AmenityPill key={i}>{name}</AmenityPill>
              ))}
            </AmenitiesList>
          )}
        </DescriptionContainer>
        <ButtonGroup onClick={e => e.stopPropagation()}>
          {showDetailsButton && (
            <MainButton
              variant={detailsVariant === 'filled' ? 'slate_cta' : 'outline'}
              title={detailsLabel}
              size='small'
              fullWidth
              onClick={stopAndDetails}
            />
          )}
          {showBookButton && (
            <MainButton
              variant='rose_cta'
              title={bookLabel}
              size='small'
              fullWidth
              onClick={stopAndBook}
            />
          )}
        </ButtonGroup>
      </ContentBottom>
    </ContentGroup>
  );
}
