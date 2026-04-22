'use client';

import { styled } from '@pigment-css/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  BOG_SUCCESS_STATUSES,
  BOG_TERMINAL_STATUSES,
  fetchBogStatus,
  type BogStatus,
  type BogStatusResponse,
} from '@/api/payments/bog';
import {
  FLITT_SUCCESS_STATUSES,
  FLITT_TERMINAL_STATUSES,
  fetchFlittStatus,
  type FlittStatus,
  type FlittStatusResponse,
} from '@/api/payments/flitt';
import Footer from '@/components/Footer';
import HeaderPrimary from '@/components/HeaderPrimary';
import MainButton from '@/components/MainButton/MainButton';
import { useCart } from '@/context/CartContext';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { localePath } from '@/i18n/routing';
import { border, foreground, slate500, white } from '@/tokens';

const POLL_INTERVAL_MS = 2_000;
const POLL_MAX_ATTEMPTS = 15;

const Page = styled('div')({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
});

const Main = styled('main')({
  flex: 1,
  padding: '24px 20px',
  maxWidth: '520px',
  width: '100%',
  margin: '0 auto',
  '@media (min-width: 768px)': {
    padding: '64px 24px',
  },
});

const Card = styled('section')({
  background: white,
  border: `1px solid ${border}`,
  borderRadius: '16px',
  padding: '32px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  alignItems: 'center',
  textAlign: 'center',
});

const Title = styled('h1')({
  fontSize: '22px',
  fontWeight: 700,
  color: foreground,
  margin: 0,
  lineHeight: 1.2,
});

const Body = styled('p')({
  fontSize: '14px',
  color: slate500,
  margin: 0,
  lineHeight: '20px',
});

const Spinner = styled('div')({
  width: '32px',
  height: '32px',
  border: `3px solid #e2e8f0`,
  borderTop: `3px solid #ec003f`,
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
});

type Flow = 'order' | 'reservation' | 'add_card' | 'session_settle';

function parseFlow(raw: string | null): Flow {
  if (raw === 'reservation' || raw === 'add_card' || raw === 'session_settle') return raw;
  return 'order';
}

interface Props {
  locale: Locale;
}

export default function PaymentReturnPage({ locale }: Props) {
  const t = getDictionary(locale);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const flow = parseFlow(searchParams.get('flow'));
  const ref = searchParams.get('ref') || '';
  const returnStatus = searchParams.get('status') || 'ok';
  const provider: 'bog' | 'flitt' = searchParams.get('provider') === 'flitt' ? 'flitt' : 'bog';

  const [outcome, setOutcome] = useState<'pending' | 'success' | 'fail'>(
    returnStatus === 'fail' ? 'fail' : 'pending'
  );
  const [status, setStatus] = useState<BogStatusResponse | FlittStatusResponse | null>(null);
  const attemptsRef = useRef(0);

  const navigateOnSuccess = useCallback(
    (response: BogStatusResponse | FlittStatusResponse) => {
      const orderNumber = (response as { order_number?: string | null }).order_number;
      if (flow === 'order') {
        clearCart();
        if (orderNumber) {
          router.replace(localePath(locale, `/orders/${orderNumber}`));
        } else {
          router.replace(localePath(locale));
        }
      } else if (flow === 'reservation') {
        router.replace(localePath(locale, '/profile/reservations'));
      } else if (flow === 'session_settle') {
        // Table fully paid — land back on home. The host's session orders
        // remain viewable from /profile/orders.
        router.replace(localePath(locale, '/?table_settled=1'));
      } else {
        router.replace(localePath(locale, '/profile/payment'));
      }
    },
    [flow, clearCart, locale, router]
  );

  useEffect(() => {
    if (!ref) {
      setOutcome('fail');
      return;
    }

    // Provider-aware status fetcher — keeps the polling loop agnostic.
    const fetchStatus = () => (provider === 'flitt' ? fetchFlittStatus(ref) : fetchBogStatus(ref));

    const isSuccess = (s: string) =>
      provider === 'flitt'
        ? FLITT_SUCCESS_STATUSES.has(s as FlittStatus)
        : BOG_SUCCESS_STATUSES.has(s as BogStatus);
    const isTerminal = (s: string) =>
      provider === 'flitt'
        ? FLITT_TERMINAL_STATUSES.has(s as FlittStatus)
        : BOG_TERMINAL_STATUSES.has(s as BogStatus);
    const isFailure = (s: string) =>
      provider === 'flitt' ? s === 'declined' || s === 'expired' : s === 'rejected';

    if (returnStatus === 'fail') {
      // Still try to fetch details for the reason text.
      fetchStatus()
        .then(setStatus)
        .catch(() => undefined);
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const poll = async () => {
      try {
        const res = await fetchStatus();
        if (cancelled) return;
        setStatus(res);

        if (isSuccess(res.status)) {
          setOutcome('success');
          navigateOnSuccess(res);
          return;
        }
        if (isFailure(res.status)) {
          setOutcome('fail');
          return;
        }
        if (isTerminal(res.status)) {
          setOutcome('success');
          navigateOnSuccess(res);
          return;
        }
      } catch {
        // transient — keep polling until max attempts
      }

      attemptsRef.current += 1;
      if (attemptsRef.current < POLL_MAX_ATTEMPTS) {
        timer = setTimeout(poll, POLL_INTERVAL_MS);
      } else {
        setOutcome('success');
        navigateOnSuccess({ status: 'processing' } as BogStatusResponse);
      }
    };

    poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [ref, returnStatus, provider, navigateOnSuccess]);

  const successTitle = (() => {
    if (flow === 'order') return t.paymentReturn.successOrder;
    if (flow === 'reservation') return t.paymentReturn.successReservation;
    if (flow === 'session_settle')
      return t.paymentReturn.successSessionSettle ?? t.paymentReturn.successOrder;
    return t.paymentReturn.successAddCard;
  })();

  const backButton = (() => {
    if (flow === 'order') {
      return (
        <MainButton
          variant='rose_cta'
          title={t.paymentReturn.backToCart}
          onClick={() => router.replace(localePath(locale, '/order-review'))}
          rounded
        />
      );
    }
    if (flow === 'reservation') {
      return (
        <MainButton
          variant='rose_cta'
          title={t.paymentReturn.backToReservations}
          onClick={() => router.replace(localePath(locale, '/profile/reservations'))}
          rounded
        />
      );
    }
    return (
      <MainButton
        variant='rose_cta'
        title={t.paymentReturn.backToPayment}
        onClick={() => router.replace(localePath(locale, '/profile/payment'))}
        rounded
      />
    );
  })();

  return (
    <Page>
      <HeaderPrimary />
      <Main>
        <Card>
          {outcome === 'pending' && (
            <>
              <Spinner />
              <Title>{t.paymentReturn.verifying}</Title>
              <Body>{t.paymentReturn.stillPending}</Body>
            </>
          )}
          {outcome === 'success' && (
            <>
              <Title>{successTitle}</Title>
              <Body>{t.paymentReturn.verifying}</Body>
            </>
          )}
          {outcome === 'fail' && (
            <>
              <Title>{t.paymentReturn.failTitle}</Title>
              <Body>
                {t.paymentReturn.failBody.replace(
                  '{reason}',
                  (status as BogStatusResponse | null)?.code_description ||
                    t.paymentReturn.unknownFail
                )}
              </Body>
              {backButton}
            </>
          )}
        </Card>
      </Main>
      <Footer locale={locale} />
    </Page>
  );
}
