'use client';

import { styled } from '@pigment-css/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import axiosInstance from '@/api/axios';
import { useLocale, useTranslations } from '@/context/LocaleContext';
import { useTable } from '@/context/TableContext';
import { localePath } from '@/i18n/routing';
import { border, foreground, muted, rose50, rose600, rose700, white } from '@/tokens';

const Banner = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  backgroundColor: white,
  border: `1px solid ${border}`,
  borderLeft: `4px solid ${rose600}`,
  borderRadius: '12px',
  padding: '12px 16px',
  marginBottom: '16px',
});

const TopRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const PayRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  paddingTop: '10px',
  borderTop: `1px dashed ${border}`,
  flexWrap: 'wrap',
});

const PayHint = styled('span')({
  fontSize: '13px',
  color: foreground,
  fontWeight: 600,
});

const PayTotal = styled('span')({
  fontSize: '12px',
  color: muted,
  display: 'block',
  marginTop: '2px',
});

const PayLink = styled(Link)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  height: '36px',
  padding: '0 16px',
  borderRadius: '100px',
  background: rose600,
  color: white,
  fontSize: '13px',
  fontWeight: 600,
  textDecoration: 'none',
  transition: 'background 0.15s ease',
  '&:hover': { background: rose700 },
});

const PayAlt = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 10px',
  borderRadius: '100px',
  background: rose50,
  color: rose600,
  fontSize: '11px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
});

const Dot = styled('span')({
  width: '10px',
  height: '10px',
  borderRadius: '5px',
  backgroundColor: rose600,
  flexShrink: 0,
});

const Title = styled('span')({
  fontSize: '14px',
  fontWeight: 600,
  color: foreground,
});

const Sub = styled('span')({
  fontSize: '13px',
  color: muted,
  display: 'block',
  marginTop: '2px',
  lineHeight: '18px',
});

interface Props {
  slug: string;
}

interface UnpaidSummary {
  unpaid_count: number;
  unpaid_total: string;
}

export default function SharedTableBanner({ slug }: Props) {
  const { tableData } = useTable();
  const t = useTranslations();
  const { locale } = useLocale();
  const [hostName, setHostName] = useState<string | null>(null);
  const [joinedRecently, setJoinedRecently] = useState(false);
  const [unpaid, setUnpaid] = useState<UnpaidSummary | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.sessionStorage.getItem('tableSharedSession');
      if (!raw) return;
      const parsed = JSON.parse(raw) as { hostName?: string | null; joinedAt?: string };
      if (parsed && parsed.hostName) setHostName(parsed.hostName);
      if (parsed && parsed.joinedAt) {
        const minutesSince = (Date.now() - new Date(parsed.joinedAt).getTime()) / 60_000;
        setJoinedRecently(minutesSince < 60);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Poll the session's orders summary every 30s so the "time to pay"
  // prompt surfaces as soon as the customer's order is served. The
  // SettleTablePage itself does its own fetch on mount, so we don't
  // need per-order detail here — just the aggregate unpaid total.
  useEffect(() => {
    const sessionId = tableData?.sessionId;
    if (!sessionId) return;
    let cancelled = false;
    async function poll() {
      try {
        const res = await axiosInstance.get<{
          id: string;
          orders_summary?: UnpaidSummary;
          data?: { orders_summary?: UnpaidSummary };
        }>(`/api/v1/tables/sessions/${sessionId}/`);
        const body = res.data;
        const summary = body?.orders_summary ?? body?.data?.orders_summary ?? null;
        if (!cancelled) setUnpaid(summary);
      } catch {
        if (!cancelled) setUnpaid(null);
      }
    }
    poll();
    const handle = window.setInterval(poll, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(handle);
    };
  }, [tableData?.sessionId]);

  if (!tableData?.isValidated || tableData.restaurantSlug !== slug || !tableData.sessionId) {
    return null;
  }

  const tableNumber = tableData.tableNumber || tableData.tableName || '';

  const title =
    joinedRecently && hostName
      ? (t.sharedTable?.joinedHost ?? "You joined {{host}}'s table").replace('{{host}}', hostName)
      : (t.sharedTable?.seatedTitle ?? 'You are seated at this table');

  const sub = tableNumber
    ? (t.sharedTable?.tableHint ?? 'Table {{table}} · orders go on the shared check.').replace(
        '{{table}}',
        String(tableNumber)
      )
    : (t.sharedTable?.sub ?? 'Your orders go on the shared table check.');

  const hasUnpaid = !!unpaid && unpaid.unpaid_count > 0;
  const unpaidTotal = unpaid ? parseFloat(unpaid.unpaid_total) : 0;

  return (
    <Banner role='status' aria-live='polite'>
      <TopRow>
        <Dot />
        <div>
          <Title>{title}</Title>
          <Sub>{sub}</Sub>
        </div>
      </TopRow>
      {hasUnpaid && (
        <PayRow>
          <div>
            <PayHint>{t.sharedTable?.readyToPay ?? 'Ready to check out?'}</PayHint>
            <PayTotal>
              {(t.sharedTable?.unpaidAmount ?? '{{count}} open · {{total}} ₾')
                .replace('{{count}}', String(unpaid!.unpaid_count))
                .replace('{{total}}', unpaidTotal.toFixed(2))}
            </PayTotal>
          </div>
          <PayLink href={localePath(locale, '/table/settle')}>
            {t.sharedTable?.payNow ?? 'Pay now'} <PayAlt>₾</PayAlt>
          </PayLink>
        </PayRow>
      )}
    </Banner>
  );
}
