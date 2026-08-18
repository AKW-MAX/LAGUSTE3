const LOCAL_API_URL = "http://localhost:5000";
const REMOTE_API_URL = "https://agriventure-enterprise-backend.onrender.com";

const isLocalHost = (hostname = "") => {
  const normalizedHostname = String(hostname || "").trim().toLowerCase();

  if (!normalizedHostname) {
    return false;
  }

  return [
    "localhost",
    "127.0.0.1",
    "::1",
    "0.0.0.0",
    "[::1]",
  ].includes(normalizedHostname) ||
    normalizedHostname.startsWith("192.168.") ||
    normalizedHostname.startsWith("10.") ||
    normalizedHostname.startsWith("172.");
};

export const getApiBaseUrl = () => {
  const configuredApiUrl = (import.meta.env.VITE_API_URL || "")
    .trim()
    .replace(/\/+$/, "");

  if (configuredApiUrl) {
    return configuredApiUrl;
  }

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return `${protocol}//localhost:5000`;
    }

    if (isLocalHost(hostname)) {
      return LOCAL_API_URL;
    }

    return REMOTE_API_URL;
  }

  return configuredApiUrl || REMOTE_API_URL || LOCAL_API_URL;
};

export const buildApiUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, `${getApiBaseUrl()}/`).toString();
};