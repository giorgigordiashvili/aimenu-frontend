import { Suspense } from 'react';

import RestaurantsSearchPage from '@/components/RestaurantsSearchPage';

// Search / filter / category-browse experience. The marketing-style hero
// landing lives at the site root (see src/app/[locale]/page.tsx).
export default function RestaurantsRoute() {
  return (
    <Suspense>
      <RestaurantsSearchPage />
    </Suspense>
  );
}
