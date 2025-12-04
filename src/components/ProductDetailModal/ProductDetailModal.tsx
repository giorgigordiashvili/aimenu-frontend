'use client';

import { useState, useEffect } from 'react';
import BackButton from '../BackButton';
import styles from './ProductDetailModal.module.css';

interface Modifier {
  id: string;
  name: string;
  price: number;
}

interface ModifierGroup {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required?: boolean;
  modifiers: Modifier[];
}

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    modifierGroups?: ModifierGroup[];
  };
}

export default function ProductDetailModal({
  isOpen,
  onClose,
  product,
}: ProductDetailModalProps) {
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string[]>>({});

  // Reset selections when modal opens with new product
  useEffect(() => {
    if (isOpen) {
      const initialSelections: Record<string, string[]> = {};
      product.modifierGroups?.forEach((group) => {
        if (group.type === 'single' && group.modifiers.length > 0) {
          // Select first option by default for single selection groups
          initialSelections[group.id] = [group.modifiers[0].id];
        } else {
          initialSelections[group.id] = [];
        }
      });
      setSelectedModifiers(initialSelections);
    }
  }, [isOpen, product]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSingleSelect = (groupId: string, modifierId: string) => {
    setSelectedModifiers((prev) => ({
      ...prev,
      [groupId]: [modifierId],
    }));
  };

  const handleMultipleSelect = (groupId: string, modifierId: string) => {
    setSelectedModifiers((prev) => {
      const current = prev[groupId] || [];
      if (current.includes(modifierId)) {
        return {
          ...prev,
          [groupId]: current.filter((id) => id !== modifierId),
        };
      }
      return {
        ...prev,
        [groupId]: [...current, modifierId],
      };
    });
  };

  const calculateTotalPrice = () => {
    let total = product.price;
    product.modifierGroups?.forEach((group) => {
      const selected = selectedModifiers[group.id] || [];
      selected.forEach((modId) => {
        const modifier = group.modifiers.find((m) => m.id === modId);
        if (modifier) {
          total += modifier.price;
        }
      });
    });
    return total;
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Product Image */}
        <div className={styles.imageContainer}>
          {product.image ? (
            <img src={product.image} alt={product.name} className={styles.image} />
          ) : (
            <div className={styles.imagePlaceholder} />
          )}
          <div className={styles.backButtonContainer}>
            <BackButton onClick={onClose} />
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.productName}>{product.name}</h2>
            {product.description && (
              <p className={styles.productDescription}>{product.description}</p>
            )}
          </div>

          <div className={styles.divider} />

          {/* Modifier Groups */}
          {product.modifierGroups?.map((group) => (
            <div key={group.id} className={styles.modifierGroup}>
              <h3 className={styles.groupTitle}>{group.name}</h3>
              <div className={styles.optionsList}>
                {group.modifiers.map((modifier) => {
                  const isSelected = (selectedModifiers[group.id] || []).includes(
                    modifier.id
                  );
                  return (
                    <button
                      key={modifier.id}
                      className={styles.optionItem}
                      onClick={() =>
                        group.type === 'single'
                          ? handleSingleSelect(group.id, modifier.id)
                          : handleMultipleSelect(group.id, modifier.id)
                      }
                    >
                      <div className={styles.optionLeft}>
                        <div
                          className={`${styles.radio} ${
                            isSelected ? styles.radioSelected : ''
                          }`}
                        >
                          {isSelected && <div className={styles.radioInner} />}
                        </div>
                        <span className={styles.optionName}>{modifier.name}</span>
                      </div>
                      <span className={styles.optionPrice}>
                        + {modifier.price.toFixed(2)} ₾
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Price Display */}
        <div className={styles.footer}>
          <div className={styles.priceDisplay}>
            <span className={styles.priceLabel}>ჯამი:</span>
            <span className={styles.priceValue}>{totalPrice.toFixed(2)} ₾</span>
          </div>
        </div>
      </div>
    </div>
  );
}
