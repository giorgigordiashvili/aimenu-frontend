'use client';

import useSWR from 'swr';
import {
  restaurantsMenuItemsList,
  restaurantsMenuCategoriesList,
} from '@/api/generated/api';
import type { MenuItem, MenuCategory, ModifierGroup, Modifier } from '@/api/generated/interfaces';

interface FormattedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  categoryId: string;
  modifierGroups: {
    id: string;
    name: string;
    type: 'single' | 'multiple';
    required?: boolean;
    modifiers: { id: string; name: string; price: number }[];
  }[];
}

interface FormattedCategory {
  id: string;
  name: string;
  icon?: string;
}

const getTranslatedField = (translations: unknown, field: string): string => {
  if (!translations) return '';
  if (typeof translations === 'object') {
    const obj = translations as Record<string, { [key: string]: string } | string>;
    const kaValue = obj.ka;
    const enValue = obj.en;

    if (kaValue && typeof kaValue === 'object' && field in kaValue) {
      return kaValue[field] || '';
    }
    if (enValue && typeof enValue === 'object' && field in enValue) {
      return enValue[field] || '';
    }

    const firstValue = Object.values(obj)[0];
    if (firstValue && typeof firstValue === 'object' && field in firstValue) {
      return (firstValue as Record<string, string>)[field] || '';
    }

    if (typeof kaValue === 'string') return kaValue;
    if (typeof enValue === 'string') return enValue;
  }
  return '';
};

const formatMenuItem = (item: MenuItem): FormattedProduct => {
  // Parse modifier_groups - it can be a string or already an array
  let modifierGroupsData: ModifierGroup[] = [];
  if (item.modifier_groups) {
    if (typeof item.modifier_groups === 'string') {
      try {
        modifierGroupsData = JSON.parse(item.modifier_groups);
      } catch {
        modifierGroupsData = [];
      }
    } else if (Array.isArray(item.modifier_groups)) {
      modifierGroupsData = item.modifier_groups as unknown as ModifierGroup[];
    }
  }

  // Format modifier groups
  const formattedModifierGroups = modifierGroupsData.map((group: ModifierGroup) => ({
    id: group.id,
    name: getTranslatedField(group.translations, 'name'),
    type: (String(group.selection_type) === 'single' ? 'single' : 'multiple') as 'single' | 'multiple',
    required: group.is_required || false,
    modifiers: (group.modifiers || []).map((mod: Modifier) => ({
      id: mod.id,
      name: getTranslatedField(mod.translations, 'name'),
      price: parseFloat(mod.price_adjustment || '0') || 0,
    })),
  }));

  return {
    id: item.id,
    name: getTranslatedField(item.translations, 'name'),
    description: getTranslatedField(item.translations, 'description'),
    price: parseFloat(item.price) || 0,
    image: item.image,
    categoryId: item.category?.id || '',
    modifierGroups: formattedModifierGroups,
  };
};

interface MenuDataResult {
  products: FormattedProduct[];
  categories: FormattedCategory[];
}

const fetchMenuData = async (slug: string): Promise<MenuDataResult> => {
  const [itemsData, categoriesData] = await Promise.all([
    restaurantsMenuItemsList(slug),
    restaurantsMenuCategoriesList(slug),
  ]);

  // Format categories
  const formattedCategories = categoriesData.results.map((cat: MenuCategory) => ({
    id: cat.id,
    name: getTranslatedField(cat.translations, 'name'),
    icon: '🍽️',
  }));

  // Format products
  const formattedProducts = itemsData.results.map(formatMenuItem);

  return {
    products: formattedProducts,
    categories: formattedCategories,
  };
};

export function useMenuData(slug: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    slug ? ['menuData', slug] : null,
    () => (slug ? fetchMenuData(slug) : null),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Dedupe requests for 1 minute
      keepPreviousData: true,
    }
  );

  return {
    products: data?.products || [],
    categories: data?.categories || [],
    error,
    isLoading,
    mutate,
  };
}

export function useCategoryProducts(slug: string | null, categoryId: string | null) {
  const { products, categories, isLoading, error, mutate } = useMenuData(slug);

  // Filter products for this category
  const categoryProducts = categoryId
    ? products.filter((product) => product.categoryId === categoryId)
    : [];

  // Get category name
  const categoryName = categoryId
    ? categories.find((c) => c.id === categoryId)?.name || ''
    : '';

  return {
    products: categoryProducts,
    categories,
    categoryName,
    isLoading,
    error,
    mutate,
  };
}
