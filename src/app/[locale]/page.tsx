import RestaurantsListPage from '@/components/RestaurantsListPage';

// The homepage is a marketing-style landing: dark hero with a
// search/booking strip + a grid of popular restaurants below. The more
// utilitarian search/filter experience lives at /restaurants (see
// src/app/[locale]/restaurants/page.tsx).
export default function Home() {
  return <RestaurantsListPage />;
}
