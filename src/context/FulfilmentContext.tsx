'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

export type FulfilmentMode = 'dine_in' | 'pickup' | 'delivery';

export interface DeliveryAddress {
  text: string;
  lat: number;
  lng: number;
  building?: string;
  entrance?: string;
  floor?: string;
  apartment?: string;
}

interface FulfilmentState {
  restaurantSlug: string | null;
  mode: FulfilmentMode;
  /** ISO datetime of the chosen slot; null = as soon as possible. */
  scheduledFor: string | null;
  address: DeliveryAddress | null;
  instructions: string;
}

interface FulfilmentContextType extends FulfilmentState {
  setMode: (mode: FulfilmentMode) => void;
  setScheduledFor: (iso: string | null) => void;
  setAddress: (address: DeliveryAddress | null) => void;
  setInstructions: (text: string) => void;
  /** Forget everything when the guest switches restaurant. */
  scopeTo: (slug: string) => void;
  reset: () => void;
}

const STORAGE_KEY = 'fulfilment.v1';
const EMPTY: FulfilmentState = {
  restaurantSlug: null,
  mode: 'dine_in',
  scheduledFor: null,
  address: null,
  instructions: '',
};

const FulfilmentContext = createContext<FulfilmentContextType | undefined>(undefined);

export function FulfilmentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FulfilmentState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<FulfilmentState>;
        setState({ ...EMPTY, ...parsed });
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage disabled
    }
  }, [state, hydrated]);

  const setMode = useCallback((mode: FulfilmentMode) => setState(s => ({ ...s, mode })), []);
  const setScheduledFor = useCallback(
    (scheduledFor: string | null) => setState(s => ({ ...s, scheduledFor })),
    []
  );
  const setAddress = useCallback(
    (address: DeliveryAddress | null) => setState(s => ({ ...s, address })),
    []
  );
  const setInstructions = useCallback(
    (instructions: string) => setState(s => ({ ...s, instructions })),
    []
  );
  const scopeTo = useCallback((slug: string) => {
    setState(s => (s.restaurantSlug === slug ? s : { ...EMPTY, restaurantSlug: slug }));
  }, []);
  const reset = useCallback(() => setState(EMPTY), []);

  return (
    <FulfilmentContext.Provider
      value={{ ...state, setMode, setScheduledFor, setAddress, setInstructions, scopeTo, reset }}
    >
      {children}
    </FulfilmentContext.Provider>
  );
}

export function useFulfilment() {
  const ctx = useContext(FulfilmentContext);
  if (!ctx) throw new Error('useFulfilment must be used within a FulfilmentProvider');
  return ctx;
}
