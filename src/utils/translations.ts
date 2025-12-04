import { Locale, defaultLocale } from '@/i18n/config';

type TranslationFields = {
  name?: string;
  description?: string;
  [key: string]: string | undefined;
};

type Translations = {
  [locale: string]: TranslationFields;
};

/**
 * Get a translated field from a translations object
 * Falls back to default locale (ka) if the requested locale is not available
 */
export function getTranslation(
  translations: Translations | unknown,
  field: string,
  locale: Locale
): string {
  if (!translations || typeof translations !== 'object') return '';

  const trans = translations as Translations;

  // Try requested locale first
  const value = trans[locale]?.[field];
  if (value) return value;

  // Fallback to Georgian (default)
  const fallback = trans[defaultLocale]?.[field];
  if (fallback) return fallback;

  // Try any available translation
  for (const lang of Object.keys(trans)) {
    const langValue = trans[lang]?.[field];
    if (langValue) return langValue;
  }

  return '';
}

/**
 * Convenience function to get the 'name' field
 */
export function getName(translations: Translations | unknown, locale: Locale): string {
  return getTranslation(translations, 'name', locale);
}

/**
 * Convenience function to get the 'description' field
 */
export function getDescription(translations: Translations | unknown, locale: Locale): string {
  return getTranslation(translations, 'description', locale);
}
