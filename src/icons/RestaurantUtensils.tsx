import * as React from 'react';

// ViewBox widened by one stroke-width on every side so the rounded
// stroke ends aren't clipped at x≈0 / y≈0 / x≈16 / y≈16. The original
// Figma export wrapped the path in a 15.992-wide clipPath that cut the
// top of the fork and the bottom of the knife at stroke-width 1.333.
const RestaurantUtensils = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={24}
    height={24}
    viewBox='-1 -1 18 18'
    fill='none'
    {...props}
  >
    <g stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.333}>
      <path d='M1.998 1.333v4.664c0 .733.6 1.333 1.333 1.333h2.665a1.333 1.333 0 0 0 1.333-1.333V1.333M4.664 1.333v13.326M13.994 9.995V1.333a3.332 3.332 0 0 0-3.332 3.331v3.998c0 .733.6 1.333 1.333 1.333h1.999Zm0 0v4.664' />
    </g>
  </svg>
);
export default RestaurantUtensils;
