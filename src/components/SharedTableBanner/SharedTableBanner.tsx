'use client';

import { styled } from '@pigment-css/react';
import { useEffect, useState } from 'react';

import { useTranslations } from '@/context/LocaleContext';
import { useTable } from '@/context/TableContext';
import { border, foreground, muted, rose600, white } from '@/tokens';

const Banner = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  backgroundColor: white,
  border: `1px solid ${border}`,
  borderLeft: `4px solid ${rose600}`,
  borderRadius: '12px',
  padding: '12px 16px',
  marginBottom: '16px',
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

export default function SharedTableBanner({ slug }: Props) {
  const { tableData } = useTable();
  const t = useTranslations();
  const [hostName, setHostName] = useState<string | null>(null);
  const [joinedRecently, setJoinedRecently] = useState(false);

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

  return (
    <Banner role='status' aria-live='polite'>
      <Dot />
      <div>
        <Title>{title}</Title>
        <Sub>{sub}</Sub>
      </div>
    </Banner>
  );
}
