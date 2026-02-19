'use client';

import { styled } from '@pigment-css/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { restaurantsRetrieve } from '@/api/generated/api';
import type { RestaurantDetail } from '@/api/generated/interfaces';
import { Header } from '@/components';
import ContactInfo from '@/components/ContactInfo';
import PhotoGallery from '@/components/PhotoGallery';
import RestaurantDetailInfo from '@/components/RestaurantDetailInfo';
import { useLocale } from '@/context/LocaleContext';
import { getTranslation } from '@/utils/translations';

const Page = styled('div')({
  minHeight: '100vh',
  background: '#ffffff',
});

const Main = styled('main')({
  padding: '20px',
  '@media (min-width: 768px)': {
    padding: '32px 80px 100px',
    maxWidth: '1280px',
    margin: '0 auto',
  },
});

export default function RestaurantDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { locale } = useLocale();

  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);

  useEffect(() => {
    async function fetchRestaurant() {
      try {
        const data = await restaurantsRetrieve(slug);
        setRestaurant(data);
      } catch (err) {
        console.error('Failed to fetch restaurant:', err);
      }
    }

    if (slug) {
      fetchRestaurant();
    }
  }, [slug]);

  if (!restaurant) {
    return null;
  }

  // Prepare images array
  const images = [restaurant.cover_image, restaurant.logo].filter(Boolean) as string[];

  // Get category name
  const categoryName = restaurant.category
    ? getTranslation(restaurant.category.translations, 'name', locale)
    : undefined;

  return (
    <Page>
      <Header />

      <Main>
        {/* Photo Gallery */}
        <PhotoGallery images={images} restaurantName={restaurant.name} />

        {/* Restaurant Info */}
        <RestaurantDetailInfo
          name={restaurant.name}
          description={restaurant.description}
          city={restaurant.city}
          averageRating={restaurant.average_rating}
          totalReviews={restaurant.total_reviews}
          categoryName={categoryName}
          amenities={restaurant.amenities}
          locale={locale}
        />

        {/* Contact & Hours */}
        <ContactInfo
          operatingHours={restaurant.operating_hours}
          phone={restaurant.phone}
          website={restaurant.website}
          email={restaurant.email}
          isOpenNow={restaurant.is_open_now}
          locale={locale}
        />
      </Main>
    </Page>
  );
}
