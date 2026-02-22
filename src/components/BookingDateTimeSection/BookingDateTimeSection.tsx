'use client';

import { styled } from '@pigment-css/react';
import { useEffect, useRef, useState } from 'react';

import { useLocale, useTranslations } from '@/context/LocaleContext';
import CalendarIcon from '@/icons/Calendar';
import {
  background,
  border,
  foreground,
  primary,
  primaryHover,
  rose50,
  rose100,
  slate100,
  slate300,
  slate400,
  slate600,
  white,
} from '@/tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  time: string;
  onTimeChange: (time: string) => void;
  guests: number;
  onGuestsChange: (guests: number) => void;
  availableTimeSlots?: string[];
  maxAdvanceDays?: number;
  minGuests?: number;
  maxGuests?: number;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

// ─── Styled components ────────────────────────────────────────────────────────

const Section = styled('div')({
  padding: '20px',
  backgroundColor: background,
  '@media (min-width: 768px)': {
    padding: '24px',
  },
});

const SectionHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '16px',
});

const SectionTitle = styled('h2')({
  fontSize: '16px',
  fontWeight: 600,
  color: foreground,
  margin: 0,
  letterSpacing: '-0.15px',
});

const SectionIconWrap = styled('span')({
  display: 'flex',
  alignItems: 'center',
  color: slate400,
  '& svg': { width: '18px', height: '18px' },
});

const DateTimeRow = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '10px',
  marginBottom: '10px',
});

const FieldBox = styled('div')({
  border: `1px solid ${border}`,
  borderRadius: '12px',
  padding: '12px 14px',
  backgroundColor: white,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.06)',
});

const FieldLabel = styled('label')({
  fontSize: '11px',
  fontWeight: 500,
  color: slate600,
  letterSpacing: '0.2px',
  lineHeight: '14px',
  textTransform: 'uppercase',
});

const DateFieldWrapper = styled('div')({
  position: 'relative',
});

const DateValueText = styled('span')({
  fontSize: '14px',
  fontWeight: 500,
  color: foreground,
  lineHeight: '20px',
});

const DatePlaceholder = styled('span')({
  fontSize: '14px',
  fontWeight: 400,
  color: slate400,
  lineHeight: '20px',
});

const CalendarDropdown = styled('div')({
  position: 'absolute',
  top: 'calc(100% + 6px)',
  left: 0,
  zIndex: 200,
  backgroundColor: white,
  border: `1px solid ${border}`,
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  padding: '16px',
  width: '280px',
  userSelect: 'none',
});

const CalHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '12px',
});

const CalMonthYear = styled('span')({
  fontSize: '14px',
  fontWeight: 600,
  color: foreground,
  lineHeight: '20px',
});

const CalNavBtn = styled('button')({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '4px 8px',
  borderRadius: '6px',
  color: slate600,
  fontSize: '18px',
  lineHeight: 1,
  display: 'flex',
  alignItems: 'center',
  '&:hover': { backgroundColor: slate100 },
});

const CalGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '2px',
});

const CalDayName = styled('span')({
  fontSize: '11px',
  fontWeight: 500,
  color: slate400,
  textAlign: 'center',
  padding: '4px 0',
  lineHeight: '16px',
});

const CalDayCell = styled('button')<{
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
        color: slate300,
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
        '&:hover': { backgroundColor: slate600 },
      },
    },
    {
      props: { isSelected: true },
      style: {
        backgroundColor: primary,
        color: white,
        fontWeight: 600,
        '&:hover': { backgroundColor: primaryHover },
      },
    },
  ],
});

// ─── Time slot grid ───────────────────────────────────────────────────────────

const TimeSlotPanel = styled('div')({
  position: 'absolute',
  top: 'calc(100% + 6px)',
  left: 0,
  zIndex: 200,
  backgroundColor: white,
  border: `1px solid ${border}`,
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  padding: '12px',
  width: '200px',
  userSelect: 'none',
});

const TimeSlotGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '6px',
});

