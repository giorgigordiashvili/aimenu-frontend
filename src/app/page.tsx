'use client';

import { useState, useEffect, useMemo } from 'react';
import { Header, RestaurantCard, RestaurantListSkeleton, CategoryTabsSkeleton } from '@/components';
import { restaurantsList } from '@/api/generated/api';
import type { RestaurantList, RestaurantCategory } from '@/api/generated/interfaces';
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

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [restaurants, setRestaurants] = useState<RestaurantList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        setLoading(true);
        const response = await restaurantsList(
          undefined, // acceptsRemoteOrders
          undefined, // acceptsReservations
          undefined, // acceptsTakeaway
          undefined, // city
          undefined, // country
          undefined, // minRating
          searchQuery || undefined, // name
          undefined, // ordering
          undefined, // page
          20, // pageSize
          searchQuery || undefined, // search
        );
        setRestaurants(response.results);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch restaurants:', err);
        setError('ვერ მოხერხდა რესტორნების ჩატვირთვა');
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurants();
  }, [searchQuery]);

  // Extract unique categories from restaurants
  const categories = useMemo((): CategoryWithIcon[] => {
    const categoryMap = new Map<string, RestaurantCategory>();
    restaurants.forEach((restaurant) => {
      if (restaurant.category && !categoryMap.has(restaurant.category.id)) {
        categoryMap.set(restaurant.category.id, restaurant.category);
      }
    });

    const extractedCategories: CategoryWithIcon[] = Array.from(categoryMap.values()).map((cat) => ({
      id: cat.id,
      name: cat.name,
      icon: getCategoryIcon(cat.slug),
    }));

    return [
      { id: 'all', name: 'ყველა', icon: '🍽️' },
      ...extractedCategories,
    ];
  }, [restaurants]);

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || restaurant.category?.id === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.page}>
      <div className={styles.heroSection}>
        <Header />
      </div>

      <main className={styles.main}>
        <div className={styles.categoryTabs}>
          {loading ? (
            <CategoryTabsSkeleton count={5} />
          ) : (
            categories.map((category) => (
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
            <RestaurantListSkeleton count={4} />
          ) : error ? (
            <div className={styles.errorState}>{error}</div>
          ) : filteredRestaurants.length === 0 ? (
            <div className={styles.emptyState}>რესტორნები ვერ მოიძებნა</div>
          ) : (
            filteredRestaurants.map((restaurant) => (
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
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
