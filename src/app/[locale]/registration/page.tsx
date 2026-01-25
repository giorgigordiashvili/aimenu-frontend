'use client';

import React from 'react';

import RadioButton from '@/components/RadioButton/RadioButton';

function Page() {
  return (
    <>
      <RadioButton label='Option 1' name='example' />
      <RadioButton label='Option 2' name='example' disabled />
      <RadioButton label='Option 3' name='example' />
      <RadioButton label='Option 4' name='sxva' />
      <RadioButton label='Option 5' name='sxva' disabled />
      <RadioButton label='Option 6' name='sxva' />
    </>
  );
}

export default Page;
