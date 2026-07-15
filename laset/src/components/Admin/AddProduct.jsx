import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { resolveImageSource } from "../../assets/assets";

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
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    img: "",
  });

  const imagePreview = resolveImageSource(product.img || "");

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

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedFileName("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      e.target.value = "";
      setSelectedFileName("");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be 2MB or less.");
      e.target.value = "";
      setSelectedFileName("");
      return;
    }

    const uploadImage = async () => {
      setIsUploadingImage(true);

      try {
        const token = localStorage.getItem("adminToken");

        if (!token) {
          throw new Error("Admin session expired. Please login again.");
        }

        const signatureResponse = await axios.post(
          `${getApiBaseUrl()}/admin/cloudinary/sign-upload`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const signPayload = signatureResponse.data || {};

        if (
          !signPayload.cloudName ||
          !signPayload.apiKey ||
          !signPayload.signature ||
          !signPayload.timestamp ||
          !signPayload.folder ||
          !signPayload.transformation
        ) {
          throw new Error("Invalid Cloudinary signature response from server.");
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", signPayload.apiKey);
        formData.append("timestamp", String(signPayload.timestamp));
        formData.append("signature", signPayload.signature);
        formData.append("folder", signPayload.folder);
        formData.append("transformation", signPayload.transformation);

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${signPayload.cloudName}/image/upload`,
          formData
        );

        const secureUrl = response.data?.secure_url || "";

        if (!secureUrl) {
          throw new Error("Cloudinary did not return an image URL.");
        }

        setProduct((prev) => ({
          ...prev,
          img: secureUrl,
        }));
        setSelectedFileName(file.name);
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.error?.message || error.message || "Image upload failed.");
        e.target.value = "";
        setSelectedFileName("");
      } finally {
        setIsUploadingImage(false);
      }
    };

    uploadImage();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.img.trim()) {
      alert("Please upload an image to Cloudinary before saving this product.");
      return;
    }

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
      setSelectedFileName("");

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

        <div className="rounded border p-3">
          <label htmlFor="product-image-file" className="mb-2 block text-sm font-medium text-gray-700">
            Upload image to Cloudinary
          </label>
          <input
            id="product-image-file"
            type="file"
            accept="image/*"
            onChange={handleImageFileChange}
            disabled={isUploadingImage}
            className="w-full border rounded p-3"
          />
          <p className="mt-2 text-sm text-gray-600">
            The selected file is uploaded to Cloudinary using a backend-generated signature, and only the returned public URL is saved in MongoDB.
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Uploaded images are automatically normalized to the product card format (480x600, center-cropped).
          </p>
          {isUploadingImage ? (
            <p className="mt-1 text-sm text-blue-700">Uploading image...</p>
          ) : null}
          {selectedFileName ? (
            <p className="mt-1 text-sm text-green-700">Selected file: {selectedFileName}</p>
          ) : null}
        </div>

        {imagePreview ? (
          <div className="rounded border p-3">
            <p className="mb-2 text-sm font-medium text-gray-700">Image preview</p>
            <img
              src={imagePreview}
              alt={product.name || "Product preview"}
              className="h-48 w-40 rounded object-cover"
            />
          </div>
        ) : null}

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