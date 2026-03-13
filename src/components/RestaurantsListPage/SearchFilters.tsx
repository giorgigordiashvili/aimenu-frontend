'use client';

import { styled } from '@pigment-css/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import CalendarPicker from '@/components/ReservationWidget/CalendarPicker';
import {
  CheckMark,
  DropdownList,
  DropdownRow,
  DropdownRowText,
} from '@/components/ReservationWidget/DropdownShared';
import GuestsDropdown from '@/components/ReservationWidget/GuestsDropdown';
import TimeDropdown from '@/components/ReservationWidget/TimeDropdown';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import CalendarIcon from '@/icons/Calendar';
import ChevronDownIcon from '@/icons/ChevronDown';
import ClockIcon from '@/icons/Clock';
import LocationIcon from '@/icons/Location';
import PeopleIcon from '@/icons/People';
import SearchIcon from '@/icons/Search';
import ArrowRightIcon from '@/icons/ArrowRight';
import ScanIcon from '@/icons/Scan';
import {
  foreground,
  green500,
  muted,
  primary,
  slate200,
  slate400,
  white,
} from '@/tokens';

// ── Constants ─────────────────────────────────────────────────────────────────

const TIME_SLOTS = [
  '11:00', '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00',
];

const GUEST_OPTIONS = [1, 2, 3, 4, 5];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDateShort(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }).format(date);
}

// ── Styled ────────────────────────────────────────────────────────────────────

/** Desktop: horizontal pill  |  Mobile: 2-column grid card */
const FiltersCard = styled('div')({
  background: white,
  boxShadow: '0 4px 32px rgba(0,0,0,0.18)',

  // ── Desktop ──────────────────────────────────────────────────────────────
  borderRadius: '9999px',
  padding: '6px 6px 6px 0',
  display: 'flex',
  alignItems: 'center',
  width: '100%',

  // ── Mobile ───────────────────────────────────────────────────────────────
  '@media (max-width: 767px)': {
    borderRadius: '20px',
    padding: '0',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
});

// ─── Field wrappers ───────────────────────────────────────────────────────────

const fieldBase = {
  position: 'relative' as const,
  cursor: 'pointer',
  // desktop
  flex: 1,
  minWidth: 0,
  padding: '8px 20px',
};

/** City, Guests — full row on mobile */
const FieldWrapFull = styled('div')({
  ...fieldBase,
  '@media (max-width: 767px)': {
    gridColumn: '1 / -1',
    padding: '14px 16px',
  },
});

/** Date — left half on mobile, has right border */
const FieldWrapDate = styled('div')({
  ...fieldBase,
  '@media (max-width: 767px)': {
    gridColumn: '1 / 2',
    padding: '14px 16px',
    borderRight: `1px solid ${slate200}`,
  },
});

/** Time — right half on mobile */
const FieldWrapTime = styled('div')({
  ...fieldBase,
  '@media (max-width: 767px)': {
    gridColumn: '2 / 3',
    padding: '14px 16px',
  },
});

// ─── Field internals ──────────────────────────────────────────────────────────

const FieldLabel = styled('div')({
  fontSize: '11px',
  fontWeight: 700,
  color: muted,
  marginBottom: '3px',
  letterSpacing: '0.04em',
  userSelect: 'none',
  '@media (max-width: 767px)': {
    fontSize: '12px',
  },
});

const FieldInput = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  userSelect: 'none',
});

const FieldText = styled('span')<{ isPlaceholder?: boolean }>({
  fontSize: '15px',
  fontWeight: 600,
  flex: 1,
  lineHeight: '22px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  '@media (max-width: 767px)': {
    fontSize: '16px',
  },
  variants: [
    { props: { isPlaceholder: true }, style: { color: slate400, fontWeight: 400 } },
    { props: { isPlaceholder: false }, style: { color: foreground } },
  ],
});

const IconWrap = styled('span')({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  color: slate400,
});

// ─── Separators ───────────────────────────────────────────────────────────────

/** Vertical divider — desktop only, between fields in the pill */
const VerticalDivider = styled('div')({
  width: '1px',
  height: '36px',
  background: slate200,
  flexShrink: 0,
  '@media (max-width: 767px)': {
    display: 'none',
  },
});

/** Horizontal divider — mobile only, between rows */
const HorizontalDivider = styled('div')({
  display: 'none',
  '@media (max-width: 767px)': {
    display: 'block',
    gridColumn: '1 / -1',
    height: '1px',
    background: slate200,
  },
});

