import { Navigate, useLocation } from "react-router-dom";
import { parseStoredJson } from "../../utils/storage";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const user = parseStoredJson("user", null);
  const admin = parseStoredJson("admin", null);
  const adminToken = localStorage.getItem("adminToken");
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    if (!adminToken) {
      return <Navigate to="/admin/login" replace />;
    }

    // Superadmin can access all admin routes.
    if (admin?.role === "superadmin") {
      return children;
    }

    const permissions = Array.isArray(admin?.permissions) ? admin.permissions : [];
    const path = location.pathname;

    // Dashboard is accessible to any authenticated admin.
    if (path === "/admin/dashboard") {
      return children;
    }

    if (path.startsWith("/admin/orders") && permissions.includes("manage_orders")) {
      return children;
    }

    if (path.startsWith("/admin/products") && permissions.includes("manage_products")) {
      return children;
    }

    if (path.startsWith("/admin/edit-product") && permissions.includes("manage_products")) {
      return children;
    }

    if (path.startsWith("/admin/add-product") && permissions.includes("add_product")) {
      return children;
    }

    if (path.startsWith("/admin/add-admin") && permissions.includes("add_admin")) {
      return children;
    }

    if (path.startsWith("/admin/admin-permissions") && admin?.role === "superadmin") {
      return children;
    }

    // Admin activity page is intentionally superadmin-only.
    return <Navigate to="/admin/dashboard" replace />;
  }

  return user ? children : <Navigate to="/login" replace />;
}
