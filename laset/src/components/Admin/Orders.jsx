import { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/orders`);
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/admin/orders/${id}`, {
        status,
      });

      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg shadow-md p-5 bg-white"
            >
              <div className="mb-3">
                <p>
                  <strong>Order ID:</strong> {order._id}
                </p>

                <p>
                  <strong>Customer:</strong>{" "}
                  {order.customer?.first_name}{" "}
                  {order.customer?.last_name}
                </p>

                <p>
                  <strong>Email:</strong> {order.customer?.email}
                </p>

                <p>
                  <strong>Total:</strong> KSh {order.totalAmount}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className="font-semibold text-blue-700">
                    {order.status}
                  </span>
                </p>
              </div>

              <h2 className="font-bold mb-2">Ordered Items</h2>

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
                      <td className="border p-2">{item.name}</td>
                      <td className="border p-2">{item.quantity}</td>
                      <td className="border p-2">
                        KSh {item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex gap-3">
                <button
                  onClick={() => updateStatus(order._id, "Approved")}
                  className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                >
                  Approve
                </button>

                <button
                  onClick={() => updateStatus(order._id, "Rejected")}
                  className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
                >
                  Reject
                </button>

                <button
                  onClick={() => updateStatus(order._id, "Pending")}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
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