const LOCAL_API_URL = "http://localhost:5000";

export const getApiBaseUrl = () => {
  const configuredApiUrl = (import.meta.env.VITE_API_URL || "")
    .trim()
    .replace(/\/+$/, "");

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return LOCAL_API_URL;
    }

    if (configuredApiUrl) {
      return configuredApiUrl;
    }

    return window.location.origin;
  }

  return configuredApiUrl || LOCAL_API_URL;
};

export const buildApiUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, `${getApiBaseUrl()}/`).toString();
};