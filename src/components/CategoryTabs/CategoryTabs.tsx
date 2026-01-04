'use client';

import { styled } from '@pigment-css/react';

const Container = styled('div')({
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  scrollbarWidth: 'none',
  margin: '0 -20px',
  padding: '0 20px',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
});

const Tabs = styled('div')({
  display: 'flex',
  gap: '8px',
  paddingBottom: '4px',
});

interface TabProps {
  isActive?: boolean;
}

const Tab = styled('button')<TabProps>({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '9px 13px 10px',
  background: '#e2e8f0',
  color: 'inherit',
  borderRadius: '26px',
  whiteSpace: 'nowrap',
  flexShrink: 0,
  transition: 'background 0.2s ease, color 0.2s ease',
  border: 'none',
  cursor: 'pointer',
  variants: [
    {
      props: { isActive: true },
      style: {
        background: '#7ccf00',
        color: '#ffffff',
      },
    },
  ],
});

const Icon = styled('span')({
  fontSize: '14px',
  lineHeight: 1,
});

const Name = styled('span')({
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: '20px',
});

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
    ...categories.map(cat => ({
      ...cat,
      icon: cat.icon || categoryIcons[cat.id] || '🍽️',
    })),
  ];

  return (
    <Container>
      <Tabs>
        {allCategories.map(category => (
          <Tab
            key={category.id}
            isActive={
              (category.id === 'all' && activeCategory === null) || category.id === activeCategory
            }
            onClick={() => onCategoryChange(category.id === 'all' ? null : category.id)}
          >
            <Icon>{category.icon}</Icon>
            <Name>{category.name}</Name>
          </Tab>
        ))}
      </Tabs>
    </Container>
  );
}
