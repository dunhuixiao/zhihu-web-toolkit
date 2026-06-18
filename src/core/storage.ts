export async function getStoredValue<T>(key: string, fallback: T): Promise<T> {
  try {
    if (typeof GM_getValue === 'function') {
      const value = await GM_getValue<T>(key, fallback);
      return value === undefined || value === null ? fallback : value;
    }
  } catch {
    // Fall through to localStorage.
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function setStoredValue<T>(key: string, value: T): Promise<void> {
  try {
    if (typeof GM_setValue === 'function') {
      await GM_setValue(key, value);
      return;
    }
  } catch {
    // Fall through to localStorage.
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}
