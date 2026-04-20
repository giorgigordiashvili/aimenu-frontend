'use client';

import { styled } from '@pigment-css/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import axiosInstance from '@/api/axios';
import { initiateSessionSettle } from '@/api/payments/bog';
import Footer from '@/components/Footer';
import HeaderPrimary from '@/components/HeaderPrimary';
import MainButton from '@/components/MainButton/MainButton';
import { useTable } from '@/context/TableContext';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { localePath } from '@/i18n/routing';
import { background, border, foreground, slate100, slate500, white } from '@/tokens';

interface OrdersSummary {
  counts: Record<string, number>;
  total_orders: number;
  grand_total: string;
  unpaid_count: number;
  unpaid_order_numbers: string[];
  unpaid_total: string;
  all_paid: boolean;
}

interface SessionDetail {
  id: string;
  host: string;
  payment_mode: string;
  status: string;
  restaurant_slug: string;
  orders_summary?: OrdersSummary;
}

const Page = styled('div')({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: background,
});

const Main = styled('main')({
  flex: 1,
  padding: '24px 20px 96px',
  maxWidth: '560px',
  width: '100%',
  margin: '0 auto',
});

const Title = styled('h1')({
  fontSize: '22px',
  fontWeight: 700,
  color: foreground,
  margin: '0 0 8px 0',
});

const Subtitle = styled('p')({
  fontSize: '14px',
  color: slate500,
  margin: '0 0 24px 0',
});

const Card = styled('section')({
  background: white,
  border: `1px solid ${border}`,
  borderRadius: '16px',
  padding: '20px',
  marginBottom: '16px',
});

const OrderRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '10px 0',
  fontSize: '14px',
  color: foreground,
  borderBottom: `1px solid ${slate100}`,
  '&:last-child': {
    borderBottom: 'none',
  },
});

const GrandTotalRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '16px 0 4px',
  marginTop: '8px',
  borderTop: `1px solid ${border}`,
  fontSize: '16px',
  fontWeight: 700,
  color: foreground,
});

const TipLabel = styled('label')({
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: foreground,
  marginBottom: '8px',
});

const TipChips = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginBottom: '8px',
});

const Chip = styled('button')({
  appearance: 'none',
  border: `1px solid ${border}`,
  background: white,
  color: foreground,
  fontSize: '14px',
  borderRadius: '999px',
  padding: '8px 14px',
  cursor: 'pointer',
  '&[data-active="true"]': {
    background: foreground,
    color: white,
    borderColor: foreground,
  },
});

const CustomTipInput = styled('input')({
  width: '120px',
  padding: '8px 12px',
  borderRadius: '10px',
  border: `1px solid ${border}`,
  fontSize: '14px',
});

const ErrorNote = styled('p')({
  color: '#ec003f',
  fontSize: '13px',
  margin: '12px 0 0 0',
});

const EmptyNote = styled('p')({
  fontSize: '14px',
  color: slate500,
  margin: '0 0 24px 0',
});

interface Props {
  locale: Locale;
}

const TIP_PRESETS = [0, 0.1, 0.15, 0.2];

