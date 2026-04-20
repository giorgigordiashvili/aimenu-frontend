'use client';

import { styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';

import { restaurantsRetrieve } from '@/api/generated/api';
import type { RestaurantDetail } from '@/api/generated/interfaces';
import { submitOrder } from '@/api/order';
import type { CreateOrderRequest, OrderItemPayload } from '@/api/order-payload';
import { initiateOrderPayment } from '@/api/payments/bog';
import BookingRestaurantCard from '@/components/BookingRestaurantCard/BookingRestaurantCard';
import GuestAddSection, { type Guest } from '@/components/GuestAddSection/GuestAddSection';
import InviteFriendsSection from '@/components/InviteFriendsSection';
import MainButton from '@/components/MainButton/MainButton';
import PaymentMethodSelector, { PaymentMethod } from '@/components/PaymentMethodSelector';
import { useCart } from '@/context/CartContext';
import { useTranslations } from '@/context/LocaleContext';
import { useTable } from '@/context/TableContext';
import { useToast } from '@/hooks/useToast';
import { Locale } from '@/i18n/config';
import { localePath } from '@/i18n/routing';
import ArrowRightIcon from '@/icons/ArrowRight';
import {
  background,
  border,
  foreground,
  slate500,
  white,
  slate100,
  lime500,
  lime600,
} from '@/tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderReviewPageProps {
  locale: Locale;
}

// ─── Styled components ────────────────────────────────────────────────────────

const Wrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: background,
  minHeight: '100vh',
  fontFamily: 'Inter, sans-serif',
  padding: '24px 20px',
  '@media (min-width: 768px)': {
    padding: '48px 64px',
  },
});

const ContentContainer = styled('div')({
  width: '100%',
  '@media (min-width: 768px)': {
    maxWidth: '576px',
    margin: '0 auto',
  },
});

const Divider = styled('hr')({
  border: 'none',
  borderTop: `1px solid ${border}`,
  margin: '0 0 24px 0',
});

const PageTitle = styled('h1')({
  fontSize: '28px',
  fontWeight: 700,
  color: foreground,
  margin: '0 0 8px 0',
  letterSpacing: '-0.5px',
  lineHeight: '36px',
  '@media (min-width: 768px)': {
    fontSize: '32px',
    lineHeight: '40px',
  },
});

const PageSubtitle = styled('p')({
  fontSize: '15px',
  fontWeight: 400,
  color: slate500,
  margin: '0 0 32px 0',
  lineHeight: '22px',
});

// Empty state
const EmptyState = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '60px 20px',
  textAlign: 'center',
});

const EmptyStateTitle = styled('h2')({
  fontSize: '18px',
  fontWeight: 600,
  color: foreground,
  margin: '0 0 8px 0',
});

const EmptyStateDescription = styled('p')({
  fontSize: '14px',
  color: slate500,
  margin: '0 0 24px 0',
});

const ActionButtonsContainer = styled('div')({
  display: 'flex',
  gap: '16px',
  marginTop: '32px',
});

const CancelButton = styled('button')({
  padding: '16px 32px',
  borderRadius: '12px',
  border: `1px solid ${border}`,
  backgroundColor: white,
  color: foreground,
  fontSize: '16px',
  fontWeight: 500,
  fontFamily: 'Inter, sans-serif',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: slate100,
  },
});

const SubmitButton = styled('button')({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '16px 32px',
  borderRadius: '12px',
  border: 'none',
  backgroundColor: lime500,
  color: white,
  fontSize: '16px',
  fontWeight: 500,
  fontFamily: 'Inter, sans-serif',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  '&:hover:not(:disabled)': {
    backgroundColor: lime600,
  },
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
});

const ToastContainer = styled('div')({
  position: 'fixed',
  bottom: '24px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: foreground,
  color: white,
  padding: '12px 24px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 500,
  zIndex: 1000,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
});

// ─── Component ────────────────────────────────────────────────────────────────

function formatGuestsNote(guests: Guest[]): string {
  if (guests.length === 0) return '';
  return `Guests: ${guests.map(g => `${g.name} (${g.contact})`).join('; ')}`;
}

