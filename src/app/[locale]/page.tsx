import React from 'react';

import RestaurantCard from '@/components/RestaurantCard/RestaurantCard';

export default function page() {
  return (
    <>
      <RestaurantCard
        filterText='ერთი Erti'
        rating={5.7}
        showFavoriteButton={true}
        showFavoriteYellow={true}
        showRating={true}
        showFilterText={true}
        restaurantTitle='რამე რესტორანი'
        locationText='თბილისი, საქართველო'
        detailsVariant='filled'
        showBookButton={true}
        showDetailsButton={true}
      />
    </>
  );
}
