'use client';

import { useState, useMemo } from 'react';

import type { RestaurantCategory } from '@/api/generated/interfaces';
import { Header, RestaurantCard, RestaurantListSkeleton, CategoryTabsSkeleton } from '@/components';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import { useDebounce } from '@/hooks/useDebounce';
import { useRestaurants } from '@/hooks/useRestaurants';
import { getTranslation } from '@/utils/translations';

import styles from './page.module.css';

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
    <div className={styles.page}>
      <div className={styles.heroSection}>
        <Header />
      </div>

      <main className={styles.main}>
        {/* Desktop section header */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <h1 className={styles.sectionTitle}>{t.home.popularRestaurants}</h1>
            <p className={styles.sectionSubtitle}>{t.home.featuredPlaces}</p>
          </div>
          <button className={styles.viewAllButton}>{t.common.viewAll}</button>
        </div>

        {/* Mobile category tabs */}
        <div className={styles.categoryTabs}>
          {loading ? (
            <CategoryTabsSkeleton count={5} />
          ) : (
            categories.map(category => (
              <button
                key={category.id}
                className={`${styles.categoryTab} ${activeCategory === category.id ? styles.activeTab : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className={styles.categoryIcon}>{category.icon}</span>
                <span className={styles.categoryName}>{category.name}</span>
              </button>
            ))
          )}
        </div>

        <div className={styles.restaurantsList}>
          {loading ? (
            <RestaurantListSkeleton count={8} />
          ) : error ? (
            <div className={styles.errorState}>{t.home.failedToLoad}</div>
          ) : filteredRestaurants.length === 0 ? (
            <div className={styles.emptyState}>{t.home.noRestaurantsFound}</div>
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
        </div>
      </main>
    </div>
  );
}
