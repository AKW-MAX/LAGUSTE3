import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { getApiBaseUrl } from "../../utils/api";
import { buildAnalyticsMetadata } from "../../utils/analytics";

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        const metadata = await buildAnalyticsMetadata({
          pathname: location.pathname,
          search: location.search,
        });

        await axios.post(`${getApiBaseUrl()}/api/analytics`, {
          eventType: "page_view",
          page: location.pathname,
          referrer: document.referrer || "",
          metadata,
        });
      } catch (error) {
        console.warn("Analytics tracking failed", error);
      }
    };

    trackPageView();
  }, [location.pathname, location.search]);

  return null;
}
