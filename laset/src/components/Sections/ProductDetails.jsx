import { useParams } from "react-router-dom";
import { useGetAllProductsQuery } from "../../Features/ProductsApi";
import { resolveImageSource } from "../../assets/assets.js";
import { useDispatch } from "react-redux";
import { addToCart } from "../../Features/CartSlice";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ProductDetails() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [addedToCart, setAddedToCart] = useState(false);

  const {
    data,
    error,
    isLoading,
  } = useGetAllProductsQuery();

  const products = Array.isArray(data)
    ? data
    : Array.isArray(data?.products)
      ? data.products
      : data?.value || [];

  const product = products.find(
    (item) => item._id?.toString() === productId?.toString()
  );

  const handleAddToCart = () => {
    if (!product) return;

    dispatch(
      addToCart({
        _id: product._id,
        img: resolveImageSource(
          product.img || product.image || ""
        ),
        name: product.name,
        price: Number(product.price),
      })
    );

    setAddedToCart(true);

    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  if (isLoading) {
    return (
      <p className="p-6 text-center">
        Loading product...
      </p>
    );
  }

  if (error) {
    return (
      <p className="p-6 text-center text-red-600">
        Failed to load product.
      </p>
    );
  }

  if (!product) {
    return (
      <p className="p-6 text-center text-red-600">
        Product not found.
      </p>
    );
  }

  const imageSrc = resolveImageSource(
    product.img || product.image || ""
  );

    const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-8 lg:px-12">

      <div className="mx-auto max-w-5xl rounded-xl bg-white p-4 shadow-md sm:p-6 lg:p-8">

        <div className="grid items-start gap-8 lg:grid-cols-2">

          {/* ================= PRODUCT IMAGE ================= */}
          <div className="
            flex
            min-h-[350px]
            items-center
            justify-center
            overflow-hidden
            rounded-xl
            bg-gray-50
            p-6
            sm:min-h-[450px]
            lg:min-h-[550px]
          ">

            <img
              src={imageSrc}
              alt={product.name}
              className="
                max-h-[500px]
                w-full
                object-contain
                transition-transform
                duration-500
                hover:scale-110
              "
            />

          </div>

          {/* ================= PRODUCT INFORMATION ================= */}
          <div>

            {/* Product Name */}
            <h1 className="
              mb-4
              text-2xl
              font-bold
              text-green-900
              sm:text-3xl
            ">
              {product.name}
            </h1>

            {/* Category */}
            <p className="mb-4 text-base text-gray-700 sm:text-lg">
              Category:{" "}
              <span className="font-medium text-gray-900">
                {product.category || "Uncategorized"}
              </span>
            </p>

            {/* Price */}
            <p className="mb-6 text-2xl font-bold text-green-900">
              Ksh {Number(product.price).toLocaleString()}
            </p>

            {/* ================= DESCRIPTION ================= */}
            <div className="
              mb-6
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              p-5
            ">

              <h2 className="
                mb-3
                text-xl
                font-bold
                text-green-900
              ">
                Product Description
              </h2>

              <p className="
                whitespace-pre-line
                text-base
                leading-8
                text-gray-600
              ">
                {product.description ||
                  "No description available for this product."}
              </p>

            </div>

            {/* ================= ADD TO CART ================= */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="
                w-full
                rounded-lg
                bg-green-900
                px-6
                py-3
                
                font-semibold
                text-white
                transition
                duration-300
                hover:bg-green-800
                sm:w-auto
              "
            >
              Add to Cart
            </button>
            <Link to="/">
            <button
             type="button"
             onClick={handleClose}
             className="
            bg-green-900
             px-6 py-3
             rounded-lg
             font-semibold
            hover:bg-green-800
             transition
            text-white
            sm:w-auto
            m-2             "
           >
           Close
           </button>
           </Link>
            {/* Success Message */}
            {addedToCart && (
              <p className="
                mt-3
                font-medium
                text-green-700
              ">
                Product added to cart successfully!
              </p>
            )}

            {/* ================= PRODUCT ID ================= */}
            <div className="
              mt-6
              border-t
              border-gray-200
              pt-4
              text-sm
              text-gray-500
            ">
              <p>
                Product ID: {product._id}
              </p>

              {/* 
              <p>
                Stock: {product.stock ?? "N/A"}
              </p>
              */}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
