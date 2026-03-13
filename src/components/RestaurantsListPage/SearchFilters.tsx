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
import ArrowRightIcon from '@/icons/ArrowRight';
import CalendarIcon from '@/icons/Calendar';
import ChevronDownIcon from '@/icons/ChevronDown';
import ClockIcon from '@/icons/Clock';
import LocationIcon from '@/icons/Location';
import PeopleIcon from '@/icons/People';
import ScanIcon from '@/icons/Scan';
import SearchIcon from '@/icons/Search';
import { foreground, green500, muted, primary, slate200, slate400, white } from '@/tokens';

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
  // Desktop
  borderRadius: '9999px',
  padding: '6px 6px 6px 0',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  // Mobile
  '@media (max-width: 767px)': {
    borderRadius: '20px',
    padding: '0',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
});

// ─── Field wrappers ───────────────────────────────────────────────────────────
// IMPORTANT: gridColumn must live in base styles (not only in @media blocks)
// so Pigment CSS always emits the property in the CSS output.

const FieldWrapFull = styled('div')({
  // grid placement — ignored by flex parent on desktop, used by grid on mobile
  gridColumn: '1 / -1',
  // shared
  position: 'relative',
  cursor: 'pointer',
  flex: 1,
  minWidth: 0,
  padding: '8px 20px',
  '@media (max-width: 767px)': {
    padding: '14px 16px',
  },
});

const FieldWrapDate = styled('div')({
  gridColumn: '1 / 2',
  position: 'relative',
  cursor: 'pointer',
  flex: 1,
  minWidth: 0,
  padding: '8px 20px',
  '@media (max-width: 767px)': {
    padding: '14px 16px',
    borderRight: `1px solid ${slate200}`,
  },
});

const FieldWrapTime = styled('div')({
  gridColumn: '2 / 3',
  position: 'relative',
  cursor: 'pointer',
  flex: 1,
  minWidth: 0,
  padding: '8px 20px',
  '@media (max-width: 767px)': {
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
  '@media (max-width: 767px)': { fontSize: '16px' },
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

const VerticalDivider = styled('div')({
  width: '1px',
  height: '36px',
  background: slate200,
  flexShrink: 0,
  '@media (max-width: 767px)': { display: 'none' },
});

/** gridColumn in base so Pigment CSS always emits it */
const HorizontalDivider = styled('div')({
  gridColumn: '1 / -1',
  display: 'none',
  '@media (max-width: 767px)': {
    display: 'block',
    height: '1px',
    background: slate200,
  },
});

// ─── Desktop circle search button ─────────────────────────────────────────────

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
  '& svg': { color: white, stroke: white },
  '@media (max-width: 767px)': { display: 'none' },
});

// ─── Mobile buttons wrapper ───────────────────────────────────────────────────
// gridColumn in base so Pigment CSS always includes it in the stylesheet.
// On desktop (flex parent) gridColumn is ignored.
// On mobile (grid parent) it spans both columns.

const MobileButtonsWrap = styled('div')({
  gridColumn: '1 / -1',
  display: 'none',
  '@media (max-width: 767px)': {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '4px 12px 12px',
  },
});

const MobileSearchBtn = styled('button')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  width: '100%',
  padding: '15px 24px',
  background: primary,
  border: 'none',
  borderRadius: '9999px',
  color: white,
  fontSize: '16px',
  fontWeight: 700,
  cursor: 'pointer',
  '& svg': { color: white, stroke: white },
});

const MobileScanBtn = styled('button')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '15px 20px',
  background: green500,
  border: 'none',
  borderRadius: '9999px',
  color: white,
  fontSize: '16px',
  fontWeight: 700,
  cursor: 'pointer',
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
  const maxDate = useMemo(() => {
    const d = new Date(today); d.setDate(today.getDate()+60); return d;
  }, [today]);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const monthYearLabel = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' })
    .format(new Date(viewYear, viewMonth, 1));
  const dayNamesShort = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(2024, 0, 7+i))
  );

  function navigateMonth(dir: 1 | -1) {
    let m = viewMonth+dir, y = viewYear;
    if (m<0){m=11;y-=1;} if (m>11){m=0;y+=1;}
    setViewMonth(m); setViewYear(y);
  }
  function handleDaySelect(day: number) {
    const d = new Date(viewYear, viewMonth, day); d.setHours(0,0,0,0);
    if (d<today||d>maxDate) return;
    onChange({...value,date:d}); setShowCal(false);
  }

  useEffect(() => {
    function onOut(e: MouseEvent) {
      if (cityRef.current&&!cityRef.current.contains(e.target as Node)) setShowCity(false);
      if (calRef.current&&!calRef.current.contains(e.target as Node)) setShowCal(false);
      if (timeRef.current&&!timeRef.current.contains(e.target as Node)) setShowTime(false);
      if (guestsRef.current&&!guestsRef.current.contains(e.target as Node)) setShowGuests(false);
    }
    document.addEventListener('mousedown', onOut);
    return () => document.removeEventListener('mousedown', onOut);
  }, []);

  const cities = [
    { value: undefined,    label: t.restaurantsList.allCities },
    { value: 'Tbilisi',   label: t.restaurantsList.cities.tbilisi },
    { value: 'Batumi',    label: t.restaurantsList.cities.batumi },
    { value: 'Rustavi',   label: t.restaurantsList.cities.rustavi },
    { value: 'Gori',      label: t.restaurantsList.cities.gori },
    { value: 'Kutaisi',   label: t.restaurantsList.cities.kutaisi },
  ];
  const selectedCityLabel = cities.find(c=>c.value===value.city)?.label ?? t.restaurantsList.allCities;

  const toggle = (w: 'city'|'cal'|'time'|'guests') => {
    setShowCity(w==='city'?s=>!s:false);
    setShowCal(w==='cal'?s=>!s:false);
    setShowTime(w==='time'?s=>!s:false);
    setShowGuests(w==='guests'?s=>!s:false);
  };

  return (
    <FiltersCard>

      {/* City — full width on mobile */}
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
              const isSel = c.value===value.city;
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

      {/* Date — left half on mobile */}
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

      {/* Time — right half on mobile */}
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

      {/* Guests — full width on mobile */}
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

      {/* Desktop circle search button */}
      <CircleSearchButton onClick={e => { e.stopPropagation(); onSearch(); }} aria-label='Search'>
        <SearchIcon />
      </CircleSearchButton>

      {/* Mobile buttons — MobileButtonsWrap spans both columns via gridColumn in base styles */}
      <MobileButtonsWrap>
        <MobileSearchBtn onClick={e => { e.stopPropagation(); onSearch(); }}>
          <SearchIcon />
          {t.common.search}
        </MobileSearchBtn>
        <MobileScanBtn type='button'>
          <ScanLeft>
            <ScanIcon />
            დაასკანერე მენიუ
          </ScanLeft>
          <ArrowRightIcon />
        </MobileScanBtn>
      </MobileButtonsWrap>

    </FiltersCard>
  );
}
