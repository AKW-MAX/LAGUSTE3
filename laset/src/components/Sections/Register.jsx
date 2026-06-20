import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";


const Register = ({ isOpen = true, setIsOpen }) => {
  const navigate = useNavigate();
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  // handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    axios
      .post(`${VITE_API_URL}/register`, formData)
      .then(() => {
        navigate("/Login");
        setIsOpen(false);
      })
      .catch((error) => {
        const message =
          error.response?.data?.message || "failed to Register";

        setErrorMessage(message);

        if (
          error.response?.status === 409 ||
          message.toLowerCase().includes("already exists")
        ) {
          navigate("/Login");
        }
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`fixed inset-0 flex flex-col items-center justify-center text-black bg-white bg-opacity-95 p-6 ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <h3 className="text-xl font-bold mb-4">Register</h3>

      {/* First Name */}
      <div className="w-full max-w-md">
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          name="first_name"
          placeholder="First Name"
          className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
          value={formData.first_name}
          onChange={handleChange}
        />
      </div>

      {/* Last Name */}
      <div className="w-full max-w-md">
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="last_name"
          placeholder="Last Name"
          className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
          value={formData.last_name}
          onChange={handleChange}
        />
      </div>

      {/* Email */}
      <div className="w-full max-w-md">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      {/* Password */}
      <div className="w-full max-w-md">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      {/* Confirm Password */}
      <div className="w-full max-w-md">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirm_password"
          placeholder="Confirm Password"
          className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
          value={formData.confirm_password}
          onChange={handleChange}
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="bg-green-900 text-white px-6 py-2 w-full max-w-md rounded"
      >
        Register
      </button>

      {/* Error message */}
      {errorMessage && (
        <p className="mt-3 text-red-600 font-medium">{errorMessage}</p>
      )}

      {/* Login link */}
      <p className="mt-4">
        Already have an account?{" "}
        <Link to="/Login" className="text-green-900 hover:underline">
          Login here
        </Link>
      </p>
    </form>
  );
};

export default Register;
