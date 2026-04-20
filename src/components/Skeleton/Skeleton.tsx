'use client';

import { styled, keyframes } from '@pigment-css/react';

const shimmer = keyframes({
  '0%': { backgroundPosition: '-200% 0' },
  '100%': { backgroundPosition: '200% 0' },
});

const SkeletonBase = styled('div')({
  background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.5s infinite`,
  borderRadius: '4px',
});

const RestaurantCardWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  background: '#ffffff',
  border: '0.873px solid #e2e8f0',
  borderRadius: '14px',
  overflow: 'hidden',
});

const RestaurantImage = styled('div')({
  width: '100%',
  aspectRatio: '1 / 1',
  background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.5s infinite`,
  '@media (min-width: 768px)': {
    aspectRatio: '262 / 160',
  },
});

const RestaurantContent = styled('div')({
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const RestaurantHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const RestaurantName = styled(SkeletonBase)({
  height: '24px',
  width: '60%',
});

const RestaurantPrice = styled(SkeletonBase)({
  height: '20px',
  width: '40px',
});

const RestaurantLocation = styled(SkeletonBase)({
  height: '15px',
  width: '40%',
});

const RestaurantAmenities = styled('div')({
  display: 'flex',
  gap: '8px',
});

const AmenityTag = styled(SkeletonBase)({
  height: '22px',
  width: '70px',
  borderRadius: '100px',
});

const RestaurantDescription = styled(SkeletonBase)({
  height: '36px',
  width: '100%',
});

const CategoryCardWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  padding: '14px',
  background: '#ffffff',
  border: '0.873px solid #e2e8f0',
  borderRadius: '12px',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  '@media (min-width: 768px)': {
    flexDirection: 'column',
    padding: '16px',
    borderRadius: '14px',
    gap: '12px',
  },
});

const CategoryImage = styled('div')({
  width: '54px',
  height: '53px',
  borderRadius: '8px',
  flexShrink: 0,
  marginRight: '14px',
  background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.5s infinite`,
  '@media (min-width: 768px)': {
    width: '100%',
    height: '120px',
    marginRight: 0,
    borderRadius: '10px',
  },
});

const CategoryName = styled(SkeletonBase)({
  flex: 1,
  height: '16px',
  '@media (min-width: 768px)': {
    textAlign: 'center',
    width: '80%',
    margin: '0 auto',
  },
});

const CategoryChevron = styled('div')({
  width: '20px',
  height: '20px',
  borderRadius: '4px',
  flexShrink: 0,
  background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.5s infinite`,
  '@media (min-width: 768px)': {
    display: 'none',
  },
});

const CategoryList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  '@media (min-width: 768px)': {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  '@media (min-width: 1024px)': {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
  '@media (min-width: 1280px)': {
    gridTemplateColumns: 'repeat(5, 1fr)',
  },
});

const ProductCardWrapper = styled('div')({
  display: 'flex',
  gap: '12px',
  padding: '12px',
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  '@media (min-width: 768px)': {
    flexDirection: 'column',
    padding: 0,
    gap: 0,
    borderRadius: '14px',
    overflow: 'hidden',
  },
});

const ProductImage = styled('div')({
  width: '100px',
  height: '100px',
  borderRadius: '8px',
  flexShrink: 0,
  background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.5s infinite`,
  '@media (min-width: 768px)': {
    width: '100%',
    height: '160px',
    borderRadius: 0,
  },
});

const ProductContent = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  '@media (min-width: 768px)': {
    padding: '12px',
  },
});

const ProductName = styled(SkeletonBase)({
  height: '20px',
  width: '70%',
});

const ProductDescription = styled(SkeletonBase)({
  height: '32px',
  width: '100%',
});

const ProductFooter = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 'auto',
});

const ProductPrice = styled(SkeletonBase)({
  height: '20px',
  width: '60px',
});

const ProductButton = styled(SkeletonBase)({
  height: '32px',
  width: '32px',
  borderRadius: '50%',
  '@media (min-width: 768px)': {
    display: 'none',
  },
});

const CategoryTabsContainer = styled('div')({
  display: 'flex',
  gap: '8px',
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
});

const CategoryTab = styled('div')({
  width: '80px',
  height: '36px',
  borderRadius: '100px',
  flexShrink: 0,
  background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.5s infinite`,
});

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <SkeletonBase className={className} />;
}

