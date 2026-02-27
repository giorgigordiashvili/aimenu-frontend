import { useCallback, useRef, useState } from 'react';

export function useToast(durationMs = 3000) {
  const [toast, setToast] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (msg: string) => {
      setToast(msg);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setToast(null), durationMs);
    },
    [durationMs]
  );

  return { toast, showToast };
}
