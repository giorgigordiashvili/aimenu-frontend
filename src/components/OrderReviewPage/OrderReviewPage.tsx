'use client';

import { styled } from '@pigment-css/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, useCallback, useMemo } from 'react';

import BookingRestaurantCard from '@/components/BookingRestaurantCard/BookingRestaurantCard';
import GuestAddSection from '@/components/GuestAddSection';
import InviteFriendsSection from '@/components/InviteFriendsSection';
import MainButton from '@/components/MainButton/MainButton';
import PaymentMethodSelector, { PaymentMethod } from '@/components/PaymentMethodSelector';
import { useCart } from '@/context/CartContext';
import { useTranslations } from '@/context/LocaleContext';
import { Locale } from '@/i18n/config';
import ArrowRightIcon from '@/icons/ArrowRight';
import { background, border, foreground, slate500, white } from '@/tokens';

// Types

interface OrderReviewPageProps {
  locale: Locale;
}

// Styled components

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
    backgroundColor: '#f5f5f5',
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
  backgroundColor: '#84CC16',
  color: white,
  fontSize: '16px',
  fontWeight: 500,
  fontFamily: 'Inter, sans-serif',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: '#65A30D',
  },
});

const LoadingWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: background,
});

// Mock Data

const MOCK_CART_ITEMS = [
  { id: 'mock-1', name: 'სალათი ცეზარი', price: 18 },
  { id: 'mock-2', name: 'მარგარიტა პიცა', price: 24 },
];

// Inner component that uses useSearchParams
function OrderReviewPageContent({ locale }: OrderReviewPageProps) {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items: cartItems, restaurantSlug } = useCart();

  const useMockData = searchParams.get('mock') === 'true';
  const items = useMemo(() => {
    return useMockData ? MOCK_CART_ITEMS : cartItems;
  }, [useMockData, cartItems]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('iWillPay');

  const handleBackToMenu = useCallback(() => {
    if (restaurantSlug) {
      router.push(`/${locale}/restaurant/${restaurantSlug}`);
    } else {
      router.push(`/${locale}/restaurants`);
    }
  }, [locale, restaurantSlug, router]);

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  const handleSendInvitation = useCallback(() => {
    // TODO: Implement send invitation logic
  }, []);

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
        <BookingRestaurantCard
          name='სტეფანო'
          subtitle='იტალიური სამზარეულო'
          rating={4.8}
          image='/demo/RestaurantCardImage.jpg'
        />

        <Divider />

        <PageTitle>{t.orderReview.title}</PageTitle>
        <PageSubtitle>{t.orderReview.subtitle}</PageSubtitle>

        <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />

        <InviteFriendsSection locale={locale} paymentMethod={paymentMethod} />

        <GuestAddSection />

        <ActionButtonsContainer>
          <CancelButton type='button' onClick={handleCancel}>
            {t.orderReview.cancel}
          </CancelButton>
          <SendInvitationButton type='button' onClick={handleSendInvitation}>
            {t.orderReview.sendInvitation}
            <ArrowRightIcon color='#ffffff' />
          </SendInvitationButton>
        </ActionButtonsContainer>
      </ContentContainer>
    </Wrapper>
  );
}

// Main component wrapped with Suspense
export default function OrderReviewPage({ locale }: OrderReviewPageProps) {
  return (
    <Suspense fallback={<LoadingWrapper>Loading...</LoadingWrapper>}>
      <OrderReviewPageContent locale={locale} />
    </Suspense>
  );
}
