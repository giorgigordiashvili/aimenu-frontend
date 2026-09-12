'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { tablesValidateRetrieve } from '@/api/generated/api';
import { useLocale } from '@/context/LocaleContext';
import { useTable } from '@/context/TableContext';
import { localePath } from '@/i18n/routing';
import { readVenueTable } from '@/lib/venueTable';

// Small client-only side-effect component: if the URL has `?table=<code>`
// it validates the code with the backend and stashes a TableSession in
// TableContext (which the cart + invite flows rely on later).
//
// Split out of the page component so the rest of the restaurant detail
// can render as a Server Component — the initial HTML now ships the
// hero image directly, shaving seconds off LCP on slow 3G.
export default function TableValidator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { locale } = useLocale();
  const tableCode = searchParams.get('table');
  const viaVenue = searchParams.get('via') === 'venue';
  const { tableData, setTableData } = useTable();

  useEffect(() => {
    if (!tableCode) return;
    const alreadyFresh =
      tableData?.code === tableCode && tableData.isValidated && !!tableData.sessionId;
    if (alreadyFresh) return;
    let cancelled = false;
    (async () => {
      try {
        const r = (await tablesValidateRetrieve(tableCode)) as {
          table_number?: string;
          table_name?: string;
          restaurant_slug?: string;
          session_id?: string;
          venue?: { slug: string; name: string; table_code: string; table_number: string } | null;
        };
        if (cancelled) return;
        // A QR printed for one restaurant at a shared venue lands on the
        // venue page listing every restaurant -- unless the guest already
        // came from that page (?via=venue, or the venue table is known).
        if (r.venue && !viaVenue && readVenueTable()?.venueSlug !== r.venue.slug) {
          router.replace(
            `${localePath(locale, `/venue/${r.venue.slug}`)}?table=${encodeURIComponent(r.venue.table_code)}`
          );
          return;
        }
        setTableData({
          code: tableCode,
          tableNumber: r.table_number,
          tableName: r.table_name,
          restaurantSlug: r.restaurant_slug,
          sessionId: r.session_id,
          isValidated: true,
        });
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') console.error('[validateTable]', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    tableCode,
    viaVenue,
    locale,
    router,
    tableData?.code,
    tableData?.isValidated,
    tableData?.sessionId,
    setTableData,
  ]);

  return null;
}
