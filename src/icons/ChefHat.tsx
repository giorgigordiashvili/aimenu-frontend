import * as React from 'react';

const ChefHat = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={16}
    height={16}
    viewBox='0 0 16 16'
    fill='none'
    {...props}
  >
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.333}
      d='M11.328 13.993a.666.666 0 0 0 .666-.666V9.762c0-.305.211-.563.485-.694a2.665 2.665 0 0 0-1.422-5.057 3.332 3.332 0 0 0-6.121 0 2.665 2.665 0 0 0-1.422 5.056c.274.132.484.39.484.694v3.566a.666.666 0 0 0 .667.666h6.663ZM3.998 11.328h7.996'
    />
  </svg>
);
export default ChefHat;
