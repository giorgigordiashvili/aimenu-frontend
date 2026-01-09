import React from 'react';

import MainButton from '@/components/MainButton/MainButton';

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
        <MainButton icon='heart' title='Heart Button' />
        <MainButton icon='search' title='Search Button' />
        <MainButton icon='calendar' title='Calendar Button' />
      </>
    </>
  );
}

export default Page;
