'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo, useMemo } from 'react';

import type { Amenity } from '@/api/generated/interfaces';
import { Locale, defaultLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { getTranslation } from '@/utils/translations';

import styles from './RestaurantCard.module.css';

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
    <Link href={`/${locale}/restaurant/${slug}`} className={styles.card}>
      <div className={styles.imageContainer}>
        {logo ? (
          <Image
            src={logo}
            alt={name}
            fill
            sizes='(max-width: 768px) 100vw, 262px'
            className={styles.image}
            loading='lazy'
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
        {averageRating && (
          <div className={styles.ratingBadge}>
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
            <span className={styles.ratingText}>{averageRating}</span>
          </div>
        )}
        {categoryName && <div className={styles.categoryBadge}>{categoryName}</div>}
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{name}</h3>
          <span className={styles.priceLevel}>{priceLevel}</span>
        </div>

        <div className={styles.location}>
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
          <span className={styles.city}>{city || 'თბილისი'}</span>
        </div>

        {displayAmenities.length > 0 && (
          <div className={styles.amenities}>
            {displayAmenities.map(amenity => (
              <span key={amenity.id} className={styles.amenity}>
                {amenity.icon && <span className={styles.amenityIcon}>{amenity.icon}</span>}
                {getTranslation(parseTranslations(amenity.translations), 'name', locale) ||
                  amenity.slug}
              </span>
            ))}
            {extraAmenitiesCount > 0 && (
              <span className={styles.extraAmenities}>+{extraAmenitiesCount}</span>
            )}
          </div>
        )}

        {description && <p className={styles.description}>{description}</p>}

        <div className={styles.detailsButton}>
          <span>{t.common.details}</span>
        </div>
      </div>
    </Link>
  );
});

export default RestaurantCard;
