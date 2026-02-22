'use client';

import { styled } from '@pigment-css/react';
import { useEffect, useState } from 'react';

import axiosInstance from '@/api/axios';
import BookingContactForm from '@/components/BookingContactForm/BookingContactForm';
import BookingDateTimeSection from '@/components/BookingDateTimeSection/BookingDateTimeSection';
import BookingOrderSummary from '@/components/BookingOrderSummary/BookingOrderSummary';
import type { OrderItem } from '@/components/BookingOrderSummary/BookingOrderSummary';
import BookingRestaurantCard from '@/components/BookingRestaurantCard/BookingRestaurantCard';
import MainButton from '@/components/MainButton/MainButton';
import { useTranslations } from '@/context/LocaleContext';
import ArrowIcon from '@/icons/Arrow';
import CloseIcon from '@/icons/Close';
import { background, border, foreground, slate100, slate600, white } from '@/tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

type BookingFormProps = {
  slug?: string;
  onClose?: () => void;
  restaurantName?: string;
  restaurantSubtitle?: string;
  restaurantRating?: number;
  restaurantImage?: string;
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_ORDER_ITEMS: OrderItem[] = [
  { id: '1', quantity: 3, name: 'სალათი ცეზარი', price: 54.0 },
  {
    id: '2',
    quantity: 3,
    name: 'სალათი ცეზარი',
    price: 54.0,
    notes: ['დიდი მენიუ, ქვარცხის გარეშე', 'დიდი მენიუ', 'პატარა მენიუ'],
  },
  { id: '3', quantity: 3, name: 'სუპი ხარჩო', price: 12.0 },
];

const DEPOSIT_AMOUNT = 10.0;

const DEFAULT_MAX_ADVANCE_DAYS = 60;
const DEFAULT_MIN_GUESTS = 1;
const DEFAULT_MAX_GUESTS = 20;

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

// ─── Inline icons ─────────────────────────────────────────────────────────────

function ArrowRightIcon() {
  return (
    <span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}>
      <ArrowIcon color='#ffffff' size={16} />
    </span>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

const Wrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: background,
  minHeight: '100vh',
  fontFamily: 'Inter, sans-serif',
  '@media (min-width: 768px)': {
    alignItems: 'center',
    background: `linear-gradient(to right, ${background} 40%, ${white} 40%)`,
  },
});

const PageShell = styled('div')({
  display: 'contents',
  '@media (min-width: 768px)': {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '1120px',
    minHeight: '100vh',
  },
});

const PageHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px 20px',
  backgroundColor: white,
  borderBottom: `1px solid ${border}`,
  position: 'relative',
  flexShrink: 0,
  '@media (min-width: 768px)': {
    display: 'none',
  },
});

const DesktopCloseRow = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: '24px',
});

const HeaderTitle = styled('h1')({
  fontSize: '16px',
  fontWeight: 600,
  color: foreground,
  margin: 0,
  letterSpacing: '-0.15px',
  lineHeight: '24px',
});

const CloseButton = styled('button')({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: slate600,
  fontSize: '18px',
  lineHeight: 1,
  borderRadius: '6px',
  '&:hover': {
    backgroundColor: slate100,
  },
});

const MobileCloseButton = styled(CloseButton)({
  position: 'absolute',
  left: '16px',
  top: '50%',
  transform: 'translateY(-50%)',
});

const ContentArea = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  '@media (min-width: 768px)': {
    display: 'grid',
    gridTemplateColumns: '40% 60%',
    alignItems: 'start',
    minHeight: '100vh',
  },
});

const LeftColumn = styled('div')({
  paddingBottom: '100px',
  '@media (min-width: 768px)': {
    paddingBottom: '40px',
    backgroundColor: background,
    minHeight: '100vh',
  },
});

const RightColumn = styled('div')({
  display: 'none',
  '@media (min-width: 768px)': {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: white,
    padding: '32px',
    position: 'sticky',
    top: 0,
    minHeight: '100vh',
    alignSelf: 'start',
  },
});

const Divider = styled('hr')({
  border: 'none',
  borderTop: `1px solid ${border}`,
  margin: '0 20px',
  '@media (min-width: 768px)': {
    margin: '0 24px',
  },
});

const Section = styled('div')({
  padding: '20px',
  backgroundColor: background,
  '@media (min-width: 768px)': {
    padding: '24px',
  },
});

const MobileContactSection = styled('div')({
  '@media (min-width: 768px)': {
    display: 'none',
  },
});

const MobileFooter = styled('div')({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '12px 20px 20px',
  backgroundColor: white,
  borderTop: `1px solid ${border}`,
  zIndex: 100,
  '@media (min-width: 768px)': {
    display: 'none',
  },
});

// ─── Main component ───────────────────────────────────────────────────────────

