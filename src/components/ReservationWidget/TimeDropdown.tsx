'use client';

import React from 'react';

import { CheckMark, DropdownList, DropdownRow, DropdownRowText } from './DropdownShared';
import { useListboxKeys } from './useListboxKeys';

// ─── Props ────────────────────────────────────────────────────────────────────

interface TimeDropdownProps {
  show: boolean;
  slots: string[];
  selected: string;
  onSelect: (slot: string) => void;
  /** Optional — lets the parent close the popover on Escape. */
  onClose?: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** aria-labelledby target so screen readers announce the field label. */
  labelledBy?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TimeDropdown({
  show,
  slots,
  selected,
  onSelect,
  onClose,
  labelledBy,
}: TimeDropdownProps) {
  const { containerProps, getOptionProps } = useListboxKeys<string>({
    isOpen: show,
    options: slots,
    isSelected: s => s === selected,
    onSelect: s => onSelect(s),
    onClose: () => onClose?.(),
    optionIdPrefix: 'time-opt',
  });

  if (!show) return null;

  return (
    <DropdownList {...containerProps} aria-labelledby={labelledBy}>
      {slots.map((slot, idx) => {
        const isSelected = selected === slot;
        return (
          <DropdownRow
            key={slot}
            {...getOptionProps(idx)}
            isSelected={isSelected}
            isLast={idx === slots.length - 1}
            onClick={() => onSelect(slot)}
          >
            <DropdownRowText isSelected={isSelected}>{slot}</DropdownRowText>
            {isSelected && <CheckMark />}
          </DropdownRow>
        );
      })}
    </DropdownList>
  );
}
