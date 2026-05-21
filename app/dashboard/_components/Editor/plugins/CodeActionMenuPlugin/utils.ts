import { useMemo, useRef } from 'react';

type AnyFunction = (...args: any[]) => void;

function debounce<T extends AnyFunction>(
  fn: T,
  wait: number,
  maxWait?: number
) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let startTime: number | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now();

    if (startTime === null) {
      startTime = now;
    }

    if (timer) {
      clearTimeout(timer);
    }

    if (maxWait && now - startTime >= maxWait) {
      fn.apply(this, args);
      startTime = now;
      return;
    }

    timer = setTimeout(() => {
      fn.apply(this, args);
      startTime = null;
      timer = null;
    }, wait);
  };
}

export function useDebounce<T extends AnyFunction>(
  fn: T,
  ms: number,
  maxWait?: number
): (...args: Parameters<T>) => void {
  const funcRef = useRef<T | null>(null);
  funcRef.current = fn;

  return useMemo(() => {
    return debounce(
      (...args: Parameters<T>) => {
        if (funcRef.current) {
          funcRef.current(...args);
        }
      },
      ms,
      maxWait
    );
  }, [ms, maxWait]);
}

// Example usage : 
//   const debouncedSearch = useDebounce((value: string) => {
//     console.log(value);
//   }, 300);