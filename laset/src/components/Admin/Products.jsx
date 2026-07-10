import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(`${API_URL}/admin/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(res.data.products);

    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      } else {
        alert("Failed to fetch products.");
      }
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

      await axios.delete(`${API_URL}/admin/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(products.filter((product) => product._id !== id));

      alert("Product deleted successfully!");

    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      } else {
        alert("Failed to delete product.");
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Products</h1>

        <Link
          to="/admin/add-product"
          className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded"
        >
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-3">Image</th>
                <th className="border p-3">Name</th>
                <th className="border p-3">Category</th>
                <th className="border p-3">Price</th>
                <th className="border p-3">Description</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="border p-2">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>

                  <td className="border p-2">{product.name}</td>

                  <td className="border p-2">{product.category}</td>

                  <td className="border p-2">
                    KSh {product.price}
                  </td>

                  <td className="border p-2">
                    {product.description}
                  </td>

                  <td className="border p-2 space-x-2">
                    <Link
                      to={`/admin/edit-product/${product._id}`}
                      className="bg-blue-600 text-white px-3 py-2 rounded"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="bg-red-600 text-white px-3 py-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}