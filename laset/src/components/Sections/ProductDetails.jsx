import { useParams } from "react-router-dom";
import { useGetAllProductsQuery } from "../../Features/ProductsApi";
import { resolveImageSource } from "../../assets/assets.js";
import { useDispatch } from "react-redux";
import { addToCart } from "../../Features/CartSlice";

export default function ProductDetails() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { data, error, isLoading } = useGetAllProductsQuery();
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
        img: resolveImageSource(product.img || product.image || ""),
        name: product.name,
        price: product.price,
      })
    );
  };

  if (isLoading) {
    return <p className="p-6">Loading product...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">Failed to load product.</p>;
  }

  if (!product) {
    return <p className="p-6 text-red-600">Product not found.</p>;
  }

  const imageSrc = resolveImageSource(product.img || product.image || "");

  return (
    <div className="px-4 py-6 sm:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] items-start">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-[360px] object-cover rounded-lg border border-green-700"
          />
          <div>
            <h1 className="text-3xl font-bold text-green-900 mb-3">{product.name}</h1>
            <p className="text-lg text-gray-700 mb-4">Category: {product.category || "Uncategorized"}</p>
            <p className="text-2xl font-semibold text-green-900 mb-4">Ksh {product.price}</p>
            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-green-900 text-white px-4 py-2 rounded hover:bg-green-800"
            >
              Add to Cart
            </button>
            <div className="mt-6 text-sm text-gray-600">
              <p>Product ID: {product._id}</p>
              <p>Stock: {product.stock ?? "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
