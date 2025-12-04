'use client';

import styles from './CategoryTabs.module.css';

interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

const categoryIcons: Record<string, string> = {
  all: '✨',
  hot: '🍲',
  drinks: '🍹',
  cold: '🥗',
  coffee: '☕',
  bar: '🍸',
};

export default function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  const allCategories = [
    { id: 'all', name: 'ყველა', icon: categoryIcons.all },
    ...categories.map((cat) => ({
      ...cat,
      icon: cat.icon || categoryIcons[cat.id] || '🍽️',
    })),
  ];

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {allCategories.map((category) => (
          <button
            key={category.id}
            className={`${styles.tab} ${
              (category.id === 'all' && activeCategory === null) ||
              category.id === activeCategory
                ? styles.active
                : ''
            }`}
            onClick={() =>
              onCategoryChange(category.id === 'all' ? null : category.id)
            }
          >
            <span className={styles.icon}>{category.icon}</span>
            <span className={styles.name}>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
