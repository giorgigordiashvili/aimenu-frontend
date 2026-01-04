'use client';

import { styled } from '@pigment-css/react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useMemo } from 'react';

import type { Amenity } from '@/api/generated/interfaces';
import { Locale, defaultLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { getTranslation } from '@/utils/translations';

// Helper to parse translations string or object
const parseTranslations = (translations: string | object | undefined): object => {
  if (!translations) return {};
  if (typeof translations === 'string') {
    try {
      return JSON.parse(translations);
    } catch {
      return {};
    }
  }
  return translations;
};

const Card = styled(Link)({
  display: 'flex',
  flexDirection: 'column',
  background: '#ffffff',
  border: '0.873px solid #e2e8f0',
  borderRadius: '14px',
  overflow: 'hidden',
  textDecoration: 'none',
  color: 'inherit',
  transition: 'transform 0.1s ease, box-shadow 0.1s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0px 24px 24px -12px rgba(12, 12, 13, 0.15), 0px 8px 8px -4px rgba(12, 12, 13, 0.08)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
});

const ImageContainer = styled('div')({
  position: 'relative',
  width: '100%',
  aspectRatio: '1 / 1',
  overflow: 'hidden',
  '@media (min-width: 768px)': {
    aspectRatio: '262 / 160',
  },
});

const StyledImage = styled(Image)({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const ImagePlaceholder = styled('div')({
  width: '100%',
  height: '100%',
  background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
});

const RatingBadge = styled('div')({
  position: 'absolute',
  top: '12px',
  right: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 8px',
  background: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '100px',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
});

const RatingText = styled('span')({
  fontSize: '10px',
  fontWeight: 700,
  color: '#0f172a',
  lineHeight: '15px',
  letterSpacing: '0.1172px',
});

const CategoryBadge = styled('div')({
  position: 'absolute',
  bottom: '8px',
  left: '8px',
  padding: '3px 7px',
  background: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '8px',
  fontSize: '10px',
  fontWeight: 500,
  color: '#0f172b',
  lineHeight: '15px',
  letterSpacing: '0.1172px',
  display: 'none',
  '@media (min-width: 768px)': {
    display: 'block',
  },
});

const Content = styled('div')({
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  '@media (min-width: 768px)': {
    padding: '12px',
    gap: '6px',
  },
});

const CardHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const Name = styled('h3')({
  fontSize: '16px',
  fontWeight: 700,
  color: '#0f172a',
  lineHeight: '24px',
  letterSpacing: '-0.3125px',
  margin: 0,
});

const PriceLevel = styled('span')({
  fontSize: '10px',
  fontWeight: 500,
  color: '#90a1b9',
  padding: '2px 6px',
  background: '#f8fafc',
  border: '0.873px solid rgba(0, 0, 0, 0.1)',
  borderRadius: '4px',
  lineHeight: '15px',
  letterSpacing: '0.1172px',
});

const Location = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

const City = styled('span')({
  fontSize: '11px',
  fontWeight: 500,
  color: '#62748e',
  lineHeight: '15px',
  letterSpacing: '0.1172px',
});

const Description = styled('p')({
  fontSize: '11px',
  fontWeight: 400,
  color: '#45556c',
  lineHeight: '18.1px',
  letterSpacing: '0.0645px',
  margin: 0,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  '@media (min-width: 768px)': {
    fontSize: '11px',
    lineHeight: '15px',
  },
});

const Amenities = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '7px',
  flexWrap: 'wrap',
});

const AmenityTag = styled('span')({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 8px',
  background: '#f1f5f9',
  borderRadius: '100px',
  fontSize: '9px',
  fontWeight: 400,
  color: '#62748e',
  lineHeight: '13.5px',
  letterSpacing: '0.167px',
});

const AmenityIcon = styled('span')({
  fontSize: '10px',
});

const ExtraAmenities = styled('span')({
  padding: '4px 6px',
  background: '#f1f5f9',
  borderRadius: '100px',
  fontSize: '9px',
  fontWeight: 400,
  color: '#62748e',
  lineHeight: '13.5px',
  letterSpacing: '0.167px',
});

const DetailsButton = styled('div')({
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px 16px',
  background: '#0f172b',
  borderRadius: '8px',
  marginTop: 'auto',
  '@media (min-width: 768px)': {
    display: 'flex',
  },
  '& span': {
    fontSize: '12px',
    fontWeight: 500,
    color: '#ffffff',
    lineHeight: '16px',
  },
});

interface RestaurantCardProps {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  city?: string;
  averageRating?: string;
  totalReviews?: number;
  isOpenNow?: string;
  amenities?: Amenity[];
  priceLevel?: string;
  categoryName?: string;
  locale?: Locale;
}

const RestaurantCard = memo(function RestaurantCard({
  name,
  slug,
  description,
  logo,
  city,
  averageRating,
  amenities = [],
  priceLevel = '₾₾',
  categoryName,
  locale = defaultLocale,
}: RestaurantCardProps) {
  const t = getDictionary(locale);
  const displayAmenities = useMemo(() => amenities.slice(0, 2), [amenities]);
  const extraAmenitiesCount = amenities.length - 2;

  return (
    <Card href={`/${locale}/restaurant/${slug}`}>
      <ImageContainer>
        {logo ? (
          <StyledImage
            src={logo}
            alt={name}
            fill
            sizes='(max-width: 768px) 100vw, 262px'
            loading='lazy'
          />
        ) : (
          <ImagePlaceholder />
        )}
        {averageRating && (
          <RatingBadge>
            <svg
              width='12'
              height='12'
              viewBox='0 0 12 12'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z'
                fill='#FFB800'
                stroke='#FFB800'
                strokeWidth='1'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <RatingText>{averageRating}</RatingText>
          </RatingBadge>
        )}
        {categoryName && <CategoryBadge>{categoryName}</CategoryBadge>}
      </ImageContainer>

      <Content>
        <CardHeader>
          <Name>{name}</Name>
          <PriceLevel>{priceLevel}</PriceLevel>
        </CardHeader>

        <Location>
          <svg
            width='12'
            height='12'
            viewBox='0 0 12 12'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M10 5C10 8.5 6 11 6 11C6 11 2 8.5 2 5C2 3.93913 2.42143 2.92172 3.17157 2.17157C3.92172 1.42143 4.93913 1 6 1C7.06087 1 8.07828 1.42143 8.82843 2.17157C9.57857 2.92172 10 3.93913 10 5Z'
              stroke='#62748E'
              strokeWidth='1'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M6 6.5C6.82843 6.5 7.5 5.82843 7.5 5C7.5 4.17157 6.82843 3.5 6 3.5C5.17157 3.5 4.5 4.17157 4.5 5C4.5 5.82843 5.17157 6.5 6 6.5Z'
              stroke='#62748E'
              strokeWidth='1'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          <City>{city || 'თბილისი'}</City>
        </Location>

        {displayAmenities.length > 0 && (
          <Amenities>
            {displayAmenities.map(amenity => (
              <AmenityTag key={amenity.id}>
                {amenity.icon && <AmenityIcon>{amenity.icon}</AmenityIcon>}
                {getTranslation(parseTranslations(amenity.translations), 'name', locale) ||
                  amenity.slug}
              </AmenityTag>
            ))}
            {extraAmenitiesCount > 0 && <ExtraAmenities>+{extraAmenitiesCount}</ExtraAmenities>}
          </Amenities>
        )}

        {description && <Description>{description}</Description>}

        <DetailsButton>
          <span>{t.common.details}</span>
        </DetailsButton>
      </Content>
    </Card>
  );
});

export default RestaurantCard;
