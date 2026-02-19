'use client';

import { styled } from '@pigment-css/react';
import { useState } from 'react';

import type { Amenity } from '@/api/generated/interfaces';
import MainButton from '@/components/MainButton/MainButton';
import TagButton from '@/components/TagButton';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import ChefHat from '@/icons/ChefHat';
import HeartOutline from '@/icons/HeartOutline';
import Location from '@/icons/Location';
import RestaurantUtensils from '@/icons/RestaurantUtensils';
import Share from '@/icons/Share';
import Star from '@/icons/Star';
import { foreground, lime500, muted, white } from '@/tokens';
import { getTranslation } from '@/utils/translations';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  marginBottom: '24px',
  '@media (min-width: 768px)': {
    gap: '12px',
    marginBottom: '32px',
  },
});

// Mobile: Rating + Icons Row
const MobileTopRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '@media (min-width: 768px)': {
    display: 'none',
  },
});

const MobileLeftSection = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const MobileRightSection = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

// Desktop: Name + Reviews | Rating
const DesktopNameRow = styled('div')({
  display: 'none',
  '@media (min-width: 768px)': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
  },
});

const DesktopLeftSection = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
});

const Name = styled('h1')({
  fontSize: '20px',
  fontWeight: 700,
  color: foreground,
  lineHeight: '28px',
  margin: 0,
  '@media (min-width: 768px)': {
    fontSize: '24px',
    lineHeight: '32px',
  },
});

const ReviewCount = styled('span')({
  fontSize: '14px',
  fontWeight: 400,
  color: muted,
  lineHeight: '20px',
});

const RatingBadge = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 10px',
  background: foreground,
  borderRadius: '8px',
  flexShrink: 0,
});

const RatingText = styled('span')({
  fontSize: '14px',
  fontWeight: 600,
  color: white,
  lineHeight: '20px',
});

// Mobile: Name (shown below top row)
const MobileName = styled('h1')({
  fontSize: '20px',
  fontWeight: 700,
  color: foreground,
  lineHeight: '28px',
  margin: 0,
  '@media (min-width: 768px)': {
    display: 'none',
  },
});

// Meta Row: Location | Cuisine | Category
const MetaRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
});

const MetaItem = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

const MetaText = styled('span')({
  fontSize: '13px',
  fontWeight: 400,
  color: muted,
  lineHeight: '20px',
});

const Description = styled('p')({
  fontSize: '14px',
  fontWeight: 400,
  color: muted,
  lineHeight: '22px',
  margin: 0,
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  '@media (min-width: 768px)': {
    fontSize: '15px',
    lineHeight: '24px',
  },
});

const AmenitiesRow = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '8px',
  alignItems: 'center',
});

interface RestaurantDetailInfoProps {
  name: string;
  description?: string;
  city?: string;
  averageRating?: string;
  totalReviews?: number;
  categoryName?: string;
  amenities: Amenity[];
  locale: Locale;
}

export default function RestaurantDetailInfo({
  name,
  description,
  city,
  averageRating,
  totalReviews,
  categoryName,
  amenities,
  locale,
}: RestaurantDetailInfoProps) {
  const t = getDictionary(locale);
  const rating = averageRating ? parseFloat(averageRating) : 0;
  const [isFavorite, setIsFavorite] = useState(false);

  const reviewText = totalReviews
    ? `${totalReviews}+ ${t.restaurantDetail.reviews || 'შეფასება'}`
    : '';

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <Container>
      {/* Mobile: Rating + Icons Row */}
      <MobileTopRow>
        <MobileLeftSection>
          {rating > 0 && (
            <RatingBadge>
              <Star color={lime500} size={16} />
              <RatingText>{rating.toFixed(1)}</RatingText>
            </RatingBadge>
          )}
          {reviewText && <ReviewCount>{reviewText}</ReviewCount>}
        </MobileLeftSection>

        <MobileRightSection>
          <MainButton
            variant='ghost'
            size='extra_small'
            icon={props => <HeartOutline variant={isFavorite ? 'filled' : 'outlined'} {...props} />}
            onClick={handleFavoriteToggle}
          />
          <MainButton variant='ghost' size='extra_small' icon={Share} />
        </MobileRightSection>
      </MobileTopRow>

      {/* Mobile: Name */}
      <MobileName>{name}</MobileName>

      {/* Desktop: Name + Reviews | Rating */}
      <DesktopNameRow>
        <DesktopLeftSection>
          <Name>{name}</Name>
          {reviewText && <ReviewCount>{reviewText}</ReviewCount>}
        </DesktopLeftSection>

        {rating > 0 && (
          <RatingBadge>
            <Star color={lime500} size={16} />
            <RatingText>{rating.toFixed(1)}</RatingText>
          </RatingBadge>
        )}
      </DesktopNameRow>

      {/* Meta Row: Location | Cuisine | Category */}
      <MetaRow>
        {city && (
          <>
            <MetaItem>
              <Location />
              <MetaText>{city}</MetaText>
            </MetaItem>
          </>
        )}

        {categoryName && (
          <>
            <MetaItem>
              <RestaurantUtensils />
              <MetaText>{categoryName}</MetaText>
            </MetaItem>
          </>
        )}

        <MetaItem>
          <MetaText>საშუალო</MetaText>
        </MetaItem>
      </MetaRow>

      {/* Description */}
      {description && <Description>{description}</Description>}

      {/* Amenities */}
      {amenities.length > 0 && (
        <AmenitiesRow>
          {amenities.slice(0, 3).map(amenity => {
            const amenityName =
              getTranslation(amenity.translations, 'name', locale) || amenity.slug;
            return <TagButton key={amenity.id} icon={ChefHat} text={amenityName} size='small' />;
          })}
        </AmenitiesRow>
      )}
    </Container>
  );
}
