import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { getApiBaseUrl } from "../../utils/api";

export default function Login({
  isOpen = true,
  setIsOpen = () => {},
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = getApiBaseUrl();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      if (response.data.message === "Login successful") {
        // Save the logged-in user
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        // Optional token if your backend returns one
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        setIsOpen(false);

        navigate(location.state?.from || "/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password."
      );
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate(location.state?.from || "/");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <h2 className="mb-6 text-center text-2xl font-bold">
          Customer Login
        </h2>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="mb-2 block font-semibold">
            Email
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded border p-3 focus:outline-none focus:ring-2 focus:ring-green-700"
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block font-semibold">
            Password
          </label>

          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full rounded border p-3 focus:outline-none focus:ring-2 focus:ring-green-700"
          />
        </div>

        <div className="mb-6 text-center">
          <Link to="/forgot-password/customer" className="text-sm text-blue-700 underline">
            Forgot password?
          </Link>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 rounded bg-green-900 py-3 font-semibold text-white hover:bg-green-800"
          >
            Login
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="flex-1 rounded bg-gray-500 py-3 font-semibold text-white hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}