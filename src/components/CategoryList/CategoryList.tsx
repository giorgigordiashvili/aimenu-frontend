'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Locale, defaultLocale } from '@/i18n/config';
import styles from './CategoryList.module.css';

interface Category {
  id: string;
  name: string;
  image?: string;
}

interface CategoryListProps {
  categories: Category[];
  restaurantSlug: string;
  locale?: Locale;
}

export default function CategoryList({ categories, restaurantSlug, locale = defaultLocale }: CategoryListProps) {
  return (
    <div className={styles.list}>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/${locale}/restaurant/${restaurantSlug}/category/${category.id}`}
          className={styles.item}
        >
          <div className={styles.imageContainer}>
            {category.image ? (
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(min-width: 768px) 200px, 54px"
                className={styles.image}
                loading="lazy"
              />
            ) : (
              <div className={styles.imagePlaceholder} />
            )}
          </div>
          <span className={styles.name}>{category.name}</span>
          <svg
            className={styles.chevron}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 15L12.5 10L7.5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      ))}
    </div>
  );
}
