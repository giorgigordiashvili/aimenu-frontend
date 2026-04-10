import * as React from 'react';

const ManIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={16}
    height={16}
    viewBox='0 0 16 16'
    fill='none'
    {...props}
  >
    <path
      stroke='#90A1B9'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.333}
      d='M12.66 13.993V12.66a2.665 2.665 0 0 0-2.665-2.665H5.997a2.665 2.665 0 0 0-2.665 2.665v1.333M7.996 7.33a2.665 2.665 0 1 0 0-5.33 2.665 2.665 0 0 0 0 5.33Z'
    />
  </svg>
);

export default ManIcon;
