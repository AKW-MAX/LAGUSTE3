import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

export default function AdminAuditLogs() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const admin = JSON.parse(localStorage.getItem("admin") || "null");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    if (admin?.role !== "superadmin") {
      alert("Only superadmin can view audit logs.");
      navigate("/admin/dashboard");
      return;
    }

    fetchLogs(token);
  }, [navigate]);

  const fetchLogs = async (token) => {
    try {
      const res = await axios.get(`${getApiBaseUrl()}/admin/audit-logs?limit=200`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLogs(res.data?.logs || []);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-8">Loading audit logs...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Audit Logs</h1>

      {logs.length === 0 ? (
        <p>No audit logs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">Time</th>
                <th className="border p-2 text-left">Username</th>
                <th className="border p-2 text-left">Action</th>
                <th className="border p-2 text-left">Target</th>
                <th className="border p-2 text-left">Status</th>
                <th className="border p-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td className="border p-2">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="border p-2">{log.username || "N/A"}</td>
                  <td className="border p-2">{log.action}</td>
                  <td className="border p-2">{log.targetType || "-"}{log.targetId ? ` (${log.targetId})` : ""}</td>
                  <td className="border p-2">{log.status}</td>
                  <td className="border p-2">{log.details || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