// ─── Buttons ──────────────────────────────────────────────────────────────────

/** Desktop: circle  |  Mobile: hidden (replaced by MobileSearchButton) */
const CircleSearchButton = styled('button')({
  width: '52px',
  height: '52px',
  borderRadius: '50%',
  background: primary,
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  flexShrink: 0,
  marginRight: '2px',
  transition: 'opacity 0.15s, transform 0.1s',
  '&:hover': { opacity: 0.9, transform: 'scale(1.05)' },
  '&:active': { transform: 'scale(0.97)' },
  '& svg': { color: white, stroke: white },
  '@media (max-width: 767px)': {
    display: 'none',
  },
});

/** Mobile: full-width red pill with text */
const MobileSearchButton = styled('button')({
  display: 'none',
  '@media (max-width: 767px)': {
    display: 'flex',
    gridColumn: '1 / -1',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    margin: '12px 12px 6px',
    padding: '15px 24px',
    background: primary,
    border: 'none',
    borderRadius: '9999px',
    color: white,
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    '&:hover': { opacity: 0.9 },
    '& svg': { color: white, stroke: white },
  },
});

/** Mobile-only green scan button placeholder */
const MobileScanButton = styled('button')({
  display: 'none',
  '@media (max-width: 767px)': {
    display: 'flex',
    gridColumn: '1 / -1',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '0 12px 12px',
    padding: '15px 20px',
    background: green500,
    border: 'none',
    borderRadius: '9999px',
    color: white,
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    '&:hover': { opacity: 0.9 },
  },
});

const ScanLeft = styled('span')({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
});



// ── Props ─────────────────────────────────────────────────────────────────────

export interface SearchFiltersValue {
  city?: string;
  date: Date | null;
  time: string;
  guests: number;
}

