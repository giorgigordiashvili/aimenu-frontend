'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { validateVenueTable } from '@/api/venues';
import { readVenueTable, writeVenueTable } from '@/lib/venueTable';

// Side-effect only: `?table=<venue code>` resolves the physical table and each
// member restaurant's own table code, stored for the rest of the visit. No
// session is created here -- that happens once the guest picks a restaurant.
export default function VenueTableValidator({ venueSlug }: { venueSlug: string }) {
  const searchParams = useSearchParams();
  const code = searchParams.get('table');

  useEffect(() => {
    if (!code) return;
    const stored = readVenueTable();
    if (stored?.code === code && stored.venueSlug === venueSlug) return;
    let cancelled = false;
    (async () => {
      try {
        const r = await validateVenueTable(code);
        if (cancelled) return;
        const memberCodes: Record<string, string | null> = {};
        for (const m of r.restaurants) memberCodes[m.restaurant.slug] = m.table_code;
        writeVenueTable({
          venueSlug: r.venue.slug,
          venueName: r.venue.name,
          code,
          tableNumber: r.table.number,
          memberCodes,
        });
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') console.error('[validateVenueTable]', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code, venueSlug]);

  return null;
}
