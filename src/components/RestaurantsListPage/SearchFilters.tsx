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
import {
  foreground,
  rose500,
  rose600,
  rose700,
  slate100,
  slate400,
  slate50,
  white,
} from '@/tokens';

// ── Constants ─────────────────────────────────────────────────────────────────

const TIME_SLOTS = [
  '11:00',
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
const GUEST_OPTIONS = [1, 2, 3, 4, 5];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDateShort(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }).format(date);
}

// ── Styled ────────────────────────────────────────────────────────────────────

/** Outer pill container */
const FilterBar = styled('div')({
  background: white,
  padding: 8,
  borderRadius: 32,
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  width: '100%',
  border: `1px solid ${slate100}`,
  display: 'flex',
  alignItems: 'center',
});

/** Row containing all fields + search button */
const FieldsRow = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  alignItems: 'center',
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    gap: 8,
  },
});

/**
 * Wraps the date and time fields so they appear side-by-side on mobile.
 * On desktop `display: contents` makes this wrapper invisible to flex layout,
 * so the fields flow normally in FieldsRow.
 */
const DateTimeRow = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  '@media (min-width: 769px)': {
    display: 'contents',
  },
  '& > div': {
    '@media (max-width: 768px)': {
      flex: 1,
      width: 'auto',
      borderRight: `1px solid ${slate100}`,
      borderBottom: `1px solid ${slate100}`,
    },
  },
  '& > div:last-child': {
    '@media (max-width: 768px)': {
      borderRight: 'none',
    },
  },
});

/** First field — extra left rounding */
const FilterFieldFirst = styled('div')({
  flex: 1,
  minWidth: 0,
  paddingLeft: 24,
  paddingRight: 24,
  paddingTop: 8,
  paddingBottom: 8,
  borderTopLeftRadius: 24,
  borderBottomLeftRadius: 24,
  borderTopRightRadius: 12,
  borderBottomRightRadius: 12,
  cursor: 'pointer',
  position: 'relative',
  transition: 'background 0.15s',
  borderRight: `1px solid ${slate100}`,
  '&:hover': { background: slate50 },
  '&:hover label': { color: rose500 },
  '&:hover svg': { color: rose500 },
  '&:hover .field-text': { color: rose500 },
  '@media (max-width: 768px)': {
    borderRight: 'none',
    borderBottom: `1px solid ${slate100}`,
    borderRadius: 12,
    width: '100%',
  },
});

/** Middle fields */
const FilterField = styled('div')({
  flex: 1,
  minWidth: 0,
  paddingLeft: 24,
  paddingRight: 24,
  paddingTop: 8,
  paddingBottom: 8,
  borderRadius: 12,
  cursor: 'pointer',
  position: 'relative',
  transition: 'background 0.15s',
  borderRight: `1px solid ${slate100}`,
  '&:hover': { background: slate50 },
  '&:hover label': { color: rose500 },
  '&:hover svg': { color: rose500 },
  '&:hover .field-text': { color: rose500 },
  '@media (max-width: 768px)': {
    borderRight: 'none',
    borderBottom: `1px solid ${slate100}`,
    width: '100%',
  },
});

/** Last field — no right border on desktop */
const FilterFieldLast = styled('div')({
  flex: 1,
  minWidth: 0,
  paddingLeft: 24,
  paddingRight: 24,
  paddingTop: 8,
  paddingBottom: 8,
  borderRadius: 12,
  cursor: 'pointer',
  position: 'relative',
  transition: 'background 0.15s',
  '&:hover': { background: slate50 },
  '&:hover label': { color: rose500 },
  '&:hover svg': { color: rose500 },
  '&:hover .field-text': { color: rose500 },
  '@media (max-width: 768px)': {
    borderBottom: `1px solid ${slate100}`,
    width: '100%',
  },
});

// ── Field internals ───────────────────────────────────────────────────────────

const FieldInner = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  gap: 8,
  userSelect: 'none',
  cursor: 'pointer',
});

const FieldLeft = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
});

