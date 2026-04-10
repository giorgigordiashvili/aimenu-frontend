import * as React from 'react';

const LockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={16} height={16} fill='none' {...props}>
    <path
      stroke='#90A1B9'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.333}
      d='M12.66 7.33H3.332c-.736 0-1.333.596-1.333 1.332v4.665c0 .736.597 1.332 1.333 1.332h9.328c.736 0 1.333-.596 1.333-1.332V8.662c0-.736-.597-1.332-1.333-1.332ZM4.665 7.33V4.664a3.332 3.332 0 1 1 6.663 0V7.33'
    />
  </svg>
);

export default LockIcon;
