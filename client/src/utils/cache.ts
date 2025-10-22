// client/src/utils/cache.ts
export function getCached<T>(key: string, ttlMs: number): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { t, v } = JSON.parse(raw);
    if (typeof t !== "number") return null;
    if (Date.now() - t > ttlMs) return null;
    return v as T;
  } catch {
    return null;
  }
}

export function setCached<T>(key: string, v: T) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), v }));
  } catch {}
}
