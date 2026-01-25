'use client';

import React from 'react';

import SwitchButton from '@/components/SwitchButton/SwitchButton';

function Page() {
  return (
    <>
      <SwitchButton label='Notifications' />
      <SwitchButton label='Dark mode' />
      <SwitchButton label='Disabled option' disabled />
    </>
  );
}

export default Page;
