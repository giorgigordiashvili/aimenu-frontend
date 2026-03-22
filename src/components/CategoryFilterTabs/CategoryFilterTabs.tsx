'use client';

import { styled } from '@pigment-css/react';

import MainButton from '@/components/MainButton/MainButton';

// ── Styled ────────────────────────────────────────────────────────────────────

const TabsWrapper = styled('div')({
  overflowX: 'auto',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  padding: '0 0 4px',
});

const TabsList = styled('div')({
  display: 'flex',
  gap: '8px',
  width: 'max-content',
  flexWrap: 'nowrap',
});

// ── Types ─────────────────────────────────────────────────────────────────────

interface CategoryFilterTabsProps {
  categories: { id: string; name: string; icon?: string }[];
  activeId: string | null;
  allLabel: string;
  onChange: (id: string | null) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CategoryFilterTabs({
  categories,
  activeId,
  allLabel,
  onChange,
}: CategoryFilterTabsProps) {
  return (
    <TabsWrapper>
      <TabsList>
        <MainButton
          variant={activeId === null ? 'slate_cta' : 'outline'}
          size='default'
          rounded
          title={allLabel}
          onClick={() => onChange(null)}
        />
        {categories.map(cat => (
          <MainButton
            key={cat.id}
            variant={activeId === cat.id ? 'slate_cta' : 'outline'}
            size='default'
            rounded
            title={cat.name}
            onClick={() => onChange(cat.id)}
          />
        ))}
      </TabsList>
    </TabsWrapper>
  );
}
