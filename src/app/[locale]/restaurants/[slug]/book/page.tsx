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

  return (
    <BookingForm
      slug={slug}
      onClose={() => router.back()}
      restaurantName={restaurant?.name}
      restaurantImage={
        restaurant?.cover_image ?? restaurant?.logo ?? '/demo/RestaurantCardImage.jpg'
      }
      restaurantRating={restaurant ? parseFloat(restaurant.average_rating) : undefined}
      restaurantSubtitle={restaurant?.city}
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
