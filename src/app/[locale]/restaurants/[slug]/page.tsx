'use client';

import { styled } from '@pigment-css/react';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { restaurantsRetrieve, tablesValidateRetrieve } from '@/api/generated/api';
import type { RestaurantDetail } from '@/api/generated/interfaces';
import { ReservationWidget } from '@/components';
import CartBadge from '@/components/CartBadge';
import ContactInfo from '@/components/ContactInfo';
import Footer from '@/components/Footer';
import HeaderPrimary from '@/components/HeaderPrimary';
import MenuSection from '@/components/MenuSection';
import PhotoGallery from '@/components/PhotoGallery';
import RestaurantCartScopeBanner from '@/components/RestaurantCartScopeBanner';
import RestaurantDetailInfo from '@/components/RestaurantDetailInfo';
import SimilarRestaurants from '@/components/SimilarRestaurants';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import { useTable } from '@/context/TableContext';
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

const ContentLayout = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  '@media (min-width: 1024px)': {
    flexDirection: 'row',
    gap: '32px',
    alignItems: 'flex-start',
  },
});

const LeftColumn = styled('div')({
  flex: 1,
  minWidth: 0,
});

const RightColumn = styled('div')({
  display: 'none',
  '@media (min-width: 1024px)': {
    display: 'block',
    width: '380px',
    flexShrink: 0,
    position: 'sticky',
    // 64px sticky header height + 24px breathing room — otherwise the widget
    // scrolls under the Header.
    top: '88px',
  },
});

const MobileReservation = styled('div')({
  display: 'block',
  '@media (min-width: 1024px)': {
    display: 'none',
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
  const searchParams = useSearchParams();
  const tableCode = searchParams.get('table');
  const { tableData, setTableData } = useTable();
  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Validate ?table=<code> against the backend, establishing a TableSession
  // so invite-link + cart-attachment flows have sessionId available later.
  useEffect(() => {
    if (!tableCode) return;
    if (tableData?.code === tableCode && tableData.isValidated) return;
    let cancelled = false;
    (async () => {
      try {
        const r = (await tablesValidateRetrieve(tableCode)) as {
          table_number?: string;
          table_name?: string;
          restaurant_slug?: string;
          session_id?: string;
        };
        if (cancelled) return;
        setTableData({
          code: tableCode,
          tableNumber: r.table_number,
          tableName: r.table_name,
          restaurantSlug: r.restaurant_slug,
          sessionId: r.session_id,
          isValidated: true,
        });
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') console.error('[validateTable]', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tableCode, tableData?.code, tableData?.isValidated, setTableData]);

  useEffect(() => {
    async function fetchRestaurant() {
      try {
        setLoading(true);
        const data = await restaurantsRetrieve(slug);
        setRestaurant(data);
        setError(null);
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') console.error('[RestaurantDetail]', err);
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
        <HeaderPrimary />
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
        <HeaderPrimary />
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

  // Widget is always shown when the restaurant accepts reservations. Its
  // internals switch to "order only" (QR dine-in) when the URL has ?table=
  // — handled inside ReservationWidget itself.
  const showWidget = restaurant.accepts_reservations === true;

  return (
    <Page>
      <HeaderPrimary />

      <Main>
        {/* Photo Gallery — full width above columns */}
        <PhotoGallery images={images} restaurantName={restaurant.name} />

        <ContentLayout>
          {/* Left column — main content */}
          <LeftColumn>
            <RestaurantCartScopeBanner slug={slug} />
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

            {/* ReservationWidget — mobile only (between RestaurantDetailInfo and MenuSection) */}
            {showWidget && (
              <MobileReservation>
                <ReservationWidget slug={slug} locale={locale} />
              </MobileReservation>
            )}

            <MenuSection slug={slug} locale={locale} headerRight={<CartBadge />} />

            {/* Contact & Hours */}
            <ContactInfo
              operatingHours={restaurant.operating_hours}
              phone={restaurant.phone}
              website={restaurant.website}
              email={restaurant.email}
              isOpenNow={restaurant.is_open_now}
              locale={locale}
            />

            {/* Similar Restaurants */}
            <SimilarRestaurants
              cuisineType={restaurant.category?.slug ?? ''}
              currentSlug={slug}
              locale={locale}
            />
          </LeftColumn>

          {/* Right column — sticky widget (desktop only) */}
          {showWidget && (
            <RightColumn>
              <ReservationWidget slug={slug} locale={locale} />
            </RightColumn>
          )}
        </ContentLayout>
      </Main>

      <Footer locale={locale} />
    </Page>
  );
}
