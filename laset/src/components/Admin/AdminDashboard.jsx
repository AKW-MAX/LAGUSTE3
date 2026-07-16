import { Link } from "react-router-dom";
import { parseStoredJson } from "../../utils/storage";

export default function AdminDashboard(){
    const admin = parseStoredJson("admin", null);
    const isSuperAdmin = admin?.role === "superadmin";
    const permissions = Array.isArray(admin?.permissions) ? admin.permissions : [];

    const canManageOrders = isSuperAdmin || permissions.includes("manage_orders");
    const canManageProducts = isSuperAdmin || permissions.includes("manage_products");
    const canAddProduct = isSuperAdmin || permissions.includes("add_product");
    const canAddAdmin = isSuperAdmin || permissions.includes("add_admin");

    return(

        <div className="p-10">

            <h1 className="text-4xl font-bold mb-10">
                Admin Dashboard
            </h1>

            <div className="space-x-5 flex flex-row items-start">
                {canManageOrders && (
                <Link to="/admin/orders">
                <button className="bg-green-700 text-white px-6 py-3 rounded">
                    Manage Orders
                </button>
                </Link>
                )}

                {canManageOrders && (
                <Link to="/admin/invoices">
                <button className="bg-emerald-800 text-white px-6 py-3 rounded">
                    Post Invoices
                </button>
                </Link>
                )}

                {canManageOrders && (
                <Link to="/admin/receipts">
                <button className="bg-emerald-600 text-white px-6 py-3 rounded">
                    Customer Sale Receipts
                </button>
                </Link>
                )}

                <br/>

                {canManageProducts && (
                <Link to="/admin/products">
                <button className="bg-blue-700 text-white px-6 py-3 rounded">
                    Manage Products
                </button>
                </Link>
                )}

                <br/>

                {canAddProduct && (
                <Link to="/admin/add-product">
                <button className="bg-orange-600 text-white px-6 py-3 rounded">
                    Add Product
                </button>
                </Link>
                )}

                 <br/>

                {canAddAdmin && (
                <Link to="/admin/add-admin">
                <button className="bg-purple-600 text-white px-6 py-3 rounded">
                    Add Admin
                </button>
                </Link>
                )}

                {isSuperAdmin && (
                <>
                <br/>
                <Link to="/admin/admin-activity">
                <button className="bg-black text-white px-6 py-3 rounded">
                    Admin Activity
                </button>
                </Link>
                <br/>
                <Link to="/admin/admin-permissions">
                <button className="bg-gray-800 text-white px-6 py-3 rounded">
                    Edit Admin Permissions
                </button>
                </Link>
                <br/>
                <Link to="/admin/audit-logs">
                <button className="bg-slate-700 text-white px-6 py-3 rounded">
                    Audit Logs
                </button>
                </Link>
                </>
                )}

          </div>

        </div>

        )

        }