export default function BookingForm({
  slug,
  onClose,
  restaurantName,
  restaurantSubtitle,
  restaurantRating,
  restaurantImage,
}: BookingFormProps) {
  const t = useTranslations();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>(DEFAULT_TIME_SLOTS);
  const [maxAdvanceDays, setMaxAdvanceDays] = useState(DEFAULT_MAX_ADVANCE_DAYS);
  const [minGuests, setMinGuests] = useState(DEFAULT_MIN_GUESTS);
  const [maxGuests, setMaxGuests] = useState(DEFAULT_MAX_GUESTS);

  // Fetch reservation settings (advance booking window, guest bounds)
  useEffect(() => {
    if (!slug) return;
    axiosInstance
      .get(`/api/v1/restaurants/${slug}/reservation-settings/`)
      .then(res => {
        const d = res.data;
        if (d?.advance_booking_days !== null && d?.advance_booking_days !== undefined)
          setMaxAdvanceDays(d.advance_booking_days);
        if (d?.min_party_size !== null && d?.min_party_size !== undefined)
          setMinGuests(d.min_party_size);
        if (d?.max_party_size !== null && d?.max_party_size !== undefined)
          setMaxGuests(d.max_party_size);
      })
      .catch(() => {
        // endpoint not available — keep defaults
      });
  }, [slug]);

  // Fetch available time slots when date changes
  useEffect(() => {
    if (!selectedDate || !slug) return;

    const dateStr = selectedDate.toISOString().split('T')[0];

    axiosInstance
      .get('/api/v1/reservations/availability/', {
        params: { restaurant_slug: slug, date: dateStr },
      })
      .then(res => {
        const data = res.data;
        // Try to extract slots from various possible response shapes
        const slots: string[] = Array.isArray(data)
          ? data.filter((s: unknown) => typeof s === 'string')
          : Array.isArray(data?.available_slots)
            ? data.available_slots
            : Array.isArray(data?.slots)
              ? data.slots
              : [];
        setAvailableTimeSlots(slots.length > 0 ? slots : DEFAULT_TIME_SLOTS);
      })
      .catch(() => {
        setAvailableTimeSlots(DEFAULT_TIME_SLOTS);
      });
  }, [selectedDate, slug]);

  function handleSubmit() {
    // UI only — no API call
  }

  return (
    <Wrapper>
      <PageShell>
        {/* ── Header ────────────────────────────────────────────────────────── */}
        <PageHeader>
          <MobileCloseButton type='button' onClick={onClose} aria-label={t.booking.close}>
            <CloseIcon />
          </MobileCloseButton>
          <HeaderTitle>{t.booking.title}</HeaderTitle>
        </PageHeader>

        <ContentArea>
          {/* ── Left column ──────────────────────────────────────────────────── */}
          <LeftColumn>
            <BookingRestaurantCard
              name={restaurantName}
              subtitle={restaurantSubtitle}
              rating={restaurantRating}
              image={restaurantImage}
            />
            <Divider />
            <BookingDateTimeSection
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              time={time}
              onTimeChange={setTime}
              guests={guests}
              onGuestsChange={setGuests}
              availableTimeSlots={availableTimeSlots}
              maxAdvanceDays={maxAdvanceDays}
              minGuests={minGuests}
              maxGuests={maxGuests}
            />
            <BookingOrderSummary items={MOCK_ORDER_ITEMS} depositAmount={DEPOSIT_AMOUNT} />

            {/* Contact form — mobile only (right column shows it on desktop) */}
            <MobileContactSection>
              <Section>
                <BookingContactForm
                  name={name}
                  phone={phone}
                  email={email}
                  notes={notes}
                  onName={setName}
                  onPhone={setPhone}
                  onEmail={setEmail}
                  onNotes={setNotes}
                />
              </Section>
            </MobileContactSection>
          </LeftColumn>

          {/* ── Right column — desktop only ───────────────────────────────────── */}
          <RightColumn>
            <DesktopCloseRow>
              <CloseButton type='button' onClick={onClose} aria-label={t.booking.close}>
                <CloseIcon />
              </CloseButton>
            </DesktopCloseRow>
            <BookingContactForm
              name={name}
              phone={phone}
              email={email}
              notes={notes}
              onName={setName}
              onPhone={setPhone}
              onEmail={setEmail}
              onNotes={setNotes}
              showSubmitButton
              onSubmit={handleSubmit}
            />
          </RightColumn>
        </ContentArea>

        {/* ── Mobile sticky footer (hidden on desktop) ──────────────────────── */}
        <MobileFooter>
          <MainButton
            variant='green_cta'
            title={t.booking.continue}
            icon={ArrowRightIcon}
            iconGap={12}
            iconPosition='right'
            size='large'
            fullWidth
            type='button'
            onClick={handleSubmit}
          />
        </MobileFooter>
      </PageShell>
    </Wrapper>
  );
}
