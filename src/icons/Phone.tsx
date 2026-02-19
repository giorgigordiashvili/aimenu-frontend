import * as React from 'react';

import { iconStroke } from '@/tokens';

const Phone = () => (
  <svg xmlns='http://www.w3.org/2000/svg' width={20} height={20} fill='none'>
    <path
      stroke={iconStroke}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.666}
      d='M11.52 13.797a.833.833 0 0 0 1.01-.252l.295-.387a1.665 1.665 0 0 1 1.333-.666h2.498a1.665 1.665 0 0 1 1.666 1.665v2.498a1.665 1.665 0 0 1-1.666 1.666 14.99 14.99 0 0 1-14.99-14.99 1.666 1.666 0 0 1 1.666-1.665H5.83A1.666 1.666 0 0 1 7.495 3.33V5.83a1.666 1.666 0 0 1-.666 1.333l-.39.292a.833.833 0 0 0-.243 1.027 11.66 11.66 0 0 0 5.323 5.316Z'
    />
  </svg>
);
export default Phone;
