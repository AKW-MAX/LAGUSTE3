import Buttons from "../Common/Buttons";
import { useState } from "react";

export default function SignUp() {
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
      const response = await fetch("http://localhost:3000/register", {
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
 

      <div className="bg-green-900 text-white p-6 flex items-center gap-4">

        {/* IMAGE - always on the left */}
        <div className="flex-shrink-0">
          <img
            className="
              w-40 h-32 
              sm:w-44 sm:h-36 
              md:w-52 md:h-40 
              lg:w-120 lg:h-60
              object-cover 
              rounded-lg
            "
            src="/images/SignupPic.png"
            alt="Signup image"
          />
        </div>

        {/* TEXT - always on the right */}
        <div className="flex-grow">

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
            <input
              type="email"
              placeholder="Enter your email"
              value ={email}
              onChange={(e) => setEmail(e.target.value)}
              onSubmit={handleSubmit} 
              className="text-black mt-10 bg-white rounded-lg p-2 
                         w-full sm:w-64"
            />
            <Buttons />
          </div>

        </div>
      </div>
    </>
  );
}

         




