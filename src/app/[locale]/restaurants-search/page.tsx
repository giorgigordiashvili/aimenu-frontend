import { Suspense } from 'react';

import RestaurantsSearchPage from '@/components/RestaurantsSearchPage';

export default function RestaurantsSearchRoute() {
  return (
    <Suspense>
      <RestaurantsSearchPage />
    </Suspense>
  );
}
