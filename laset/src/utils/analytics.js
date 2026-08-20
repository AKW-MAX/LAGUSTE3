let cachedLocationMetadata = null;
let cachedLocationTimestamp = 0;
const LOCATION_CACHE_TTL_MS = 60 * 60 * 1000;

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
  } catch (error) {
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
