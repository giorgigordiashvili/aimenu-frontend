'use client';

import { memo, useCallback } from 'react';
import Image from 'next/image';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  onClick?: () => void;
}

const ProductCard = memo(function ProductCard({
  id,
  name,
  description,
  price,
  image,
  onClick,
}: ProductCardProps) {
  const handleCardClick = useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  return (
    <div
      className={`${styles.card} ${onClick ? styles.clickable : ''}`}
      onClick={handleCardClick}
    >
      <div className={styles.imageContainer}>
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="100px"
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        {description && <p className={styles.description}>{description}</p>}
        <p className={styles.price}>{price.toFixed(2)} ₾</p>
      </div>
      <div className={styles.actions}>
        <button
          className={styles.viewButton}
          onClick={handleCardClick}
          aria-label="View product details"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12.5" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </button>
      </div>
    </div>
  );
});

export default ProductCard;