/** Label above value — using <label> so '&:hover label' selector works */
const FieldLabel = styled('label')({
  fontSize: 10,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: slate400,
  marginBottom: 4,
  display: 'block',
  transition: 'color 0.15s',
  userSelect: 'none',
  cursor: 'pointer',
  alignSelf: 'baseline',
});

/** Icon + value text row */
const FieldInput = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const FieldText = styled('span')<{ isPlaceholder?: boolean }>({
  fontSize: 15,
  fontWeight: 600,
  lineHeight: '22px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  transition: 'color 0.15s',
  '@media (max-width: 768px)': { fontSize: 16 },
  variants: [
    { props: { isPlaceholder: true }, style: { color: slate400, fontWeight: 400 } },
    { props: { isPlaceholder: false }, style: { color: foreground } },
  ],
});

/** Leading icon wrap (16×16) */
const IconWrap = styled('span')({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  color: slate400,
  marginRight: 8,
  transition: 'color 0.15s',
  '& svg': { width: 16, height: 16 },
});

/** Trailing chevron wrap */
const ChevronWrap = styled('span')({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  color: slate400,
  transition: 'color 0.15s',
});

// ── Search button ─────────────────────────────────────────────────────────────

/** Circle on desktop, full-width pill on mobile */
const SearchButton = styled('button')({
  borderRadius: 24,
  background: rose600,
  padding: '16px 12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  cursor: 'pointer',
  flexShrink: 0,
  boxShadow: '0 4px 14px rgba(236, 0, 63, 0.4)',
  transition: 'background 0.15s, transform 0.1s',
  '& svg': { color: white, width: 20, height: 20 },
  '&:hover': { background: rose700 },
  '&:active': { transform: 'scale(0.95)' },
  '@media (max-width: 768px)': {
    borderRadius: '9999px',
    width: '100%',
  },
});

