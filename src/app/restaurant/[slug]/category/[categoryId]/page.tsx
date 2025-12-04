'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Header,
  BackButton,
  SearchBar,
  CategoryTabs,
  ProductCard,
  CartButton,
  ProductDetailModal,
  ProductListSkeleton,
  CategoryTabsSkeleton,
  Skeleton,
} from '@/components';
import {
  restaurantsMenuItemsList,
  restaurantsMenuCategoriesList,
} from '@/api/generated/api';
import type { MenuItem, MenuCategory, ModifierGroup, Modifier } from '@/api/generated/interfaces';
import styles from './page.module.css';

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

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<FormattedProduct | null>(null);
  const [products, setProducts] = useState<FormattedProduct[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; icon?: string }[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  const getTranslatedField = (translations: unknown, field: string): string => {
    if (!translations) return '';
    if (typeof translations === 'object') {
      const obj = translations as Record<string, { [key: string]: string } | string>;
      const kaValue = obj.ka;
      const enValue = obj.en;

      if (kaValue && typeof kaValue === 'object' && field in kaValue) {
        return kaValue[field] || '';
      }
      if (enValue && typeof enValue === 'object' && field in enValue) {
        return enValue[field] || '';
      }

      const firstValue = Object.values(obj)[0];
      if (firstValue && typeof firstValue === 'object' && field in firstValue) {
        return (firstValue as Record<string, string>)[field] || '';
      }

      if (typeof kaValue === 'string') return kaValue;
      if (typeof enValue === 'string') return enValue;
    }
    return '';
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [itemsData, categoriesData] = await Promise.all([
          restaurantsMenuItemsList(slug),
          restaurantsMenuCategoriesList(slug),
        ]);

        // Format categories
        const formattedCategories = categoriesData.results.map((cat: MenuCategory) => ({
          id: cat.id,
          name: getTranslatedField(cat.translations, 'name'),
          icon: '🍽️',
        }));
        setCategories(formattedCategories);

        // Find current category name
        const currentCat = categoriesData.results.find((c: MenuCategory) => c.id === categoryId);
        if (currentCat) {
          setCategoryName(getTranslatedField(currentCat.translations, 'name'));
        }

        // Filter and format products for this category
        const categoryItems = itemsData.results.filter(
          (item: MenuItem) => item.category?.id === categoryId
        );

        const formattedProducts: FormattedProduct[] = categoryItems.map((item: MenuItem) => {
          // Parse modifier_groups - it can be a string or already an array
          let modifierGroupsData: ModifierGroup[] = [];
          if (item.modifier_groups) {
            if (typeof item.modifier_groups === 'string') {
              try {
                modifierGroupsData = JSON.parse(item.modifier_groups);
              } catch {
                modifierGroupsData = [];
              }
            } else if (Array.isArray(item.modifier_groups)) {
              modifierGroupsData = item.modifier_groups as unknown as ModifierGroup[];
            }
          }

          // Format modifier groups
          const formattedModifierGroups = modifierGroupsData.map((group: ModifierGroup) => ({
            id: group.id,
            name: getTranslatedField(group.translations, 'name'),
            type: (String(group.selection_type) === 'single' ? 'single' : 'multiple') as 'single' | 'multiple',
            required: group.is_required || false,
            modifiers: (group.modifiers || []).map((mod: Modifier) => ({
              id: mod.id,
              name: getTranslatedField(mod.translations, 'name'),
              price: parseFloat(mod.price_adjustment || '0') || 0,
            })),
          }));

          return {
            id: item.id,
            name: getTranslatedField(item.translations, 'name'),
            description: getTranslatedField(item.translations, 'description'),
            price: parseFloat(item.price) || 0,
            image: item.image,
            categoryId: item.category?.id || '',
            modifierGroups: formattedModifierGroups,
          };
        });

        setProducts(formattedProducts);
      } catch (err) {
        console.error('Failed to fetch menu items:', err);
      } finally {
        setLoading(false);
      }
    }

    if (slug && categoryId) {
      fetchData();
    }
  }, [slug, categoryId]);

  const pageTitle = categoryName || 'მენიუ';

  // Filter products based on search
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

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
            placeholder="მოძებნე კერძი სახელით"
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
            <div className={styles.emptyState}>პროდუქტები ვერ მოიძებნა</div>
          ) : (
            filteredProducts.map((product) => (
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