export function RestaurantCardSkeleton() {
  return (
    <RestaurantCardWrapper>
      <RestaurantImage />
      <RestaurantContent>
        <RestaurantHeader>
          <RestaurantName />
          <RestaurantPrice />
        </RestaurantHeader>
        <RestaurantLocation />
        <RestaurantAmenities>
          <AmenityTag />
          <AmenityTag />
        </RestaurantAmenities>
        <RestaurantDescription />
      </RestaurantContent>
    </RestaurantCardWrapper>
  );
}

export function CategoryCardSkeleton() {
  return (
    <CategoryCardWrapper>
      <CategoryImage />
      <CategoryName />
      <CategoryChevron />
    </CategoryCardWrapper>
  );
}

export function ProductCardSkeleton() {
  return (
    <ProductCardWrapper>
      <ProductImage />
      <ProductContent>
        <ProductName />
        <ProductDescription />
        <ProductFooter>
          <ProductPrice />
          <ProductButton />
        </ProductFooter>
      </ProductContent>
    </ProductCardWrapper>
  );
}

export function RestaurantListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <RestaurantCardSkeleton key={i} />
      ))}
    </>
  );
}

export function CategoryListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <CategoryList>
      {Array.from({ length: count }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </CategoryList>
  );
}

export function ProductListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </>
  );
}

export function CategoryTabSkeleton() {
  return <CategoryTab />;
}

export function CategoryTabsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <CategoryTabsContainer>
      {Array.from({ length: count }).map((_, i) => (
        <CategoryTabSkeleton key={i} />
      ))}
    </CategoryTabsContainer>
  );
}

// ── Menu row skeleton (horizontal layout used on restaurant detail) ──────────

const MenuRowCard = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 8px',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
});

const MenuRowImage = styled('div')({
  width: '72px',
  height: '72px',
  borderRadius: '10px',
  flexShrink: 0,
  background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.5s infinite`,
  '@media (min-width: 768px)': {
    width: '80px',
    height: '80px',
  },
});

const MenuRowContent = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  minWidth: 0,
});

const MenuRowName = styled(SkeletonBase)({
  height: '16px',
  width: '55%',
});

const MenuRowDescription = styled(SkeletonBase)({
  height: '13px',
  width: '90%',
});

const MenuRowPrice = styled(SkeletonBase)({
  height: '14px',
  width: '50px',
  marginTop: '2px',
});

const MenuRowAddBtn = styled(SkeletonBase)({
  width: '44px',
  height: '44px',
  borderRadius: '10px',
  flexShrink: 0,
});

const MenuGroup = styled('div')({
  marginBottom: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const MenuGroupHeading = styled(SkeletonBase)({
  height: '18px',
  width: '120px',
  marginBottom: '8px',
});

export function MenuItemRowSkeleton() {
  return (
    <MenuRowCard>
      <MenuRowImage />
      <MenuRowContent>
        <MenuRowName />
        <MenuRowDescription />
        <MenuRowPrice />
      </MenuRowContent>
      <MenuRowAddBtn />
    </MenuRowCard>
  );
}

export function MenuGroupSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <MenuGroup>
      <MenuGroupHeading />
      {Array.from({ length: rows }).map((_, i) => (
        <MenuItemRowSkeleton key={i} />
      ))}
    </MenuGroup>
  );
}

export function MenuSectionSkeleton({ groups = 2 }: { groups?: number }) {
  return (
    <>
      {Array.from({ length: groups }).map((_, i) => (
        <MenuGroupSkeleton key={i} rows={i === 0 ? 4 : 3} />
      ))}
    </>
  );
}

// ── Similar restaurants horizontal scroll skeleton ───────────────────────────

const SimilarRow = styled('div')({
  display: 'flex',
  gap: '16px',
  padding: '8px 8px 16px',
  margin: '0 -8px',
  '@media (max-width: 767px)': {
    flexDirection: 'column',
  },
});

const SimilarCard = styled('div')({
  width: '264px',
  flexShrink: 0,
  '@media (max-width: 767px)': {
    width: '100%',
  },
});

export function SimilarRestaurantsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <SimilarRow>
      {Array.from({ length: count }).map((_, i) => (
        <SimilarCard key={i}>
          <RestaurantCardSkeleton />
        </SimilarCard>
      ))}
    </SimilarRow>
  );
}
