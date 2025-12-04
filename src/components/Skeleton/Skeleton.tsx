'use client';

import styles from './Skeleton.module.css';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={`${styles.skeleton} ${className || ''}`} />;
}

export function RestaurantCardSkeleton() {
  return (
    <div className={styles.restaurantCard}>
      <div className={styles.restaurantImage} />
      <div className={styles.restaurantContent}>
        <div className={styles.restaurantHeader}>
          <Skeleton className={styles.restaurantName} />
          <Skeleton className={styles.restaurantPrice} />
        </div>
        <Skeleton className={styles.restaurantLocation} />
        <div className={styles.restaurantAmenities}>
          <Skeleton className={styles.amenityTag} />
          <Skeleton className={styles.amenityTag} />
        </div>
        <Skeleton className={styles.restaurantDescription} />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className={styles.categoryCard}>
      <div className={styles.categoryImage} />
      <Skeleton className={styles.categoryName} />
      <div className={styles.categoryChevron} />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className={styles.productCard}>
      <div className={styles.productImage} />
      <div className={styles.productContent}>
        <Skeleton className={styles.productName} />
        <Skeleton className={styles.productDescription} />
        <div className={styles.productFooter}>
          <Skeleton className={styles.productPrice} />
          <Skeleton className={styles.productButton} />
        </div>
      </div>
    </div>
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
    <div className={styles.categoryList}>
      {Array.from({ length: count }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
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
  return <div className={styles.categoryTab} />;
}

export function CategoryTabsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className={styles.categoryTabsContainer}>
      {Array.from({ length: count }).map((_, i) => (
        <CategoryTabSkeleton key={i} />
      ))}
    </div>
  );
}
