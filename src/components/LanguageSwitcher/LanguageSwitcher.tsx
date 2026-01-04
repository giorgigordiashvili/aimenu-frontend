'use client';

import { usePathname, useRouter } from 'next/navigation';

import { Locale, locales, localeNames } from '@/i18n/config';

import styles from './LanguageSwitcher.module.css';

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: Locale) => {
    // Remove current locale from pathname
    const segments = pathname.split('/');
    if (locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join('/') || '/';

    // Set cookie for persistence
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

    router.push(newPath);
  };

  return (
    <div className={styles.container}>
      {locales.map(locale => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={`${styles.button} ${locale === currentLocale ? styles.active : ''}`}
          aria-label={`Switch to ${localeNames[locale]}`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
