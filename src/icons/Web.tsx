import * as React from 'react';

import { iconStroke } from '@/tokens';

const Web = () => (
  <svg xmlns='http://www.w3.org/2000/svg' width={20} height={20} fill='none'>
    <path
      stroke={iconStroke}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.666}
      d='M9.994 18.321a8.328 8.328 0 1 0 0-16.656 8.328 8.328 0 0 0 0 16.656Z'
    />
    <path
      stroke={iconStroke}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.666}
      d='M9.993 1.666a12.075 12.075 0 0 0 0 16.655 12.075 12.075 0 0 0 0-16.655ZM1.666 9.993h16.655'
    />
  </svg>
);
export default Web;
