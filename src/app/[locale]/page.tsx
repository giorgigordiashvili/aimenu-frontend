'use client';

import { styled } from '@pigment-css/react';
import { useState, useMemo } from 'react';

import type { RestaurantCategory } from '@/api/generated/interfaces';
import { Header, RestaurantCard, RestaurantListSkeleton, CategoryTabsSkeleton } from '@/components';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import { useDebounce } from '@/hooks/useDebounce';
import { useRestaurants } from '@/hooks/useRestaurants';
import { getTranslation } from '@/utils/translations';

const Page = styled('div')({
  minHeight: '100vh',
  background: '#f8fafc',
});

const HeroSection = styled('div')({
  position: 'relative',
  background: '#f8fafc',
});

const Main = styled('main')({
  padding: '0 20px 100px',
  '@media (min-width: 768px)': {
    padding: '64px 80px 100px',
    maxWidth: '1280px',
    margin: '0 auto',
  },
});

const SectionHeader = styled('div')({
  display: 'none',
  '@media (min-width: 768px)': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
  },
});

const SectionTitleGroup = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const SectionTitle = styled('h1')({
  fontSize: '30px',
  fontWeight: 700,
  color: '#0f172b',
  lineHeight: '36px',
  letterSpacing: '-0.35px',
  margin: 0,
});

const SectionSubtitle = styled('p')({
  fontSize: '16px',
  fontWeight: 400,
  color: '#62748e',
  lineHeight: '24px',
  letterSpacing: '-0.31px',
  margin: 0,
});

const ViewAllButton = styled('button')({
  padding: '9px 17px',
  background: '#ffffff',
  border: '0.873px solid rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 500,
  color: '#0a0a0a',
  lineHeight: '20px',
  letterSpacing: '-0.15px',
  cursor: 'pointer',
  transition: 'background 0.2s ease',
  '&:hover': {
    background: '#f1f5f9',
  },
});

const CategoryTabsContainer = styled('div')({
  display: 'flex',
  gap: '7px',
  overflowX: 'auto',
  paddingTop: '16px',
  paddingBottom: '8px',
  marginBottom: '24px',
  WebkitOverflowScrolling: 'touch',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  '@media (min-width: 768px)': {
    display: 'none',
  },
});

const CategoryTab = styled('button')({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 13px',
  background: '#e2e8f0',
  border: 'none',
  borderRadius: '26px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'background 0.2s ease',
  '&:hover': {
    background: '#7ccf00',
  },
  '&[data-active="true"]': {
    background: '#7ccf00',
  },
});

const CategoryIcon = styled('span')({
  fontSize: '14px',
});

const CategoryName = styled('span')({
  fontSize: '12px',
  fontWeight: 500,
  color: '#0f172a',
  lineHeight: '20px',
  '[data-active="true"] &': {
    color: '#ffffff',
  },
});

const RestaurantsList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  '@media (min-width: 768px)': {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
  },
  '@media (min-width: 768px) and (max-width: 1023px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  '@media (min-width: 1024px) and (max-width: 1279px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
});

const ErrorState = styled('div')({
  textAlign: 'center',
  padding: '40px 20px',
  color: '#ec003f',
  fontSize: '14px',
});

const EmptyState = styled('div')({
  textAlign: 'center',
  padding: '40px 20px',
  color: '#62748e',
  fontSize: '14px',
});

interface CategoryWithIcon {
  id: string;
  name: string;
  icon: string;
}

const getCategoryIcon = (slug: string): string => {
  const iconMap: Record<string, string> = {
    georgian: '🥟',
    italian: '🍕',
    asian: '🍜',
    european: '🥐',
    bar: '🍸',
    cafe: '☕',
    fastfood: '🍔',
    seafood: '🦐',
  };
  return iconMap[slug.toLowerCase()] || '🍽️';
};

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

export default function Home() {
  const { locale } = useLocale();
  const t = useTranslations();

  const [searchQuery, _setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [activeCategory, setActiveCategory] = useState('all');

  const { restaurants, isLoading: loading, error } = useRestaurants({ search: debouncedSearch });

  // Extract unique categories from restaurants
  const categories = useMemo((): CategoryWithIcon[] => {
    const categoryMap = new Map<string, RestaurantCategory>();
    restaurants.forEach(restaurant => {
      if (restaurant.category && !categoryMap.has(restaurant.category.id)) {
        categoryMap.set(restaurant.category.id, restaurant.category);
      }
    });

    const extractedCategories: CategoryWithIcon[] = Array.from(categoryMap.values()).map(cat => ({
      id: cat.id,
      name: getTranslation(parseTranslations(cat.translations), 'name', locale) || cat.slug,
      icon: getCategoryIcon(cat.slug),
    }));

    return [{ id: 'all', name: t.home.allCategories, icon: '🍽️' }, ...extractedCategories];
  }, [restaurants, t.home.allCategories, locale]);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === 'all' || restaurant.category?.id === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [restaurants, searchQuery, activeCategory]);

  return (
    <Page>
      <HeroSection>
        <Header />
      </HeroSection>

      <Main>
        {/* Desktop section header */}
        <SectionHeader>
          <SectionTitleGroup>
            <SectionTitle>{t.home.popularRestaurants}</SectionTitle>
            <SectionSubtitle>{t.home.featuredPlaces}</SectionSubtitle>
          </SectionTitleGroup>
          <ViewAllButton>{t.common.viewAll}</ViewAllButton>
        </SectionHeader>

        {/* Mobile category tabs */}
        <CategoryTabsContainer>
          {loading ? (
            <CategoryTabsSkeleton count={5} />
          ) : (
            categories.map(category => (
              <CategoryTab
                key={category.id}
                data-active={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
              >
                <CategoryIcon>{category.icon}</CategoryIcon>
                <CategoryName>{category.name}</CategoryName>
              </CategoryTab>
            ))
          )}
        </CategoryTabsContainer>

        <RestaurantsList>
          {loading ? (
            <RestaurantListSkeleton count={8} />
          ) : error ? (
            <ErrorState>{t.home.failedToLoad}</ErrorState>
          ) : filteredRestaurants.length === 0 ? (
            <EmptyState>{t.home.noRestaurantsFound}</EmptyState>
          ) : (
            filteredRestaurants.map(restaurant => (
              <RestaurantCard
                key={restaurant.id}
                id={restaurant.id}
                name={restaurant.name}
                slug={restaurant.slug}
                description={restaurant.description}
                logo={restaurant.logo}
                city={restaurant.city}
                averageRating={restaurant.average_rating}
                totalReviews={restaurant.total_reviews}
                isOpenNow={restaurant.is_open_now}
                amenities={restaurant.amenities}
                categoryName={
                  restaurant.category
                    ? getTranslation(
                        parseTranslations(restaurant.category.translations),
                        'name',
                        locale
                      ) || restaurant.category.slug
                    : undefined
                }
                locale={locale}
              />
            ))
          )}
        </RestaurantsList>
      </Main>
    </Page>
  );
}
