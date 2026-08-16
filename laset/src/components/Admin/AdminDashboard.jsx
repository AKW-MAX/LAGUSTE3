import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { parseStoredJson } from "../../utils/storage";
import { assets } from "../../assets/assets";
import { getApiBaseUrl } from "../../utils/api";

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

    const repeatCustomers = dailyOrders.filter((order) => {
        const email = String(order?.customer?.email || order?.user?.email || "").trim().toLowerCase();
        const phone = String(order?.customer?.phone || "").trim();
        return Boolean(email || phone);
    }).length;

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
            orderedProducts: Array.from(productDemandMap.values()).sort((left, right) => right.quantity - left.quantity),
            cartAdditions: [],
            viewedButNotPurchased: [],
            increasingDemandProducts: [],
        },
        categories: {
            bestSelling: Array.from(categoryDemandMap.values()).sort((left, right) => right.quantity - left.quantity),
        },
        customers: {
            repeatCustomers,
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

const formatCurrency = (value) => {
    const numericValue = Number(value || 0);
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    }).format(numericValue);
};

const renderList = (items = [], formatter = (item) => item) => {
    if (!Array.isArray(items) || items.length === 0) {
        return <span className="text-gray-500">None</span>;
    }

    return (
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            {items.map((item, index) => (
                <li key={`${item?.name || item?.category || item?.title || "item"}-${index}`}>{formatter(item)}</li>
            ))}
        </ul>
    );
};

