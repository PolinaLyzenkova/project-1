import { useState, useEffect } from 'react';

/**
 * usePersistentState
 * 
 * A small helper hook that:
 * - Initializes state from localStorage (if present)
 * - Persists any changes back to localStorage
 * 
 * This lets text boxes, checkboxes, etc. remember their values
 * "forever" (until the user clears browser storage).
 */
export function usePersistentState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) {
        return JSON.parse(stored) as T;
      }
    } catch {
      // Ignore parse / access errors and fall back to default
    }

    return defaultValue;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Ignore write errors (e.g. storage full, disabled, etc.)
    }
  }, [key, state]);

  return [state, setState] as const;
}

