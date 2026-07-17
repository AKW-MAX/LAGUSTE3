import { Link } from "react-router-dom";
import { parseStoredJson } from "../../utils/storage";
import { assets } from "../../assets/assets";

export default function AdminDashboard() {
    const admin = parseStoredJson("admin", null);

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
                    Email: info@agriventure.com
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

        </div>
    );
}