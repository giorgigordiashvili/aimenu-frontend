'use client';

import dynamic from 'next/dynamic';

// Below-the-fold / event-driven components that have no place in the
// critical-path bundle. Kept in a dedicated Client Component module
// because `next/dynamic({ ssr: false })` is only allowed inside a Client
// Component (the detail page itself is a Server Component). Splitting
// these out cuts ~30–40 KB of JS (lightbox + canvas + reservation sheet
// ReservationWidget dependency tree) from the h1's LCP path.
const PhotoGallery = dynamic(() => import('@/components/PhotoGallery'), { ssr: false });
const MobileReservationSheet = dynamic(() => import('@/components/MobileReservationSheet'), {
  ssr: false,
});

interface Props {
  slug: string;
  locale: string;
  images: string[];
  blurhashes: (string | undefined)[];
  restaurantName: string;
  showMobileSheet: boolean;
  orderingEnabled: boolean;
  reservationsEnabled: boolean;
}

export default function BelowFold({
  slug,
  locale,
  images,
  blurhashes,
  restaurantName,
  showMobileSheet,
  orderingEnabled,
  reservationsEnabled,
}: Props) {
  return (
    <>
      <PhotoGallery images={images} blurhashes={blurhashes} restaurantName={restaurantName} />
      {showMobileSheet && (
        <MobileReservationSheet
          slug={slug}
          locale={locale}
          orderingEnabled={orderingEnabled}
          reservationsEnabled={reservationsEnabled}
        />
      )}
    </>
  );
}
