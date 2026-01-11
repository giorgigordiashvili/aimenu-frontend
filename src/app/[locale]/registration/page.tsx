'use client';

import React from 'react';

import MainButton from '@/components/MainButton/MainButton';
import CalendarIcon from '@/icons/Calendar';
import HeartIcon from '@/icons/Heart';
import SearchIcon from '@/icons/Search';

function Page() {
  return (
    <>
      <MainButton title='Default Button' />
      <MainButton variant='destructive' title='Destructive Button' />
      <MainButton variant='outline' title='Outline Button' />
      <MainButton variant='secondary' title='Secondary Button' />
      <MainButton variant='ghost' title='Ghost Button' />
      <MainButton variant='rose_cta' title='Rose CTA Button' />
      <MainButton variant='slate_cta' title='Slate CTA Button' />
      <>
        <MainButton size='small' title='Small Button' />
        <MainButton title='Default Button' />
        <MainButton size='large' title='Large Button' />
        <MainButton title='Default Button' icon={HeartIcon} variant='default' />
        <MainButton title='Search' icon={SearchIcon} variant='outline' />
        <MainButton title='Calendar' icon={CalendarIcon} variant='rose_cta' rounded />
      </>
    </>
  );
}

export default Page;
