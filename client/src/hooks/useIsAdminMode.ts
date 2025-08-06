import { useMemo } from 'react';

export function useIsAdminMode(): boolean {
  return useMemo(() => {
    if (typeof window === 'undefined') return false;
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('admin') === 'true';
  }, []);
}
