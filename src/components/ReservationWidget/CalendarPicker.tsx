import { styled } from '@pigment-css/react';
import React from 'react';

import { foreground, rose600, shadowCard, slate100, slate200, slate400, white } from '@/tokens';

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
  border: 'none',
  cursor: 'pointer',
  padding: '4px 8px',
  borderRadius: '6px',
  color: foreground,
  fontSize: '18px',
  lineHeight: 1,
  display: 'flex',
  alignItems: 'center',
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
        backgroundColor: slate400,
        color: white,
        fontWeight: 600,
        '&:hover': { backgroundColor: slate400 },
      },
    },
    {
      props: { isSelected: true },
      style: {
        backgroundColor: rose600,
        color: white,
        fontWeight: 600,
        '&:hover': { backgroundColor: rose600 },
      },
    },
  ],
});

// ─── Props ────────────────────────────────────────────────────────────────────

interface CalendarPickerProps {
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
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CalendarPicker({
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
}: // containerRef is held by the parent DateFieldWrap for click-outside detection
CalendarPickerProps) {
  if (!show) return null;

  function isDayDisabled(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    return d < today || d > maxDate;
  }

  return (
    <CalContainer>
      <CalMonthNav>
        <CalNavBtn type='button' onClick={() => onNavigate(-1)}>
          ‹
        </CalNavBtn>
        <CalMonthYear>{monthYearLabel}</CalMonthYear>
        <CalNavBtn type='button' onClick={() => onNavigate(1)}>
          ›
        </CalNavBtn>
      </CalMonthNav>

      <CalGrid>
        {dayNamesShort.map((d, i) => (
          <CalDayName key={i}>{d}</CalDayName>
        ))}

        {Array.from({ length: getFirstDayOfMonth(viewYear, viewMonth) }).map((_, i) => (
          <span key={`empty-${i}`} />
        ))}

        {Array.from({ length: getDaysInMonth(viewYear, viewMonth) }).map((_, i) => {
          const day = i + 1;
          const now = new Date();
          const isToday =
            day === now.getDate() && viewMonth === now.getMonth() && viewYear === now.getFullYear();
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
      </CalGrid>
    </CalContainer>
  );
}
