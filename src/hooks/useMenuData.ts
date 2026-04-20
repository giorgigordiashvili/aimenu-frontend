'use client';

import useSWR from 'swr';

import { restaurantsMenuItemsList, restaurantsMenuCategoriesList } from '@/api/generated/api';
import type { MenuItem, MenuCategory, ModifierGroup, Modifier } from '@/api/generated/interfaces';
import { Locale, defaultLocale } from '@/i18n/config';
import { getTranslation } from '@/utils/translations';

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
    minSelections?: number;
    maxSelections?: number;
    modifiers: { id: string; name: string; price: number }[];
  }[];
}

interface FormattedCategory {
  id: string;
  name: string;
  icon?: string;
}

// Helper to parse translations string or object
const parseTranslations = (translations: unknown): object => {
  if (!translations) return {};
  if (typeof translations === 'string') {
    try {
      return JSON.parse(translations);
    } catch {
      return {};
    }
  }
  if (typeof translations === 'object') {
    return translations as object;
  }
  return {};
};

const getTranslatedField = (
  translations: unknown,
  field: string,
  locale: Locale = defaultLocale
): string => {
  const parsed = parseTranslations(translations);
  return getTranslation(parsed, field, locale);
};

const formatMenuItem = (item: MenuItem, locale: Locale): FormattedProduct => {
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
    name: getTranslatedField(group.translations, 'name', locale),
    type: (String(group.selection_type) === 'single' ? 'single' : 'multiple') as
      | 'single'
      | 'multiple',
    required: group.is_required || false,
    minSelections: group.min_selections,
    maxSelections: group.max_selections,
    modifiers: (group.modifiers || []).map((mod: Modifier) => ({
      id: mod.id,
      name: getTranslatedField(mod.translations, 'name', locale),
      price: parseFloat(mod.price_adjustment || '0') || 0,
    })),
  }));

  return {
    id: item.id,
    name: getTranslatedField(item.translations, 'name', locale),
    description: getTranslatedField(item.translations, 'description', locale),
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

const fetchAllMenuItems = async (slug: string): Promise<MenuItem[]> => {
  const allItems: MenuItem[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const data = await restaurantsMenuItemsList(slug, undefined, page);
    allItems.push(...data.results);
    hasMore = !!data.next;
    page++;
  }

  return allItems;
};

const fetchMenuData = async (slug: string, locale: Locale): Promise<MenuDataResult> => {
  const [allItems, categoriesData] = await Promise.all([
    fetchAllMenuItems(slug),
    restaurantsMenuCategoriesList(slug),
  ]);

  // Format categories
  const formattedCategories = categoriesData.results.map((cat: MenuCategory) => ({
    id: cat.id,
    name: getTranslatedField(cat.translations, 'name', locale),
    icon: '🍽️',
  }));

  // Format products
  const formattedProducts = allItems.map(item => formatMenuItem(item, locale));

  return {
    products: formattedProducts,
    categories: formattedCategories,
  };
};

export function useMenuData(slug: string | null, locale: Locale = defaultLocale) {
  const { data, error, isLoading, mutate } = useSWR(
    slug ? ['menuData', slug, locale] : null,
    () => (slug ? fetchMenuData(slug, locale) : null),
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

export function useCategoryProducts(
  slug: string | null,
  categoryId: string | null,
  locale: Locale = defaultLocale
) {
  const { products, categories, isLoading, error, mutate } = useMenuData(slug, locale);

  // Filter products for this category
  const categoryProducts = categoryId
    ? products.filter(product => product.categoryId === categoryId)
    : [];

  // Get category name
  const categoryName = categoryId ? categories.find(c => c.id === categoryId)?.name || '' : '';

  return {
    products: categoryProducts,
    categories,
    categoryName,
    isLoading,
    error,
    mutate,
  };
}
