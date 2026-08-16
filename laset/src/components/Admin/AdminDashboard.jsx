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

const downloadCsv = (report) => {
    const rows = [];

    rows.push(["Metric", "Value"]);
    rows.push(["Report Date", report?.reportDate || ""]);
    rows.push(["Traffic Visits", report?.traffic?.visits ?? 0]);
    rows.push(["Unique Visitors", report?.traffic?.uniqueVisitors ?? 0]);
    rows.push(["Conversion Rate", `${report?.traffic?.conversionRate ?? 0}%`]);
    rows.push(["Orders", report?.sales?.orders ?? 0]);
    rows.push(["Revenue", report?.sales?.revenue ?? 0]);
    rows.push(["Pending Orders", report?.sales?.pendingOrders ?? 0]);
    rows.push(["Approved Orders", report?.sales?.approvedOrders ?? 0]);
    rows.push(["Average Order Value", report?.sales?.averageOrderValue ?? 0]);
    rows.push(["Repeat Customers", report?.customers?.repeatCustomers ?? 0]);
    rows.push(["Top Products", (report?.demand?.topProducts || []).map((item) => `${item.name} (${item.quantity})`).join(" | ")]);
    rows.push(["Cart Additions", (report?.demand?.cartAdditions || []).map((item) => `${item.name} (${item.count})`).join(" | ")]);
    rows.push(["Viewed But Not Purchased", (report?.demand?.viewedButNotPurchased || []).map((item) => `${item.name} (${item.count})`).join(" | ")]);
    rows.push(["Best Selling Categories", (report?.categories?.bestSelling || []).map((item) => `${item.category} (${item.quantity})`).join(" | ")]);
    rows.push(["Low Stock Products", (report?.inventory?.lowStockProducts || []).map((item) => `${item.name} (${item.stock})`).join(" | ")]);
    rows.push(["Insights", (report?.insights || []).join(" | ")]);

    const csvContent = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `agriventure-daily-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
};

export default function AdminDashboard() {
    const admin = parseStoredJson("admin", null);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [reportMessage, setReportMessage] = useState("");

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

                    downloadCsv(fallbackReport);
                    setReportMessage("Daily report generated from available admin data and downloaded.");
                    return { data: { report: fallbackReport } };
                }

                throw error;
            });

            const report = response?.data?.report || response?.data?.snapshot || null;
            if (report) {
                downloadCsv(report);
                setReportMessage(`Daily report generated and downloaded successfully for ${new Date(report.reportDate).toDateString()}.`);
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

        <Link to="/" className="text-blue-700 underline text-sm mt-6 block text-center">
          Back to Home
        </Link>

        </div>
    );
}