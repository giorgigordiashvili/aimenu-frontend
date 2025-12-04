'use client';

import { useCart } from '@/context/CartContext';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  image,
}: ProductCardProps) {
  const { addItem, removeItem, getItemQuantity } = useCart();
  const quantity = getItemQuantity(id);
  const isInCart = quantity > 0;

  const handleAdd = () => {
    addItem({ id, name, description, price, image });
  };

  const handleRemove = () => {
    removeItem(id);
  };

  return (
    <div className={`${styles.card} ${isInCart ? styles.cardActive : ''}`}>
      <div className={styles.imageContainer}>
        {image ? (
          <img src={image} alt={name} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        {description && <p className={styles.description}>{description}</p>}
        <p className={styles.price}>{price.toFixed(2)} ₾</p>
      </div>
      <div className={styles.actions}>
        {isInCart ? (
          <div className={styles.quantityControl}>
            <button
              className={styles.quantityButton}
              onClick={handleRemove}
              aria-label="Remove one"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.5 8H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <span className={styles.quantity}>{quantity}</span>
            <button
              className={`${styles.quantityButton} ${styles.addButton}`}
              onClick={handleAdd}
              aria-label="Add one"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3.5V12.5M3.5 8H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        ) : (
          <button
            className={styles.addToCartButton}
            onClick={handleAdd}
            aria-label="Add to cart"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3.5V12.5M3.5 8H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
