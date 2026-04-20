'use client';

import { styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';

import axiosInstance from '@/api/axios';
import { restaurantsRetrieve, tablesSessionsRetrieve } from '@/api/generated/api';
import type { RestaurantDetail, TableSessionDetail } from '@/api/generated/interfaces';
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

const CoveredGuestNotice = styled('div')({
  padding: '14px 16px',
  borderRadius: '12px',
  backgroundColor: slate100,
  color: foreground,
  fontSize: '14px',
  lineHeight: '20px',
  marginBottom: '24px',
  border: `1px solid ${border}`,
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
  const [session, setSession] = useState<TableSessionDetail | null>(null);

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

  // If we have a table session, pull its details so we know the payment_mode
  // and host — drives whether we hide the selector and skip BOG for shared-tab
  // guests.
  useEffect(() => {
    const sessionId = tableData?.sessionId;
    if (!sessionId) {
      setSession(null);
      return;
    }
    let cancelled = false;
    tablesSessionsRetrieve(sessionId)
      .then(data => {
        if (!cancelled) setSession(data as unknown as TableSessionDetail);
      })
      .catch(() => {
        if (!cancelled) setSession(null);
      });
    return () => {
      cancelled = true;
    };
  }, [tableData?.sessionId]);

  // Track "I am the host of this session" on the client via a sessionStorage
  // marker set when we (this browser) flip mode to host_covers. This keeps
  // the anonymous-scan flow working without a real login.
  const [isSessionHost, setIsSessionHost] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!session) {
      setIsSessionHost(false);
      return;
    }
    try {
      const marker = window.sessionStorage.getItem(`table.host.${session.id}`);
      setIsSessionHost(marker === 'true');
    } catch {
      setIsSessionHost(false);
    }
  }, [session]);

  // Guest on a session that's been flipped to host_covers — submit their
  // order straight to the kitchen, skip the payment form + BOG.
  const isCoveredGuest =
    !!session && (session.payment_mode as unknown as string) === 'host_covers' && !isSessionHost;

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

    // Backend's OrderCreateSerializer uses the BOG shape (menu_item_id,
    // modifier_ids[], session_id). Mirror the transform we do before the BOG
    // call so the direct /orders/create path also validates.
    const directPayload = {
      restaurant_slug: restaurantSlug,
      order_type: 'dine_in',
      session_id: tableData?.restaurantSlug === restaurantSlug ? tableData.sessionId : undefined,
      customer_notes: notes.join(' | '),
      items: items.map(item => ({
        menu_item_id: item.menuItemId,
        quantity: item.quantity,
        special_instructions: item.specialInstructions,
        modifier_ids: (item.modifiers ?? []).map(m => m.id),
      })),
    } as unknown as CreateOrderRequest;

    setSubmitting(true);
    try {
      // 1. Host picked "I'll pay for the whole table" → persist on the
      //    session BEFORE the BOG initiate so subsequent guest submissions
      //    see the host_covers mode.
      if (
        paymentMethod === 'iWillPay' &&
        tableData?.sessionId &&
        (session?.payment_mode as unknown as string) !== 'host_covers'
      ) {
        try {
          await axiosInstance.patch(`/api/v1/tables/sessions/${tableData.sessionId}/mode/`, {
            payment_mode: 'host_covers',
          });
          if (typeof window !== 'undefined') {
            window.sessionStorage.setItem(`table.host.${tableData.sessionId}`, 'true');
          }
        } catch {
          // If this fails it's not fatal — the host still pays their own
          // order via BOG; guests just fall back to paying themselves.
        }
      }

      // 2. Guest covered by the host → skip BOG, send straight to kitchen.
      if (isCoveredGuest) {
        const response = await submitOrder(directPayload);
        clearCart();
        router.push(localePath(locale, `/orders/${response.order_number}?covered=1`));
        return;
      }

      // 3. Dev / bypass mode
      if (process.env.NEXT_PUBLIC_BYPASS_PAYMENT === 'true') {
        const response = await submitOrder(directPayload);
        clearCart();
        router.push(localePath(locale, `/orders/${response.order_number}`));
        return;
      }

      // 4. Normal BOG flow — either the host (iWillPay/everyonePays) or a
      //    solo customer not in a covered session.
      const returnUrl = `${window.location.origin}${localePath(
        locale,
        '/payments/return'
      )}?flow=order`;
      // BOG initiate serializer (apps/payments/bog/serializers.py) expects
      // menu_item_id + modifier_ids[] rather than the /orders/create shape.
      const bogPayload = {
        ...payload,
        items: items.map(item => ({
          menu_item_id: item.menuItemId,
          quantity: item.quantity,
          special_instructions: item.specialInstructions,
          modifier_ids: (item.modifiers ?? []).map(m => m.id),
        })),
      };
      const { redirect_url } = await initiateOrderPayment({
        order_payload: bogPayload as unknown as CreateOrderRequest,
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
    isCoveredGuest,
    isSubmitting,
    items,
    locale,
    paymentMethod,
    restaurantSlug,
    router,
    session?.payment_mode,
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

        {/* Payment Method Section — hidden for guests whose host covers */}
        {isCoveredGuest ? (
          <CoveredGuestNotice>
            {(t.orderReview.coveredGuestNote as string | undefined) ??
              'Your host is covering this order. Tap submit to send it to the kitchen.'}
          </CoveredGuestNotice>
        ) : (
          <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
        )}

        {/* Invite Link Section — covered guests can't invite from a tab they
            don't own; only the host / solo customer sees it. */}
        {!isCoveredGuest && <InviteFriendsSection locale={locale} paymentMethod={paymentMethod} />}

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
