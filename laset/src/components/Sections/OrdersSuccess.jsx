import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-900 text-white">
      <h1 className="text-3xl font-bold">Order Placed Successfully 🎉</h1>

      <Link to="/">
        <button className="mt-6 bg-black px-4 py-2">
          Continue Shopping
        </button>
      </Link>
    </div>
  );
}