'use client';

import useSWR from 'swr';
import { restaurantsList } from '@/api/generated/api';
import type { RestaurantList } from '@/api/generated/interfaces';

interface UseRestaurantsOptions {
  search?: string;
}

const fetchRestaurants = async (search?: string): Promise<RestaurantList[]> => {
  const response = await restaurantsList(
    undefined, // acceptsRemoteOrders
    undefined, // acceptsReservations
    undefined, // acceptsTakeaway
    undefined, // city
    undefined, // country
    undefined, // minRating
    search || undefined, // name
    undefined, // ordering
    undefined, // page
    20, // pageSize
    search || undefined, // search
  );
  return response.results;
};

export function useRestaurants(options: UseRestaurantsOptions = {}) {
  const { search = '' } = options;

  const { data, error, isLoading, mutate } = useSWR(
    ['restaurants', search],
    () => fetchRestaurants(search),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Dedupe requests for 1 minute
      keepPreviousData: true,
    }
  );

  return {
    restaurants: data || [],
    error,
    isLoading,
    mutate,
  };
}
