import Buttons from "../Common/Buttons";
import Register from "./Register";
import Login from "./Login";
import { Link } from "react-router-dom";
import { useState } from "react";
import { assets } from "../../assets/assets.js";

export default function SignUp() {
  const [isOpen, setIsOpen] = useState(false);
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://agriventure-enterprise-backend.onrender.com/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };
  
  return (
    <>
 

      <div className="bg-green-900 text-white p-6 flex items-center gap-4 border border-green-700 rounded-lg shadow-md overflow-hidden">

        {/* IMAGE - always on the left */}
        <div className="shrink-0">
          <img
            className="
              w-40 h-32 
              sm:w-44 sm:h-36 
              md:w-52 md:h-40 
              lg:w-120 lg:h-60
              object-cover 
              rounded-lg
            "
            src={assets.signupPic}
            alt="Signup image"
          />
        </div>

        {/* TEXT - always on the right */}
        <div className="grow">

          <h2 className="font-extrabold 
                         text-lg sm:text-xl md:text-2xl 
                         mb-2">
            Sign Up for Exclusive Offers
          </h2>

          <p className="font-semibold text-sm sm:text-base">
            Join our community and stay updated on the latest products <br />
            and promotions!
          </p>

          {/* Email + Button */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <Link to="/Login">
              <button
                type="button"
                className="border border-solid rounded-lg bg-green-950
                     pr-7 pl-7 pb-2 mr-4 mt-10 font-sans
                    text-white font-semibold">
                 Login
              </button>
              </Link>
              <Link to="/Register">
              <button
                type="button"
                className="border border-solid rounded-lg bg-green-950
                            pr-7 pl-7 pb-2 mr-4 mt-10 font-sans
                            text-white font-semibold">
                Register
              </button>
              </Link>
              <Buttons />
              <Register isOpen={isOpen} setIsOpen={setIsOpen} />
              <Login isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>

        </div>
      </div>
    </>
  );
}

         




