import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets.js";

export default function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isMigratingImages, setIsMigratingImages] = useState(false);
  const [migrationSummary, setMigrationSummary] = useState(null);
  const [migrationDetails, setMigrationDetails] = useState({
    migrated: [],
    skipped: [],
    failed: [],
  });

  const isCloudinaryImageUrl = (value) => {
    const image = String(value || "").trim();
    return image.startsWith("https://res.cloudinary.com/");
  };

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

      const res = await axios.get(`${getApiBaseUrl()}/admin/products`, {
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

      await axios.delete(`${getApiBaseUrl()}/admin/products/${id}`, {
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

  const migrateImagesToCloudinary = async () => {
    if (!window.confirm("Migrate all existing product image URLs to Cloudinary now?")) {
      return;
    }

    try {
      setIsMigratingImages(true);
      setMigrationSummary(null);
      setMigrationDetails({ migrated: [], skipped: [], failed: [] });

      const token = localStorage.getItem("adminToken");

      const res = await axios.post(
        `${getApiBaseUrl()}/admin/products/migrate-images-to-cloudinary`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const summary = res.data?.summary || {};
      setMigrationSummary(summary);
      setMigrationDetails({
        migrated: Array.isArray(res.data?.migrated) ? res.data.migrated : [],
        skipped: Array.isArray(res.data?.skipped) ? res.data.skipped : [],
        failed: Array.isArray(res.data?.failed) ? res.data.failed : [],
      });

      await fetchProducts();
      alert("Image migration completed.");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      } else if (error.response?.status === 403) {
        alert("You do not have permission to run migration.");
        /* migrate local images to cloudinary */
      } else {
        const missingConfig = Array.isArray(error.response?.data?.missingConfig)
          ? error.response.data.missingConfig
          : [];

        if (missingConfig.length > 0) {
          alert(`Missing Cloudinary config: ${missingConfig.join(", ")}`);
        } else {
          alert(error.response?.data?.message || "Failed to migrate images.");
        }
      }
    } finally {
      setIsMigratingImages(false);
    }
  };

  const migrateLocalAssetKeysToCloudinary = async () => {
    if (!window.confirm("Upload local asset-key product images to Cloudinary now?")) {
      return;
    }

    try {
      setIsMigratingImages(true);
      setMigrationSummary(null);
      setMigrationDetails({ migrated: [], skipped: [], failed: [] });

      const token = localStorage.getItem("adminToken");

      if (!token) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      const migrated = [];
      const skipped = [];
      const failed = [];

      for (const product of products) {
        const keyOrUrl = String(product.img || product.image || "").trim();

        if (!keyOrUrl) {
          skipped.push({ productId: product._id, reason: "Missing image" });
          continue;
        }

        if (isCloudinaryImageUrl(keyOrUrl)) {
          skipped.push({ productId: product._id, reason: "Already Cloudinary" });
          continue;
        }

        if (/^https?:\/\//i.test(keyOrUrl)) {
          skipped.push({ productId: product._id, reason: "Public URL (use Migrate Images button)", image: keyOrUrl });
          continue;
        }

        const localAssetUrl = assets[keyOrUrl];

        if (!localAssetUrl || typeof localAssetUrl !== "string") {
          skipped.push({ productId: product._id, reason: "Asset key not found in assets map", image: keyOrUrl });
          continue;
        }

        try {
          const signRes = await axios.post(
            `${getApiBaseUrl()}/admin/cloudinary/sign-upload`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const signPayload = signRes.data || {};
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

          const fileResponse = await fetch(localAssetUrl);
          if (!fileResponse.ok) {
            throw new Error("Failed to load local asset image");
          }

          const blob = await fileResponse.blob();
          const extensionFromType = blob.type === "image/jpeg" ? "jpg" : (blob.type.split("/")[1] || "png");
          const fileName = `${keyOrUrl}.${extensionFromType}`;
          const imageFile = new File([blob], fileName, {
            type: blob.type || "image/png",
          });

          const formData = new FormData();
          formData.append("file", imageFile);
          formData.append("api_key", signPayload.apiKey);
          formData.append("timestamp", String(signPayload.timestamp));
          formData.append("signature", signPayload.signature);
          formData.append("folder", signPayload.folder);
          formData.append("transformation", signPayload.transformation);

          const uploadRes = await axios.post(
            `https://api.cloudinary.com/v1_1/${signPayload.cloudName}/image/upload`,
            formData
          );

          const secureUrl = uploadRes.data?.secure_url;
          if (!secureUrl) {
            throw new Error("Cloudinary did not return secure_url");
          }

          await axios.put(
            `${getApiBaseUrl()}/admin/products/${product._id}`,
            { img: secureUrl },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          migrated.push({
            productId: product._id,
            from: keyOrUrl,
            to: secureUrl,
          });
        } catch (migrationError) {
          failed.push({
            productId: product._id,
            image: keyOrUrl,
            reason: migrationError.response?.data?.message || migrationError.message,
          });
        }
      }

      setMigrationSummary({
        totalProducts: products.length,
        migrated: migrated.length,
        skipped: skipped.length,
        failed: failed.length,
      });
      setMigrationDetails({ migrated, skipped, failed });

      await fetchProducts();
      alert("Local asset-key migration completed.");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      } else if (error.response?.status === 403) {
        alert("You do not have permission to run local asset migration.");
      } else {
        const missingConfig = Array.isArray(error.response?.data?.missingConfig)
          ? error.response.data.missingConfig
          : [];

        if (missingConfig.length > 0) {
          alert(`Missing Cloudinary config: ${missingConfig.join(", ")}`);
        } else {
          alert(error.response?.data?.message || "Failed to migrate local asset-key images.");
        }
      }
    } finally {
      setIsMigratingImages(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Products</h1>

        <div className="flex items-center gap-3">
          <button
            onClick={migrateImagesToCloudinary}
            disabled={isMigratingImages}
            className="bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white px-5 py-2 rounded"
          >
            {isMigratingImages ? "Migrating..." : "Migrate URL Images"}
          </button>

          <button
            onClick={migrateLocalAssetKeysToCloudinary}
            disabled={isMigratingImages}
            className="bg-indigo-700 hover:bg-indigo-800 disabled:bg-indigo-400 text-white px-5 py-2 rounded"
          >
            {isMigratingImages ? "Migrating..." : "Migrate Local Keys"}
          </button>

          <Link
            to="/admin/add-product"
            className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded"
          >
            Add Product
          </Link>
        </div>
      </div>

      {migrationSummary ? (
        <div className="mb-6 rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 space-y-2">
          <p>
            Migration summary: Total {migrationSummary.totalProducts || 0}, Migrated {migrationSummary.migrated || 0}, Skipped {migrationSummary.skipped || 0}, Failed {migrationSummary.failed || 0}
          </p>

          {migrationDetails.skipped.length > 0 ? (
            <div>
              <p className="font-semibold">Skipped reasons</p>
              {Object.entries(
                migrationDetails.skipped.reduce((acc, item) => {
                  const reason = item?.reason || "Unknown";
                  acc[reason] = (acc[reason] || 0) + 1;
                  return acc;
                }, {})
              ).map(([reason, count]) => (
                <p key={reason}>- {reason}: {count}</p>
              ))}
            </div>
          ) : null}

          {migrationDetails.failed.length > 0 ? (
            <div>
              <p className="font-semibold">Failed items (first 5)</p>
              {migrationDetails.failed.slice(0, 5).map((item) => (
                <p key={item.productId}>- {item.productId}: {item.reason}</p>
              ))}
            </div>
          ) : null}

          {migrationDetails.migrated.length > 0 ? (
            <p className="text-green-800">
              Successfully migrated product IDs: {migrationDetails.migrated.slice(0, 5).map((item) => item.productId).join(", ")}
              {migrationDetails.migrated.length > 5 ? " ..." : ""}
            </p>
          ) : null}
        </div>
      ) : null}

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
                      src={assets[product.img] || assets[product.image] || product.img || product.image}
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