import { styled } from '@pigment-css/react';
import React from 'react';

import {
  border,
  foreground,
  shadowCard,
  slate100,
  slate150,
  slate200,
  slate400,
  slate950,
  white,
} from '@/tokens';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

// ─── Styled Components ────────────────────────────────────────────────────────

export const CalContainer = styled('div')({
  position: 'absolute',
  top: 'calc(100% + 16px)',
  left: 0,
  right: 0,
  zIndex: 300,
  backgroundColor: white,
  border: `1px solid ${slate200}`,
  borderRadius: '12px',
  boxShadow: shadowCard,
  padding: '16px',
  userSelect: 'none',
});

export const CalMonthNav = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '12px',
});

export const CalHeader = CalMonthNav;

export const CalMonthYear = styled('span')({
  fontSize: '14px',
  fontWeight: 600,
  color: foreground,
});

export const CalNavBtn = styled('button')({
  background: 'none',
  border: `1px solid ${border}`,
  cursor: 'pointer',
  padding: 4,
  borderRadius: 8,
  color: foreground,
  fontSize: '18px',
  lineHeight: 1,
  display: 'flex',
  alignItems: 'center',
  width: 28,
  height: 28,
  justifyContent: 'center',
  '&:hover': { backgroundColor: slate100 },
});

export const CalGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '2px',
});

export const CalDayName = styled('span')({
  fontSize: '11px',
  fontWeight: 500,
  color: slate400,
  textAlign: 'center',
  padding: '4px 0',
  lineHeight: '16px',
});

// Placeholder cell that renders blank but keeps the grid row's height
// identical to a real day cell. Used for leading blanks (start-of-month
// padding) and for trailing blanks when the month doesn't fill 6 weeks —
// otherwise a row made of empty `<span />`s collapses to 0px and the
// calendar jumps between 5- and 6-row months.
export const CalEmptyCell = styled('span')({
  display: 'block',
  padding: '6px 0',
  fontSize: '13px',
  lineHeight: '18px',
  visibility: 'hidden',
});

export const CalDayCell = styled('button')<{
  isToday?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
}>({
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  borderRadius: '8px',
  padding: '6px 0',
  fontSize: '13px',
  fontWeight: 400,
  color: foreground,
  textAlign: 'center',
  lineHeight: '18px',
  transition: 'background-color 0.1s ease',
  '&:hover': { backgroundColor: slate100 },

  variants: [
    {
      props: { isDisabled: true },
      style: {
        color: slate200,
        cursor: 'not-allowed',
        '&:hover': { backgroundColor: 'transparent' },
      },
    },
    {
      props: { isToday: true },
      style: {
        backgroundColor: slate150,
        color: foreground,
        fontWeight: 600,
        '&:hover': { backgroundColor: slate150 },
      },
    },
    {
      props: { isSelected: true },
      style: {
        backgroundColor: slate950,
        color: white,
        fontWeight: 600,
        '&:hover': { backgroundColor: slate950 },
      },
    },
  ],
});

// ─── Props ────────────────────────────────────────────────────────────────────

interface SearchCalendarPickerProps {
  show: boolean;
  selectedDate: Date | null;
  today: Date;
  maxDate: Date;
  viewYear: number;
  viewMonth: number;
  onNavigate: (dir: 1 | -1) => void;
  onSelectDay: (day: number) => void;
  monthYearLabel: string;
  dayNamesShort: string[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** When true, renders without the absolute-positioned CalContainer (for mobile modals). */
  inline?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SearchCalendarPicker({
  show,
  selectedDate,
  today,
  maxDate,
  viewYear,
  viewMonth,
  onNavigate,
  onSelectDay,
  monthYearLabel,
  dayNamesShort,
  inline = false,
}: // containerRef is held by the parent DateFieldWrap for click-outside detection
SearchCalendarPickerProps) {
  if (!show) return null;

  function isDayDisabled(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    return d < today || d > maxDate;
  }

  const inner = (
    <>
      <CalMonthNav>
        <CalNavBtn
          type='button'
          onMouseDown={e => e.preventDefault()}
          onClick={e => {
            e.stopPropagation();
            onNavigate(-1);
          }}
        >
          ‹
        </CalNavBtn>
        <CalMonthYear>{monthYearLabel}</CalMonthYear>
        <CalNavBtn
          type='button'
          onMouseDown={e => e.preventDefault()}
          onClick={e => {
            e.stopPropagation();
            onNavigate(1);
          }}
        >
          ›
        </CalNavBtn>
      </CalMonthNav>

      {(() => {
        const leadingBlanks = getFirstDayOfMonth(viewYear, viewMonth);
        const daysInMonth = getDaysInMonth(viewYear, viewMonth);
        // Pad to a full 6-week grid (42 cells) regardless of month length
        // so the calendar height never jumps when the user navigates
        // between e.g. a 28-day February and a 31-day May.
        const totalCells = 42;
        const trailingBlanks = totalCells - leadingBlanks - daysInMonth;
        return (
          <CalGrid>
            {dayNamesShort.map((d, i) => (
              <CalDayName key={i}>{d}</CalDayName>
            ))}

            {Array.from({ length: leadingBlanks }).map((_, i) => (
              <CalEmptyCell key={`empty-${i}`}>&nbsp;</CalEmptyCell>
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const now = new Date();
              const isToday =
                day === now.getDate() &&
                viewMonth === now.getMonth() &&
                viewYear === now.getFullYear();
              const isSelected = selectedDate
                ? day === selectedDate.getDate() &&
                  viewMonth === selectedDate.getMonth() &&
                  viewYear === selectedDate.getFullYear()
                : false;
              const disabled = isDayDisabled(day);
              return (
                <CalDayCell
                  key={day}
                  type='button'
                  isToday={isToday && !isSelected}
                  isSelected={isSelected}
                  isDisabled={disabled}
                  onClick={() => onSelectDay(day)}
                >
                  {day}
                </CalDayCell>
              );
            })}

            {Array.from({ length: Math.max(0, trailingBlanks) }).map((_, i) => (
              <CalEmptyCell key={`trail-${i}`}>&nbsp;</CalEmptyCell>
            ))}
          </CalGrid>
        );
      })()}
    </>
  );

  if (inline) return <div>{inner}</div>;
  return <CalContainer>{inner}</CalContainer>;
}
