'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';

import {
  Header,
  BackButton,
  SearchBar,
  CategoryTabs,
  ProductCard,
  CartButton,
  ProductListSkeleton,
  CategoryTabsSkeleton,
  Skeleton,
} from '@/components';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import { useDebounce } from '@/hooks/useDebounce';
import { useCategoryProducts } from '@/hooks/useMenuData';

import styles from './page.module.css';

// Lazy load the modal
const ProductDetailModal = dynamic(() => import('@/components/ProductDetailModal'), { ssr: false });

interface FormattedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  categoryId: string;
  modifierGroups: {
    id: string;
    name: string;
    type: 'single' | 'multiple';
    required?: boolean;
    modifiers: { id: string; name: string; price: number }[];
  }[];
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const categoryId = params.categoryId as string;

  const { locale } = useLocale();
  const t = useTranslations();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<FormattedProduct | null>(null);

  const {
    products,
    categories,
    categoryName,
    isLoading: loading,
  } = useCategoryProducts(slug, categoryId, locale);

  const pageTitle = categoryName || t.restaurant.menu;
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesSearch;
    });
  }, [products, debouncedSearch]);

  const handleProductClick = (product: FormattedProduct) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <div className={styles.titleSection}>
            <BackButton />
            <Skeleton className={styles.titleSkeleton} />
          </div>

          <div className={styles.searchSection}>
            <Skeleton className={styles.searchSkeleton} />
          </div>

          <div className={styles.tabsSection}>
            <CategoryTabsSkeleton count={5} />
          </div>

          <div className={styles.sectionTitle}>
            <Skeleton className={styles.sectionTitleSkeleton} />
          </div>

          <div className={styles.productsList}>
            <ProductListSkeleton count={4} />
          </div>
        </main>
      </div>
    );
  }

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
            placeholder={t.restaurant.searchPlaceholder}
          />
        </div>

        <div className={styles.tabsSection}>
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        <div className={styles.sectionTitle}>
          <h2>{pageTitle}</h2>
        </div>

        <div className={styles.productsList}>
          {filteredProducts.length === 0 ? (
            <div className={styles.emptyState}>{t.restaurant.noProductsFound}</div>
          ) : (
            filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                image={product.image}
                onClick={() => handleProductClick(product)}
              />
            ))
          )}
        </div>
      </main>

      <CartButton />

      {selectedProduct && (
        <ProductDetailModal
          isOpen={!!selectedProduct}
          onClose={handleCloseModal}
          product={selectedProduct}
        />
      )}
    </div>
  );
}
