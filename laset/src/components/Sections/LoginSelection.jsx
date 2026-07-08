import { useNavigate } from "react-router-dom";

export default function LoginSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-900 px-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-900 mb-2">
          Welcome
        </h1>

        <p className="text-gray-600 mb-8">
          Choose how you would like to sign in.
        </p>

        <button
          onClick={() => navigate("/login/customer")}
          className="w-full bg-green-800 hover:bg-green-700 text-white py-3 rounded-lg font-semibold mb-4"
        >
          Customer Login
        </button>

        <button
          onClick={() => navigate("/admin/login")}
          className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-semibold"
        >
          Admin Login
        </button>
      </div>
    </div>
  );
}