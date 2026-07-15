
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { clearCart } from "../../Features/CartSlice";
import { buildApiUrl } from "../../utils/api";

export default function Checkout() {
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const storedUser = savedUser ? JSON.parse(savedUser) : null;

      if (!storedUser) {
        navigate("/login/customer", { state: { from: "/CheckOut" } });
        return;
      }

      setCustomer((prev) => ({
        ...prev,
        name: `${storedUser.first_name || ""} ${storedUser.last_name || ""}`.trim(),
      }));
    } catch {
      navigate("/login/customer", { state: { from: "/CheckOut" } });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
    if (errorMessage) setErrorMessage("");
  };

  const handlePlaceOrder = async () => {
    setErrorMessage("");

    try {
      const savedUser = localStorage.getItem("user");
      const storedUser = savedUser ? JSON.parse(savedUser) : null;

      if (!storedUser) {
        navigate("/login/customer", { state: { from: "/CheckOut" } });
        return;
      }

      const orderData = {
        customer,
        orderItems: cart.cartItems,
        totalAmount: cart.cartTotalAmount,
        user: {
          id: storedUser.id || storedUser._id || null,
          name: `${storedUser.first_name || ""} ${storedUser.last_name || ""}`.trim(),
          email: storedUser.email || "",
        },
      };

      const orderUrl = buildApiUrl("/api/orders");

      console.log("Posting to:", orderUrl);
      console.log(orderData);

      const res = await axios.post(orderUrl, orderData);

      console.log(res.data);

      if (res?.data?.success || res?.status >= 200 && res?.status < 300) {
        dispatch(clearCart());
        navigate("/OrdersSuccess", {
          state: {
            order: res?.data?.order || null,
            message: res?.data?.message || "Order placed successfully",
          },
        });
      } else {
        setErrorMessage("Your order could not be placed. Please try again.");
      }
    } catch (error) {
      console.error("ORDER ERROR:", error);

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
      }

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Your order could not be placed. Please try again.";

      setErrorMessage(message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-green-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">
        Checkout
      </h1>

      {/* Order Summary */}
      <div className="bg-green-800 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Order Summary
        </h2>

        {cart.cartItems.map((item) => (
          <div
            key={item._id}
            className="flex justify-between py-2 border-b border-green-700"
          >
            <span>
              {item.name} × {item.cartQuantity}
            </span>

            <span>
              Ksh {item.price * item.cartQuantity}
            </span>
          </div>
        ))}

        <div className="flex justify-between mt-4 font-bold text-lg">
          <span>Total</span>
          <span>Ksh {cart.cartTotalAmount}</span>
        </div>
      </div>

      {/* Customer Details */}
      <div className="bg-green-800 p-4 rounded-lg">
        {errorMessage && (
          <div className="mb-4 rounded border border-red-300 bg-red-100 px-3 py-2 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        )}
        <h2 className="text-xl font-semibold mb-4">
          Customer Details
        </h2>

        <input
          type="text"
          name="name"
          value={customer.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-2 mb-3 text-white bg-green-700 rounded"
        />

        <input
          type="text"
          name="phone"
          value={customer.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full p-2 mb-3 text-white bg-green-700 rounded"
        />

        <input
          type="text"
          name="address"
          value={customer.address}
          onChange={handleChange}
          placeholder="Delivery Address"
          className="w-full p-2 mb-3 text-white bg-green-700 rounded"
        />

        <button
          onClick={handlePlaceOrder}
          className="w-full bg-black p-3 font-bold mt-3"
        >
          Place Order
        </button>
      </div>

      <Link to="/Cart">
        <button className="mt-4 underline">
          ← Back to Cart
        </button>
      </Link>
    </div>
  );
}