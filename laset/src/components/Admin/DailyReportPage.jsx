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

export default function DailyReportPage() {
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
        const endpoints = [
          `${getApiBaseUrl()}/admin/business-report?date=${dateValue}&tzOffset=${timeZoneOffsetMinutes}`,
          `${getApiBaseUrl()}/business-report?date=${dateValue}&tzOffset=${timeZoneOffsetMinutes}`,
        ];

        let lastError = null;

        for (const endpoint of endpoints) {
          try {
            const response = await fetch(endpoint, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            });

            const payload = await response.json().catch(() => null);

            if (response.ok && payload?.report) {
              setReport(payload.report);
              setLoading(false);
              return;
            }

            lastError = new Error(payload?.message || `The report request failed with status ${response.status}.`);
          } catch (requestError) {
            lastError = requestError;
          }
        }

        const serverMessage = lastError?.message || "Failed to load report.";
        setError(`${serverMessage} (checked admin and public report endpoints)`);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Failed to load report.");
      } finally {
        setLoading(false);
      }
    };

    loadReport(selectedDate);
  }, [selectedDate]);

  const handleDownload = () => {
    const lines = [
      "AGRIVENTURE DAILY REPORT",
      `Date: ${formatReportDate(report?.reportDate || selectedDate)}`,
      "",
      `Website visitors: ${report?.traffic?.visits ?? 0}`,
      `Unique visitors: ${report?.traffic?.uniqueVisitors ?? 0}`,
      `Conversion rate: ${report?.traffic?.conversionRate ?? 0}%`,
      `Orders: ${report?.sales?.orders ?? 0}`,
      `Approved orders: ${report?.sales?.approvedOrders ?? 0}`,
      `Pending orders: ${report?.sales?.pendingOrders ?? 0}`,
      `Rejected orders: ${report?.sales?.rejectedOrders ?? 0}`,
      `Sales: ${formatCurrency(report?.sales?.revenue ?? 0)}`,
      `Average order value: ${formatCurrency(report?.sales?.averageOrderValue ?? 0)}`,
      `Repeat customers: ${report?.customers?.repeatCustomers ?? 0}`,
      "",
      "Top ordered products:",
      ...(report?.demand?.topProducts || []).map((item) => `- ${item.name}: ${item.quantity} units`),
      "",
      "Best-selling categories:",
      ...(report?.categories?.bestSelling || []).map((item) => `- ${item.category}: ${item.quantity} units`),
      "",
      "Low-stock products:",
      ...(report?.inventory?.lowStockProducts || []).map((item) => `- ${item.name}: ${item.stock} in stock`),
      "",
      "Insights:",
      ...(report?.insights || []).map((insight) => `- ${insight}`),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `daily-report-${selectedDate || getLocalDateString(new Date())}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-center">
          <p className="text-lg font-semibold text-gray-900">Loading report...</p>
          <p className="mt-2 text-sm text-gray-600">If this takes too long, the backend may be unavailable or your admin session may be invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Agriventure Daily Report</p>
            <h1 className="text-2xl font-bold text-gray-900">{formatReportDate(selectedDate || report?.reportDate)}</h1>
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
            <button
              onClick={handleDownload}
              className="rounded-full bg-slate-800 px-3 py-1 text-sm font-medium text-white hover:bg-slate-900"
            >
              Download Report
            </button>
            <Link to="/admin/dashboard" className="rounded-full bg-emerald-700 px-3 py-1 text-sm font-medium text-white hover:bg-emerald-800">
              Admin Dashboard
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold">Could not load the report.</p>
            <p className="mt-1">{error}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => window.location.reload()}
                className="rounded-full bg-red-700 px-3 py-1 text-sm font-medium text-white hover:bg-red-800"
              >
                Retry
              </button>
              <Link to="/admin/login" className="rounded-full border border-red-300 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-100">
                Go to admin login
              </Link>
            </div>
          </div>
        ) : report ? (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-600">Website visitors</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{report.traffic?.visits ?? 0}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-600">Unique visitors</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{report.traffic?.uniqueVisitors ?? 0}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-600">Conversion rate</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{report.traffic?.conversionRate ?? 0}%</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-600">Orders</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{report.sales?.orders ?? 0}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-600">Approved orders</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{report.sales?.approvedOrders ?? 0}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-600">Pending orders</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{report.sales?.pendingOrders ?? 0}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-600">Rejected orders</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{report.sales?.rejectedOrders ?? 0}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-600">Sales</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(report.sales?.revenue ?? 0)}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-600">Average order value</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(report.sales?.averageOrderValue ?? 0)}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">🔥 Most demanded products</h2>
                <div className="mt-3 rounded-xl border border-gray-200 p-4">
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    {(report.demand?.mostDemandedProducts || []).map((item, index) => (
                      <li key={`${item.name}-${index}`}>
                        <span className="font-semibold text-gray-900">{item.name}</span> — {item.views ?? 0} views / {item.cartAdditions ?? 0} cart adds / {item.orders ?? 0} orders
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">⚠️ Products getting attention but not selling</h2>
                <div className="mt-3 rounded-xl border border-gray-200 p-4">
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    {(report.demand?.attentionWithoutSales || []).map((item, index) => (
                      <li key={`${item.name}-${index}`}>
                        <span className="font-semibold text-gray-900">{item.name}</span> — {item.views ?? 0} views, {item.cartAdditions ?? 0} cart adds, 0 orders
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Top ordered products</h2>
                <div className="mt-3 rounded-xl border border-gray-200 p-4">
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {(report.demand?.topProducts || []).map((item, index) => (
                      <li key={`${item.name}-${index}`}>{item.name} — {item.quantity} units</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Best-selling categories</h2>
                <div className="mt-3 rounded-xl border border-gray-200 p-4">
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {(report.categories?.bestSelling || []).map((item, index) => (
                      <li key={`${item.category}-${index}`}>{item.category} — {item.quantity} units</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Low-stock products</h2>
                <div className="mt-3 rounded-xl border border-gray-200 p-4">
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {(report.inventory?.lowStockProducts || []).map((item, index) => (
                      <li key={`${item.name}-${index}`}>{item.name} — {item.stock} in stock</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Repeat customers</h2>
                <div className="mt-3 rounded-xl border border-gray-200 p-4">
                  <p className="text-lg font-semibold text-gray-900">{report.customers?.repeatCustomers ?? 0}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900">Insights</h2>
              <div className="mt-3 rounded-xl border border-gray-200 p-4">
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  {(report.insights || []).map((insight, index) => (
                    <li key={`${insight}-${index}`}>{insight}</li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
