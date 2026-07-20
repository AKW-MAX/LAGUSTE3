import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { resolveImageSource } from "../../assets/assets";

const getApiBaseUrl = () => {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "http://localhost:5000";
  }

  return (
    import.meta.env.VITE_API_URL ||
    "https://agriventure-enterprise-backend.onrender.com"
  );
};

export default function AddProduct() {
  const navigate = useNavigate();

  const [selectedFileName, setSelectedFileName] =
    useState("");

  const [isUploadingImage, setIsUploadingImage] =
    useState(false);

  const [product, setProduct] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    img: "",
  });

  const imagePreview = resolveImageSource(
    product.img || ""
  );

  // =========================
  // CHECK ADMIN LOGIN
  // =========================

  useEffect(() => {
    const token =
      localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  // =========================
  // HANDLE INPUT CHANGES
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  // =========================
  // UPLOAD IMAGE
  // =========================

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedFileName("");
      return;
    }

    // Check file type

    if (!file.type.startsWith("image/")) {
      alert(
        "Please select a valid image file."
      );

      e.target.value = "";
      setSelectedFileName("");

      return;
    }

    // Check file size

    if (
      file.size >
      2 * 1024 * 1024
    ) {
      alert(
        "Image size must be 2MB or less."
      );

      e.target.value = "";
      setSelectedFileName("");

      return;
    }

    const uploadImage = async () => {
      setIsUploadingImage(true);

      try {
        const token =
          localStorage.getItem(
            "adminToken"
          );

        if (!token) {
          throw new Error(
            "Admin session expired. Please login again."
          );
        }

        // Get Cloudinary signature

        const signatureResponse =
          await axios.post(
            `${getApiBaseUrl()}/admin/cloudinary/sign-upload`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const signPayload =
          signatureResponse.data || {};

        if (
          !signPayload.cloudName ||
          !signPayload.apiKey ||
          !signPayload.signature ||
          !signPayload.timestamp ||
          !signPayload.folder ||
          !signPayload.transformation
        ) {
          throw new Error(
            "Invalid Cloudinary signature response from server."
          );
        }

        // Create upload form data

        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        formData.append(
          "api_key",
          signPayload.apiKey
        );

        formData.append(
          "timestamp",
          String(
            signPayload.timestamp
          )
        );

        formData.append(
          "signature",
          signPayload.signature
        );

        formData.append(
          "folder",
          signPayload.folder
        );

        formData.append(
          "transformation",
          signPayload.transformation
        );

        // Upload to Cloudinary

        const response =
          await axios.post(
            `https://api.cloudinary.com/v1_1/${signPayload.cloudName}/image/upload`,
            formData
          );

        const secureUrl =
          response.data?.secure_url ||
          "";

        if (!secureUrl) {
          throw new Error(
            "Cloudinary did not return an image URL."
          );
        }

        // Save URL in product state

        setProduct((prevProduct) => ({
          ...prevProduct,
          img: secureUrl,
        }));

        setSelectedFileName(
          file.name
        );

      } catch (error) {
        console.error(error);

        alert(
          error.response?.data
            ?.error?.message ||
            error.message ||
            "Image upload failed."
        );

        e.target.value = "";
        setSelectedFileName("");

      } finally {
        setIsUploadingImage(false);
      }
    };

    uploadImage();
  };

  // =========================
  // SUBMIT PRODUCT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.img.trim()) {
      alert(
        "Please upload an image to Cloudinary before saving this product."
      );

      return;
    }

    if (isUploadingImage) {
      alert(
        "Please wait for the image upload to finish."
      );

      return;
    }

    try {
      const token =
        localStorage.getItem(
          "adminToken"
        );

      await axios.post(
        `${getApiBaseUrl()}/admin/products`,
        {
          ...product,

          price: Number(
            product.price
          ),

          stock: Number(
            product.stock || 0
          ),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        "Product added successfully!"
      );

      setProduct({
        name: "",
        category: "",
        description: "",
        price: "",
        stock: "",
        img: "",
      });

      setSelectedFileName("");

      navigate(
        "/admin/products"
      );

    } catch (error) {
      console.error(error);

      if (
        error.response?.status ===
        401
      ) {
        alert(
          "Session expired. Please login again."
        );

        localStorage.removeItem(
          "adminToken"
        );

        navigate(
          "/admin/login"
        );

      } else {
        alert(
          error.response?.data
            ?.message ||
            "Failed to add product."
        );
      }
    }
  };

  // =========================
  // CLOSE
  // =========================

  const handleClose = () => {
    navigate(
      "/admin/dashboard"
    );
  };

  return (
    <div className="
      min-h-screen
      bg-gray-100
      px-3
      py-5
      sm:px-5
      sm:py-8
      md:px-8
      md:py-10
    ">

      <div className="
        w-full
        max-w-2xl
        mx-auto
        bg-white
        rounded-xl
        shadow-lg
        p-4
        sm:p-6
        md:p-8
      ">

        {/* =========================
            HEADER
        ========================= */}

        <div className="
          flex
          flex-col
          gap-4
          mb-6
          sm:flex-row
          sm:items-center
          sm:justify-between
        ">

          <h1 className="
            text-2xl
            sm:text-3xl
            font-bold
            text-gray-800
          ">
            Add Product
          </h1>

          <button
            type="button"
            onClick={handleClose}
            className="
              w-full
              sm:w-auto
              bg-green-900
              px-4
              py-2
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

        {/* =========================
            FORM
        ========================= */}

        <form
          onSubmit={handleSubmit}
          className="
            space-y-4
          "
        >

          {/* PRODUCT NAME */}

          <div>

            <label className="
              block
              mb-1
              text-sm
              font-medium
              text-gray-700
            ">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter product name"
              value={product.name}
              onChange={handleChange}
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                p-3
                text-sm
                sm:text-base
                focus:outline-none
                focus:ring-2
                focus:ring-green-700
              "
              required
            />

          </div>

          {/* CATEGORY */}

          <div>

            <label className="
              block
              mb-1
              text-sm
              font-medium
              text-gray-700
            ">
              Category
            </label>

            <input
              type="text"
              name="category"
              placeholder="Enter category"
              value={product.category}
              onChange={handleChange}
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                p-3
                text-sm
                sm:text-base
                focus:outline-none
                focus:ring-2
                focus:ring-green-700
              "
              required
            />

          </div>

          {/* DESCRIPTION */}

          <div>

            <label className="
              block
              mb-1
              text-sm
              font-medium
              text-gray-700
            ">
              Description
            </label>

            <textarea
              name="description"
              placeholder="Enter product description"
              value={product.description}
              onChange={handleChange}
              rows={5}
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                p-3
                text-sm
                sm:text-base
                resize-y
                focus:outline-none
                focus:ring-2
                focus:ring-green-700
              "
              required
            />

          </div>

          {/* PRICE AND STOCK */}

          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            gap-4
          ">

            <div>

              <label className="
                block
                mb-1
                text-sm
                font-medium
                text-gray-700
              ">
                Price
              </label>

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={product.price}
                onChange={handleChange}
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  p-3
                  text-sm
                  sm:text-base
                  focus:outline-none
                  focus:ring-2
                  focus:ring-green-700
                "
                min="0"
                required
              />

            </div>

            <div>

              <label className="
                block
                mb-1
                text-sm
                font-medium
                text-gray-700
              ">
                Quantity
              </label>

              <input
                type="number"
                name="stock"
                placeholder="Quantity"
                value={product.stock}
                onChange={handleChange}
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  p-3
                  text-sm
                  sm:text-base
                  focus:outline-none
                  focus:ring-2
                  focus:ring-green-700
                "
                min="0"
                required
              />

            </div>

          </div>

          {/* IMAGE UPLOAD */}

          <div className="
            rounded-lg
            border
            border-gray-300
            p-3
            sm:p-4
          ">

            <label
              htmlFor="product-image-file"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Upload Image
            </label>

            <input
              id="product-image-file"
              type="file"
              accept="image/*"
              onChange={
                handleImageFileChange
              }
              disabled={
                isUploadingImage
              }
              className="
                w-full
                text-sm
                file:mr-3
                file:rounded-lg
                file:border-0
                file:bg-green-700
                file:px-3
                file:py-2
                file:text-sm
                file:font-semibold
                file:text-white
                hover:file:bg-green-800
              "
            />

            <p className="
              mt-2
              text-xs
              sm:text-sm
              text-gray-600
            ">
              Maximum image size: 2MB.
              The image will be uploaded
              to Cloudinary.
            </p>

            <p className="
              mt-1
              text-xs
              sm:text-sm
              text-gray-600
            ">
              Images are automatically
              normalized to 480 × 600 and
              center-cropped.
            </p>

            {isUploadingImage && (

              <p className="
                mt-2
                text-sm
                text-blue-700
                font-medium
              ">
                Uploading image...
              </p>

            )}

            {selectedFileName && (

              <p className="
                mt-2
                text-xs
                sm:text-sm
                text-green-700
                break-all
              ">
                Selected file:{" "}
                {selectedFileName}
              </p>

            )}

          </div>

          {/* IMAGE PREVIEW */}

          {imagePreview && (

            <div className="
              rounded-lg
              border
              border-gray-300
              p-3
              sm:p-4
            ">

              <p className="
                mb-3
                text-sm
                font-medium
                text-gray-700
              ">
                Image Preview
              </p>

              <div className="
                flex
                justify-center
                sm:justify-start
              ">

                <img
                  src={imagePreview}
                  alt={
                    product.name ||
                    "Product preview"
                  }
                  className="
                    w-32
                    h-40
                    sm:w-40
                    sm:h-48
                    md:w-48
                    md:h-60
                    rounded-lg
                    object-cover
                    shadow
                  "
                />

              </div>

            </div>

          )}

          {/* SUBMIT BUTTON */}

          <button
            type="submit"
            disabled={
              isUploadingImage
            }
            className="
              w-full
              bg-green-700
              hover:bg-green-800
              disabled:bg-gray-400
              disabled:cursor-not-allowed
              text-white
              font-bold
              p-3
              rounded-lg
              transition
            "
          >
            {isUploadingImage
              ? "Uploading Image..."
              : "Add Product"}
          </button>

        </form>

      </div>

    </div>
  );
}