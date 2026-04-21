'use client';

import React from 'react';

import { CheckMark, DropdownList, DropdownRow, DropdownRowText } from './DropdownShared';
import { useListboxKeys } from './useListboxKeys';

// ─── Props ────────────────────────────────────────────────────────────────────

interface GuestsDropdownProps {
  show: boolean;
  options: number[];
  selected: number;
  onSelect: (n: number) => void;
  onClose?: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  personsLabel: string;
  labelledBy?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GuestsDropdown({
  show,
  options,
  selected,
  onSelect,
  onClose,
  personsLabel,
  labelledBy,
}: GuestsDropdownProps) {
  const { containerProps, getOptionProps } = useListboxKeys<number>({
    isOpen: show,
    options,
    isSelected: n => n === selected,
    onSelect: n => onSelect(n),
    onClose: () => onClose?.(),
    optionIdPrefix: 'guests-opt',
  });

  if (!show) return null;

  return (
    <DropdownList {...containerProps} aria-labelledby={labelledBy}>
      {options.map((n, idx) => {
        const isSelected = selected === n;
        return (
          <DropdownRow
            key={n}
            {...getOptionProps(idx)}
            isSelected={isSelected}
            isLast={idx === options.length - 1}
            onClick={() => onSelect(n)}
          >
            <DropdownRowText isSelected={isSelected}>
              {n} {personsLabel}
            </DropdownRowText>
            {isSelected && <CheckMark />}
          </DropdownRow>
        );
      })}
    </DropdownList>
  );
}
