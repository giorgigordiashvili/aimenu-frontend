'use client';

import { styled } from '@pigment-css/react';
import React, { useState } from 'react';

import MainButton from '@/components/MainButton/MainButton';
import ProductDetailModal from '@/components/ProductDetailModal';
import ProgressiveImage from '@/components/ProgressiveImage';
import { CategoryTabsSkeleton, MenuSectionSkeleton } from '@/components/Skeleton';
import { useCart } from '@/context/CartContext';
import { useMenuData } from '@/hooks/useMenuData';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
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

const SectionHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '16px',
  '@media (min-width: 768px)': {
    marginBottom: '20px',
  },
});

const SectionTitle = styled('h2')({
  fontSize: '22px',
  fontWeight: 700,
  color: foreground,
  lineHeight: '32px',
  margin: 0,
  '@media (min-width: 768px)': {
    fontSize: '24px',
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
  // Keep the category chips visible while the user scrolls through a long
  // menu. HeaderPrimary is 64px tall and sticks at top:0 with z-index:200;
  // we live just under it. Solid background so content doesn't bleed
  // through, slight blur to match the header. Negative horizontal margin
  // + matching padding lets the row span edge-to-edge on narrow viewports
  // so the first/last chip line up with the content below.
  position: 'sticky',
  top: '64px',
  zIndex: 10,
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(8px)',
  margin: '0 -20px 16px',
  padding: '10px 20px',
  '@media (min-width: 768px)': {
    margin: '0 -24px 20px',
    padding: '12px 24px',
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
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
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

// ── Types ─────────────────────────────────────────────────────────────────────

interface MenuProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  imageBlurhash?: string;
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
  headerRight?: React.ReactNode;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MenuSection({ slug, locale, headerRight }: MenuSectionProps) {
  const t = getDictionary(locale);
  const { products, categories, isLoading } = useMenuData(slug, locale);
  const { items: cartItems, getTotalQuantityByMenuItemId, updateQuantity } = useCart();

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<MenuProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialModifiers, setModalInitialModifiers] = useState<
    Record<string, string[]> | undefined
  >(undefined);

  const displayCategories =
    activeCategoryId === null ? categories : categories.filter(c => c.id === activeCategoryId);

  // Opens the modal; if the product is already in cart, pre-load its modifier selection.
  const openModal = (product: MenuProduct, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const existingItem = cartItems.find(i => i.menuItemId === product.id);
    const preloaded = existingItem?.modifiers
      ? existingItem.modifiers.reduce<Record<string, string[]>>((acc, mod) => {
          // Find which group this modifier belongs to
          const group = product.modifierGroups?.find(g => g.modifiers.some(m => m.id === mod.id));
          if (group) {
            acc[group.id] = [...(acc[group.id] ?? []), mod.id];
          }
          return acc;
        }, {})
      : undefined;
    setModalInitialModifiers(preloaded);
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>{t.restaurant.menu}</SectionTitle>
        {headerRight}
      </SectionHeader>

      {/* Category Tabs */}
      {isLoading ? (
        <TabsWrapper>
          <CategoryTabsSkeleton count={5} />
        </TabsWrapper>
      ) : (
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
      )}

      {/* Loading skeleton — keeps layout stable while SWR fetches */}
      {isLoading && <MenuSectionSkeleton groups={2} />}

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
                  inCart={getTotalQuantityByMenuItemId(product.id) > 0}
                  onClick={() => openModal(product)}
                >
                  {product.image ? (
                    <ItemImageWrapper>
                      <ProgressiveImage
                        blurhash={product.imageBlurhash}
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
                  {getTotalQuantityByMenuItemId(product.id) > 0 ? (
                    <QuantityControl onClick={e => e.stopPropagation()}>
                      <QtyBtn
                        onClick={e => {
                          e.stopPropagation();
                          // Decrement the first matching cart item
                          const match = cartItems.find(i => i.menuItemId === product.id);
                          if (match) updateQuantity(match.id, match.quantity - 1);
                        }}
                        aria-label='Remove one'
                      >
                        −
                      </QtyBtn>
                      <QtyCount>{getTotalQuantityByMenuItemId(product.id)}</QtyCount>
                      <QtyBtnPlus
                        onClick={e => openModal(product, e)}
                        aria-label={t.restaurant.addToCart}
                      >
                        +
                      </QtyBtnPlus>
                    </QuantityControl>
                  ) : (
                    <AddButton
                      onClick={e => openModal(product, e)}
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
          initialModifiers={modalInitialModifiers}
        />
      )}
    </Section>
  );
}
