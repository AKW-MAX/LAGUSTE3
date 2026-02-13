import Cards from "../Common/Cards";
import { useState } from "react";
import { Link } from 'react-router-dom';

export default function Cart() {

  const [isOpen, setIsOpen] = useState(false); // hidden by default

  return (
    <>
        {/* Open Cart Button */}
        <button
            onClick={() => setIsOpen(true)}
            className=" px-4 py-2 bg-green-900 text-white rounded ml-150 mt-5 ">
            Go to Cart
        </button>
        

        {/* Overlay */}
        {isOpen && (
            <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40"
            />
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

        <h1 className="p-5 font-light text-xl">
          Shopping Cart
        </h1>

        <div>
          <Cards
            imgSrc="/images/Kelpreal.png"
            imgAlt="capsicum image"
            name="Kelpreal 250ml"
            price="sh600"
          />
        </div>

        <div className="self-end grid grid-cols-2 gap-2">
          <button
            onClick={() => setIsOpen(false)}
            className="bg-green-700 text-white font-bold p-2"
          >
            CLOSE
          </button>

          <button className="bg-green-950 text-white font-bold p-2">
            CHECK OUT
          </button>
        </div>

      </div>
    </>
  );
}
