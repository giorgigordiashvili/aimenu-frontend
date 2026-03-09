'use client';

import { styled } from '@pigment-css/react';
import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { restaurantsRetrieve, tablesValidateRetrieve } from '@/api/generated/api';
import type { RestaurantDetail } from '@/api/generated/interfaces';
import { Header, TableIndicator } from '@/components';
import ContactInfo from '@/components/ContactInfo';
import Footer from '@/components/Footer';
import MenuSection from '@/components/MenuSection';
import PhotoGallery from '@/components/PhotoGallery';
import RestaurantDetailInfo from '@/components/RestaurantDetailInfo';
import SimilarRestaurants from '@/components/SimilarRestaurants';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import { useTable } from '@/context/TableContext';
import { primary, slate50 } from '@/tokens';
import { getTranslation } from '@/utils/translations';

// ── Styles ────────────────────────────────────────────────────────────────────

const Page = styled('div')({
  minHeight: '100vh',
  background: slate50,
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
  border: '3px solid #e2e8f0',
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
  margin: 0,
});

// ── Page Component ────────────────────────────────────────────────────────────

export default function RestaurantDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const tableCode = searchParams.get('table');

  const { locale } = useLocale();
  const t = useTranslations();
  const { tableData, setTableData, setTableCode: storeTableCode } = useTable();

  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle table code from QR scan
  useEffect(() => {
    async function handleTableCode() {
      if (tableCode && (!tableData || tableData.code !== tableCode)) {
        try {
          const validationResult = await tablesValidateRetrieve(tableCode);
          setTableData({
            code: tableCode,
            tableNumber: validationResult.table_number,
            tableName: validationResult.table_name,
            restaurantSlug: validationResult.restaurant_slug,
            sessionId: validationResult.session_id,
            isValidated: true,
          });
        } catch {
          storeTableCode(tableCode);
        }
      }
    }

    if (tableCode) {
      handleTableCode();
    }
  }, [tableCode, tableData, setTableData, storeTableCode]);

  useEffect(() => {
    async function fetchRestaurant() {
      try {
        setLoading(true);
        const data = await restaurantsRetrieve(slug);
        setRestaurant(data);
        setError(null);
      } catch {
        setError(t.restaurant.failedToLoad);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchRestaurant();
    }
  }, [slug, t.restaurant.failedToLoad]);

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
            <ErrorText>{error ?? t.restaurant.notFound}</ErrorText>
          </ErrorContainer>
        </Main>
      </Page>
    );
  }

  // Prepare images
  const images = [restaurant.cover_image, restaurant.logo].filter(Boolean) as string[];

  // Get category name
  const categoryName = restaurant.category
    ? getTranslation(restaurant.category.translations, 'name', locale)
    : undefined;

  // Cuisine type slug for similar restaurants
  const cuisineTypeSlug = restaurant.category?.slug ?? '';

  return (
    <Page>
      {/* 1. Header */}
      <Header />

      <Main>
        {/* 2. Photo Gallery */}
        <PhotoGallery images={images} restaurantName={restaurant.name} />

        {/* 3. Restaurant Detail Info */}
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

        {/* 4. Menu Section */}
        <MenuSection slug={slug} locale={locale} />

        {/* 5. Contact Info */}
        <ContactInfo
          operatingHours={restaurant.operating_hours}
          phone={restaurant.phone}
          website={restaurant.website}
          email={restaurant.email}
          isOpenNow={restaurant.is_open_now}
          locale={locale}
        />

        {/* 6. Similar Restaurants */}
        <SimilarRestaurants cuisineType={cuisineTypeSlug} currentSlug={slug} locale={locale} />
      </Main>

      {/* 7. Footer */}
      <Footer />

      {/* 8. Table Indicator */}
      <TableIndicator />
    </Page>
  );
}
