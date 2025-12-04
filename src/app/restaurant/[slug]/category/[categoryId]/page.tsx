'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Header,
  BackButton,
  SearchBar,
  CategoryTabs,
  ProductCard,
  CartButton,
} from '@/components';
import styles from './page.module.css';

// Mock data for demonstration
const mockCategories = [
  { id: '1', name: 'ცხელი კერძები', icon: '🍲' },
  { id: '2', name: 'სასმელები', icon: '🍹' },
  { id: '3', name: 'ცივი კერძები', icon: '🥗' },
  { id: '4', name: 'ყავა', icon: '☕' },
  { id: '5', name: 'ბარი', icon: '🍸' },
];

const mockProducts = [
  {
    id: '1',
    name: 'აჭარული ხაჭაპური',
    description: 'კენკრის სოუსით',
    price: 12.0,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
    categoryId: '1',
  },
  {
    id: '2',
    name: 'მხარში ხაჭაპური',
    description: 'დაფნის სოუსით',
    price: 15.0,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
    categoryId: '1',
  },
  {
    id: '3',
    name: 'თბილი ხაჭაპური',
    description: 'პომიდვრის სოუსით',
    price: 10.0,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
    categoryId: '1',
  },
  {
    id: '4',
    name: 'ჩხაპური',
    description: 'ყვრიმალის იოგურტით',
    price: 14.0,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
    categoryId: '1',
  },
  {
    id: '5',
    name: 'მცხალი ხაჭაპური',
    description: 'ბროწეულის სოუსით',
    price: 13.0,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
    categoryId: '1',
  },
  {
    id: '6',
    name: 'ბაკურიანი ხაჭაპური',
    description: 'მწვანე სოუსით',
    price: 16.0,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
    categoryId: '1',
  },
];

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Get category name for title
  const currentCategory = mockCategories.find((c) => c.id === categoryId);
  const pageTitle = currentCategory?.name || 'გემრიელი სალათები';

  // Filter products based on search and category
  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === null || product.categoryId === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.titleSection}>
          <BackButton />
          <h1 className={styles.pageTitle}>{pageTitle}</h1>
        </div>

        <div className={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="მოძებნე კერძი სახელით"
          />
        </div>

        <div className={styles.tabsSection}>
          <CategoryTabs
            categories={mockCategories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        <div className={styles.sectionTitle}>
          <h2>ცხელი კერძები</h2>
        </div>

        <div className={styles.productsList}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>
      </main>

      <CartButton />
    </div>
  );
}
