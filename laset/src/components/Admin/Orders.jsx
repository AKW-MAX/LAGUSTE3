import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(`${API_URL}/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data.orders);

    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("adminToken");

      await axios.put(
        `${API_URL}/admin/orders/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchOrders();

    } catch (error) {
      console.error(error);
      alert("Failed to update order.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Manage Orders
      </h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-6">

          {orders.map((order) => (

            <div
              key={order._id}
              className="bg-white shadow rounded-lg p-5 border"
            >
              <p><strong>Order ID:</strong> {order._id}</p>

              <p>
                <strong>Customer:</strong>{" "}
                {order.customer?.first_name}{" "}
                {order.customer?.last_name}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {order.customer?.email}
              </p>

              <p>
                <strong>Total:</strong> KSh {order.totalAmount}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span className="font-bold text-blue-700">
                  {order.status}
                </span>
              </p>

              <h2 className="font-bold mt-4 mb-2">
                Ordered Items
              </h2>

              <table className="w-full border mb-4">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-2">Product</th>
                    <th className="border p-2">Quantity</th>
                    <th className="border p-2">Price</th>
                  </tr>
                </thead>

                <tbody>
                  {order.orderItems?.map((item, index) => (
                    <tr key={index}>
                      <td className="border p-2">
                        {item.name}
                      </td>

                      <td className="border p-2">
                        {item.quantity}
                      </td>

                      <td className="border p-2">
                        KSh {item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex gap-3">

                <button
                  onClick={() =>
                    updateStatus(order._id, "Approved")
                  }
                  className="bg-green-700 text-white px-4 py-2 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    updateStatus(order._id, "Rejected")
                  }
                  className="bg-red-700 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>

                <button
                  onClick={() =>
                    updateStatus(order._id, "Pending")
                  }
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Pending
                </button>

              </div>
            </div>

          ))}

        </div>
      )}
    </div>
  );
}