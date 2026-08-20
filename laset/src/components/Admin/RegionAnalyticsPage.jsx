import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getApiBaseUrl } from "../../utils/api";

const formatCurrency = (value) => {
  const numericValue = Number(value || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(numericValue);
};

const getLocalDateString = (value = new Date()) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatReportDate = (value) => {
  const raw = value || new Date();
  if (typeof raw === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const [year, month, day] = raw.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return new Date(raw).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function RegionAnalyticsPage() {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(getLocalDateString(new Date()));

  useEffect(() => {
    const loadReport = async (dateToLoad = selectedDate) => {
      const rawToken = localStorage.getItem("adminToken") || localStorage.getItem("token") || "";
      const token = String(rawToken).trim();

      if (!token) {
        setError("Admin session not found. Please log in again.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const dateValue = dateToLoad || getLocalDateString(new Date());
        const timeZoneOffsetMinutes = new Date().getTimezoneOffset();
        const endpoint = `${getApiBaseUrl()}/admin/business-report?date=${dateValue}&tzOffset=${timeZoneOffsetMinutes}&refresh=true`;

        const response = await fetch(endpoint, {
          method: "GET",
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const payload = await response.json().catch(() => null);

        if (response.ok && payload?.report) {
          setReport(payload.report);
        } else {
          throw new Error(payload?.message || `The report request failed with status ${response.status}.`);
        }
      } catch (err) {
        setError(err?.message || "Failed to load region analytics.");
      } finally {
        setLoading(false);
      }
    };

    loadReport(selectedDate);
  }, [selectedDate]);

  const regionEntries = report?.engagement?.locationBreakdown || report?.engagement?.clickLocations || [];
  const countryEntries = report?.engagement?.clicksPerCountry || [];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Region Analytics</p>
            <h1 className="text-2xl font-bold text-gray-900">Where your visitors are clicking from</h1>
            <p className="mt-2 text-sm text-gray-600">{formatReportDate(selectedDate || report?.reportDate)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700">
              <span className="text-gray-500">Date</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="border-0 bg-transparent p-0 text-sm font-medium text-gray-700 outline-none"
              />
            </label>
            <button
              onClick={() => setSelectedDate(getLocalDateString(new Date()))}
              className="rounded-full border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Today
            </button>
            <button
              onClick={() => navigate(-1)}
              className="rounded-full border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <Link to="/admin/dashboard" className="rounded-full bg-emerald-700 px-3 py-1 text-sm font-medium text-white hover:bg-emerald-800">
              Admin Dashboard
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-600">
            Loading analytics...
          </div>
        ) : error ? (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Clicks by country</h2>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  {countryEntries.length} countries
                </span>
              </div>
              <div className="mt-4 space-y-2">
                {countryEntries.length > 0 ? countryEntries.map((item, index) => (
                  <div key={`${item.country}-${index}`} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2">
                    <span className="font-medium text-gray-800">{item.country || "Unknown"}</span>
                    <span className="text-sm text-gray-600">{item.count} clicks</span>
                  </div>
                )) : (
                  <p className="text-sm text-gray-600">No country-level click data has been captured yet.</p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Exact regions</h2>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                  {regionEntries.length} regions
                </span>
              </div>
              <div className="mt-4 space-y-2">
                {regionEntries.length > 0 ? regionEntries.map((item, index) => (
                  <div key={`${item.country}-${item.region}-${index}`} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2">
                    <span className="font-medium text-gray-800">{item.country || "Unknown"} / {item.region || "Unknown"}</span>
                    <span className="text-sm text-gray-600">{item.count} clicks</span>
                  </div>
                )) : (
                  <p className="text-sm text-gray-600">No region-level click data has been captured yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
