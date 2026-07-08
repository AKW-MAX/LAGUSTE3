import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    img: "",
  });

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/products`,
        product
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
      alert("Failed to add product.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-3xl font-bold mb-6">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={product.category}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          rows="4"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="text"
          name="img"
          placeholder="Image URL"
          value={product.img}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-700 hover:bg-green-800 text-white p-3 rounded font-bold"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}