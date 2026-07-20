import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ALL_ADMIN_PERMISSIONS = [
  { key: "manage_orders", label: "Manage Orders" },
  { key: "manage_products", label: "Manage Products" },
  { key: "add_product", label: "Add Product" },
  { key: "add_admin", label: "Add Admin" },
  { key: "post_invoices", label: "Post Invoices" },
  { key: "audit_logs", label: "Audit Logs" },
  { key: "admin_activity", label: "Admin Activity" },
  { key: "edit_admin_permissions", label: "Edit Admin Permissions" },
  { key: "sale_receipts", label: "Sale Receipts" },
];

const getApiBaseUrl = () => {
  const hostname = window.location.hostname;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:5000";
  }

  return (
    import.meta.env.VITE_API_URL ||
    "https://agriventure-enterprise-backend.onrender.com"
  );
};

export default function AddAdmin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    role: "admin",
    permissions: ["manage_orders", "manage_products", "add_product", "post_invoices", "audit_logs", "admin_activity", "edit_admin_permissions", "sale_receipts"],
    approved: true,
  });

  useEffect(() => {
    if (form.role === "superadmin") {
      setForm((prev) => ({
        ...prev,
        permissions: ALL_ADMIN_PERMISSIONS.map((permission) => permission.key),
      }));
    }
  }, [form.role]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePermissionChange = (permissionKey, checked) => {
    setForm((prev) => {
      const nextPermissions = checked
        ? [...new Set([...prev.permissions, permissionKey])]
        : prev.permissions.filter((permission) => permission !== permissionKey);

      return {
        ...prev,
        permissions: nextPermissions,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        alert("Please login as admin first.");
        navigate("/admin/login");
        return;
      }

      const res = await axios.post(
        `${getApiBaseUrl()}/admin/add-admin`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data?.message || "Admin created successfully.");
      setForm({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        role: "admin",
        permissions: ["manage_orders", "manage_products", "add_product"],
        approved: true,
      });
      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create admin.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Add Admin</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          className="w-full border rounded p-3"
          required
        />

        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          className="w-full border rounded p-3"
          required
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full border rounded p-3"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded p-3"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border rounded p-3"
          required
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border rounded p-3"
        >
          <option value="admin">Admin</option>
          <option value="superadmin">Super Admin</option>
        </select>

        <div className="border rounded p-3">
          <p className="font-semibold mb-2">Permissions</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ALL_ADMIN_PERMISSIONS.map((permission) => (
              <label key={permission.key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.permissions.includes(permission.key)}
                  onChange={(e) =>
                    handlePermissionChange(permission.key, e.target.checked)
                  }
                  disabled={form.role === "superadmin"}
                />
                {permission.label}
              </label>
            ))}
          </div>
          {form.role === "superadmin" && (
            <p className="text-xs text-gray-600 mt-2">
              Super Admin automatically gets all permissions.
            </p>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="approved"
            checked={form.approved}
            onChange={handleChange}
          />
          Approved
        </label>

        <button
          type="submit"
          className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded font-semibold"
        >
          Create Admin
        </button>
      </form>
    </div>
  );
}
