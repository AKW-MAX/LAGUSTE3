import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login({
  isOpen = true,
  setIsOpen = () => {},
}) {
  const navigate = useNavigate();
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      email,
      password,
    };

    axios
      .post(`${VITE_API_URL}/Login`, formData)
      .then((response) => {
        console.log("Login successful:", response.data);

        if (response.data.message === "Login successful") {
          setIsOpen(false);
          navigate("/");
        }
      })
      .catch((error) => {
        const message =
          error.response?.data?.message || error.message;

        console.error(
          "Login failed:",
          error.response?.status,
          message
        );
      });
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate("/");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="
          bg-white text-black
          rounded-xl shadow-xl
          p-4 sm:p-6 md:p-8
          w-full max-w-md
          flex flex-col
        "
      >
        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
          Login
        </h2>

        {/* Email */}
        <div className="w-full mb-4">
          <label
            htmlFor="email"
            className="block mb-2 font-semibold text-sm sm:text-base"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            placeholder="Enter your email"
            className="
              border border-gray-300
              rounded-lg
              px-3 py-2
              w-full
              text-sm sm:text-base
              focus:outline-none
              focus:ring-2
              focus:ring-green-700
            "
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="w-full mb-6">
          <label
            htmlFor="password"
            className="block mb-2 font-semibold text-sm sm:text-base"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            placeholder="Enter your password"
            className="
              border border-gray-300
              rounded-lg
              px-3 py-2
              w-full
              text-sm sm:text-base
              focus:outline-none
              focus:ring-2
              focus:ring-green-700
            "
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="
              flex-1
              bg-green-900
              text-white
              py-2 sm:py-3
              rounded-lg
              font-semibold
              text-sm sm:text-base
              hover:bg-green-800
              transition
            "
          >
            Login
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="
              flex-1
              bg-green-700
              text-white
              py-2 sm:py-3
              rounded-lg
              font-semibold
              text-sm sm:text-base
              hover:bg-green-600
              transition
            "
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
}