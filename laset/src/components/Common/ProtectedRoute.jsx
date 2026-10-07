import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { parseStoredJson } from "../../utils/storage";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = parseStoredJson("user", null);
  const admin = parseStoredJson("admin", null);
  const adminToken = localStorage.getItem("adminToken");
  const isAdminRoute = location.pathname.startsWith("/admin");
  const active = isAdminRoute ? Boolean(adminToken) : Boolean(user);
  const sessionExpiresAt = isAdminRoute
    ? localStorage.getItem("adminSessionExpiresAt")
    : user?.sessionExpiresAt;
  const sessionExpiration = sessionExpiresAt ? Date.parse(sessionExpiresAt) : NaN;
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    if (!active) return undefined;

    const clearSession = () => {
      if (isAdminRoute) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        localStorage.removeItem("adminSessionExpiresAt");
        navigate("/admin/login", { replace: true });
        return;
      }

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    };

    const expirationDelay = Number.isFinite(sessionExpiration)
      ? Math.max(0, sessionExpiration - Date.now())
      : 0;
    const timeout = window.setTimeout(() => {
      clearSession();
      setSessionExpired(true);
    }, expirationDelay);
    return () => window.clearTimeout(timeout);
  }, [active, isAdminRoute, navigate, sessionExpiration]);

  if (isAdminRoute) {
    if (!adminToken || sessionExpired) {
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

    if (path.startsWith("/admin/invoices") && permissions.includes("manage_orders")) {
      return children;
    }

    if (path.startsWith("/admin/receipts") && permissions.includes("manage_orders")) {
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

  return user && !sessionExpired ? children : <Navigate to="/login" replace />;
}
