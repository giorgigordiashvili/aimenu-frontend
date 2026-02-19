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
import { useLocale, useTranslations } from '@/context/LocaleContext';
import { primary } from '@/tokens';
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

const LoadingContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '400px',
});

const Spinner = styled('div')({
  width: '40px',
  height: '40px',
  border: `3px solid #e2e8f0`,
  borderTop: `3px solid ${primary}`,
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
});

const ErrorContainer = styled('div')({
  textAlign: 'center',
  padding: '40px 20px',
  minHeight: '400px',
});

const ErrorText = styled('p')({
  fontSize: '16px',
  color: primary,
  marginBottom: '20px',
});

export default function RestaurantDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { locale } = useLocale();
  const t = useTranslations();

  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRestaurant() {
      try {
        setLoading(true);
        const data = await restaurantsRetrieve(slug);
        setRestaurant(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch restaurant:', err);
        setError(t.restaurantDetail.failedToLoad);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchRestaurant();
    }
  }, [slug, t.restaurantDetail.failedToLoad]);

  if (loading) {
    return (
      <Page>
        <Header />
        <Main>
          <LoadingContainer>
            <Spinner />
          </LoadingContainer>
        </Main>
      </Page>
    );
  }

  if (error || !restaurant) {
    return (
      <Page>
        <Header />
        <Main>
          <ErrorContainer>
            <ErrorText>{error || t.restaurantDetail.notFound}</ErrorText>
          </ErrorContainer>
        </Main>
      </Page>
    );
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
