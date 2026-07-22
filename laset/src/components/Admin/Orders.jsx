import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getApiBaseUrl } from "../../utils/api";
import { Link } from "react-router-dom";


export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

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

      const res = await axios.get(
        `${getApiBaseUrl()}/admin/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data.orders || []);

    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        navigate("/admin/login");
      }
    }
  };

  const updateStatus = async (id, status) => {
    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      alert("Invalid status update requested.");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

      setUpdatingOrderId(id);

      await axios.put(
        `${getApiBaseUrl()}/admin/orders/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id
            ? {
                ...order,
                status,
                approvedBy:
                  status === "Approved"
                    ? order.approvedBy
                    : null,
              }
            : order
        )
      );

      await fetchOrders();

    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        navigate("/admin/login");
        return;
      }

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update order.";

      alert(message);

    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Go back to Admin Dashboard
  const handleClose = () => {
    navigate("/admin/dashboard");
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">

      <div className="flex items-center justify-between mb-8">

        <h1 className="text-2xl sm:text-3xl font-bold">
          Manage Orders
        </h1>

        <Link to="/admin/dashboard">
         <button
          type="button"
          onClick={handleClose}
          className="
            bg-green-900
            px-4 py-2
            rounded-lg
            font-semibold
            hover:bg-green-800
            transition
            text-white
          "
          >
          Close
         </button>
        </Link>

      </div>

      {orders.length === 0 ? (

        <p>No orders found.</p>

      ) : (

        <div className="space-y-6">

          {orders.map((order) => (

            <div
              key={order._id}
              className="bg-white shadow rounded-lg p-5 border"
            >

              <p>
                <strong>Order ID:</strong>{" "}
                {order._id}
              </p>

              <p>
                <strong>Customer:</strong>{" "}
                {order.customer?.name ||
                  order.user?.name ||
                  "N/A"}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {order.customer?.email ||
                  order.user?.email ||
                  "N/A"}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {order.customer?.phone || "N/A"}
              </p>

              <p>
                <strong>Total:</strong>{" "}
                KSh {order.totalAmount}
              </p>

              <p>
                <strong>Status:</strong>{" "}

                <span
                  className={`
                    font-bold
                    ${
                      order.status === "Approved"
                        ? "text-green-700"
                        : order.status === "Rejected"
                        ? "text-red-700"
                        : "text-yellow-600"
                    }
                  `}
                >
                  {order.status}
                </span>
              </p>

              <h2 className="font-bold mt-4 mb-2">
                Ordered Items
              </h2>

              <div className="overflow-x-auto">

                <table className="w-full border mb-4">

                  <thead className="bg-gray-200">

                    <tr>
                      <th className="border p-2 text-left">
                        Product
                      </th>

                      <th className="border p-2 text-left">
                        Quantity
                      </th>

                      <th className="border p-2 text-left">
                        Price
                      </th>
                    </tr>

                  </thead>

                  <tbody>

                    {order.orderItems?.map(
                      (item, index) => (

                        <tr key={index}>

                          <td className="border p-2">
                            {item.name}
                          </td>

                          <td className="border p-2">
                            {item.cartQuantity ??
                              item.quantity ??
                              0}
                          </td>

                          <td className="border p-2">
                            KSh {item.price}
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

              <div className="flex flex-wrap gap-3">

                <button
                  onClick={() =>
                    updateStatus(
                      order._id,
                      "Approved"
                    )
                  }
                  disabled={
                    updatingOrderId === order._id
                  }
                  className="
                    bg-green-700
                    text-white
                    px-4 py-2
                    rounded
                    disabled:opacity-60
                  "
                >
                  {updatingOrderId === order._id
                    ? "Updating..."
                    : "Approve"}
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      order._id,
                      "Rejected"
                    )
                  }
                  disabled={
                    updatingOrderId === order._id
                  }
                  className="
                    bg-red-700
                    text-white
                    px-4 py-2
                    rounded
                    disabled:opacity-60
                  "
                >
                  Reject
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      order._id,
                      "Pending"
                    )
                  }
                  disabled={
                    updatingOrderId === order._id
                  }
                  className="
                    bg-yellow-500
                    text-white
                    px-4 py-2
                    rounded
                    disabled:opacity-60
                  "
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