export default function SettleTablePage({ locale }: Props) {
  const t = getDictionary(locale);
  const copy = (t as unknown as { settleTable: Record<string, string> }).settleTable;
  const router = useRouter();
  const { tableData } = useTable();

  const [session, setSession] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [tipPct, setTipPct] = useState<number | 'custom' | null>(0);
  const [customTip, setCustomTip] = useState('');

  useEffect(() => {
    if (!tableData?.sessionId) {
      setErrorMsg(copy.missingSession);
      setLoading(false);
      return;
    }
    axiosInstance
      .get<SessionDetail | { data: SessionDetail }>(
        `/api/v1/tables/sessions/${tableData.sessionId}/`
      )
      .then(res => {
        const body = res.data as SessionDetail | { data: SessionDetail };
        const data = (body as { data?: SessionDetail }).data ?? (body as SessionDetail);
        setSession(data);
      })
      .catch(() => setErrorMsg(copy.missingSession))
      .finally(() => setLoading(false));
  }, [tableData?.sessionId, copy.missingSession]);

  const summary = session?.orders_summary;
  const unpaidTotal = summary ? parseFloat(summary.unpaid_total) : 0;

  const tipAmount = useMemo(() => {
    if (tipPct === 'custom') {
      const parsed = parseFloat(customTip);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    }
    if (typeof tipPct === 'number') return Math.round(unpaidTotal * tipPct * 100) / 100;
    return 0;
  }, [tipPct, customTip, unpaidTotal]);

  const grandTotal = Math.round((unpaidTotal + tipAmount) * 100) / 100;

  const handlePay = useCallback(async () => {
    if (!session || !tableData?.sessionId || !tableData?.restaurantSlug) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const returnUrl = `${window.location.origin}${localePath(
        locale,
        '/payments/return'
      )}?flow=session_settle`;
      const { redirect_url } = await initiateSessionSettle({
        session_payload: {
          restaurant_slug: tableData.restaurantSlug,
          session_id: tableData.sessionId,
          tip_amount: tipAmount || 0,
        },
        return_url: returnUrl,
      });
      window.location.assign(redirect_url);
    } catch {
      setErrorMsg(copy.failed);
      setSubmitting(false);
    }
  }, [session, tableData, locale, tipAmount, copy.failed]);

  const formatGel = (n: number) => n.toFixed(2);

  return (
    <Page>
      <HeaderPrimary />
      <Main>
        <Title>{copy.title}</Title>
        <Subtitle>{copy.subtitle}</Subtitle>

        {loading && <EmptyNote>…</EmptyNote>}

        {!loading && !summary && errorMsg && <EmptyNote>{errorMsg}</EmptyNote>}

        {!loading && summary && summary.unpaid_count === 0 && (
          <EmptyNote>{copy.noneUnpaid}</EmptyNote>
        )}

        {!loading && summary && summary.unpaid_count > 0 && (
          <>
            <Card>
              {summary.unpaid_order_numbers.map(num => (
                <OrderRow key={num}>
                  <span>
                    {copy.orderLabel} {num}
                  </span>
                </OrderRow>
              ))}
              <OrderRow>
                <span>{copy.totalLabel}</span>
                <span>{formatGel(unpaidTotal)} ₾</span>
              </OrderRow>
            </Card>

            <Card>
              <TipLabel>{copy.tipLabel}</TipLabel>
              <TipChips>
                {TIP_PRESETS.map(pct => (
                  <Chip
                    key={pct}
                    type='button'
                    data-active={tipPct === pct ? 'true' : undefined}
                    onClick={() => {
                      setTipPct(pct);
                      setCustomTip('');
                    }}
                  >
                    {pct === 0 ? '—' : `${Math.round(pct * 100)}%`}
                  </Chip>
                ))}
                <Chip
                  type='button'
                  data-active={tipPct === 'custom' ? 'true' : undefined}
                  onClick={() => setTipPct('custom')}
                >
                  {copy.tipCustomPlaceholder}
                </Chip>
                {tipPct === 'custom' && (
                  <CustomTipInput
                    type='number'
                    min={0}
                    step={1}
                    inputMode='decimal'
                    value={customTip}
                    placeholder='₾'
                    onChange={e => setCustomTip(e.target.value)}
                  />
                )}
              </TipChips>
              <GrandTotalRow>
                <span>{copy.grandTotal}</span>
                <span>{formatGel(grandTotal)} ₾</span>
              </GrandTotalRow>
            </Card>

            <MainButton
              variant='rose_cta'
              title={copy.payButton.replace('{total}', formatGel(grandTotal))}
              rounded
              disabled={submitting || grandTotal <= 0}
              onClick={handlePay}
            />
            {errorMsg && <ErrorNote>{errorMsg}</ErrorNote>}
          </>
        )}

        {!loading && !summary && !errorMsg && (
          <MainButton
            variant='rose_cta'
            title={t.paymentReturn.backToCart}
            rounded
            onClick={() => router.replace(localePath(locale))}
          />
        )}
      </Main>
      <Footer locale={locale} />
    </Page>
  );
}