const TimeSlotButton = styled('button')<{ isSelected?: boolean }>({
  border: `1px solid ${border}`,
  borderRadius: '8px',
  padding: '7px 4px',
  fontSize: '13px',
  fontWeight: 400,
  fontFamily: 'Inter, sans-serif',
  color: foreground,
  backgroundColor: white,
  textAlign: 'center',
  lineHeight: '18px',
  cursor: 'pointer',
  transition: 'all 0.1s ease',
  '&:hover': { backgroundColor: slate100, borderColor: slate400 },

  variants: [
    {
      props: { isSelected: true },
      style: {
        backgroundColor: rose50,
        borderColor: primary,
        color: primary,
        fontWeight: 600,
        '&:hover': { backgroundColor: rose100 },
      },
    },
  ],
});

const NoSlotsText = styled('p')({
  fontSize: '13px',
  color: slate600,
  textAlign: 'center',
  margin: 0,
  padding: '8px 0',
});

// ─── Guests ───────────────────────────────────────────────────────────────────

const GuestsBox = styled('div')({
  border: `1px solid ${border}`,
  borderRadius: '12px',
  padding: '12px 14px',
  backgroundColor: white,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.06)',
});

const GuestsInfo = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '3px',
});

const GuestsLabel = styled('span')({
  fontSize: '11px',
  fontWeight: 500,
  color: slate600,
  letterSpacing: '0.2px',
  textTransform: 'uppercase',
  lineHeight: '14px',
});

const GuestsValue = styled('span')({
  fontSize: '14px',
  fontWeight: 500,
  color: foreground,
  lineHeight: '20px',
});

