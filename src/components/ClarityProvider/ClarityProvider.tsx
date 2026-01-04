'use client';

import Clarity from '@microsoft/clarity';
import { useEffect } from 'react';

const CLARITY_PROJECT_ID = 'ugfe7kczrl';

export default function ClarityProvider() {
  useEffect(() => {
    Clarity.init(CLARITY_PROJECT_ID);
  }, []);

  return null;
}
