'use client';

import { styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { reservationsSettingsRetrieve } from '@/api/generated/api';
import { useCart } from '@/context/CartContext';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import CalendarIcon from '@/icons/Calendar';
import ChevronDownIcon from '@/icons/ChevronDown';
import ClockIcon from '@/icons/Clock';
import {
  border,
  foreground,
  iconStroke,
  muted,
  rose600,
  slate200,
  slate400,
  white,
} from '@/tokens';

import MainButton from '../MainButton/MainButton';

import CalendarPicker from './CalendarPicker';
import GuestsDropdown from './GuestsDropdown';
import PriceSummarySection from './PriceSummarySection';
import TimeDropdown from './TimeDropdown';

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
  marginBottom: '24px',
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
  color: iconStroke,
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

// ─── Date Field Wrapper ───────────────────────────────────────────────────────

const DateFieldWrap = styled('div')({
  position: 'relative',
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

const IconWrap = styled('span')({
  display: 'flex',
  alignItems: 'center',
  color: slate400,
});

const GuestsTextWrap = styled('span')({
  flex: 1,
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
  const { getTotalItems, getTotalPrice } = useCart();
  const cartTotal = getTotalPrice();
  const [depositAmount, setDepositAmount] = useState(10.0);

  useEffect(() => {
    reservationsSettingsRetrieve()
      .then((d: { deposit_amount?: string | null }) => {
        if (d?.deposit_amount !== null && d?.deposit_amount !== undefined)
          setDepositAmount(parseFloat(d.deposit_amount));
      })
      .catch(() => undefined);
  }, []);

  const activeLocale = locale || ctxLocale;

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [guests, setGuests] = useState<number>(2);

  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(today.getDate() + 60);
    return d;
  }, [today]);

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

  function handleDaySelect(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    if (d < today || d > maxDate) return;
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
          <IconWrap>
            <CalendarIcon />
          </IconWrap>
          {selectedDate ? (
            <FieldText isPlaceholder={false}>
              {formatDateValue(selectedDate, activeLocale)}
            </FieldText>
          ) : (
            <FieldText isPlaceholder={true}>{t.reservationWidget.datePlaceholder}</FieldText>
          )}
        </FieldInput>

        <CalendarPicker
          show={showCalendar}
          selectedDate={selectedDate}
          today={today}
          maxDate={maxDate}
          viewYear={viewYear}
          viewMonth={viewMonth}
          onNavigate={navigateMonth}
          onSelectDay={handleDaySelect}
          monthYearLabel={monthYearLabel}
          dayNamesShort={dayNamesShort}
          containerRef={calendarRef}
        />
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

          <TimeDropdown
            show={showTimeDropdown}
            slots={DEFAULT_TIME_SLOTS}
            selected={selectedTime}
            onSelect={slot => {
              setSelectedTime(slot);
              setShowTimeDropdown(false);
            }}
            containerRef={timeRef}
          />
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
            <GuestsTextWrap>
              <FieldText isPlaceholder={false}>
                {guests} {t.booking.persons}
              </FieldText>
            </GuestsTextWrap>
            <IconWrap>
              <ChevronDownIcon color={slate400} size={16} />
            </IconWrap>
          </FieldInput>

          <GuestsDropdown
            show={showGuestsDropdown}
            options={guestOptions}
            selected={guests}
            onSelect={n => {
              setGuests(n);
              setShowGuestsDropdown(false);
            }}
            containerRef={guestsRef}
            personsLabel={t.booking.persons}
          />
        </GuestsFieldWrap>
      </TimeGuestsRow>

      {/* Price Summary */}
      <PriceSummarySection
        depositLabel={t.reservationWidget.deposit}
        totalLabel={t.reservationWidget.grandTotal}
        depositAmount={depositAmount}
        cartTotal={cartTotal}
      />

      {/* CTA Button */}
      <MainButton
        variant={getTotalItems() > 0 ? 'green_cta' : 'rose_cta'}
        fullWidth
        size='large'
        title={getTotalItems() > 0 ? t.reservationWidget.bookWithOrder : t.reservationWidget.book}
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
