import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";
    
    console.log(import.meta.env.VITE_API_URL);

  async function login() {
    try {
      const res = await axios.post(`${API_URL}/admin/login`, {
        username,
        password,
      });

      if (res.data.success) {
        // Save JWT token
        localStorage.setItem("adminToken", res.data.token);

        // Save admin information
        localStorage.setItem(
          "admin",
          JSON.stringify(res.data.admin)
        );

        alert("Login successful!");

        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message || "Invalid username or password."
      );
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white shadow-lg rounded-lg p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Admin Login
      </h1>

      <input
        type="text"
        className="border p-3 w-full mb-4 rounded"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        className="border p-3 w-full mb-6 rounded"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={login}
        className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded font-semibold"
      >
        Login
      </button>
    </div>
  );
}