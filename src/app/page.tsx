'use client';

import { useState } from 'react';
import { Header, BackButton, SearchBar, CategoryList, RestaurantInfo } from '@/components';
import styles from './page.module.css';

// Mock data for demonstration
const mockRestaurant = {
  id: '1',
  name: 'შავი ლომი',
  slug: 'shavi-lomi',
  description: 'თბილისი • ქართული ფიუჟენი',
  logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop',
  rating: 4.8,
};

const mockCategories = [
  {
    id: '1',
    name: 'გემრიელი სალათები',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop',
  },
  {
    id: '2',
    name: 'მჟავე კერძები',
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=200&h=200&fit=crop',
  },
  {
    id: '3',
    name: 'ტრადიციული დესერტები',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&h=200&fit=crop',
  },
  {
    id: '4',
    name: 'ბოსტნეულის კერძები',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&h=200&fit=crop',
  },
  {
    id: '5',
    name: 'თევზის კერძები',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200&h=200&fit=crop',
  },
  {
    id: '6',
    name: 'ხორცის კერძები',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop',
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = mockCategories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.titleSection}>
          <BackButton />
          <h1 className={styles.pageTitle}>რესტორნის მენიუ</h1>
        </div>

        <RestaurantInfo
          name={mockRestaurant.name}
          description={mockRestaurant.description}
          logo={mockRestaurant.logo}
          rating={mockRestaurant.rating}
        />

        <div className={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="მოძებნე კერძი სახელით"
          />
        </div>

        <div className={styles.categoriesSection}>
          <CategoryList
            categories={filteredCategories}
            restaurantSlug={mockRestaurant.slug}
          />
        </div>
      </main>
    </div>
  );
}
