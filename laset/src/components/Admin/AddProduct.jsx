import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const getApiBaseUrl = () => {
  if (window.location.hostname === "localhost") {
    return "http://localhost:5000";
  }

  return (
    import.meta.env.VITE_API_URL ||
    "https://agriventure-enterprise-backend.onrender.com"
  );
};

export default function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    img: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("adminToken");

      await axios.post(
        `${getApiBaseUrl()}/admin/products`,
        product,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product added successfully!");

      setProduct({
        name: "",
        category: "",
        description: "",
        price: "",
        img: "",
      });

      navigate("/admin/products");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");

        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      } else {
        alert(error.response?.data?.message || "Failed to add product.");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow-lg">
      <h1 className="text-3xl font-bold mb-6">
        Add Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          className="w-full border rounded p-3"
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={product.category}
          onChange={handleChange}
          className="w-full border rounded p-3"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
          rows="4"
          className="w-full border rounded p-3"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          className="w-full border rounded p-3"
          required
        />

        <input
          type="text"
          name="img"
          placeholder="Image URL"
          value={product.img}
          onChange={handleChange}
          className="w-full border rounded p-3"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-700 hover:bg-green-800 text-white font-bold p-3 rounded"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}