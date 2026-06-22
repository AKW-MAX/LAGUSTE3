
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { clearCart } from "../../Features/CartSlice";

export default function Checkout() {
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        customer,
        orderItems: cart.cartItems,
        totalAmount: cart.cartTotalAmount,
      };

      const API_URL =
        import.meta.env.VITE_API_URL ||
        "https://agriventure-enterprise-backend.onrender.com";

      console.log("Posting to:", `${API_URL}/api/orders`);
      console.log(orderData);

      const res = await axios.post(
        `${API_URL}/api/orders`,
        orderData
      );

      console.log(res.data);

      if (res.data.success) {
        dispatch(clearCart());
        navigate("/OrderSuccess");
      }
    } catch (error) {
      console.error("ORDER ERROR:", error);

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
      }
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