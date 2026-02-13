import * as React from 'react';
const SvgComponent = () => (
  <svg xmlns='http://www.w3.org/2000/svg' width={16} height={16} fill='none'>
    <g clipPath='url(#a)'>
      <path
        fill='#1877F2'
        d='M6.065 15.788V10.47H4.416V8.026h1.649V6.973c0-2.722 1.231-3.983 3.904-3.983.267 0 .636.027.978.068.256.026.51.07.76.13v2.216a5.75 5.75 0 0 0-.435-.024c-1.764 0-1.95 1.113-1.95 2.268v1.05h2.757l-1.27 2.447H9.321v5.318H6.065v-.675Z'
      />
    </g>
    <defs>
      <clipPath id='a'>
        <path fill='#fff' d='M0 0h15.994v15.994H0z' />
      </clipPath>
    </defs>
  </svg>
);
export default SvgComponent;
