import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { getApiBaseUrl } from "../../utils/api";

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        await axios.post(`${getApiBaseUrl()}/api/analytics`, {
          eventType: "page_view",
          page: location.pathname,
          referrer: document.referrer || "",
          metadata: {
            pathname: location.pathname,
            search: location.search,
          },
        });
      } catch (error) {
        console.warn("Analytics tracking failed", error);
      }
    };

    trackPageView();
  }, [location.pathname, location.search]);

  return null;
}
