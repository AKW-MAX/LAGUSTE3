import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, decreaseCart } from "../../Features/CartSlice";
import { assets } from "../../assets/assets.js";

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleRemoveFromCart = (cartItem) => {
    dispatch(removeFromCart(cartItem));
  };
  const handleDecreaseCart = (cartItem) => {
    dispatch(decreaseCart(cartItem));
  };
  const handleIncreaseCart = (cartItem) => {
    dispatch(addToCart(cartItem));
  };
  return (
    <>
      {/* Open Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-green-900 text-white rounded ml-150 mt-5"
      >
        Go to Cart
      </button>

      <div>
        {cart.cartItems.length === 0 ? (
          <p className="text-center mt-5 text-gray-500">Your cart is empty</p>
        ) : (
          <p className="text-center mt-5 text-gray-500">You have {cart.cartItems.length} items in your cart</p>
        )}
      </div>

      {/* Overlay */}
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/40" />
      )}

      {/* Cart */}
      <div
        className={`
          text-white
          w-[400px]
          bg-green-900
          fixed
          inset-y-0 right-0
          grid
          grid-rows-[auto_1fr_auto]
          p-4
          rounded-l-lg
          overflow-auto
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <h1 className="p-5 font-light text-xl">Shopping Cart</h1>

        <div>
          {cart.cartItems?.map((item) => (
            <div key={item.id} className="grid grid-cols-4 items-center">
              <div className="w-20 mt-5 mb-5 shadow-lg rounded-md">
                <img src={assets[item.img] || item.img} alt={item.name} className="h-20 rounded-md" />
              </div>
              <div>
                <h3 className="cartitems text-center font-thin text-xs mt-1">{item.name}</h3>
                <button
                  onClick={() => handleRemoveFromCart(item)}
                  className="bg-red-500 text-white font-thin text-xs inline-block rounded ml-6"
                >
                  Remove
                </button>
              </div>
              <div className="flex flex-col justify-center items-center mt-1">
                <p className="cart-product-price font-thin text-xs">Unit: Ksh {item.price}</p>
                <p className="cart-product-subtotal font-thin text-[10px] text-gray-200">
                  total: Ksh {(Number(item.price) * item.cartQuantity).toFixed(2)}
                </p>
              </div>
              <div className="justify-end items-center flex cart-product-quantity">
                <span
                  className="count m-2 font-thin text-xs inline-block bg-white text-black p-2 rounded-4xl cursor-pointer"
                  onClick={() => handleDecreaseCart(item)}
                >≤</span>
                <span className="font-thin text-xs inline-block bg-transparent text-white p-2 rounded-4xl cursor-pointer">
                  {item.cartQuantity}
                </span>
                <span
                  className="m-2 font-thin text-xs inline-block bg-white text-black p-2 rounded-4xl cursor-pointer"
                  onClick={() => handleIncreaseCart(item)}
                >≥</span>
              </div>
            </div>
          ))}
        </div>

        <div>
          <span className="ml-50 ">SubTotal </span>
          <span className="amount">  Ksh{cart.cartTotalAmount.toFixed(2)}</span>
        </div>

        <div className="self-end grid grid-cols-2 gap-2">
          <button onClick={() => setIsOpen(false)} className="bg-green-700 text-white font-bold p-2">
            CLOSE
          </button>

          <button className="bg-green-950 text-white font-bold p-2">CHECK OUT</button>
        </div>
      </div>
    </>
  );
}
