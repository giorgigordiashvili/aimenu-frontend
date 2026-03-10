import React from 'react';

import { CheckMark, DropdownList, DropdownRow, DropdownRowText } from './DropdownShared';

// ─── Props ────────────────────────────────────────────────────────────────────

interface GuestsDropdownProps {
  show: boolean;
  options: number[];
  selected: number;
  onSelect: (n: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  personsLabel: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GuestsDropdown({
  show,
  options,
  selected,
  onSelect,
  personsLabel,
}: // containerRef is held by the parent GuestsFieldWrap for click-outside detection
GuestsDropdownProps) {
  if (!show) return null;

  return (
    <DropdownList>
      {options.map((n, idx) => {
        const isSelected = selected === n;
        const isLast = idx === options.length - 1;
        return (
          <DropdownRow key={n} isSelected={isSelected} isLast={isLast} onClick={() => onSelect(n)}>
            <DropdownRowText isSelected={isSelected}>
              {n} {personsLabel}
            </DropdownRowText>
            {isSelected && <CheckMark>✓</CheckMark>}
          </DropdownRow>
        );
      })}
    </DropdownList>
  );
}
