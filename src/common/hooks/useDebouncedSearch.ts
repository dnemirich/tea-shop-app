import { useEffect, useState } from 'react';

export const useDebouncedSearch = (
  initialValue: string,
  delay = 300,
): [string, string, (value: string) => void] => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return [value, debouncedValue, setValue] as const;
};
