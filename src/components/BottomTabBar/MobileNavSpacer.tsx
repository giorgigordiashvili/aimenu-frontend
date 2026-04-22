import { styled } from '@pigment-css/react';

// Reserves room at the bottom of every page on <768px so the last line of
// content isn't hidden behind the fixed BottomTabBar (≈56px + safe area).
const MobileNavSpacer = styled('div')({
  paddingBottom: 'calc(56px + env(safe-area-inset-bottom, 0px))',
  '@media (min-width: 768px)': {
    paddingBottom: 0,
  },
});

export default MobileNavSpacer;
