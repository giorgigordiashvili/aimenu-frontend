import { Suspense } from 'react';

import RestaurantsSearchPage from '@/components/RestaurantsSearchPage';

// The homepage now serves the unified search/browse experience — previously
// at /restaurants-search. Moved here so "/" is the canonical entry point.
export default function Home() {
  return (
    <Suspense>
      <RestaurantsSearchPage />
    </Suspense>
  );
}
