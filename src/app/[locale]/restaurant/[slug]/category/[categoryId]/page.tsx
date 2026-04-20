'use client';

import { styled, keyframes } from '@pigment-css/react';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';

import {
  Header,
  BackButton,
  SearchBar,
  CategoryTabs,
  ProductCard,
  ProductListSkeleton,
  CategoryTabsSkeleton,
} from '@/components';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import { useDebounce } from '@/hooks/useDebounce';
import { useCategoryProducts } from '@/hooks/useMenuData';
import { localePath } from '@/i18n/routing';

const shimmer = keyframes({
  '0%': { backgroundPosition: '-200% 0' },
  '100%': { backgroundPosition: '200% 0' },
});

// Lazy load the modal
const ProductDetailModal = dynamic(() => import('@/components/ProductDetailModal'), { ssr: false });

const Page = styled('div')({
  minHeight: '100vh',
  background: '#f8fafc',
  paddingBottom: '80px',
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
  marginBottom: '16px',
  '@media (min-width: 768px)': {
    marginBottom: '24px',
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
  marginBottom: '16px',
  '@media (min-width: 768px)': {
    marginBottom: '24px',
    maxWidth: '400px',
  },
});

const TabsSection = styled('div')({
  marginBottom: '24px',
  '@media (min-width: 768px)': {
    marginBottom: '32px',
  },
});

const SectionTitle = styled('div')({
  marginBottom: '12px',
  '@media (min-width: 768px)': {
    marginBottom: '20px',
  },
  '& h2': {
    fontSize: '14px',
    fontWeight: 600,
    color: '#0f172a',
    margin: 0,
    '@media (min-width: 768px)': {
      fontSize: '20px',
      fontWeight: 700,
    },
  },
});

const ProductsList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  '@media (min-width: 768px)': {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  '@media (min-width: 1024px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  '@media (min-width: 1280px)': {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
});

const EmptyState = styled('div')({
  textAlign: 'center',
  padding: '40px 20px',
  color: '#62748e',
  fontSize: '14px',
});

// Skeleton styles
const TitleSkeleton = styled('div')({
  flex: 1,
  height: '20px',
  marginRight: '44px',
  borderRadius: '4px',
  background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.5s infinite`,
  '@media (min-width: 768px)': {
    height: '32px',
    maxWidth: '200px',
    marginRight: 0,
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

const SectionTitleSkeleton = styled('div')({
  height: '20px',
  width: '100px',
  borderRadius: '4px',
  background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.5s infinite`,
});

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
  const router = useRouter();
  const slug = params.slug as string;
  const categoryId = params.categoryId as string;

  const { locale } = useLocale();
  const t = useTranslations();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<FormattedProduct | null>(null);

  const handleCategoryChange = (newCategoryId: string | null) => {
    if (newCategoryId && newCategoryId !== categoryId) {
      router.push(localePath(locale, `/restaurant/${slug}/category/${newCategoryId}`));
    }
  };

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
      <Page>
        <Header />
        <Main>
          <TitleSection>
            <BackButton />
            <TitleSkeleton />
          </TitleSection>

          <SearchSection>
            <SearchSkeleton />
          </SearchSection>

          <TabsSection>
            <CategoryTabsSkeleton count={5} />
          </TabsSection>

          <SectionTitle>
            <SectionTitleSkeleton />
          </SectionTitle>

          <ProductsList>
            <ProductListSkeleton count={4} />
          </ProductsList>
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
          <PageTitle>{pageTitle}</PageTitle>
        </TitleSection>

        <SearchSection>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t.restaurant.searchPlaceholder}
          />
        </SearchSection>

        <TabsSection>
          <CategoryTabs
            categories={categories}
            activeCategory={categoryId}
            onCategoryChange={handleCategoryChange}
          />
        </TabsSection>

        <SectionTitle>
          <h2>{pageTitle}</h2>
        </SectionTitle>

        <ProductsList>
          {filteredProducts.length === 0 ? (
            <EmptyState>{t.restaurant.noProductsFound}</EmptyState>
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
        </ProductsList>
      </Main>

      {/*
        Legacy /restaurant/[slug] menu browser is read-only — ordering lives
        on the modern /restaurants/[slug] path which has MenuSection + cart
        wiring. No CartButton here; ProductDetailModal runs in readOnly mode.
      */}

      {selectedProduct && (
        <ProductDetailModal
          isOpen={!!selectedProduct}
          onClose={handleCloseModal}
          product={selectedProduct}
          readOnly
        />
      )}
    </Page>
  );
}
