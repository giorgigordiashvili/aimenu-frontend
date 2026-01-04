'use client';

import { createContext, useContext, ReactNode } from 'react';

import { Locale, defaultLocale } from '@/i18n/config';
import { Dictionary, getDictionary } from '@/i18n/getDictionary';

interface LocaleContextType {
  locale: Locale;
  dictionary: Dictionary;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: defaultLocale,
  dictionary: getDictionary(defaultLocale),
});

interface LocaleProviderProps {
  children: ReactNode;
  locale: Locale;
}

export function LocaleProvider({ children, locale }: LocaleProviderProps) {
  const dictionary = getDictionary(locale);

  return <LocaleContext.Provider value={{ locale, dictionary }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

export function useTranslations() {
  const { dictionary } = useLocale();
  return dictionary;
}
