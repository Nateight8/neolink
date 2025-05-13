import { useEffect, useRef } from "react";

/**
 * Triggers `effectFn` after debounce delay only if `value` has 3 or more letters.
 */
export function useDebounce(
  value: string,
  effectFn: () => void,
  delay: number = 500
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const lettersOnly = value.replace(/[^a-zA-Z]/g, "");
    if (lettersOnly.length >= 3) {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        effectFn();
      }, delay);
    } else {
      if (timer.current) clearTimeout(timer.current);
    }

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value, effectFn, delay]);
}