const SearchButtonText = styled('span')({
  display: 'none',
  color: white,
  fontSize: 16,
  fontWeight: 700,
  marginLeft: 8,
  '@media (max-width: 768px)': {
    display: 'inline',
  },
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

  const monthYearLabel = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
    new Date(viewYear, viewMonth, 1)
  );
  const dayNamesShort = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(2024, 0, 7 + i))
  );

  function navigateMonth(dir: 1 | -1) {
    let m = viewMonth + dir,
      y = viewYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    }
    if (m > 11) {
      m = 0;
      y += 1;
    }
    setViewMonth(m);
    setViewYear(y);
  }
  function handleDaySelect(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    if (d < today || d > maxDate) return;
    onChange({ ...value, date: d });
    setShowCal(false);
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
    { value: 'Tbilisi', label: t.restaurantsList.cities.tbilisi },
    { value: 'Batumi', label: t.restaurantsList.cities.batumi },
    { value: 'Rustavi', label: t.restaurantsList.cities.rustavi },
    { value: 'Gori', label: t.restaurantsList.cities.gori },
    { value: 'Kutaisi', label: t.restaurantsList.cities.kutaisi },
  ];
  const selectedCityLabel =
    cities.find(c => c.value === value.city)?.label ?? t.restaurantsList.allCities;

  const toggle = (w: 'city' | 'cal' | 'time' | 'guests') => {
    setShowCity(w === 'city' ? s => !s : false);
    setShowCal(w === 'cal' ? s => !s : false);
    setShowTime(w === 'time' ? s => !s : false);
    setShowGuests(w === 'guests' ? s => !s : false);
  };

  return (
    <FilterBar>
      <FieldsRow>
        {/* City — first field, extra left rounding */}
        <FilterFieldFirst ref={cityRef} onClick={() => toggle('city')}>
          <FieldInner>
            <FieldLeft>
              <FieldLabel>{t.restaurantsList.cityFilter}</FieldLabel>
              <FieldInput>
                <IconWrap>
                  <LocationIcon size={16} />
                </IconWrap>
                <FieldText className='field-text' isPlaceholder={!value.city}>
                  {selectedCityLabel}
                </FieldText>
              </FieldInput>
            </FieldLeft>
            <ChevronWrap>
              <ChevronDownIcon color={slate400} size={14} />
            </ChevronWrap>
          </FieldInner>
          {showCity && (
            <DropdownList>
              {cities.map((c, idx) => {
                const isSel = c.value === value.city;
                return (
                  <DropdownRow
                    key={c.label}
                    isSelected={isSel}
                    isLast={idx === cities.length - 1}
                    onClick={e => {
                      e.stopPropagation();
                      onChange({ ...value, city: c.value });
                      setShowCity(false);
                    }}
                  >
                    <DropdownRowText isSelected={isSel}>{c.label}</DropdownRowText>
                    {isSel && <CheckMark>✓</CheckMark>}
                  </DropdownRow>
                );
              })}
            </DropdownList>
          )}
        </FilterFieldFirst>

        {/* Date + Time side-by-side on mobile */}
        <DateTimeRow>
          {/* Date */}
          <FilterField ref={calRef} onClick={() => toggle('cal')}>
            <FieldInner>
              <FieldLeft>
                <FieldLabel>{t.restaurantsList.dateFilter}</FieldLabel>
                <FieldInput>
                  <IconWrap>
                    <CalendarIcon />
                  </IconWrap>
                  <FieldText className='field-text' isPlaceholder={!value.date}>
                    {value.date
                      ? formatDateShort(value.date, locale)
                      : t.reservationWidget.datePlaceholder}
                  </FieldText>
                </FieldInput>
              </FieldLeft>
              <ChevronWrap>
                <ChevronDownIcon color={slate400} size={14} />
              </ChevronWrap>
            </FieldInner>
            <CalendarPicker
              show={showCal}
              selectedDate={value.date}
              today={today}
              maxDate={maxDate}
              viewYear={viewYear}
              viewMonth={viewMonth}
              onNavigate={navigateMonth}
              onSelectDay={handleDaySelect}
              monthYearLabel={monthYearLabel}
              dayNamesShort={dayNamesShort}
              containerRef={calRef}
            />
          </FilterField>

          {/* Time */}
          <FilterField ref={timeRef} onClick={() => toggle('time')}>
            <FieldInner>
              <FieldLeft>
                <FieldLabel>{t.restaurantsList.timeFilter}</FieldLabel>
                <FieldInput>
                  <IconWrap>
                    <ClockIcon size={16} />
                  </IconWrap>
                  <FieldText className='field-text' isPlaceholder={!value.time}>
                    {value.time || t.reservationWidget.timePlaceholder}
                  </FieldText>
                </FieldInput>
              </FieldLeft>
              <ChevronWrap>
                <ChevronDownIcon color={slate400} size={14} />
              </ChevronWrap>
            </FieldInner>
            <TimeDropdown
              show={showTime}
              slots={TIME_SLOTS}
              selected={value.time}
              onSelect={s => {
                onChange({ ...value, time: s });
                setShowTime(false);
              }}
              containerRef={timeRef}
            />
          </FilterField>
        </DateTimeRow>

        {/* Guests — last field, no right border */}
        <FilterFieldLast ref={guestsRef} onClick={() => toggle('guests')}>
          <FieldInner>
            <FieldLeft>
              <FieldLabel>{t.restaurantsList.guestsFilter}</FieldLabel>
              <FieldInput>
                <IconWrap>
                  <PeopleIcon />
                </IconWrap>
                <FieldText className='field-text' isPlaceholder={false}>
                  {value.guests} {t.booking.persons}
                </FieldText>
              </FieldInput>
            </FieldLeft>
            <ChevronWrap>
              <ChevronDownIcon color={slate400} size={14} />
            </ChevronWrap>
          </FieldInner>
          <GuestsDropdown
            show={showGuests}
            options={GUEST_OPTIONS}
            selected={value.guests}
            onSelect={n => {
              onChange({ ...value, guests: n });
              setShowGuests(false);
            }}
            containerRef={guestsRef}
            personsLabel={t.booking.persons}
          />
        </FilterFieldLast>

        {/* Search button — circle on desktop, full-width pill on mobile */}
        <SearchButton
          onClick={e => {
            e.stopPropagation();
            onSearch();
          }}
          aria-label={t.common.search}
        >
          <SearchIcon />
          <SearchButtonText>{t.common.search}</SearchButtonText>
        </SearchButton>
      </FieldsRow>
    </FilterBar>
  );
}