export default function OrderReviewPage({ locale }: OrderReviewPageProps) {
  const t = useTranslations();
  const router = useRouter();
  const { items, restaurantSlug, clearCart, isSubmitting, setSubmitting } = useCart();
  const { tableData } = useTable();
  const { toast, showToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('iWillPay');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);

  // Fetch real restaurant data by slug so the header card doesn't show a placeholder.
  useEffect(() => {
    if (!restaurantSlug) return;
    let cancelled = false;
    restaurantsRetrieve(restaurantSlug)
      .then(data => {
        if (!cancelled) setRestaurant(data);
      })
      .catch(() => {
        // Silent — the BookingRestaurantCard will fall back to the slug.
      });
    return () => {
      cancelled = true;
    };
  }, [restaurantSlug]);

  const handleBackToMenu = useCallback(() => {
    router.push(localePath(locale));
  }, [locale, router]);

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  const handlePlaceOrder = useCallback(async () => {
    if (!restaurantSlug || items.length === 0 || isSubmitting) return;

    const notes: string[] = [];
    const guestNote = formatGuestsNote(guests);
    if (guestNote) notes.push(guestNote);
    notes.push(`Payment: ${paymentMethod}`);

    const payload: CreateOrderRequest = {
      restaurant_slug: restaurantSlug,
      order_type: 'dine_in',
      table: tableData?.restaurantSlug === restaurantSlug ? tableData.code : undefined,
      table_session: tableData?.restaurantSlug === restaurantSlug ? tableData.sessionId : undefined,
      customer_notes: notes.join(' | '),
      items: items.map<OrderItemPayload>(item => ({
        menu_item: item.menuItemId,
        quantity: item.quantity,
        special_instructions: item.specialInstructions,
        modifiers: (item.modifiers ?? []).map(m => ({ modifier: m.id })),
      })),
    };

    setSubmitting(true);
    try {
      if (process.env.NEXT_PUBLIC_BYPASS_PAYMENT === 'true') {
        const response = await submitOrder(payload);
        clearCart();
        router.push(localePath(locale, `/orders/${response.order_number}`));
        return;
      }

      const returnUrl = `${window.location.origin}${localePath(
        locale,
        '/payments/return'
      )}?flow=order`;
      const { redirect_url } = await initiateOrderPayment({
        order_payload: payload,
        return_url: returnUrl,
      });
      window.location.assign(redirect_url);
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') console.error('[submitOrder]', err);
      showToast(t.orderReview.orderFailed);
      setSubmitting(false);
    }
  }, [
    clearCart,
    guests,
    isSubmitting,
    items,
    locale,
    paymentMethod,
    restaurantSlug,
    router,
    setSubmitting,
    showToast,
    t.orderReview.orderFailed,
    tableData,
  ]);

  // Empty cart state
  if (items.length === 0) {
    return (
      <Wrapper>
        <EmptyState>
          <EmptyStateTitle>{t.orderReview.emptyCart}</EmptyStateTitle>
          <EmptyStateDescription>{t.orderReview.emptyCartDescription}</EmptyStateDescription>
          <MainButton
            variant='rose_cta'
            title={t.orderReview.backToMenu}
            onClick={handleBackToMenu}
            rounded
          />
        </EmptyState>
      </Wrapper>
    );
  }

  const restaurantName = restaurant?.name
    ? restaurant.name
    : restaurantSlug
      ? restaurantSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      : t.orderReview.restaurantPlaceholder;
  const cuisine = restaurant?.category
    ? restaurant.category.slug
    : t.orderReview.cuisinePlaceholder;
  const heroImage = restaurant?.logo || restaurant?.cover_image || '/demo/RestaurantCardImage.jpg';

  const submitLabel = isSubmitting
    ? t.orderReview.placing
    : guests.length > 0
      ? t.orderReview.sendInvitation
      : t.orderReview.placeOrder;

  return (
    <Wrapper>
      <ContentContainer>
        {/* Restaurant Card */}
        <BookingRestaurantCard
          name={restaurantName}
          subtitle={cuisine}
          rating={parseFloat(restaurant?.average_rating || '0')}
          image={heroImage}
        />

        <Divider />

        {/* Title Section */}
        <PageTitle>{t.orderReview.title}</PageTitle>
        <PageSubtitle>{t.orderReview.subtitle}</PageSubtitle>

        {/* Payment Method Section */}
        <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />

        {/* Invite Link Section */}
        <InviteFriendsSection locale={locale} paymentMethod={paymentMethod} />

        {/* Guest Add Section */}
        <GuestAddSection guests={guests} onChange={setGuests} />

        {/* Action Buttons */}
        <ActionButtonsContainer>
          <CancelButton type='button' onClick={handleCancel} disabled={isSubmitting}>
            {t.orderReview.cancel}
          </CancelButton>
          <SubmitButton type='button' onClick={handlePlaceOrder} disabled={isSubmitting}>
            {submitLabel}
            <ArrowRightIcon color={white} />
          </SubmitButton>
        </ActionButtonsContainer>
      </ContentContainer>

      {/* Toast notification */}
      {toast && <ToastContainer>{toast.message}</ToastContainer>}
    </Wrapper>
  );
}
