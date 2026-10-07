let cachedLocationMetadata = null;
let cachedLocationTimestamp = 0;
const LOCATION_CACHE_TTL_MS = 60 * 60 * 1000;
const VISITOR_ID_KEY = "analyticsVisitorId";
const SESSION_ID_KEY = "analyticsSessionId";
const SESSION_ACTIVITY_KEY = "analyticsSessionActivityAt";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

const createAnalyticsId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
};

export const getAnalyticsIdentity = () => {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = createAnalyticsId();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }

  const now = Date.now();
  const lastActivityAt = Number(sessionStorage.getItem(SESSION_ACTIVITY_KEY));
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  if (!sessionId || !Number.isFinite(lastActivityAt) || now - lastActivityAt > SESSION_TIMEOUT_MS) {
    sessionId = createAnalyticsId();
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  sessionStorage.setItem(SESSION_ACTIVITY_KEY, String(now));

  return { visitorId, sessionId };
};

const normalizeLocationValue = (value) => {
  const text = String(value || "").trim();
  if (!text) return "";

  const normalizedText = text.replace(/\s+/g, " ").trim();
  if (!normalizedText) return "";

  const lowered = normalizedText.toLowerCase();
  if (["unknown", "undefined", "null", "n/a", "na", "not available", "not provided"].includes(lowered)) {
    return "";
  }

  return normalizedText;
};

export const resolveBrowserLocationMetadata = async () => {
  const now = Date.now();
  if (cachedLocationMetadata && now - cachedLocationTimestamp < LOCATION_CACHE_TTL_MS) {
    return cachedLocationMetadata;
  }

  try {
    const response = await fetch("https://ipapi.co/json/", {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error("Location lookup failed");
    }

    const payload = await response.json();

    const locationMetadata = {
      country: normalizeLocationValue(payload?.country_name || payload?.country || payload?.countryCode || ""),
      region: normalizeLocationValue(payload?.region || payload?.region_name || payload?.region_code || ""),
    };

    cachedLocationMetadata = locationMetadata;
    cachedLocationTimestamp = now;
    return locationMetadata;
  } catch {
    cachedLocationMetadata = { country: "", region: "" };
    cachedLocationTimestamp = now;
    return cachedLocationMetadata;
  }
};

export const buildAnalyticsMetadata = async (metadata = {}) => {
  const normalizedMetadata = { ...(metadata || {}) };
  const locationMetadata = await resolveBrowserLocationMetadata();

  if (locationMetadata.country) {
    normalizedMetadata.country = locationMetadata.country;
  }

  if (locationMetadata.region) {
    normalizedMetadata.region = locationMetadata.region;
  }

  if (!normalizedMetadata.location || typeof normalizedMetadata.location !== "object") {
    normalizedMetadata.location = {};
  }

  if (locationMetadata.country) {
    normalizedMetadata.location.country = locationMetadata.country;
  }

  if (locationMetadata.region) {
    normalizedMetadata.location.region = locationMetadata.region;
  }

  return normalizedMetadata;
};
