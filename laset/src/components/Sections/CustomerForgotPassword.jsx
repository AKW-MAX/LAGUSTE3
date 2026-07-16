import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const getApiBaseUrl = () => {
  const hostname = window.location.hostname;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:5000";
  }

  return (
    import.meta.env.VITE_API_URL ||
    "https://agriventure-enterprise-backend.onrender.com"
  );
};

export default function CustomerForgotPassword() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(`${getApiBaseUrl()}/forgot-password/request`, {
        email,
      });

      setMessage(res.data?.message || "Reset token requested.");
    } catch (error) {
      console.error(error);
      const missingConfig = Array.isArray(error.response?.data?.missingConfig)
        ? error.response.data.missingConfig
        : [];

      if (missingConfig.length > 0) {
        setMessage(`Missing email config: ${missingConfig.join(", ")}`);
      } else {
        setMessage(error.response?.data?.message || "Failed to request reset token.");
      }
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post(`${getApiBaseUrl()}/forgot-password/reset`, {
        email,
        token,
        newPassword,
      });

      setMessage(res.data?.message || "Password reset successful.");
      setToken("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 bg-white rounded-lg shadow-lg p-8 space-y-8">
      <h1 className="text-2xl font-bold text-center">Customer Forgot Password</h1>

      <form onSubmit={handleRequestToken} className="space-y-3">
        <h2 className="font-semibold">1. Request Reset Token</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
        >
          Request Token
        </button>

        <p className="text-xs text-gray-600">
          A reset token will be sent to your email if the account exists.
        </p>
      </form>

      <form onSubmit={handleResetPassword} className="space-y-3">
        <h2 className="font-semibold">2. Reset Password</h2>

        <input
          type="text"
          placeholder="Reset Token"
          className="w-full border p-3 rounded"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-3 rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full border p-3 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <p className="text-xs text-gray-600">
          Password must contain uppercase, lowercase, number, special character, and be at least 8 characters.
        </p>

        <button
          type="submit"
          className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
        >
          Reset Password
        </button>
      </form>

      {message && <p className="text-sm text-center text-gray-700">{message}</p>}

      <div className="text-center text-sm">
        <Link className="text-blue-700 underline" to="/login">
          Back to Login Selection
        </Link>
      </div>
    </div>
  );
}
