'use client';

import { styled, keyframes } from '@pigment-css/react';
import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import {
  restaurantsRetrieve,
  restaurantsMenuCategoriesList,
  tablesValidateRetrieve,
} from '@/api/generated/api';
import type { RestaurantDetail, MenuCategory } from '@/api/generated/interfaces';
import {
  Header,
  BackButton,
  SearchBar,
  CategoryList,
  RestaurantInfo,
  TableIndicator,
  CategoryListSkeleton,
} from '@/components';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import { useTable } from '@/context/TableContext';
import { getTranslation } from '@/utils/translations';

const shimmer = keyframes({
  '0%': { backgroundPosition: '-200% 0' },
  '100%': { backgroundPosition: '200% 0' },
});

const Page = styled('div')({
  minHeight: '100vh',
  background: '#f8fafc',
});

const Main = styled('main')({
  padding: '10px 20px 40px',
  '@media (min-width: 768px)': {
    padding: '24px 80px 100px',
    maxWidth: '1280px',
    margin: '0 auto',
  },
});

const TitleSection = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '20px',
  '@media (min-width: 768px)': {
    marginBottom: '32px',
  },
});

const PageTitle = styled('h1')({
  flex: 1,
  fontSize: '14px',
  fontWeight: 600,
  color: '#0f172a',
  textAlign: 'center',
  marginRight: '44px',
  margin: 0,
  '@media (min-width: 768px)': {
    fontSize: '24px',
    fontWeight: 700,
    marginRight: 0,
    textAlign: 'left',
    flex: 'none',
  },
});

const SearchSection = styled('div')({
  margin: '20px 0',
  '@media (min-width: 768px)': {
    margin: '32px 0',
    maxWidth: '400px',
  },
});

const CategoriesSection = styled('div')({
  marginTop: '8px',
  '@media (min-width: 768px)': {
    marginTop: '24px',
  },
});

const ErrorState = styled('div')({
  textAlign: 'center',
  padding: '40px 20px',
  color: '#ec003f',
  fontSize: '14px',
});

// Skeleton styles
const RestaurantInfoSkeleton = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '16px',
  background: '#ffffff',
  borderRadius: '16px',
  marginBottom: '16px',
  '@media (min-width: 768px)': {
    gap: '24px',
    padding: '24px',
  },
});

const LogoSkeleton = styled('div')({
  width: '64px',
  height: '64px',
  borderRadius: '12px',
  flexShrink: 0,
  background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.5s infinite`,
  '@media (min-width: 768px)': {
    width: '120px',
    height: '120px',
    borderRadius: '16px',
  },
});

const InfoSkeleton = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const NameSkeleton = styled('div')({
  height: '24px',
  width: '60%',
  borderRadius: '4px',
  background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.5s infinite`,
  '@media (min-width: 768px)': {
    height: '32px',
  },
});

const DescSkeleton = styled('div')({
  height: '16px',
  width: '80%',
  borderRadius: '4px',
  background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.5s infinite`,
  '@media (min-width: 768px)': {
    height: '20px',
  },
});

const SearchSkeleton = styled('div')({
  height: '48px',
  width: '100%',
  borderRadius: '12px',
  background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.5s infinite`,
});

const CategoriesList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export default function RestaurantDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const tableCode = searchParams.get('table');

  const { locale } = useLocale();
  const t = useTranslations();
  const { tableData, setTableData, setTableCode: storeTableCode } = useTable();

  const [searchQuery, setSearchQuery] = useState('');
  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
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
        } catch (err) {
          console.error('Failed to validate table code:', err);
          // Store the code anyway but mark as not validated
          storeTableCode(tableCode);
        }
      }
    }

    if (tableCode) {
      handleTableCode();
    }
  }, [tableCode, tableData, setTableData, storeTableCode]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [restaurantData, categoriesData] = await Promise.all([
          restaurantsRetrieve(slug),
          restaurantsMenuCategoriesList(slug),
        ]);
        setRestaurant(restaurantData);
        setCategories(categoriesData.results);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch restaurant data:', err);
        setError(t.restaurant.failedToLoad);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchData();
    }
  }, [slug, t.restaurant.failedToLoad]);

  const formattedCategories = categories.map(cat => ({
    id: cat.id,
    name: getTranslation(cat.translations, 'name', locale),
    image: cat.image,
  }));

  const filteredCategories = formattedCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Page>
        <Header />
        <Main>
          <TitleSection>
            <BackButton />
            <PageTitle>{t.restaurant.menu}</PageTitle>
          </TitleSection>

          <RestaurantInfoSkeleton>
            <LogoSkeleton />
            <InfoSkeleton>
              <NameSkeleton />
              <DescSkeleton />
            </InfoSkeleton>
          </RestaurantInfoSkeleton>

          <SearchSection>
            <SearchSkeleton />
          </SearchSection>

          <CategoriesSection>
            <CategoriesList>
              <CategoryListSkeleton count={6} />
            </CategoriesList>
          </CategoriesSection>
        </Main>
      </Page>
    );
  }

  if (error || !restaurant) {
    return (
      <Page>
        <Header />
        <Main>
          <ErrorState>{error || t.restaurant.notFound}</ErrorState>
        </Main>
      </Page>
    );
  }

  return (
    <Page>
      <Header />

      <Main>
        <TitleSection>
          <BackButton />
          <PageTitle>{t.restaurant.menu}</PageTitle>
        </TitleSection>

        <RestaurantInfo
          name={restaurant.name}
          description={`${restaurant.city || ''} • ${restaurant.description || ''}`}
          logo={restaurant.logo}
          rating={parseFloat(restaurant.average_rating || '0')}
        />

        <SearchSection>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t.restaurant.searchPlaceholder}
          />
        </SearchSection>

        <CategoriesSection>
          <CategoryList categories={filteredCategories} restaurantSlug={slug} locale={locale} />
        </CategoriesSection>
      </Main>

      <TableIndicator />
    </Page>
  );
}
