'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Keyboard navigation helper for custom listbox-style dropdowns (city,
// time, guests, etc.). Opens focused on the currently-selected option;
// ArrowDown / ArrowUp move through options; Home / End jump to ends;
// Enter or Space picks the focused option; Escape closes.
//
// Consumers:
//  - Spread `containerProps` on the <DropdownList> (sets `tabIndex` + keydown).
//  - Spread `getOptionProps(index)` on each option row (sets `role`,
//    `aria-selected`, and a `data-active` flag for styling).
//  - Mount-time focus lands on the container, and active-option tracking
//    uses `aria-activedescendant` so the browser surfaces the focused
//    option to screen readers without moving real focus.

interface Options<T> {
  isOpen: boolean;
  options: readonly T[];
  /** Which option value is currently selected (used as the initial focused item). */
  isSelected: (value: T) => boolean;
  onSelect: (value: T) => void;
  onClose: () => void;
  /** Stable ID prefix for each option element. */
  optionIdPrefix: string;
}

export function useListboxKeys<T>({
  isOpen,
  options,
  isSelected,
  onSelect,
  onClose,
  optionIdPrefix,
}: Options<T>) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // On open, focus the container and point activeIndex at the currently
  // selected option (or 0 if none).
  useEffect(() => {
    if (!isOpen) return;
    const initial = options.findIndex(isSelected);
    setActiveIndex(initial >= 0 ? initial : 0);
    // Defer focus to next tick so Pigment's styled div actually exists.
    const t = window.setTimeout(() => containerRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
    // Only run on open/close; option identity changes during render are
    // intentionally ignored so focus doesn't bounce.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!isOpen || options.length === 0) return;
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex(i => (i + 1) % options.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(i => (i <= 0 ? options.length - 1 : i - 1));
          break;
        case 'Home':
          e.preventDefault();
          setActiveIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setActiveIndex(options.length - 1);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < options.length) onSelect(options[activeIndex]);
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [isOpen, options, activeIndex, onSelect, onClose]
  );

  const containerProps = {
    ref: containerRef,
    tabIndex: -1,
    role: 'listbox' as const,
    onKeyDown,
    'aria-activedescendant': activeIndex >= 0 ? `${optionIdPrefix}-${activeIndex}` : undefined,
  };

  const getOptionProps = (index: number) => ({
    id: `${optionIdPrefix}-${index}`,
    role: 'option' as const,
    'aria-selected': isSelected(options[index]),
    'data-active': activeIndex === index ? 'true' : undefined,
    onMouseEnter: () => setActiveIndex(index),
  });

  return { containerProps, getOptionProps };
}
