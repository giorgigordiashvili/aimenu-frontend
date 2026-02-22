'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { restaurantsRetrieve } from '@/api/generated/api';
import type { RestaurantDetail } from '@/api/generated/interfaces';
import BookingForm from '@/components/BookingForm/BookingForm';

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);

  useEffect(() => {
    if (slug) {
      restaurantsRetrieve(slug).then(setRestaurant).catch(console.warn);
    }
  }, [slug]);

  // TODO: remove fallbacks before production
  const name = restaurant?.name ?? 'შავი ლომი';
  const subtitle = restaurant?.city ?? 'თბილისი';
  const rating = restaurant ? parseFloat(restaurant.average_rating) : 4.8;
  const image = restaurant?.cover_image ?? restaurant?.logo ?? '/demo/RestaurantCardImage.jpg';

  return (
    <BookingForm
      slug={slug}
      onClose={() => router.back()}
      restaurantName={name}
      restaurantImage={image}
      restaurantRating={rating}
      restaurantSubtitle={subtitle}
    />
  );
}