interface SearchFiltersProps {
  value: SearchFiltersValue;
  onChange: (next: SearchFiltersValue) => void;
  onSearch: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SearchFilters({ value, onChange, onSearch }: SearchFiltersProps) {
  const t = useTranslations();
  const { locale } = useLocale();

  const [showCity, setShowCity] = useState(false);
  const [showCal, setShowCal] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [showGuests, setShowGuests] = useState(false);

  const cityRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);

  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);
  const maxDate = useMemo(() => { const d = new Date(today); d.setDate(today.getDate()+60); return d; }, [today]);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const monthYearLabel = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' })
    .format(new Date(viewYear, viewMonth, 1));
  const dayNamesShort = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(2024, 0, 7+i))
  );

  function navigateMonth(dir: 1 | -1) {
    let m = viewMonth + dir, y = viewYear;
    if (m < 0) { m = 11; y -= 1; } if (m > 11) { m = 0; y += 1; }
    setViewMonth(m); setViewYear(y);
  }
  function handleDaySelect(day: number) {
    const d = new Date(viewYear, viewMonth, day); d.setHours(0,0,0,0);
    if (d < today || d > maxDate) return;
    onChange({ ...value, date: d }); setShowCal(false);
  }

  useEffect(() => {
    function onOut(e: MouseEvent) {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setShowCity(false);
      if (calRef.current && !calRef.current.contains(e.target as Node)) setShowCal(false);
      if (timeRef.current && !timeRef.current.contains(e.target as Node)) setShowTime(false);
      if (guestsRef.current && !guestsRef.current.contains(e.target as Node)) setShowGuests(false);
    }
    document.addEventListener('mousedown', onOut);
    return () => document.removeEventListener('mousedown', onOut);
  }, []);

  const cities = [
    { value: undefined, label: t.restaurantsList.allCities },
    { value: 'Tbilisi',  label: t.restaurantsList.cities.tbilisi },
    { value: 'Batumi',   label: t.restaurantsList.cities.batumi },
    { value: 'Rustavi',  label: t.restaurantsList.cities.rustavi },
    { value: 'Gori',     label: t.restaurantsList.cities.gori },
    { value: 'Kutaisi',  label: t.restaurantsList.cities.kutaisi },
  ];
  const selectedCityLabel = cities.find(c => c.value === value.city)?.label ?? t.restaurantsList.allCities;

  const toggle = (w: 'city'|'cal'|'time'|'guests') => {
    setShowCity(w==='city' ? s=>!s : false);
    setShowCal(w==='cal' ? s=>!s : false);
    setShowTime(w==='time' ? s=>!s : false);
    setShowGuests(w==='guests' ? s=>!s : false);
  };

  return (
    <FiltersCard>

      {/* ── City ── */}
      <FieldWrapFull ref={cityRef} onClick={() => toggle('city')}>
        <FieldLabel>{t.restaurantsList.cityFilter}</FieldLabel>
        <FieldInput>
          <IconWrap><LocationIcon color={slate400} size={16} /></IconWrap>
          <FieldText isPlaceholder={!value.city}>{selectedCityLabel}</FieldText>
          <IconWrap><ChevronDownIcon color={slate400} size={14} /></IconWrap>
        </FieldInput>
        {showCity && (
          <DropdownList>
            {cities.map((c, idx) => {
              const isSel = c.value === value.city;
              return (
                <DropdownRow key={c.label} isSelected={isSel} isLast={idx===cities.length-1}
                  onClick={e => { e.stopPropagation(); onChange({...value,city:c.value}); setShowCity(false); }}>
                  <DropdownRowText isSelected={isSel}>{c.label}</DropdownRowText>
                  {isSel && <CheckMark>✓</CheckMark>}
                </DropdownRow>
              );
            })}
          </DropdownList>
        )}
      </FieldWrapFull>

      <HorizontalDivider />
      <VerticalDivider />

      {/* ── Date ── */}
      <FieldWrapDate ref={calRef} onClick={() => toggle('cal')}>
        <FieldLabel>{t.restaurantsList.dateFilter}</FieldLabel>
        <FieldInput>
          <IconWrap><CalendarIcon /></IconWrap>
          <FieldText isPlaceholder={!value.date}>
            {value.date ? formatDateShort(value.date, locale) : t.reservationWidget.datePlaceholder}
          </FieldText>
          <IconWrap><ChevronDownIcon color={slate400} size={14} /></IconWrap>
        </FieldInput>
        <CalendarPicker
          show={showCal} selectedDate={value.date} today={today} maxDate={maxDate}
          viewYear={viewYear} viewMonth={viewMonth} onNavigate={navigateMonth}
          onSelectDay={handleDaySelect} monthYearLabel={monthYearLabel}
          dayNamesShort={dayNamesShort} containerRef={calRef}
        />
      </FieldWrapDate>

      <VerticalDivider />

      {/* ── Time ── */}
      <FieldWrapTime ref={timeRef} onClick={() => toggle('time')}>
        <FieldLabel>{t.restaurantsList.timeFilter}</FieldLabel>
        <FieldInput>
          <IconWrap><ClockIcon size={16} color={slate400} /></IconWrap>
          <FieldText isPlaceholder={!value.time}>
            {value.time || t.reservationWidget.timePlaceholder}
          </FieldText>
          <IconWrap><ChevronDownIcon color={slate400} size={14} /></IconWrap>
        </FieldInput>
        <TimeDropdown show={showTime} slots={TIME_SLOTS} selected={value.time}
          onSelect={s => { onChange({...value,time:s}); setShowTime(false); }}
          containerRef={timeRef}
        />
      </FieldWrapTime>

      <HorizontalDivider />
      <VerticalDivider />

      {/* ── Guests ── */}
      <FieldWrapFull ref={guestsRef} onClick={() => toggle('guests')}>
        <FieldLabel>{t.restaurantsList.guestsFilter}</FieldLabel>
        <FieldInput>
          <IconWrap><PeopleIcon /></IconWrap>
          <FieldText isPlaceholder={false}>{value.guests} {t.booking.persons}</FieldText>
          <IconWrap><ChevronDownIcon color={slate400} size={14} /></IconWrap>
        </FieldInput>
        <GuestsDropdown show={showGuests} options={GUEST_OPTIONS} selected={value.guests}
          onSelect={n => { onChange({...value,guests:n}); setShowGuests(false); }}
          containerRef={guestsRef} personsLabel={t.booking.persons}
        />
      </FieldWrapFull>

      {/* Desktop circle button */}
      <CircleSearchButton onClick={e => { e.stopPropagation(); onSearch(); }} aria-label='Search'>
        <SearchIcon />
      </CircleSearchButton>

      {/* Mobile full-width red pill "ძებნა" */}
      <MobileSearchButton onClick={e => { e.stopPropagation(); onSearch(); }}>
        <SearchIcon />
        {t.common.search}
      </MobileSearchButton>

      {/* Mobile green scan button — scan.tsx will be integrated here */}
      <MobileScanButton type='button'>
        <ScanLeft>
          <ScanIcon />
          დაასკანერე მენიუ
        </ScanLeft>
        <ArrowRightIcon />
      </MobileScanButton>

    </FiltersCard>
  );
}
