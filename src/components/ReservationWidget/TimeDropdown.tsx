import React from 'react';

import { CheckMark, DropdownList, DropdownRow, DropdownRowText } from './DropdownShared';

// ─── Props ────────────────────────────────────────────────────────────────────

interface TimeDropdownProps {
  show: boolean;
  slots: string[];
  selected: string;
  onSelect: (slot: string) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TimeDropdown({
  show,
  slots,
  selected,
  onSelect,
}: // containerRef is held by the parent TimeFieldWrap for click-outside detection
TimeDropdownProps) {
  if (!show) return null;

  return (
    <DropdownList>
      {slots.map((slot, idx) => {
        const isSelected = selected === slot;
        const isLast = idx === slots.length - 1;
        return (
          <DropdownRow
            key={slot}
            isSelected={isSelected}
            isLast={isLast}
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
