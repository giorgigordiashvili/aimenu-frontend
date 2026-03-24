import * as React from 'react';
const StarOutline = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={20} height={20} fill='none' {...props}>
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.666}
      d='M9.601 1.912a.441.441 0 0 1 .792 0l1.924 3.898a1.768 1.768 0 0 0 1.329.967l4.304.63a.442.442 0 0 1 .245.753l-3.113 3.03a1.77 1.77 0 0 0-.509 1.565l.735 4.283a.442.442 0 0 1-.642.466l-3.848-2.023a1.768 1.768 0 0 0-1.643 0l-3.847 2.023a.44.44 0 0 1-.642-.466l.734-4.282a1.768 1.768 0 0 0-.509-1.565L1.8 8.16a.442.442 0 0 1 .245-.755l4.303-.63a1.768 1.768 0 0 0 1.33-.966l1.924-3.898Z'
    />
  </svg>
);
export default StarOutline;