const GuestsControls = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const CounterButton = styled('button')<{ variant?: 'minus' | 'plus' }>({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  border: `1.5px solid ${border}`,
  backgroundColor: white,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
  lineHeight: 1,
  fontWeight: 400,
  color: foreground,
  transition: 'all 0.15s ease',
  padding: 0,

  variants: [
    {
      props: { variant: 'plus' },
      style: {
        borderColor: primary,
        color: primary,
        '&:hover': { backgroundColor: rose50 },
        '&:active': { backgroundColor: rose100 },
      },
    },
    {
      props: { variant: 'minus' },
      style: {
        '&:hover:not(:disabled)': { backgroundColor: slate100 },
        '&:disabled': { opacity: 0.4, cursor: 'not-allowed' },
      },
    },
  ],
});

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookingDateTimeSection({
  selectedDate,
  onDateChange,
  time,
  onTimeChange,
  guests,
  onGuestsChange,
  availableTimeSlots,
  maxAdvanceDays = 60,
  minGuests = 1,
  maxGuests = 20,
}: Props) {
  const t = useTranslations();
  const { locale } = useLocale();

  // Locale-aware date formatters (no state dependency)
  const formatDisplayDate = (d: Date) =>
    new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(d);

  // Sunday-first day names (Jan 7 2024 = Sunday)
  const dayNamesShort = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(2024, 0, 7 + i))
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + maxAdvanceDays);

  const [showCalendar, setShowCalendar] = useState(false);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // Depends on viewYear/viewMonth state
  const monthYearLabel = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(new Date(viewYear, viewMonth, 1));
  const calendarRef = useRef<HTMLDivElement>(null);

  const [showTimePanel, setShowTimePanel] = useState(false);
  const timeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showCalendar) return;
    function handleClickOutside(e: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCalendar]);

  useEffect(() => {
    if (!showTimePanel) return;
    function handleClickOutside(e: MouseEvent) {
      if (timeRef.current && !timeRef.current.contains(e.target as Node)) {
        setShowTimePanel(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTimePanel]);

  function navigateMonth(dir: 1 | -1) {
    let newMonth = viewMonth + dir;
    let newYear = viewYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setViewMonth(newMonth);
    setViewYear(newYear);
  }

  function isDayDisabled(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    return d < today || d > maxDate;
  }

  function handleDaySelect(day: number) {
    if (isDayDisabled(day)) return;
    onDateChange(new Date(viewYear, viewMonth, day));
    setShowCalendar(false);
  }

  const slots = availableTimeSlots ?? [];

  return (
    <Section>
      <SectionHeader>
        <SectionIconWrap>
          <CalendarIcon />
        </SectionIconWrap>
        <SectionTitle>{t.booking.yourReservation}</SectionTitle>
      </SectionHeader>

      <DateTimeRow>
        {/* ── Date picker ──────────────────────────────── */}
        <DateFieldWrapper ref={calendarRef}>
          <FieldBox
            role='button'
            tabIndex={0}
            onClick={() => setShowCalendar(s => !s)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') setShowCalendar(s => !s);
            }}
            style={{ cursor: 'pointer' }}
          >
            <FieldLabel>{t.booking.date}</FieldLabel>
            {selectedDate ? (
              <DateValueText>{formatDisplayDate(selectedDate)}</DateValueText>
            ) : (
              <DatePlaceholder>{t.booking.select}</DatePlaceholder>
            )}
          </FieldBox>

          {showCalendar && (
            <CalendarDropdown>
              <CalHeader>
                <CalNavBtn type='button' onClick={() => navigateMonth(-1)}>
                  ‹
                </CalNavBtn>
                <CalMonthYear>{monthYearLabel}</CalMonthYear>
                <CalNavBtn type='button' onClick={() => navigateMonth(1)}>
                  ›
                </CalNavBtn>
              </CalHeader>

              <CalGrid>
                {dayNamesShort.map((d, i) => (
                  <CalDayName key={i}>{d}</CalDayName>
                ))}

                {Array.from({ length: getFirstDayOfMonth(viewYear, viewMonth) }).map((_, i) => (
                  <span key={`empty-${i}`} />
                ))}

                {Array.from({ length: getDaysInMonth(viewYear, viewMonth) }).map((_, i) => {
                  const day = i + 1;
                  const t2 = new Date();
                  const isToday =
                    day === t2.getDate() &&
                    viewMonth === t2.getMonth() &&
                    viewYear === t2.getFullYear();
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
                      onClick={() => handleDaySelect(day)}
                    >
                      {day}
                    </CalDayCell>
                  );
                })}
              </CalGrid>
            </CalendarDropdown>
          )}
        </DateFieldWrapper>

        {/* ── Time picker ──────────────────────────────── */}
        <DateFieldWrapper ref={timeRef}>
          <FieldBox
            role='button'
            tabIndex={0}
            onClick={() => setShowTimePanel(s => !s)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') setShowTimePanel(s => !s);
            }}
            style={{ cursor: 'pointer' }}
          >
            <FieldLabel>{t.booking.time}</FieldLabel>
            {time ? (
              <DateValueText>{time}</DateValueText>
            ) : (
              <DatePlaceholder>{t.booking.select}</DatePlaceholder>
            )}
          </FieldBox>

          {showTimePanel && (
            <TimeSlotPanel>
              {slots.length === 0 ? (
                <NoSlotsText>{t.booking.noSlotsAvailable}</NoSlotsText>
              ) : (
                <TimeSlotGrid>
                  {slots.map(slot => (
                    <TimeSlotButton
                      key={slot}
                      type='button'
                      isSelected={time === slot}
                      onClick={() => {
                        onTimeChange(slot);
                        setShowTimePanel(false);
                      }}
                    >
                      {slot}
                    </TimeSlotButton>
                  ))}
                </TimeSlotGrid>
              )}
            </TimeSlotPanel>
          )}
        </DateFieldWrapper>
      </DateTimeRow>

      {/* ── Guests counter ───────────────────────────── */}
      <GuestsBox>
        <GuestsInfo>
          <GuestsLabel>{t.booking.guests}</GuestsLabel>
          <GuestsValue>
            {guests} {t.booking.persons}
          </GuestsValue>
        </GuestsInfo>
        <GuestsControls>
          <CounterButton
            type='button'
            variant='minus'
            onClick={() => onGuestsChange(Math.max(minGuests, guests - 1))}
            disabled={guests <= minGuests}
            aria-label={t.booking.decreaseGuests}
          >
            −
          </CounterButton>
          <CounterButton
            type='button'
            variant='plus'
            onClick={() => onGuestsChange(Math.min(maxGuests, guests + 1))}
            disabled={guests >= maxGuests}
            aria-label={t.booking.increaseGuests}
          >
            +
          </CounterButton>
        </GuestsControls>
      </GuestsBox>
    </Section>
  );
}
