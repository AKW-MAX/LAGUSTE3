export const parseStoredJson = (key, fallback = null) => {
  if (typeof window === "undefined") {
    return fallback;
  }

  const rawValue = localStorage.getItem(key);

  if (rawValue === null || rawValue === undefined) {
    return fallback;
  }

  const normalizedValue = String(rawValue).trim();

  if (!normalizedValue || normalizedValue === "undefined" || normalizedValue === "null") {
    localStorage.removeItem(key);
    return fallback;
  }

  try {
    return JSON.parse(normalizedValue);
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
};