import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { parseStoredJson } from "../../utils/storage";
import { Link } from "react-router-dom";

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

export default function AdminActivity() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const admin = parseStoredJson("admin", null);

    if (!token) {
      navigate("/admin/login");
      return;
    }

    if (admin?.role !== "superadmin") {
      alert("Only superadmin can view this page.");
      navigate("/admin/dashboard");
      return;
    }

    fetchAdminActivity(token);
  }, [navigate]);

  const fetchAdminActivity = async (token) => {
    try {
      const res = await axios.get(`${getApiBaseUrl()}/admin/admin-activity`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAdmins(res.data?.admins || []);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to load admin activity.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="p-8">Loading admin activity...</p>;
  }

   // Go back to Admin Dashboard
  const handleClose = () => {
    navigate("/admin/dashboard");
  };


  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Admin Roles and Approved Orders</h1>
      <Link to="/admin/dashboard">
         <button
          type="button"
          onClick={handleClose}
          className="
            bg-green-900
            px-4 py-2
            rounded-lg
            font-semibold
            hover:bg-green-700
            transition
            text-white
          "
 >
          Close
        </button>
        </Link>

      {admins.length === 0 ? (
        <p>No admins found.</p>
      ) : (
        admins.map((admin) => (
          <div key={admin._id} className="border rounded-lg p-5 bg-white shadow-sm">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                {admin.first_name} {admin.last_name} ({admin.username})
              </h2>
              <p className="text-sm text-gray-600">Email: {admin.email}</p>
              <p className="text-sm text-gray-600">Role: {admin.role}</p>
              <p className="text-sm text-gray-600">
                Approved Account: {admin.approved ? "Yes" : "No"}
              </p>
              <p className="text-sm text-gray-600">
                Permissions: {admin.permissions?.length ? admin.permissions.join(", ") : "None"}
              </p>
              <p className="text-sm font-medium mt-2">
                Approved Orders: {admin.approvedOrdersCount || 0}
              </p>
            </div>

            {admin.approvedOrders?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2 text-left">Order ID</th>
                      <th className="border p-2 text-left">Customer</th>
                      <th className="border p-2 text-left">Total</th>
                      <th className="border p-2 text-left">Approved At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admin.approvedOrders.map((order) => (
                      <tr key={order._id}>
                        <td className="border p-2">{order._id}</td>
                        <td className="border p-2">{order.customer?.name || order.customer?.email || "N/A"}</td>
                        <td className="border p-2">KSh {order.totalAmount}</td>
                        <td className="border p-2">
                          {order.approvedBy?.at
                            ? new Date(order.approvedBy.at).toLocaleString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No approved orders by this admin yet.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
