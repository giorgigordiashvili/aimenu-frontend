'use client';

import { styled } from '@pigment-css/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { localePath } from '@/i18n/routing';
import { readVenueTable, subscribeVenueTable } from '@/lib/venueTable';
import * as tokens from '@/tokens';

const Chip = styled(Link)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  borderRadius: '999px',
  background: tokens.slate100,
  color: tokens.slate700,
  fontSize: '13px',
  fontWeight: 600,
  textDecoration: 'none',
  marginBottom: '12px',
  '&:hover': { background: tokens.slate200 },
});

/** "Part of {venue}" link back to the shared venue page, keeping the scanned table. */
export default function VenueChip({
  locale,
  venue,
}: {
  locale: Locale;
  venue: { slug: string; name: string };
}) {
  const t = getDictionary(locale);
  const [tableCode, setTableCode] = useState<string | null>(null);
  useEffect(() => {
    const load = () => {
      const ctx = readVenueTable();
      setTableCode(ctx && ctx.venueSlug === venue.slug ? ctx.code : null);
    };
    load();
    return subscribeVenueTable(load);
  }, [venue.slug]);
  const href = `${localePath(locale, `/venue/${venue.slug}`)}${tableCode ? `?table=${encodeURIComponent(tableCode)}` : ''}`;
  return (
    <Chip href={href} data-testid='venue-chip'>
      ← {t.venue.partOf.replace('{venue}', venue.name)}
    </Chip>
  );
}
