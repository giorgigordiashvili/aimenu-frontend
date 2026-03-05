'use client';

import { styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';

import BookingRestaurantCard from '@/components/BookingRestaurantCard/BookingRestaurantCard';
import GuestAddSection from '@/components/GuestAddSection';
import InviteFriendsSection from '@/components/InviteFriendsSection';
import MainButton from '@/components/MainButton/MainButton';
import PaymentMethodSelector, { PaymentMethod } from '@/components/PaymentMethodSelector';
import { useCart } from '@/context/CartContext';
import { useTranslations } from '@/context/LocaleContext';
import { useToast } from '@/hooks/useToast';
import { Locale } from '@/i18n/config';
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

const SendInvitationButton = styled('button')({
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
  '&:hover': {
    backgroundColor: lime600,
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

export default function OrderReviewPage({ locale }: OrderReviewPageProps) {
  const t = useTranslations();
  const router = useRouter();
  const { items, restaurantSlug } = useCart();
  const { toast, showToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('iWillPay');

  // Restaurant data state - TODO: Replace with actual API call when backend is ready
  const [restaurantData, setRestaurantData] = useState({
    name: t.orderReview.restaurantPlaceholder,
    subtitle: t.orderReview.cuisinePlaceholder,
    rating: 0,
    image: '/demo/RestaurantCardImage.jpg',
  });

  // Fetch restaurant data when slug is available
  useEffect(() => {
    if (!restaurantSlug) return;

    // TODO: Replace with actual API call: fetchRestaurantBySlug(restaurantSlug)
    // For now, use slug as a display name fallback
    setRestaurantData(prev => ({
      ...prev,
      name: restaurantSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    }));
  }, [restaurantSlug]);

  const handleBackToMenu = useCallback(() => {
    router.push(`/${locale}`);
  }, [locale, router]);

  const handleCancel = useCallback(() => {
    // Navigate back to the previous page or restaurant page
    router.back();
  }, [router]);

  const handleSendInvitation = useCallback(() => {
    // TODO: Implement send invitation logic
    // This should:
    // 1. Validate that at least one guest has been added or invite link was created
    // 2. Send invitation emails/SMS to all guests
    // 3. Create order record in backend with payment method and guest list
    // 4. Navigate to order confirmation or payment page
    showToast('Coming soon! This feature is under development.');
  }, [showToast]);

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

  return (
    <Wrapper>
      <ContentContainer>
        {/* Restaurant Card */}
        <BookingRestaurantCard
          name={restaurantData.name}
          subtitle={restaurantData.subtitle}
          rating={restaurantData.rating}
          image={restaurantData.image}
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
        <GuestAddSection />

        {/* Action Buttons */}
        <ActionButtonsContainer>
          <CancelButton type='button' onClick={handleCancel}>
            {t.orderReview.cancel}
          </CancelButton>
          <SendInvitationButton type='button' onClick={handleSendInvitation}>
            {t.orderReview.sendInvitation}
            <ArrowRightIcon color={white} />
          </SendInvitationButton>
        </ActionButtonsContainer>
      </ContentContainer>

      {/* Toast notification */}
      {toast && <ToastContainer>{toast}</ToastContainer>}
    </Wrapper>
  );
}
