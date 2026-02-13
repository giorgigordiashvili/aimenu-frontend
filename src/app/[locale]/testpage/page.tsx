'use client';

import { notFound } from 'next/navigation';
import React from 'react';

import RestaurantCard from '@/components/RestaurantCardPrimary/RestaurantCardPrimary';

function Page() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return (
    <>
      <RestaurantCard
        variant='default'
        imageSrc='/demo/RestaurantCardImage2.jpg'
        filterText='ქართული ფიუჟენი'
        rating={4.8}
        showFavoriteButton={true}
        showFavoriteYellow={true}
        showRating={true}
        showFilterText={true}
        restaurantTitle='შავი ლომი'
        locationText='თბილისი'
        showBookButton={true}
        showDetailsButton={true}
        detailsVariant='outlined'
        descriptionText='გამორჩეული ატმოსფერო და უნიკალური კერძები. იდეალურია როგორც ოჯახური, ისე ბიზნეს შეხვედრებისთვის.'
      />
      <RestaurantCard
        imageSrc='/demo/RestaurantCardImage2.jpg'
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
      <RestaurantCard
        imageSrc='/demo/RestaurantCardImage.jpg'
        variant='compact'
        filterText='ტრადიციული'
        rating={4.5}
        showFavoriteButton={false}
        showFavoriteYellow={true}
        showRating={true}
        showFilterText={true}
        restaurantTitle='ხინკლის სახლი'
        locationText='თბილისი'
        showBookButton={true}
      />
    </>
  );
}

export default Page;
