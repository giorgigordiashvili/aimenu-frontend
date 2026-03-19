import { useCallback, useRef, useState } from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastState {
  message: string;
  variant: ToastVariant;
}

export function useToast(durationMs = 4000) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (msg: string, variant: ToastVariant = 'success') => {
      setToast({ message: msg, variant });
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setToast(null), durationMs);
    },
    [durationMs]
  );

  const hideToast = useCallback(() => setToast(null), []);

  return { toast, showToast, hideToast };
}
