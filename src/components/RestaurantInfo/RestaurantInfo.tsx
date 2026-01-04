'use client';

import Image from 'next/image';

import styles from './RestaurantInfo.module.css';

interface RestaurantInfoProps {
  name: string;
  description?: string;
  logo?: string;
  rating?: number;
}

export default function RestaurantInfo({ name, description, logo, rating }: RestaurantInfoProps) {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        {logo ? (
          <Image src={logo} alt={name} className={styles.image} fill sizes='80px' />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
      </div>
      <div className={styles.info}>
        <h2 className={styles.name}>{name}</h2>
        {description && <p className={styles.description}>{description}</p>}
        {rating && (
          <div className={styles.ratingBadge}>
            <span>{rating.toFixed(1)} ★</span>
          </div>
        )}
      </div>
    </div>
  );
}
