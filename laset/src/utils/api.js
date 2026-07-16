const LOCAL_API_URL = "http://localhost:5000";
const REMOTE_API_URL = "https://agriventure-enterprise-backend.onrender.com";

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

    return REMOTE_API_URL;
  }

  return configuredApiUrl || REMOTE_API_URL || LOCAL_API_URL;
};

export const buildApiUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, `${getApiBaseUrl()}/`).toString();
};