const downloadReportText = (report) => {
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
        "Most added to cart:",
        ...(report?.demand?.cartAdditions || []).map((item) => `- ${item.name}: ${item.count} times`),
        "",
        "Viewed but not purchased:",
        ...(report?.demand?.viewedButNotPurchased || []).map((item) => `- ${item.name}: ${item.count} views`),
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
    link.download = `agriventure-daily-report-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
};

export default function AdminDashboard() {
    const admin = parseStoredJson("admin", null);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [reportMessage, setReportMessage] = useState("");
    const [latestReport, setLatestReport] = useState(null);

    const isSuperAdmin = admin?.role === "superadmin";
    const permissions = Array.isArray(admin?.permissions)
        ? admin.permissions
        : [];

    const canManageOrders =
        isSuperAdmin || permissions.includes("manage_orders");

    const canManageProducts =
        isSuperAdmin || permissions.includes("manage_products");

    const canAddProduct =
        isSuperAdmin || permissions.includes("add_product");

    const canAddAdmin =
        isSuperAdmin || permissions.includes("add_admin");

    const canGenerateDailyReport =
        isSuperAdmin || permissions.includes("generate_daily_report");

    const handleGenerateDailyReport = async () => {
        const token = localStorage.getItem("adminToken");

        if (!token) {
            setReportMessage("Admin session not found.");
            return;
        }

        try {
            setIsGeneratingReport(true);
            setReportMessage("");

            const response = await axios.get(`${getApiBaseUrl()}/admin/business-report`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).catch(async (error) => {
                if (error?.response?.status === 404) {
                    const [ordersResponse, productsResponse] = await Promise.all([
                        axios.get(`${getApiBaseUrl()}/admin/orders`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }),
                        axios.get(`${getApiBaseUrl()}/admin/products`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }),
                    ]);

                    const fallbackReport = buildFallbackReport({
                        orders: ordersResponse?.data?.orders || [],
                        products: productsResponse?.data?.products || [],
                    });

                    setLatestReport(fallbackReport);
                    setReportMessage("Daily report generated from available admin data.");
                    return { data: { report: fallbackReport } };
                }

                throw error;
            });

            const report = response?.data?.report || response?.data?.snapshot || null;
            if (report) {
                setLatestReport(report);
                setReportMessage(`Daily report generated successfully for ${new Date(report.reportDate).toDateString()}.`);
            } else {
                setReportMessage("Daily report generated successfully.");
            }
        } catch (error) {
            setReportMessage(error?.response?.data?.message || "Failed to generate daily report.");
        } finally {
            setIsGeneratingReport(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">

            {/* Header */}
            <div className="text-center mb-10">

                <img
                    src={assets.AgriventureLogo}
                    alt="Agriventure Enterprises Logo"
                    className="w-24 sm:w-32 md:w-40 lg:w-48 h-auto mx-auto mb-4"
                />

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-950">
                    AGRIVENTURE ENTERPRISES
                    <br />
                    ADMIN DASHBOARD
                </h1>

                <p className="mt-3 text-sm sm:text-base">
                    P.O. Box 100, Nairobi, Kenya
                </p>

                <p className="text-sm sm:text-base">
                    Phone: +254 704 519 867
                </p>

                <p className="text-sm sm:text-base">
                    Email: agriventureenterprise@gmail.com
                </p>

            </div>

            {/* Dashboard Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">

                {canManageOrders && (
                    <Link to="/admin/orders">
                        <button className="w-full h-14 rounded-lg bg-green-700 hover:bg-green-800 transition duration-300 text-white font-semibold shadow-md">
                            Manage Orders
                        </button>
                    </Link>
                )}

                {canManageOrders && (
                    <Link to="/admin/invoices">
                        <button className="w-full h-14 rounded-lg bg-emerald-800 hover:bg-emerald-900 transition duration-300 text-white font-semibold shadow-md">
                            Post Invoices
                        </button>
                    </Link>
                )}

                {canManageOrders && (
                    <Link to="/admin/receipts">
                        <button className="w-full h-14 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition duration-300 text-white font-semibold shadow-md">
                            Customer Sale Receipts
                        </button>
                    </Link>
                )}

                {canManageProducts && (
                    <Link to="/admin/products">
                        <button className="w-full h-14 rounded-lg bg-blue-700 hover:bg-blue-800 transition duration-300 text-white font-semibold shadow-md">
                            Manage Products
                        </button>
                    </Link>
                )}

                {canAddProduct && (
                    <Link to="/admin/add-product">
                        <button className="w-full h-14 rounded-lg bg-orange-600 hover:bg-orange-700 transition duration-300 text-white font-semibold shadow-md">
                            Add Product
                        </button>
                    </Link>
                )}

                {canAddAdmin && (
                    <Link to="/admin/add-admin">
                        <button className="w-full h-14 rounded-lg bg-purple-600 hover:bg-purple-700 transition duration-300 text-white font-semibold shadow-md">
                            Add Admin
                        </button>
                    </Link>
                )}

                {canGenerateDailyReport && (
                    <button
                        onClick={handleGenerateDailyReport}
                        disabled={isGeneratingReport}
                        className="w-full h-14 rounded-lg bg-amber-600 hover:bg-amber-700 transition duration-300 text-white font-semibold shadow-md disabled:opacity-70"
                    >
                        {isGeneratingReport ? "Generating..." : "Generate Daily Report"}
                    </button>
                )}

                {isSuperAdmin && (
                    <>
                        <Link to="/admin/admin-activity">
                            <button className="w-full h-14 rounded-lg bg-black hover:bg-gray-900 transition duration-300 text-white font-semibold shadow-md">
                                Admin Activity
                            </button>
                        </Link>

                        <Link to="/admin/admin-permissions">
                            <button className="w-full h-14 rounded-lg bg-gray-800 hover:bg-gray-900 transition duration-300 text-white font-semibold shadow-md">
                                Edit Admin Permissions
                            </button>
                        </Link>

                        <Link to="/admin/audit-logs">
                            <button className="w-full h-14 rounded-lg bg-slate-700 hover:bg-slate-800 transition duration-300 text-white font-semibold shadow-md">
                                Audit Logs
                            </button>
                        </Link>
                    </>
                )}

            </div>

            {reportMessage && (
                <div className="max-w-6xl mx-auto mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                    {reportMessage}
                </div>
            )}

            {latestReport && (
                <div className="max-w-6xl mx-auto mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-2 border-b border-gray-200 pb-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Agriventure Daily Report</p>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {new Date(latestReport.reportDate).toDateString()}
                            </h2>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
                                {latestReport.sales?.orders ?? 0} orders • {formatCurrency(latestReport.sales?.revenue ?? 0)} sales
                            </div>
                            <button
                                onClick={() => downloadReportText(latestReport)}
                                className="rounded-full bg-slate-800 px-3 py-1 text-sm font-medium text-white hover:bg-slate-900"
                            >
                                Download Report
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                            <p className="text-sm font-semibold text-gray-600">Website visitors</p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">{latestReport.traffic?.visits ?? 0}</p>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                            <p className="text-sm font-semibold text-gray-600">Unique visitors</p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">{latestReport.traffic?.uniqueVisitors ?? 0}</p>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                            <p className="text-sm font-semibold text-gray-600">Conversion rate</p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">{latestReport.traffic?.conversionRate ?? 0}%</p>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                            <p className="text-sm font-semibold text-gray-600">Orders</p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">{latestReport.sales?.orders ?? 0}</p>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                            <p className="text-sm font-semibold text-gray-600">Sales</p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(latestReport.sales?.revenue ?? 0)}</p>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                            <p className="text-sm font-semibold text-gray-600">Average order value</p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(latestReport.sales?.averageOrderValue ?? 0)}</p>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-6 lg:grid-cols-2">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Top ordered products</h3>
                            <div className="mt-3 rounded-xl border border-gray-200 p-4">
                                {renderList(latestReport.demand?.topProducts || [], (item) => `${item.name} — ${item.quantity} units`)}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Most added to cart</h3>
                            <div className="mt-3 rounded-xl border border-gray-200 p-4">
                                {renderList(latestReport.demand?.cartAdditions || [], (item) => `${item.name} — ${item.count} times`)}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Viewed but not purchased</h3>
                            <div className="mt-3 rounded-xl border border-gray-200 p-4">
                                {renderList(latestReport.demand?.viewedButNotPurchased || [], (item) => `${item.name} — ${item.count} views`)}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Best-selling categories</h3>
                            <div className="mt-3 rounded-xl border border-gray-200 p-4">
                                {renderList(latestReport.categories?.bestSelling || [], (item) => `${item.category} — ${item.quantity} units`)}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Low-stock products</h3>
                            <div className="mt-3 rounded-xl border border-gray-200 p-4">
                                {renderList(latestReport.inventory?.lowStockProducts || [], (item) => `${item.name} — ${item.stock} in stock`)}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Repeat customers</h3>
                            <div className="mt-3 rounded-xl border border-gray-200 p-4">
                                <p className="text-lg font-semibold text-gray-900">{latestReport.customers?.repeatCustomers ?? 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-900">Insights</h3>
                        <div className="mt-3 rounded-xl border border-gray-200 p-4">
                            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                                {(latestReport.insights || []).map((insight, index) => (
                                    <li key={`${insight}-${index}`}>{insight}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

        <Link to="/" className="text-blue-700 underline text-sm mt-6 block text-center">
          Back to Home
        </Link>

        </div>
    );
}