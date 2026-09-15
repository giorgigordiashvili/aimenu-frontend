'use client';

import { styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';

import axiosInstance from '@/api/axios';
import { restaurantsRetrieve, tablesSessionsRetrieve } from '@/api/generated/api';
import type { RestaurantDetail, TableSessionDetail } from '@/api/generated/interfaces';
import { submitOrder } from '@/api/order';
import type { CreateOrderRequest, OrderItemPayload } from '@/api/order-payload';
import {
  fetchOrderingConfig,
  orderingError,
  quoteDelivery,
  type DeliveryQuote,
  type OrderingConfig,
} from '@/api/ordering';
import { initiateOrderPayment } from '@/api/payments/bog';
import { initiateOrderFlitt } from '@/api/payments/flitt';
import BookingRestaurantCard from '@/components/BookingRestaurantCard/BookingRestaurantCard';
import GuestAddSection, { type Guest } from '@/components/GuestAddSection/GuestAddSection';
import InviteFriendsSection from '@/components/InviteFriendsSection';
import MainButton from '@/components/MainButton/MainButton';
import PaymentMethodSelector, { PaymentMethod } from '@/components/PaymentMethodSelector';
import PaymentProviderPicker, { type PaymentProvider } from '@/components/PaymentProviderPicker';
import GiftCardField from '@/components/GiftCardField';
import PromoCodeField from '@/components/PromoCodeField';
import TipSelector from '@/components/TipSelector';
import WalletApplySection from '@/components/WalletApplySection';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useFulfilment } from '@/context/FulfilmentContext';
import { useTranslations } from '@/context/LocaleContext';
import { useTable } from '@/context/TableContext';
import { useToast } from '@/hooks/useToast';
import { Locale } from '@/i18n/config';
import { localePath } from '@/i18n/routing';
import { restaurantModules } from '@/lib/modules';
import ArrowRightIcon from '@/icons/ArrowRight';
import {
  background,
  border,
  foreground,
  slate500,
  white,
  slate100,
  lime500,
  ctaGreenHover,
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
    backgroundColor: ctaGreenHover,
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

const FulfilmentSummary = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: '14px 16px',
  borderRadius: 12,
  border: '1px solid #fecdd3',
  background: '#fff1f2',
  fontSize: 14,
  color: '#0f172b',
  marginBottom: 16,
  '& small': { color: '#6b7280' },
});

const ConsentRow = styled('label')({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 8,
  padding: '8px 0',
  fontSize: 13,
  color: '#6b7280',
  cursor: 'pointer',
});

