
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../Features/CartSlice";


export default function Checkout() {
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const handlePlaceOrder = async () => {
  try {
    const orderData = {
      customer: {
        name: "",
        phone: "",
        address: "",
      },
      orderItems: cart.cartItems,
      totalAmount: cart.cartTotalAmount,
    };

     const res = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/orders`,
  orderData
);

    if (res.data.success) {
      dispatch(clearCart());
      navigate("/OrderSuccess");
    }
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="min-h-screen w-full bg-green-900 text-white p-6">

      <h1 className="text-2xl font-bold mb-6">
        Checkout
      </h1>

      {/* Order Summary */}
      <div className="bg-green-800 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        {cart.cartItems.map((item) => (
          <div
            key={item._id}
            className="flex justify-between py-2 border-b border-green-700"
          >
            <span>{item.name} × {item.cartQuantity}</span>
            <span>Ksh {item.price * item.cartQuantity}</span>
          </div>
        ))}

        <div className="flex justify-between mt-4 font-bold text-lg">
          <span>Total</span>
          <span>Ksh {cart.cartTotalAmount}</span>
        </div>
      </div>

      {/* Customer Form */}
      <div className="bg-green-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Customer Details</h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 mb-3 text-white"
        />

        <input
          type="text"
          placeholder="Phone Number"
          className="w-full p-2 mb-3 text-white"
        />

        <input
          type="text"
          placeholder="Delivery Address"
          className="w-full p-2 mb-3 text-white"
        />

        <button  onClick={handlePlaceOrder} 
        className="w-full bg-black p-3 font-bold mt-3">
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