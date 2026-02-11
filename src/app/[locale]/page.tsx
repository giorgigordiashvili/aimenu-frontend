import React from 'react';

import RestaurantCard from '@/components/RestaurantCard/RestaurantCard';

export default function page() {
  return (
    <>
      <RestaurantCard
        variant='default'
        filterText='ქართული ფიუჟენი'
        rating={4.8}
        showFavoriteButton={true}
        showFavoriteYellow={true}
        showRating={true}
        showFilterText={true}
        restaurantTitle='შავი ლომი'
        locationText='თბილისი'
        showBookButton={true}
        showDetailsButton={false}
        descriptionText='გამორჩეული ატმოსფერო და უნიკალური კერძები. იდეალურია როგორც ოჯახური, ისე ბიზნეს შეხვედრებისთვის.'
      />
      <RestaurantCard
        variant='xl'
        filterText='ქართული ფიუჟენი'
        rating={4.8}
        showFavoriteButton={true}
        showFavoriteYellow={true}
        showRating={true}
        showFilterText={true}
        restaurantTitle='შავი ლომი'
        locationText='თბილისი'
        showBookButton={true}
        showDetailsButton={false}
        descriptionText='გამორჩეული ატმოსფერო და უნიკალური კერძები. იდეალურია როგორც ოჯახური, ისე ბიზნეს შეხვედრებისთვის.'
      />
    </>
  );
}