export default function OrderReviewPage({ locale }: OrderReviewPageProps) {
  const t = useTranslations();
  const router = useRouter();
  const { items, restaurantSlug, clearCart, isSubmitting, setSubmitting } = useCart();
  const { tableData } = useTable();
  const { toast, showToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('iWillPay');
  // Card acquirer selection — separate from paymentMethod (which is about who
  // pays). Default falls back to whichever provider the restaurant exposes;
  // when both are on, the customer picks via PaymentProviderPicker.
  const [provider, setProvider] = useState<PaymentProvider>('bog');
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [promoCode, setPromoCode] = useState<string>('');
  const [giftCardCode, setGiftCardCode] = useState<string>('');
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const { user: authUser } = useAuth();
  const [walletAmount, setWalletAmount] = useState<number>(0);
  const [guests, setGuests] = useState<Guest[]>([]);
  const fulfilment = useFulfilment();
  const [orderingConfig, setOrderingConfig] = useState<OrderingConfig | null>(null);
  const [deliveryQuote, setDeliveryQuote] = useState<DeliveryQuote | null>(null);
  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
  const [session, setSession] = useState<TableSessionDetail | null>(null);

  // Fetch real restaurant data by slug so the header card doesn't show a placeholder.
  // Also enforce the master ordering switch: if the restaurant has flipped
  // into menu-only mode we can't accept an order — clear the cart, toast,
  // and bounce back to the menu. Covers direct-navigation and invite-join
  // targets alongside the backend 403 guard.
  useEffect(() => {
    if (!restaurantSlug) return;
    let cancelled = false;
    restaurantsRetrieve(restaurantSlug)
      .then(data => {
        if (cancelled) return;
        setRestaurant(data);
        if (data && (data as { accepts_remote_orders?: boolean }).accepts_remote_orders === false) {
          clearCart();
          showToast(
            (t as unknown as { menuOnly?: { orderingDisabledToast?: string } }).menuOnly
              ?.orderingDisabledToast ?? 'Ordering is disabled at this restaurant.'
          );
          router.replace(localePath(locale, `/restaurant/${restaurantSlug}`));
        }
        // Seed the acquirer default from the restaurant's flags. If both
        // are configured the customer picks; the default choice here is
        // the one that was "more true" alphabetically (bog wins ties) —
        // arbitrary but deterministic.
        const flags = (data ?? {}) as {
          accepts_bog_payments?: boolean;
          accepts_flitt_payments?: boolean;
        };
        if (!flags.accepts_bog_payments && flags.accepts_flitt_payments) {
          setProvider('flitt');
        } else {
          setProvider('bog');
        }
      })
      .catch(() => {
        // Silent — the BookingRestaurantCard will fall back to the slug.
      });
    return () => {
      cancelled = true;
    };
  }, [restaurantSlug, clearCart, showToast, t, router, locale]);

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

  // Pickup / delivery rules for this restaurant (hours, fees, minimums).
  useEffect(() => {
    if (!restaurantSlug) return;
    let cancelled = false;
    fetchOrderingConfig(restaurantSlug)
      .then(cfg => {
        if (!cancelled) setOrderingConfig(cfg);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [restaurantSlug]);

  const atTable = tableData?.restaurantSlug === restaurantSlug && !!tableData?.sessionId;
  const onlineMode = !atTable && !!orderingConfig?.enabled;
  const orderType: 'dine_in' | 'takeaway' | 'delivery' = !onlineMode
    ? 'dine_in'
    : fulfilment.mode === 'delivery'
      ? 'delivery'
      : 'takeaway';
  const cartSubtotal = items.reduce(
    (sum, item) =>
      sum + (item.price + (item.modifiers ?? []).reduce((s, m) => s + m.price, 0)) * item.quantity,
    0
  );

  useEffect(() => {
    if (!restaurantSlug || orderType !== 'delivery' || !fulfilment.address) {
      setDeliveryQuote(null);
      return;
    }
    let cancelled = false;
    quoteDelivery(restaurantSlug, fulfilment.address.lat, fulfilment.address.lng, cartSubtotal)
      .then(q => {
        if (!cancelled) setDeliveryQuote(q);
      })
      .catch(() => {
        if (!cancelled) setDeliveryQuote(null);
      });
    return () => {
      cancelled = true;
    };
  }, [restaurantSlug, orderType, fulfilment.address, cartSubtotal]);

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  const handlePlaceOrder = useCallback(async () => {
    if (!restaurantSlug || items.length === 0 || isSubmitting) return;

    const notes: string[] = [];
    const guestNote = formatGuestsNote(guests);
    if (guestNote) notes.push(guestNote);
    notes.push(`Payment: ${paymentMethod}`);

    if (orderType === 'delivery' && !fulfilment.address) {
      showToast(t.ordering.addressRequired);
      return;
    }
    const fulfilmentFields =
      orderType === 'dine_in'
        ? {}
        : {
            scheduled_for: fulfilment.scheduledFor ?? undefined,
            delivery_instructions: fulfilment.instructions || undefined,
            ...(orderType === 'delivery' && fulfilment.address
              ? {
                  delivery_address: fulfilment.address.text,
                  lat: fulfilment.address.lat,
                  lng: fulfilment.address.lng,
                  address: {
                    street: fulfilment.address.text,
                    building: fulfilment.address.building ?? '',
                    entrance: fulfilment.address.entrance ?? '',
                    floor: fulfilment.address.floor ?? '',
                    apartment: fulfilment.address.apartment ?? '',
                  },
                }
              : {}),
          };

    const payload: CreateOrderRequest = {
      restaurant_slug: restaurantSlug,
      order_type: orderType,
      ...fulfilmentFields,
      table: tableData?.restaurantSlug === restaurantSlug ? tableData.code : undefined,
      table_session: tableData?.restaurantSlug === restaurantSlug ? tableData.sessionId : undefined,
      customer_notes: notes.join(' | '),
      promo_code: promoCode || undefined,
      gift_card_code: giftCardCode || undefined,
      marketing_opt_in: marketingOptIn || undefined,
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
      order_type: orderType,
      ...fulfilmentFields,
      session_id: tableData?.restaurantSlug === restaurantSlug ? tableData.sessionId : undefined,
      customer_notes: notes.join(' | '),
      tip_amount: tipAmount || 0,
      promo_code: promoCode || undefined,
      gift_card_code: giftCardCode || undefined,
      marketing_opt_in: marketingOptIn || undefined,
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
        tip_amount: tipAmount || 0,
        wallet_amount: walletAmount || 0,
        items: items.map(item => ({
          menu_item_id: item.menuItemId,
          quantity: item.quantity,
          special_instructions: item.specialInstructions,
          modifier_ids: (item.modifiers ?? []).map(m => m.id),
        })),
      };
      const initiateBody = {
        order_payload: bogPayload as unknown as CreateOrderRequest,
        return_url: returnUrl,
      };
      const result =
        provider === 'flitt'
          ? await initiateOrderFlitt(initiateBody)
          : await initiateOrderPayment(initiateBody);
      window.location.assign(result.redirect_url);
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') console.error('[submitOrder]', err);
      const known = orderingError(err);
      const message = known
        ? ((t.ordering.errors as Record<string, string>)[known.code] ?? known.message)
        : (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
            ?.message || t.orderReview.orderFailed;
      showToast(message);
      setSubmitting(false);
    }
  }, [
    orderType,
    fulfilment.address,
    fulfilment.scheduledFor,
    fulfilment.instructions,
    t.ordering.addressRequired,
    t.ordering.errors,
    clearCart,
    guests,
    isCoveredGuest,
    isSubmitting,
    items,
    locale,
    paymentMethod,
    provider,
    restaurantSlug,
    router,
    session?.payment_mode,
    setSubmitting,
    showToast,
    t.orderReview.orderFailed,
    tableData,
    tipAmount,
    promoCode,
    giftCardCode,
    walletAmount,
    marketingOptIn,
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

        {onlineMode ? (
          <FulfilmentSummary data-testid='fulfilment-summary'>
            <strong>
              {orderType === 'delivery' ? '🛵 ' : '🛍 '}
              {(orderType === 'delivery'
                ? t.ordering.summaryDelivery
                : t.ordering.summaryPickup
              ).replace(
                '{time}',
                fulfilment.scheduledFor
                  ? t.ordering.scheduledFor.replace(
                      '{time}',
                      new Date(fulfilment.scheduledFor).toLocaleString(locale, {
                        weekday: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    )
                  : t.ordering.asap.toLowerCase()
              )}
            </strong>
            {orderType === 'delivery' ? (
              <span>
                {fulfilment.address
                  ? `${t.ordering.deliveryTo}: ${fulfilment.address.text}${fulfilment.address.apartment ? `, ${fulfilment.address.apartment}` : ''}`
                  : t.ordering.addressRequired}
              </span>
            ) : null}
            {deliveryQuote ? (
              <span>
                {parseFloat(deliveryQuote.fee) > 0
                  ? `${t.ordering.deliveryFee}: ${parseFloat(deliveryQuote.fee).toFixed(2)} ₾`
                  : t.ordering.freeDelivery}
                {' · '}
                {t.ordering.eta.replace('{minutes}', String(deliveryQuote.eta_minutes))}
              </span>
            ) : null}
            {orderingConfig && parseFloat(orderingConfig.packaging_fee) > 0 ? (
              <span>
                {t.ordering.packaging}: {parseFloat(orderingConfig.packaging_fee).toFixed(2)} ₾
              </span>
            ) : null}
            <small>{t.ordering.checkoutHint}</small>
          </FulfilmentSummary>
        ) : null}

        {/* Payment Method Section — hidden for guests whose host covers */}
        {onlineMode ? null : isCoveredGuest ? (
          <CoveredGuestNotice>
            {(t.orderReview.coveredGuestNote as string | undefined) ??
              'Your host is covering this order. Tap submit to send it to the kitchen.'}
          </CoveredGuestNotice>
        ) : (
          <>
            <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
            <PaymentProviderPicker
              value={provider}
              onChange={setProvider}
              bogAvailable={
                (restaurant as { accepts_bog_payments?: boolean } | null)?.accepts_bog_payments ===
                true
              }
              flittAvailable={
                (restaurant as { accepts_flitt_payments?: boolean } | null)
                  ?.accepts_flitt_payments === true
              }
            />
          </>
        )}

        {authUser && !isCoveredGuest && (
          <ConsentRow>
            <input
              type='checkbox'
              checked={marketingOptIn}
              onChange={e => setMarketingOptIn(e.target.checked)}
              data-testid='checkout-marketing-opt-in'
            />
            <span>{t.orderReview.marketingOptIn}</span>
          </ConsentRow>
        )}

        {!isCoveredGuest && restaurantSlug && (
          <PromoCodeField
            slug={restaurantSlug}
            channel={tableData?.restaurantSlug === restaurantSlug ? 'qr' : 'web'}
            items={items.map(item => ({ menu_item_id: item.menuItemId, quantity: item.quantity }))}
            value={promoCode}
            onChange={setPromoCode}
          />
        )}

        {!isCoveredGuest && restaurantSlug && restaurantModules(restaurant).gift_cards && (
          <GiftCardField slug={restaurantSlug} value={giftCardCode} onChange={setGiftCardCode} />
        )}

        {/* Tip — only for people actually paying right now (host / solo);
            covered guests don't swipe a card on this page. */}
        {!isCoveredGuest && (
          <TipSelector
            subtotal={items.reduce(
              (sum, item) =>
                sum +
                (item.price + (item.modifiers ?? []).reduce((s, m) => s + m.price, 0)) *
                  item.quantity,
              0
            )}
            value={tipAmount}
            onChange={setTipAmount}
          />
        )}

        {/* Wallet credit — backend re-clamps to spendable, but we cap the input
            at the visible subtotal so users can't try to pay tip+tax with
            credit (UI surprise — backend would silently drop it). */}
        {!isCoveredGuest && (
          <WalletApplySection
            maxApplicable={items.reduce(
              (sum, item) =>
                sum +
                (item.price + (item.modifiers ?? []).reduce((s, m) => s + m.price, 0)) *
                  item.quantity,
              0
            )}
            value={walletAmount}
            onChange={setWalletAmount}
          />
        )}

        {/* Invite Link Section — covered guests can't invite from a tab they
            don't own; only the host / solo customer sees it. */}
        {!isCoveredGuest && !onlineMode && (
          <InviteFriendsSection
            locale={locale}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
          />
        )}

        {/* Guest Add Section */}
        {!onlineMode ? <GuestAddSection guests={guests} onChange={setGuests} /> : null}

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
