import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { parseStoredJson } from "../../utils/storage";
import { Link } from "react-router-dom";

const ALL_ADMIN_PERMISSIONS = [
  { key: "manage_orders", label: "Manage Orders" },
  { key: "manage_products", label: "Manage Products" },
  { key: "add_product", label: "Add Product" },
  { key: "add_admin", label: "Add Admin" },
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

export default function AdminPermissions() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const admin = parseStoredJson("admin", null);

    if (!token) {
      navigate("/admin/login");
      return;
    }

    if (admin?.role !== "superadmin") {
      alert("Only superadmin can manage admin permissions.");
      navigate("/admin/dashboard");
      return;
    }

    fetchAdmins(token);
  }, [navigate]);

  const fetchAdmins = async (token) => {
    try {
      const res = await axios.get(`${getApiBaseUrl()}/admin/admins`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const mapped = (res.data?.admins || []).map((admin) => ({
        ...admin,
        permissions: Array.isArray(admin.permissions) ? admin.permissions : [],
      }));

      setAdmins(mapped);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to load admins.");
    } finally {
      setLoading(false);
    }
  };

  const updateAdminLocally = (adminId, updater) => {
    setAdmins((prev) =>
      prev.map((admin) =>
        admin._id === adminId ? { ...admin, ...updater(admin) } : admin
      )
    );
  };

  const handleRoleChange = (adminId, role) => {
    updateAdminLocally(adminId, (admin) => ({
      role,
      permissions:
        role === "superadmin"
          ? ALL_ADMIN_PERMISSIONS.map((permission) => permission.key)
          : admin.permissions,
    }));
  };

  const handlePermissionToggle = (adminId, permissionKey, checked) => {
    updateAdminLocally(adminId, (admin) => ({
      permissions: checked
        ? [...new Set([...admin.permissions, permissionKey])]
        : admin.permissions.filter((permission) => permission !== permissionKey),
    }));
  };

  const handleApprovalToggle = (adminId, approved) => {
    updateAdminLocally(adminId, () => ({ approved }));
  };

  const handleSave = async (admin) => {
    const token = localStorage.getItem("adminToken");

    try {
      setSavingId(admin._id);
      const res = await axios.put(
        `${getApiBaseUrl()}/admin/admins/${admin._id}`,
        {
          role: admin.role,
          permissions: admin.permissions,
          approved: !!admin.approved,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data?.message || "Admin updated successfully.");
      const currentAdmin = parseStoredJson("admin", null);
      if (admin.id === currentAdmin?.id) {
        localStorage.setItem("admin", JSON.stringify(res.data.admin));
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update admin.");
    } finally {
      setSavingId("");
    }
  };

  if (loading) {
    return <p className="p-8">Loading admins...</p>;
  }
  // Go back to Admin Dashboard
  const handleClose = () => {
    navigate("/admin/dashboard");
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Edit Admin Permissions</h1>

       <Link to="/admin/dashboard">
         <button
          type="button"
          onClick={handleClose}
          className="
            bg-green-900
            px-4 py-2
            mb-4
            rounded-lg
            font-semibold
            hover:bg-green-700
            transition
            text-white
          " >
          Close
        </button>
        </Link>

      {admins.length === 0 ? (
        <p>No admins found.</p>
      ) : (
        admins.map((admin) => (
          <div key={admin._id} className="bg-white border rounded-lg p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                {admin.first_name} {admin.last_name} ({admin.username})
              </h2>
              <p className="text-sm text-gray-600">{admin.email}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div>
                <label className="text-sm font-medium">Role</label>
                <select
                  value={admin.role}
                  onChange={(e) => handleRoleChange(admin._id, e.target.value)}
                  className="w-full border rounded p-2 mt-1"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Approved</label>
                <div className="mt-2">
                  <input
                    type="checkbox"
                    checked={!!admin.approved}
                    onChange={(e) => handleApprovalToggle(admin._id, e.target.checked)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 border rounded p-3">
              <p className="font-semibold mb-2">Permissions</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ALL_ADMIN_PERMISSIONS.map((permission) => (
                  <label key={permission.key} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={admin.permissions.includes(permission.key)}
                      onChange={(e) =>
                        handlePermissionToggle(admin._id, permission.key, e.target.checked)
                      }
                      disabled={admin.role === "superadmin"}
                    />
                    {permission.label}
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleSave(admin)}
              disabled={savingId === admin._id}
              className="mt-4 bg-black text-white px-4 py-2 rounded disabled:opacity-60"
            >
              {savingId === admin._id ? "Saving..." : "Save Changes"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
