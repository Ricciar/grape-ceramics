import axios, { AxiosError } from 'axios';

export function isAbort(e: unknown) {
  if (e instanceof DOMException && e.name === 'AbortError') return true;
  if (axios.isCancel?.(e)) return true;
  if (e && typeof e === 'object' && 'code' in e) {
    return (e as AxiosError).code === 'ERR_CANCELED';
  }
  return false;
}
