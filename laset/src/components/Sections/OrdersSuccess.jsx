import { Link, useLocation } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;
  const message = location.state?.message || "Order placed successfully";

  return (
    <div className="min-h-screen bg-green-900 px-6 py-10 text-white">
      <div className="mx-auto flex max-w-3xl flex-col rounded-xl bg-green-800 p-6 shadow-lg">
        <h1 className="text-3xl font-bold">{message} 🎉</h1>

        {order ? (
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-green-200">Order ID</p>
              <p className="font-semibold">{order._id}</p>
            </div>

            <div>
              <p className="text-sm uppercase tracking-wide text-green-200">Customer</p>
              <p className="font-semibold">{order.customer?.name || "N/A"}</p>
              <p className="text-sm text-green-100">{order.customer?.phone || ""}</p>
              <p className="text-sm text-green-100">{order.customer?.address || ""}</p>
            </div>

            <div>
              <p className="text-sm uppercase tracking-wide text-green-200">Items</p>
              <ul className="mt-2 space-y-2">
                {order.orderItems?.map((item, index) => (
                  <li key={`${item._id || index}-${index}`} className="flex justify-between rounded bg-green-700/70 px-3 py-2">
                    <span>{item.name} × {item.cartQuantity}</span>
                    <span>Ksh {item.price * item.cartQuantity}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between rounded bg-black/20 px-3 py-2">
              <span className="font-semibold">Total Amount</span>
              <span className="font-semibold">Ksh {order.totalAmount}</span>
            </div>

            <div>
              <p className="text-sm uppercase tracking-wide text-green-200">Status</p>
              <p className="font-semibold">{order.status || "Pending"}</p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-green-100">Your order has been received. We will contact you shortly.</p>
        )}

        <Link to="/">
          <button className="mt-8 bg-black px-4 py-2 font-semibold">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
}