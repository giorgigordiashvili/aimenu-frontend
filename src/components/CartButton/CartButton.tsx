'use client';

import { useCart } from '@/context/CartContext';
import styles from './CartButton.module.css';

interface CartButtonProps {
  onClick?: () => void;
}

export default function CartButton({ onClick }: CartButtonProps) {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  if (totalItems === 0) {
    return null;
  }

  return (
    <button className={styles.button} onClick={onClick}>
      <div className={styles.badge}>
        <span className={styles.badgeText}>x{totalItems}</span>
      </div>
      <span className={styles.text}>შეკვეთის გაფორმება</span>
      <div className={styles.arrow}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </button>
  );
}
