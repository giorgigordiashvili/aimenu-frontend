import * as React from 'react';
const CreditCardIcon = ({ color = '#90A1B9' }: { color?: string }) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={16} height={16} fill='none'>
    <path
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.333}
      d='M13.326 3.332H2.665c-.736 0-1.333.596-1.333 1.332v6.664c0 .736.597 1.332 1.333 1.332h10.661c.736 0 1.333-.597 1.333-1.332V4.664c0-.736-.597-1.332-1.333-1.332ZM1.332 6.663h13.327'
    />
  </svg>
);
export default CreditCardIcon;
