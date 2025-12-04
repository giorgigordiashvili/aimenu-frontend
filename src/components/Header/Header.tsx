'use client';

import styles from './Header.module.css';

interface HeaderProps {
  showMenu?: boolean;
}

export default function Header({ showMenu = true }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <div className={styles.logoIcon}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="#7CCF00"/>
            <path d="M12 28V12H16L20 24L24 12H28V28H24V18L20 28H16L20 18V28H12Z" fill="white"/>
          </svg>
        </div>
        <span className={styles.logoText}>Magida</span>
      </div>
      {showMenu && (
        <button className={styles.menuButton} aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </header>
  );
}
