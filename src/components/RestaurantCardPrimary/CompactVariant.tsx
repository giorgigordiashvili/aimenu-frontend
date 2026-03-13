'use client';

import { styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';

import MainButton from '@/components/MainButton/MainButton';
import LocationIcon from '@/icons/Location';
import Star from '@/icons/Star';
import { border, foreground, muted, radiusMd, shadowCard, white, yellow500 } from '@/tokens';

import { FavoriteYellow, PriceWrapper, RestaurantCardProps } from './shared';

const CompactContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  borderRadius: radiusMd,
  border: `1px solid ${border}`,
  overflow: 'hidden',
  backgroundColor: white,
  padding: '12px',
  gap: '16px',
  cursor: 'pointer',
  alignItems: 'stretch',
  '&:hover': {
    boxShadow: shadowCard,
  },
  '&:hover img': {
    transform: 'scale(1.1)',
  },
});

const CompactImageContainer = styled('div')({
  position: 'relative',
  width: '140px',
  height: '140px',
  borderRadius: '10px',
  overflow: 'hidden',
  flexShrink: 0,
});

const CompactImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  transition: 'transform 0.3s ease',
});

const CompactFavoriteYellowOverlay = styled('div')({
  position: 'absolute',
  top: '8px',
  left: '8px',
  zIndex: 1,
});

const CompactContent = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  justifyContent: 'space-between',
  minWidth: 0,
});

const CompactInfoGroup = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

const CompactTopRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
});

const CompactTitle = styled('span')({
  fontFamily: 'Inter',
  fontSize: '18px',
  fontWeight: '700',
  lineHeight: '28px',
  color: foreground,
});

const CompactRatingFilterRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontFamily: 'Inter',
  fontSize: '14px',
  fontWeight: '400',
  lineHeight: '20px',
  color: muted,
  '& svg': {
    display: 'block',
  },
});

const CompactDot = styled('span')({
  color: muted,
});

const CompactLocation = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontFamily: 'Inter',
  fontSize: '14px',
  fontWeight: '400',
  lineHeight: '20px',
  color: muted,
  '& svg': {
    display: 'block',
  },
});

const CompactButtonGroup = styled('div')({
  display: 'flex',
  marginTop: '8px',
});

type CompactVariantProps = Omit<
  RestaurantCardProps,
  'variant' | 'detailsVariant' | 'showDetailsButton' | 'descriptionText'
>;

export default function CompactVariant({
  filterText,
  rating = 4.5,
  showFavoriteYellow = true,
  showRating = true,
  showFilterText = true,
  imageSrc = '/RestaurantCardImage.jpg',
  restaurantTitle,
  locationText,
  showBookButton = true,
  href,
  priceLevel = '₾₾₾',
  bookLabel = 'დაჯავშნა',
  favoriteLabel = 'რჩეული',
}: CompactVariantProps) {
  const router = useRouter();

  const handleCardClick = () => {
    if (href) router.push(href);
  };

  const stopAndBook = () => { if (href) router.push(`${href}/book`); };

  return (
    <CompactContainer onClick={handleCardClick}>
      <CompactImageContainer>
        <CompactImage src={imageSrc} alt={restaurantTitle || 'Restaurant'} />
        {showFavoriteYellow && (
          <CompactFavoriteYellowOverlay>
            <FavoriteYellow>
              <Star color={foreground} size={12} />
              {favoriteLabel}
            </FavoriteYellow>
          </CompactFavoriteYellowOverlay>
        )}
      </CompactImageContainer>
      <CompactContent>
        <CompactInfoGroup>
          <CompactTopRow>
            {restaurantTitle && <CompactTitle>{restaurantTitle}</CompactTitle>}
            <PriceWrapper>
              <MainButton variant='outline' title={priceLevel} size='extra_small' />
            </PriceWrapper>
          </CompactTopRow>
          <CompactRatingFilterRow>
            {showRating && (
              <>
                <Star color={yellow500} size={14} />
                {rating}
              </>
            )}
            {showRating && showFilterText && filterText && <CompactDot>•</CompactDot>}
            {showFilterText && filterText && <span>{filterText}</span>}
          </CompactRatingFilterRow>
          {locationText && (
            <CompactLocation>
              <LocationIcon color={muted} size={14} />
              {locationText}
            </CompactLocation>
          )}
        </CompactInfoGroup>
        <CompactButtonGroup onClick={e => e.stopPropagation()}>
          {showBookButton && (
            <MainButton
              variant='rose_cta'
              title={bookLabel}
              size='small'
              fullWidth
              onClick={stopAndBook}
            />
          )}
        </CompactButtonGroup>
      </CompactContent>
    </CompactContainer>
  );
}
