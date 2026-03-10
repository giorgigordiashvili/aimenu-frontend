'use client';

import { styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useLocale, useTranslations } from '@/context/LocaleContext';
import CalendarIcon from '@/icons/Calendar';
import ClockIcon from '@/icons/Clock';
import {
  border,
  foreground,
  muted,
  rose600,
  shadowCard,
  slate100,
  slate200,
  slate400,
  slate500,
  white,
} from '@/tokens';

import MainButton from '../MainButton/MainButton';

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_TIME_SLOTS = [
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDateValue(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatDateParam(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// ─── Styled Components ────────────────────────────────────────────────────────

const WidgetCard = styled('div')({
  backgroundColor: white,
  borderRadius: '16px',
  boxShadow: '0 4px 32px rgba(0,0,0,0.06)',
  border: `1px solid ${border}`,
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const WidgetHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
});

const WidgetTitle = styled('span')({
  fontSize: '22px',
  fontWeight: 700,
  color: foreground,
  lineHeight: '28px',
});

const CalendarIconWrap = styled('span')({
  display: 'flex',
  alignItems: 'center',
  color: rose600,
  '& svg': { width: '22px', height: '22px' },
});

// ─── Field common styles ──────────────────────────────────────────────────────

const FieldLabel = styled('div')({
  fontSize: '13px',
  fontWeight: 500,
  color: rose600,
  marginBottom: '6px',
});

const FieldInput = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: white,
  border: `1px solid ${slate200}`,
  borderRadius: '12px',
  height: '48px',
  padding: '0 12px',
  cursor: 'pointer',
  userSelect: 'none',
});

const FieldText = styled('span')<{ isPlaceholder?: boolean }>({
  fontSize: '15px',
  flex: 1,
  lineHeight: '20px',
  variants: [
    {
      props: { isPlaceholder: true },
      style: { color: muted },
    },
    {
      props: { isPlaceholder: false },
      style: { color: foreground },
    },
  ],
});

// ─── Calendar Dropdown ────────────────────────────────────────────────────────

const CalendarDropdown = styled('div')({
  position: 'absolute',
  top: 'calc(100% + 6px)',
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
});

const CalNavBtn = styled('button')({
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

// ─── Time + Guests Row ────────────────────────────────────────────────────────

const TimeGuestsRow = styled('div')({
  display: 'flex',
  gap: '12px',
  alignItems: 'flex-start',
});

const TimeFieldWrap = styled('div')({
  position: 'relative',
  flex: '0 0 48%',
  width: '48%',
});

const GuestsFieldWrap = styled('div')({
  position: 'relative',
  flex: 1,
});

// ─── Dropdown List (city-chooser style) ──────────────────────────────────────

const DropdownList = styled('div')({
  position: 'absolute',
  top: 'calc(100% + 6px)',
  left: 0,
  right: 0,
  zIndex: 300,
  backgroundColor: white,
  border: `1px solid ${slate200}`,
  borderRadius: '12px',
  boxShadow: shadowCard,
  maxHeight: '220px',
  overflowY: 'auto',
  userSelect: 'none',
});

const DropdownRow = styled('div')<{ isSelected?: boolean; isLast?: boolean }>({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '48px',
  padding: '0 16px',
  borderBottom: `1px solid ${slate200}`,
  cursor: 'pointer',
  transition: 'background-color 0.1s ease',
  '&:hover': { backgroundColor: slate100 },

  variants: [
    {
      props: { isLast: true },
      style: { borderBottom: 'none' },
    },
    {
      props: { isSelected: true },
      style: {
        backgroundColor: slate100,
      },
    },
  ],
});

const DropdownRowText = styled('span')<{ isSelected?: boolean }>({
  fontSize: '15px',
  variants: [
    {
      props: { isSelected: true },
      style: { color: foreground, fontWeight: 700 },
    },
    {
      props: { isSelected: false },
      style: { color: foreground, fontWeight: 400 },
    },
  ],
});

const CheckMark = styled('span')({
  color: foreground,
  fontSize: '15px',
  fontWeight: 700,
});

// ─── Price Summary ────────────────────────────────────────────────────────────

const PriceSummary = styled('div')({
  backgroundColor: '#F8FAFC',
  borderRadius: '12px',
  padding: '16px',
});

const PriceRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const PriceLabel = styled('span')<{ bold?: boolean }>({
  variants: [
    {
      props: { bold: true },
      style: { fontSize: '16px', fontWeight: 700, color: foreground },
    },
    {
      props: { bold: false },
      style: { fontSize: '14px', fontWeight: 400, color: slate500 },
    },
  ],
});

const PriceValue = styled('span')<{ highlight?: boolean }>({
  variants: [
    {
      props: { highlight: true },
      style: { fontSize: '24px', fontWeight: 700, color: rose600 },
    },
    {
      props: { highlight: false },
      style: { fontSize: '14px', fontWeight: 400, color: slate500 },
    },
  ],
});

const PriceSeparator = styled('div')({
  height: '1px',
  backgroundColor: border,
  margin: '12px 0',
});

// ─── Footer Note ──────────────────────────────────────────────────────────────

const FooterNote = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  marginTop: '12px',
});

const FooterText = styled('span')({
  fontSize: '12px',
  color: muted,
});

// ─── Date Field Wrapper ───────────────────────────────────────────────────────

const DateFieldWrap = styled('div')({
  position: 'relative',
});

// ─── Props ────────────────────────────────────────────────────────────────────

interface ReservationWidgetProps {
  slug: string;
  locale: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReservationWidget({ slug, locale }: ReservationWidgetProps) {
  const router = useRouter();
  const t = useTranslations();
  const { locale: ctxLocale } = useLocale();

  const activeLocale = locale || ctxLocale;

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [guests, setGuests] = useState<number>(2);

  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 60);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const monthYearLabel = new Intl.DateTimeFormat(activeLocale, {
    month: 'long',
    year: 'numeric',
  }).format(new Date(viewYear, viewMonth, 1));

  const dayNamesShort = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(activeLocale, { weekday: 'short' }).format(new Date(2024, 0, 7 + i))
  );

  const calendarRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setShowCalendar(false);
      }
      if (timeRef.current && !timeRef.current.contains(e.target as Node)) {
        setShowTimeDropdown(false);
      }
      if (guestsRef.current && !guestsRef.current.contains(e.target as Node)) {
        setShowGuestsDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    setSelectedDate(new Date(viewYear, viewMonth, day));
    setShowCalendar(false);
  }

  function handleBook() {
    if (!selectedDate || !selectedTime) return;
    const dateParam = formatDateParam(selectedDate);
    router.push(
      `/${activeLocale}/restaurants/${slug}/book?date=${dateParam}&time=${selectedTime}&guests=${guests}`
    );
  }

  const guestOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <WidgetCard>
      {/* Header */}
      <WidgetHeader>
        <CalendarIconWrap>
          <CalendarIcon />
        </CalendarIconWrap>
        <WidgetTitle>{t.reservationWidget.title}</WidgetTitle>
      </WidgetHeader>

      {/* Date Field */}
      <DateFieldWrap ref={calendarRef}>
        <FieldLabel>{t.booking.date}</FieldLabel>
        <FieldInput
          role='button'
          tabIndex={0}
          onClick={() => {
            setShowCalendar(s => !s);
            setShowTimeDropdown(false);
            setShowGuestsDropdown(false);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') setShowCalendar(s => !s);
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', color: slate400 }}>
            <CalendarIcon />
          </span>
          {selectedDate ? (
            <FieldText isPlaceholder={false}>
              {formatDateValue(selectedDate, activeLocale)}
            </FieldText>
          ) : (
            <FieldText isPlaceholder={true}>{t.reservationWidget.datePlaceholder}</FieldText>
          )}
        </FieldInput>

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
                    onClick={() => handleDaySelect(day)}
                  >
                    {day}
                  </CalDayCell>
                );
              })}
            </CalGrid>
          </CalendarDropdown>
        )}
      </DateFieldWrap>

      {/* Time + Guests Row */}
      <TimeGuestsRow>
        {/* Time Field */}
        <TimeFieldWrap ref={timeRef}>
          <FieldLabel>{t.booking.time}</FieldLabel>
          <FieldInput
            role='button'
            tabIndex={0}
            onClick={() => {
              setShowTimeDropdown(s => !s);
              setShowCalendar(false);
              setShowGuestsDropdown(false);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') setShowTimeDropdown(s => !s);
            }}
          >
            <ClockIcon size={16} color={slate400} />
            {selectedTime ? (
              <FieldText isPlaceholder={false}>{selectedTime}</FieldText>
            ) : (
              <FieldText isPlaceholder={true}>{t.reservationWidget.timePlaceholder}</FieldText>
            )}
          </FieldInput>

          {showTimeDropdown && (
            <DropdownList>
              {DEFAULT_TIME_SLOTS.map((slot, idx) => {
                const isSelected = selectedTime === slot;
                const isLast = idx === DEFAULT_TIME_SLOTS.length - 1;
                return (
                  <DropdownRow
                    key={slot}
                    isSelected={isSelected}
                    isLast={isLast}
                    onClick={() => {
                      setSelectedTime(slot);
                      setShowTimeDropdown(false);
                    }}
                  >
                    <DropdownRowText isSelected={isSelected}>{slot}</DropdownRowText>
                    {isSelected && <CheckMark>✓</CheckMark>}
                  </DropdownRow>
                );
              })}
            </DropdownList>
          )}
        </TimeFieldWrap>

        {/* Guests Field */}
        <GuestsFieldWrap ref={guestsRef}>
          <FieldLabel>{t.booking.guests}</FieldLabel>
          <FieldInput
            role='button'
            tabIndex={0}
            onClick={() => {
              setShowGuestsDropdown(s => !s);
              setShowCalendar(false);
              setShowTimeDropdown(false);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') setShowGuestsDropdown(s => !s);
            }}
          >
            <FieldText isPlaceholder={false} style={{ flex: 1 }}>
              {guests} {t.booking.persons}
            </FieldText>
            <span style={{ display: 'flex', alignItems: 'center', color: slate400 }}>
              <svg
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M4 6L8 10L12 6'
                  stroke={slate400}
                  strokeWidth='1.333'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </span>
          </FieldInput>

          {showGuestsDropdown && (
            <DropdownList>
              {guestOptions.map((n, idx) => {
                const isSelected = guests === n;
                const isLast = idx === guestOptions.length - 1;
                return (
                  <DropdownRow
                    key={n}
                    isSelected={isSelected}
                    isLast={isLast}
                    onClick={() => {
                      setGuests(n);
                      setShowGuestsDropdown(false);
                    }}
                  >
                    <DropdownRowText isSelected={isSelected}>
                      {n} {t.booking.persons}
                    </DropdownRowText>
                    {isSelected && <CheckMark>✓</CheckMark>}
                  </DropdownRow>
                );
              })}
            </DropdownList>
          )}
        </GuestsFieldWrap>
      </TimeGuestsRow>

      {/* Price Summary */}
      <PriceSummary>
        <PriceRow>
          <PriceLabel bold={false}>{t.reservationWidget.deposit}</PriceLabel>
          <PriceValue highlight={false}>10.00 ₾</PriceValue>
        </PriceRow>
        <PriceSeparator />
        <PriceRow>
          <PriceLabel bold={true}>{t.reservationWidget.grandTotal}</PriceLabel>
          <PriceValue highlight={true}>10.00 ₾</PriceValue>
        </PriceRow>
      </PriceSummary>

      {/* CTA Button */}
      <MainButton
        variant='rose_cta'
        fullWidth
        size='large'
        title={t.reservationWidget.book}
        onClick={handleBook}
      />

      {/* Footer Note */}
      <FooterNote>
        <ClockIcon size={14} color={slate400} />
        <FooterText>{t.reservationWidget.freeCancellation}</FooterText>
      </FooterNote>
    </WidgetCard>
  );
}
