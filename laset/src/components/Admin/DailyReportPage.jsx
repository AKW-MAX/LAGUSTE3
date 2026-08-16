import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { parseStoredJson } from "../../utils/storage";
import { getApiBaseUrl } from "../../utils/api";

const formatCurrency = (value) => {
  const numericValue = Number(value || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(numericValue);
};

const buildFallbackReport = ({ orders = [], products = [] }) => {
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const dailyOrders = (orders || []).filter((order) => {
    const createdAt = order?.createdAt ? new Date(order.createdAt) : null;
    return createdAt && !Number.isNaN(createdAt.getTime()) && createdAt >= startOfDay && createdAt <= endOfDay;
  });

  const revenue = dailyOrders.reduce((sum, order) => sum + Number(order?.totalAmount || 0), 0);
  const averageOrderValue = dailyOrders.length > 0 ? revenue / dailyOrders.length : 0;

  const productDemandMap = new Map();
  const categoryDemandMap = new Map();

  dailyOrders.forEach((order) => {
    const items = Array.isArray(order?.orderItems) ? order.orderItems : [];
    items.forEach((item) => {
      const name = String(item?.name || "Unknown product").trim();
      const quantity = Number(item?.cartQuantity ?? item?.quantity ?? 0);
      if (!name || !Number.isFinite(quantity) || quantity <= 0) return;

      const current = productDemandMap.get(name) || { name, quantity: 0, revenue: 0 };
      current.quantity += quantity;
      current.revenue += Number(item?.price || 0) * quantity;
      productDemandMap.set(name, current);

      const category = String(item?.category || "Uncategorized").trim() || "Uncategorized";
      const categoryEntry = categoryDemandMap.get(category) || { category, quantity: 0, revenue: 0 };
      categoryEntry.quantity += quantity;
      categoryEntry.revenue += Number(item?.price || 0) * quantity;
      categoryDemandMap.set(category, categoryEntry);
    });
  });

  const lowStockProducts = (products || [])
    .filter((product) => Number(product?.stock || 0) <= 5)
    .sort((left, right) => Number(left?.stock || 0) - Number(right?.stock || 0))
    .slice(0, 5);

  return {
    reportDate: today.toISOString(),
    traffic: {
      visits: 0,
      uniqueVisitors: 0,
      conversionRate: 0,
    },
    sales: {
      orders: dailyOrders.length,
      revenue,
      pendingOrders: dailyOrders.filter((order) => String(order?.status || "").trim().toLowerCase() === "pending").length,
      approvedOrders: dailyOrders.filter((order) => String(order?.status || "").trim().toLowerCase() === "approved").length,
      averageOrderValue: Number(averageOrderValue.toFixed(2)),
    },
    demand: {
      topProducts: Array.from(productDemandMap.values()).sort((left, right) => right.quantity - left.quantity).slice(0, 5),
      cartAdditions: [],
      viewedButNotPurchased: [],
    },
    categories: {
      bestSelling: Array.from(categoryDemandMap.values()).sort((left, right) => right.quantity - left.quantity),
    },
    customers: {
      repeatCustomers: dailyOrders.filter((order) => Boolean(String(order?.customer?.email || order?.user?.email || "").trim() || String(order?.customer?.phone || "").trim())).length,
    },
    inventory: {
      lowStockProducts,
    },
    insights: [
      dailyOrders.length > 0
        ? `Generated from ${dailyOrders.length} order${dailyOrders.length === 1 ? "" : "s"} recorded today.`
        : "No orders were recorded today.",
      lowStockProducts.length > 0
        ? `Low stock alert: ${lowStockProducts.map((product) => `${product.name} (${product.stock})`).join(", ")}`
        : "Inventory looks healthy for the current stock levels.",
    ],
  };
};

export default function DailyReportPage() {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Admin session not found.");
        setLoading(false);
        return;
      }

      try {
        const [ordersResponse, productsResponse] = await Promise.all([
          axios.get(`${getApiBaseUrl()}/admin/orders`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${getApiBaseUrl()}/admin/products`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const generatedReport = buildFallbackReport({
          orders: ordersResponse?.data?.orders || [],
          products: productsResponse?.data?.products || [],
        });

        setReport(generatedReport);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load report.");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, []);

  const handleDownload = () => {
    const lines = [
      "AGRIVENTURE DAILY REPORT",
      `Date: ${new Date(report?.reportDate || new Date()).toDateString()}`,
      "",
      `Website visitors: ${report?.traffic?.visits ?? 0}`,
      `Unique visitors: ${report?.traffic?.uniqueVisitors ?? 0}`,
      `Conversion rate: ${report?.traffic?.conversionRate ?? 0}%`,
      `Orders: ${report?.sales?.orders ?? 0}`,
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
    link.download = `daily-report-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 p-6">Loading report...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Agriventure Daily Report</p>
            <h1 className="text-2xl font-bold text-gray-900">{new Date(report?.reportDate || new Date()).toDateString()}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
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
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
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
