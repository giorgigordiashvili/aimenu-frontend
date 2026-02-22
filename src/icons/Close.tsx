import * as React from 'react';

import { foreground } from '@/tokens';

const CloseIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' width={16} height={16} fill='none'>
    <path
      stroke={foreground}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.333}
      d='m11.814 3.998-7.996 7.996M3.818 3.998l7.996 7.996'
    />
  </svg>
);
export default CloseIcon;
