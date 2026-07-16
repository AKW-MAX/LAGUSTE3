import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { getApiBaseUrl } from "../../utils/api";

const Register = ({
  isOpen = true,
  setIsOpen = () => {},
}) => {
  const navigate = useNavigate();
  const VITE_API_URL = getApiBaseUrl();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    axios
      .post(`${VITE_API_URL}/register`, formData)
      .then(() => {
        setIsOpen(false);
        navigate("/login");
      })
      .catch((error) => {
        const message =
          error.response?.data?.message ||
          "Failed to register.";

        setErrorMessage(message);

        if (
          error.response?.status === 409 ||
          message.toLowerCase().includes("already exists")
        ) {
          navigate("/login");
        }
      });
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate("/");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 py-6 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="
          bg-white
          text-black
          rounded-xl
          shadow-xl
          p-5 sm:p-6 md:p-8
          w-full
          max-w-md
          flex
          flex-col
        "
      >
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
          Register
        </h2>

        {/* First Name */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            First Name
          </label>
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            className="
              w-full
              border border-gray-300
              rounded-lg
              px-3 py-2
              focus:outline-none
              focus:ring-2
              focus:ring-green-700
            "
            required
          />
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Last Name
          </label>
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            className="
              w-full
              border border-gray-300
              rounded-lg
              px-3 py-2
              focus:outline-none
              focus:ring-2
              focus:ring-green-700
            "
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="
              w-full
              border border-gray-300
              rounded-lg
              px-3 py-2
              focus:outline-none
              focus:ring-2
              focus:ring-green-700
            "
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="
              w-full
              border border-gray-300
              rounded-lg
              px-3 py-2
              focus:outline-none
              focus:ring-2
              focus:ring-green-700
            "
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            value={formData.confirm_password}
            onChange={handleChange}
            className="
              w-full
              border border-gray-300
              rounded-lg
              px-3 py-2
              focus:outline-none
              focus:ring-2
              focus:ring-green-700
            "
            required
          />
        </div>

        {errorMessage && (
          <p className="text-red-600 mb-4 text-sm">
            {errorMessage}
          </p>
        )}

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
              hover:bg-green-800
              transition
            "
          >
            Register
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="
              flex-1
              bg-green-900
              py-2 sm:py-3
              rounded-lg
              font-semibold
              hover:bg-green-800
              transition
              text-white
            "
          >
            Close
          </button>
        </div>

        <p className="mt-5 text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-900 font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
