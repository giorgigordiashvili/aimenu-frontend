'use client';

import { styled } from '@pigment-css/react';
import { isAxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import axiosInstance from '@/api/axios';
import BookingContactForm from '@/components/BookingContactForm/BookingContactForm';
import BookingDateTimeSection from '@/components/BookingDateTimeSection/BookingDateTimeSection';
import BookingFailPanel from '@/components/BookingFailPanel/BookingFailPanel';
import BookingOrderSummary from '@/components/BookingOrderSummary/BookingOrderSummary';
import type { OrderItem } from '@/components/BookingOrderSummary/BookingOrderSummary';
import BookingPaymentForm from '@/components/BookingPaymentForm/BookingPaymentForm';
import BookingRestaurantCard from '@/components/BookingRestaurantCard/BookingRestaurantCard';
import BookingRightPanel from '@/components/BookingRightPanel/BookingRightPanel';
import BookingSuccessPanel from '@/components/BookingSuccessPanel/BookingSuccessPanel';
import MainButton from '@/components/MainButton/MainButton';
import { useLocale, useTranslations } from '@/context/LocaleContext';
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
// TODO: replace with cart/order data from API

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

const DEFAULT_DEPOSIT_AMOUNT = 10.0;
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

const HeaderTitle = styled('h1')({
  fontSize: '16px',
  fontWeight: 600,
  color: foreground,
  margin: 0,
  letterSpacing: '-0.15px',
  lineHeight: '24px',
});

const MobileCloseButton = styled('button')({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: slate600,
  borderRadius: '6px',
  position: 'absolute',
  left: '16px',
  top: '50%',
  transform: 'translateY(-50%)',
  '&:hover': {
    backgroundColor: slate100,
  },
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

// Mobile payment overlay — covers entire screen on mobile when step = 'payment'
const MobilePaymentOverlay = styled('div')({
  display: 'none',
  '&[data-active="true"]': {
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: white,
    zIndex: 200,
    overflowY: 'auto',
  },
  '@media (min-width: 768px)': {
    display: 'none !important',
  },
});

const OverlayHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px 20px',
  backgroundColor: white,
  borderBottom: `1px solid ${border}`,
  position: 'sticky',
  top: 0,
  zIndex: 10,
  flexShrink: 0,
});

const OverlayBackButton = styled('button')({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  left: '16px',
  borderRadius: '6px',
  '&:hover': {
    backgroundColor: slate100,
  },
});

const OverlayContent = styled('div')({
  flex: 1,
  padding: '20px',
  paddingBottom: '20px',
});

const OverlayFooter = styled('div')({
  padding: '12px 20px 20px',
  backgroundColor: white,
  borderTop: `1px solid ${border}`,
  flexShrink: 0,
  position: 'sticky',
  bottom: 0,
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
  const { locale } = useLocale();
  const router = useRouter();

  // internalStep captures user-driven navigation (contact ↔ payment).
  // The rendered step is derived below so success/fail never need to be set manually.
  const [internalStep, setInternalStep] = useState<'contact' | 'payment' | 'success' | 'fail'>(
    'contact'
  );
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [isCardFormValid, setIsCardFormValid] = useState(false);

  // Derived step: API outcomes take priority over local navigation state, which
  // prevents the three competing useEffects that previously caused flickering on retry.
  const step = reservationId
    ? 'success'
    : paymentError
      ? 'fail'
      : isPaymentLoading
        ? 'payment'
        : internalStep;

  // Callback passed to BookingPaymentForm so the mobile pay button can be gated
  // on card-form validity without lifting all card field state to this component.
  const handleCardValidChange = useCallback((valid: boolean) => {
    setIsCardFormValid(valid);
  }, []);

  // Passed to BookingRightPanel for user-initiated step transitions.
  // Clearing paymentError when advancing to payment lets the panel escape the
  // derived 'fail' state (e.g. after a failed payment the user retries).
  const handleStepChange = useCallback((s: 'contact' | 'payment') => {
    setInternalStep(s);
    if (s === 'payment') setPaymentError(null);
  }, []);

  // DEV-only: pre-set a visual state via ?state=success|fail in the URL so you can
  // inspect the success/fail UI without making real API calls.
  // NOTE: This guard relies on NODE_ENV==='production' being set correctly in your
  // staging environment. If staging uses a different NODE_ENV value, adjust accordingly.
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    const testState = new URLSearchParams(window.location.search).get('state') as
      | 'success'
      | 'fail'
      | null;
    // Setting reservationId / paymentError is enough — step is derived from them.
    if (testState === 'success') {
      setReservationId('MG-2271-TEST');
    } else if (testState === 'fail') {
      setPaymentError('test-error');
    }
  }, []);

  const searchParams = useSearchParams();

  const initialDate = useMemo(() => {
    const d = searchParams.get('date');
    if (!d) return null;
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? null : parsed;
  }, [searchParams]);

  const initialTime = useMemo(() => searchParams.get('time') ?? '', [searchParams]);
  const initialGuests = useMemo(() => {
    const g = searchParams.get('guests');
    const n = g ? parseInt(g, 10) : NaN;
    return isNaN(n) ? 2 : n;
  }, [searchParams]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
  const [time, setTime] = useState(initialTime);
  const [guests, setGuests] = useState(initialGuests);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>(DEFAULT_TIME_SLOTS);
  const [maxAdvanceDays, setMaxAdvanceDays] = useState(DEFAULT_MAX_ADVANCE_DAYS);
  const [minGuests, setMinGuests] = useState(DEFAULT_MIN_GUESTS);
  const [maxGuests, setMaxGuests] = useState(DEFAULT_MAX_GUESTS);
  const [depositAmount, setDepositAmount] = useState(DEFAULT_DEPOSIT_AMOUNT);

  // Fetch reservation settings
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
        if (d?.deposit_amount !== null && d?.deposit_amount !== undefined)
          setDepositAmount(parseFloat(d.deposit_amount));
      })
      .catch(() => {});
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

  async function handlePay() {
    if (!selectedDate || !time || !name || !phone) return;

    setIsPaymentLoading(true);
    setPaymentError(null);

    try {
      const result = await axiosInstance.post<{ id?: string }>('/api/v1/reservations/create/', {
        guest_name: name,
        guest_phone: phone,
        guest_email: email || undefined,
        reservation_date: selectedDate.toISOString().split('T')[0],
        reservation_time: time,
        party_size: guests,
        special_requests: notes || undefined,
        ...(slug ? { restaurant_slug: slug } : {}),
      });

      const id = result.data.id ?? null;
      setReservationId(id); // step derives to 'success'
    } catch (err: unknown) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[BookingForm] handlePay error:', err);
      }
      const msg = isAxiosError(err)
        ? ((err.response?.data as { detail?: string } | undefined)?.detail ?? null)
        : null;
      setPaymentError(msg ?? t.common.error); // step derives to 'fail'
    } finally {
      setIsPaymentLoading(false);
    }
  }

  return (
    <Wrapper>
      <PageShell>
        {/* ── Mobile header ──────────────────────────────────────────────── */}
        <PageHeader>
          <MobileCloseButton type='button' onClick={onClose} aria-label={t.booking.close}>
            <CloseIcon />
          </MobileCloseButton>
          <HeaderTitle>{t.booking.title}</HeaderTitle>
        </PageHeader>

        <ContentArea>
          {/* ── Left column ──────────────────────────────────────────────── */}
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
            <BookingOrderSummary items={MOCK_ORDER_ITEMS} depositAmount={depositAmount} />

            {/* Contact form — mobile only */}
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

          {/* ── Right panel — desktop only, self-contained ───────────────── */}
          <BookingRightPanel
            depositAmount={depositAmount}
            name={name}
            phone={phone}
            email={email}
            notes={notes}
            onName={setName}
            onPhone={setPhone}
            onEmail={setEmail}
            onNotes={setNotes}
            isPaymentLoading={isPaymentLoading}
            paymentError={paymentError}
            reservationId={reservationId}
            onClose={onClose}
            onPay={handlePay}
            step={step}
            onStepChange={handleStepChange}
          />
        </ContentArea>

        {/* ── Mobile sticky footer ───────────────────────────────────────── */}
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
            onClick={() => setInternalStep('payment')}
          />
        </MobileFooter>

        {/* ── Mobile payment overlay ─────────────────────────────────────── */}
        <MobilePaymentOverlay data-active={step === 'payment' ? 'true' : 'false'}>
          <OverlayHeader>
            <OverlayBackButton
              type='button'
              onClick={() => setInternalStep('contact')}
              aria-label={t.booking.close}
            >
              <CloseIcon />
            </OverlayBackButton>
            <HeaderTitle>{t.booking.payment}</HeaderTitle>
          </OverlayHeader>

          <OverlayContent>
            <BookingPaymentForm
              depositAmount={depositAmount}
              savedCard={null}
              isLoading={isPaymentLoading}
              error={paymentError}
              onPay={handlePay}
              onValidChange={handleCardValidChange}
            />
          </OverlayContent>

          <OverlayFooter>
            <MainButton
              variant='green_cta'
              title={
                isPaymentLoading
                  ? t.common.loading
                  : `${t.booking.pay} ${depositAmount.toFixed(2)} ₾`
              }
              size='large'
              fullWidth
              disabled={isPaymentLoading || !isCardFormValid}
              type='button'
              onClick={handlePay}
            />
          </OverlayFooter>
        </MobilePaymentOverlay>

        {/* ── Mobile success overlay ─────────────────────────────────────── */}
        <MobilePaymentOverlay data-active={step === 'success' ? 'true' : 'false'}>
          <OverlayHeader>
            <OverlayBackButton type='button' onClick={onClose} aria-label={t.booking.close}>
              <CloseIcon />
            </OverlayBackButton>
            <HeaderTitle>{t.booking.order}</HeaderTitle>
          </OverlayHeader>

          <OverlayContent>
            <BookingSuccessPanel
              reservationId={reservationId}
              onGoHome={() => router.push(`/${locale}`)}
              onMyReservations={() => router.push(`/${locale}/reservations`)}
            />
          </OverlayContent>
        </MobilePaymentOverlay>

        {/* ── Mobile fail overlay ────────────────────────────────────────── */}
        <MobilePaymentOverlay data-active={step === 'fail' ? 'true' : 'false'}>
          <OverlayHeader>
            <OverlayBackButton
              type='button'
              onClick={() => {
                setInternalStep('payment');
                setPaymentError(null);
              }}
              aria-label={t.booking.close}
            >
              <CloseIcon />
            </OverlayBackButton>
            <HeaderTitle>{t.booking.payment}</HeaderTitle>
          </OverlayHeader>

          <OverlayContent>
            <BookingFailPanel
              onGoBack={() => {
                setInternalStep('payment');
                setPaymentError(null);
              }}
            />
          </OverlayContent>
        </MobilePaymentOverlay>
      </PageShell>
    </Wrapper>
  );
}
