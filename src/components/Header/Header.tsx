'use client';

import Image from 'next/image';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Image
          src="/logo.png"
          alt="AiMenu"
          width={32}
          height={32}
          className={styles.logo}
          priority
        />
        <span className={styles.logoText}>AiMenu</span>
      </div>
    </header>
  );
}
