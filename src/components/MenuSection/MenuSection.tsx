'use client';

import { styled } from '@pigment-css/react';
import Image from 'next/image';
import { useState } from 'react';

import ProductDetailModal from '@/components/ProductDetailModal';
import { useCart } from '@/context/CartContext';
import { useMenuData } from '@/hooks/useMenuData';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import MainButton from '@/components/MainButton/MainButton';
import {
  border,
  foreground,
  muted,
  radiusSm,
  rose100,
  rose200,
  rose25,
  rose600,
  slate200,
  white,
} from '@/tokens';

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

interface ItemCardProps {
  inCart?: boolean;
}

const ItemCard = styled('div')<ItemCardProps>({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 8px',
  border: `1px solid ${border}`,
  borderRadius: '8px',
  cursor: 'pointer',
  variants: [
    {
      props: { inCart: true },
      style: {
        border: `1.5px solid ${rose200}`,
        background: rose25,
      },
    },
  ],
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
  width: '44px',
  height: '44px',
  borderRadius: '10px',
  border: `1px solid ${border}`,
  background: white,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  fontSize: '22px',
  color: muted,
});

// Quantity control — shown when item is in cart
const QuantityControl = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '6px 6px 6px 12px',
  border: `1px solid ${border}`,
  borderRadius: '14px',
  background: white,
  flexShrink: 0,
});

const QtyBtn = styled('button')({
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
  cursor: 'pointer',
  border: 'none',
  background: 'transparent',
  color: muted,
  flexShrink: 0,
  padding: 0,
});

const QtyBtnPlus = styled('button')({
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '22px',
  cursor: 'pointer',
  border: 'none',
  background: rose100,
  color: rose600,
  borderRadius: radiusSm,
  flexShrink: 0,
  padding: 0,
});

const QtyCount = styled('span')({
  minWidth: '24px',
  textAlign: 'center',
  fontSize: '16px',
  fontWeight: 700,
  color: foreground,
  userSelect: 'none',
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
  const { addItem, getItemQuantity, updateQuantity } = useCart();

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
          <MainButton
            variant={activeCategoryId === null ? 'slate_cta' : 'outline'}
            size='default'
            rounded
            title={t.restaurant.allCategories}
            onClick={() => setActiveCategoryId(null)}
          />
          {categories.map(cat => (
            <MainButton
              key={cat.id}
              variant={activeCategoryId === cat.id ? 'slate_cta' : 'outline'}
              size='default'
              rounded
              title={cat.name}
              onClick={() => setActiveCategoryId(cat.id)}
            />
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
                <ItemCard
                  key={product.id}
                  inCart={getItemQuantity(product.id) > 0}
                  onClick={() => handleProductClick(product)}
                >
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
                  {getItemQuantity(product.id) > 0 ? (
                    <QuantityControl onClick={e => e.stopPropagation()}>
                      <QtyBtn
                        onClick={e => {
                          e.stopPropagation();
                          updateQuantity(product.id, getItemQuantity(product.id) - 1);
                        }}
                        aria-label='Remove one'
                      >
                        −
                      </QtyBtn>
                      <QtyCount>{getItemQuantity(product.id)}</QtyCount>
                      <QtyBtnPlus
                        onClick={e => handleAddToCart(e, product)}
                        aria-label={t.restaurant.addToCart}
                      >
                        +
                      </QtyBtnPlus>
                    </QuantityControl>
                  ) : (
                    <AddButton
                      onClick={e => handleAddToCart(e, product)}
                      aria-label={t.restaurant.addToCart}
                    >
                      +
                    </AddButton>
                  )}
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
