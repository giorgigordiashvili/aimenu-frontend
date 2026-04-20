'use client';

import { useParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { restaurantsRetrieve } from '@/api/generated/api';
import type { RestaurantDetail } from '@/api/generated/interfaces';
import BookingForm from '@/components/BookingForm/BookingForm';

function BookingPageInner() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);

  useEffect(() => {
    if (slug) {
      restaurantsRetrieve(slug).then(setRestaurant).catch(console.warn);
    }
  }, [slug]);

  // `||` (not `??`) so empty strings from the API fall through to the demo
  // fallback — some restaurants have cover_image=""/logo="" rather than null.
  const restaurantImage =
    restaurant?.cover_image || restaurant?.logo || '/demo/RestaurantCardImage.jpg';
  // Show a slug-based name while the fetch is in flight so the top of the
  // card isn't blank on first paint.
  const fallbackName = slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '';

  return (
    <BookingForm
      slug={slug}
      onClose={() => router.back()}
      restaurantName={restaurant?.name || fallbackName}
      restaurantImage={restaurantImage}
      restaurantRating={
        restaurant?.average_rating ? parseFloat(restaurant.average_rating) : undefined
      }
      restaurantSubtitle={restaurant?.city || undefined}
    />
  );
}

export default function BookingPage() {
  return (
    <Suspense>
      <BookingPageInner />
    </Suspense>
  );
}
