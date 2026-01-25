'use client';

import React from 'react';

import Checkbox from '@/components/Checkbox/Checkbox';

function Page() {
  return (
    <>
      <Checkbox label='Accept Terms and Conditions' />
      <Checkbox label='Accept Privacy Policy' />
      <Checkbox label='Accept Marketing Communications' disabled />
    </>
  );
}

export default Page;
