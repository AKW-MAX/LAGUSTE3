import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { getApiBaseUrl } from "../../utils/api";
import { parseStoredJson } from "../../utils/storage";

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString();
};

const isFulfilled = (status = "") => {
  const normalized = status.toLowerCase();
  return ["fulfilled", "completed", "delivered", "done"].includes(normalized);
};

export default function MyOrders() {
  const navigate = useNavigate();
  const [lookup, setLookup] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setOrders([]);
    setLookup("");
    setMessage("");
    setError("");

    navigate("/");
  };
  const loggedInUser = parseStoredJson("user", null);
  useEffect(() => {
    if (!loggedInUser) {
      navigate("/login");
    }
  }, [loggedInUser, navigate]);

  if (!loggedInUser) {
    return null;
  }

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!lookup.trim()) {
      setError("Please enter your phone number or email address.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.get(`${getApiBaseUrl()}/api/orders`, {
        params: {
          phone: lookup.trim(),
          email: lookup.trim(),
        },
      });

      const foundOrders = response.data.orders || [];
      setOrders(foundOrders);

      if (foundOrders.length === 0) {
        setMessage("No orders found for this phone number or email address.");
      } else {
        setMessage("Here are your orders.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load orders right now.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const pendingOrders = orders.filter((order) => !isFulfilled(order.status));
  const fulfilledOrders = orders.filter((order) => isFulfilled(order.status));

  return (
    <div className="min-h-screen bg-green-900 px-6 py-24 text-white">
      <div className="mx-auto max-w-5xl rounded-xl bg-green-800 p-6 shadow-lg">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="mt-2 text-green-100">Check your pending and fulfilled orders by phone number or email address.</p>
          </div>

          <Link to="/">
            <button className="rounded bg-black px-4 py-2 font-semibold">Back Home</button>
          </Link>
        </div>
        <div>
          <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded"
        >
          Logout
        </button>
        </div>

        <form onSubmit={handleSearch} className="mb-6 rounded-lg bg-green-700/70 p-4">
          <label className="mb-2 block font-semibold">Phone Number</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={lookup}
              onChange={(e) => setLookup(e.target.value)}
              placeholder="Enter your phone number or email address"
              className="flex-1 rounded border border-green-300 bg-white px-3 py-2 text-green-900"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-black px-4 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Searching..." : "Find Orders"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-4 rounded border border-red-300 bg-red-100 px-3 py-2 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {message && !error && (
          <div className="mb-4 rounded border border-green-300 bg-green-100 px-3 py-2 text-sm font-medium text-green-800">
            {message}
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-lg bg-green-700/70 p-4">
              <h2 className="mb-4 text-xl font-semibold">Pending Orders</h2>
              {pendingOrders.length > 0 ? (
                pendingOrders.map((order) => (
                  <div key={order._id} className="mb-3 rounded bg-green-800/80 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-semibold">{order._id}</span>
                      <span className="rounded bg-yellow-500 px-2 py-1 text-xs font-semibold text-black">{order.status || "Pending"}</span>
                    </div>
                    <p className="text-sm text-green-100">Placed: {formatDate(order.createdAt)}</p>
                    <p className="mt-2 font-semibold">Total: Ksh {order.totalAmount}</p>
                    <ul className="mt-2 space-y-1 text-sm text-green-100">
                      {order.orderItems?.slice(0, 3).map((item, index) => (
                        <li key={`${item._id || index}-${index}`}>
                          {item.name} × {item.cartQuantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-green-100">No pending orders found.</p>
              )}
            </section>

            <section className="rounded-lg bg-green-700/70 p-4">
              <h2 className="mb-4 text-xl font-semibold">Fulfilled Orders</h2>
              {fulfilledOrders.length > 0 ? (
                fulfilledOrders.map((order) => (
                  <div key={order._id} className="mb-3 rounded bg-green-800/80 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-semibold">{order._id}</span>
                      <span className="rounded bg-green-500 px-2 py-1 text-xs font-semibold text-black">{order.status || "Fulfilled"}</span>
                    </div>
                    <p className="text-sm text-green-100">Placed: {formatDate(order.createdAt)}</p>
                    <p className="mt-2 font-semibold">Total: Ksh {order.totalAmount}</p>
                    <ul className="mt-2 space-y-1 text-sm text-green-100">
                      {order.orderItems?.slice(0, 3).map((item, index) => (
                        <li key={`${item._id || index}-${index}`}>
                          {item.name} × {item.cartQuantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-green-100">No fulfilled orders found.</p>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
