'use client';

import { styled } from '@pigment-css/react';
import Image from 'next/image';
import { useState } from 'react';

import ProductDetailModal from '@/components/ProductDetailModal';
import { useCart } from '@/context/CartContext';
import { useMenuData } from '@/hooks/useMenuData';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { border, foreground, muted, rose600, slate200, slate900, white } from '@/tokens';

// ── Containers ────────────────────────────────────────────────────────────────

const Section = styled('section')({
  marginBottom: '24px',
  '@media (min-width: 768px)': {
    marginBottom: '40px',
  },
});

const SectionTitle = styled('h2')({
  fontSize: '22px',
  fontWeight: 700,
  color: foreground,
  lineHeight: '32px',
  margin: '0 0 16px',
  '@media (min-width: 768px)': {
    fontSize: '24px',
    marginBottom: '20px',
  },
});

// ── Category Tabs ─────────────────────────────────────────────────────────────

const TabsWrapper = styled('div')({
  overflowX: 'auto',
  marginBottom: '24px',
  // hide scrollbar
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
});

const TabsList = styled('div')({
  display: 'flex',
  gap: '8px',
  width: 'max-content',
});

interface TabButtonProps {
  isActive?: boolean;
}

const TabButton = styled('button')<TabButtonProps>({
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap',
  border: `1px solid ${slate200}`,
  background: white,
  color: foreground,
  variants: [
    {
      props: { isActive: true },
      style: {
        background: slate900,
        color: white,
        border: `1px solid ${slate900}`,
      },
    },
  ],
});

// ── Category Group ────────────────────────────────────────────────────────────

const CategoryGroup = styled('div')({
  marginBottom: '24px',
});

const CategoryHeading = styled('h3')({
  fontSize: '16px',
  fontWeight: 700,
  color: rose600,
  lineHeight: '24px',
  margin: '0 0 12px',
  '@media (min-width: 768px)': {
    fontSize: '18px',
    marginBottom: '16px',
  },
});

// ── Menu Item Card ────────────────────────────────────────────────────────────

const ItemCard = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 8px',
  border: `1px solid ${border}`,
  borderRadius: '8px',
  cursor: 'pointer',
});

const ItemImageWrapper = styled('div')({
  position: 'relative',
  width: '72px',
  height: '72px',
  borderRadius: '10px',
  overflow: 'hidden',
  flexShrink: 0,
  '@media (min-width: 768px)': {
    width: '80px',
    height: '80px',
  },
});

const ItemImagePlaceholder = styled('div')({
  width: '72px',
  height: '72px',
  borderRadius: '10px',
  background: slate200,
  flexShrink: 0,
  '@media (min-width: 768px)': {
    width: '80px',
    height: '80px',
  },
});

const ItemContent = styled('div')({
  flex: 1,
  minWidth: 0,
});

const ItemName = styled('p')({
  fontSize: '15px',
  fontWeight: 700,
  color: foreground,
  lineHeight: '22px',
  margin: '0 0 4px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const ItemDescription = styled('p')({
  fontSize: '13px',
  fontWeight: 400,
  color: muted,
  lineHeight: '18px',
  margin: '0 0 6px',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

const ItemPrice = styled('p')({
  fontSize: '15px',
  fontWeight: 700,
  color: foreground,
  lineHeight: '22px',
  margin: 0,
});

const AddButton = styled('button')({
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  border: `1px solid ${border}`,
  background: white,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  fontSize: '20px',
  color: foreground,
  transition: 'all 0.2s ease',
  '&:hover': {
    background: slate900,
    color: white,
    border: `1px solid ${slate900}`,
  },
});

// ── Loading / Empty ───────────────────────────────────────────────────────────

const LoadingText = styled('p')({
  fontSize: '14px',
  color: muted,
  textAlign: 'center',
  padding: '24px 0',
  margin: 0,
});

// ── Types ─────────────────────────────────────────────────────────────────────

interface MenuProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  categoryId: string;
  modifierGroups: Array<{
    id: string;
    name: string;
    type: 'single' | 'multiple';
    required?: boolean;
    modifiers: Array<{ id: string; name: string; price: number }>;
  }>;
}

interface MenuSectionProps {
  slug: string;
  locale: Locale;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MenuSection({ slug, locale }: MenuSectionProps) {
  const t = getDictionary(locale);
  const { products, categories, isLoading } = useMenuData(slug, locale);
  const { addItem } = useCart();

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<MenuProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayCategories =
    activeCategoryId === null ? categories : categories.filter(c => c.id === activeCategoryId);

  const handleAddToCart = (e: React.MouseEvent, product: MenuProduct) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      menuItemId: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
    });
  };

  const handleProductClick = (product: MenuProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <Section>
      <SectionTitle>{t.restaurant.menu}</SectionTitle>

      {/* Category Tabs */}
      <TabsWrapper>
        <TabsList>
          <TabButton isActive={activeCategoryId === null} onClick={() => setActiveCategoryId(null)}>
            {t.restaurant.allCategories}
          </TabButton>
          {categories.map(cat => (
            <TabButton
              key={cat.id}
              isActive={activeCategoryId === cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
            >
              {cat.name}
            </TabButton>
          ))}
        </TabsList>
      </TabsWrapper>

      {/* Loading */}
      {isLoading && <LoadingText>{t.common.loading}</LoadingText>}

      {/* Menu Items grouped by category */}
      {!isLoading &&
        displayCategories.map(cat => {
          const catProducts = products.filter(p => p.categoryId === cat.id);
          if (catProducts.length === 0) return null;
          return (
            <CategoryGroup key={cat.id}>
              <CategoryHeading>{cat.name}</CategoryHeading>
              {catProducts.map(product => (
                <ItemCard key={product.id} onClick={() => handleProductClick(product)}>
                  {product.image ? (
                    <ItemImageWrapper>
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes='80px'
                        style={{ objectFit: 'cover' }}
                      />
                    </ItemImageWrapper>
                  ) : (
                    <ItemImagePlaceholder />
                  )}
                  <ItemContent>
                    <ItemName>{product.name}</ItemName>
                    {product.description && (
                      <ItemDescription>{product.description}</ItemDescription>
                    )}
                    <ItemPrice>{product.price.toFixed(2)} ₾</ItemPrice>
                  </ItemContent>
                  <AddButton
                    onClick={e => handleAddToCart(e, product)}
                    aria-label={t.restaurant.addToCart}
                  >
                    +
                  </AddButton>
                </ItemCard>
              ))}
            </CategoryGroup>
          );
        })}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={selectedProduct}
        />
      )}
    </Section>
  );
}
