'use client';

import Image from 'next/image';
import Link from 'next/link';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLocale } from '@/context/LocaleContext';

import styles from './Header.module.css';

export default function Header() {
  const { locale } = useLocale();

  return (
    <header className={styles.header}>
      <Link href={`/${locale}`} className={styles.logoContainer}>
        <Image
          src='/logo.png'
          alt='AiMenu'
          width={32}
          height={32}
          className={styles.logo}
          priority
        />
        <span className={styles.logoText}>AiMenu</span>
      </Link>
      <LanguageSwitcher currentLocale={locale} />
    </header>
  );
}
