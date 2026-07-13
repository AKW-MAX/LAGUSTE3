import Buttons from "../Common/Buttons";
import Register from "./Register";
import Login from "./Login";
import { Link } from "react-router-dom";
import { useState } from "react";
import { assets } from "../../assets/assets.js";

export default function SignUp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="
          bg-green-900 text-white
          p-3 sm:p-4 md:p-6 lg:p-8
          flex flex-row items-center
          gap-2 sm:gap-4 md:gap-6
          border border-green-700
          rounded-lg shadow-md
          overflow-x-auto
          w-full
        "
      >
        {/* IMAGE */}
        <div className="shrink-0">
          <img
            className="
              w-20 h-16
              sm:w-32 sm:h-24
              md:w-40 md:h-32
              lg:w-52 lg:h-40
              object-cover
              rounded-lg
            "
            src={assets.signupPic}
            alt="Signup image"
          />
        </div>

        {/* TEXT */}
        <div className="flex-1 min-w-0">
          <h2
            className="
              font-extrabold
              text-base sm:text-lg md:text-2xl lg:text-3xl
              mb-2
            "
          >
            Sign Up for Exclusive Offers
          </h2>

          <p
            className="
              font-semibold
              text-sm sm:text-sm md:text-base lg:text-lg
            "
          >
            Join our community and stay updated on the latest
            products and promotions!
          </p>

          {/* Buttons */}
          <div className="mt-3 flex  items-center gap-2 sm:gap-2">
            <Link to="/Login">
              <button
                type="button"
                className="
                  bg-green-950
                  px-3 py-1
                  sm:px-4 sm:py-2
                  md:px-5 md:py-2
                  rounded-lg
                  text-xs sm:text-sm md:text-base
                  font-semibold
                  hover:bg-green-800
                  transition
                "
              >
                Login
              </button>
            </Link>

            <Link to="/Register">
              <button
                type="button"
                className="
                  bg-green-950
                  px-3 py-1
                  sm:px-4 sm:py-2
                  md:px-5 md:py-2
                  rounded-lg
                  text-xs sm:text-sm md:text-base
                  font-semibold
                  hover:bg-green-800
                  transition
                "
              >
                Register
              </button>
            </Link>

            <Buttons />
          </div>

          <Register isOpen={isOpen} setIsOpen={setIsOpen} />
          <Login isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>
    </>
  );
}

         




