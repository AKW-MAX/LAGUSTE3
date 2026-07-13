import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { addToCart } from "../../Features/CartSlice";
import { useGetAllProductsQuery } from "../../Features/ProductsApi";
import ProductsCard from "../Common/ProductsCard";
import { assets, product_list } from "../../assets/assets.js";

export default function AllProducts() {
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    data: products = [],
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllProductsQuery();

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q")?.toLowerCase().trim() || "";

  // Use API products if available, otherwise use local products
  const source =
    !isLoading && !error && products.length > 0 ? products : product_list;

  const products_list = useMemo(() => {
    if (!query) return source;

    return source.filter((product) => {
      const text = `${product.name || ""} ${product.category || ""}`.toLowerCase();
      return text.includes(query);
    });
  }, [source, query]);

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        ...product,
        img:
          assets[product.img] ||
          assets[product.image] ||
          product.img ||
          product.image,
        add: assets[product.add] || product.add,
      })
    );
  };

  return (
    <div className="border border-green-700 rounded-lg shadow-md overflow-hidden">
      <div className="mt-4 px-4 text-center">
        <h2 className="font-extrabold text-2xl text-green-900 mt-10">
          Check Out Our Range of Products
        </h2>

        <p className="text-sm">
          Explore our complete range of products, including the latest
          innovations and timeless classics.
        </p>

        {isLoading && (
          <p className="mt-4 text-green-700 font-semibold">
            Loading products...
          </p>
        )}

        {isFetching && !isLoading && (
          <p className="mt-4 text-gray-600">
            Refreshing products...
          </p>
        )}

        {error && (
          <div className="mt-4">
            <p className="text-red-600">
              Failed to load products from the API.
              Showing local products instead.
            </p>

            <button
              onClick={refetch}
              className="mt-2 px-4 py-2 bg-green-900 text-white rounded hover:bg-green-800"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      <div
        className="
          grid
          grid-rows-2
          grid-flow-col
          overflow-x-auto
          overflow-y-hidden
          gap-3
          sm:gap-5
          md:gap-4
          lg:gap-4
          px-2
          sm:px-6
          md:px-10
          mt-10
          mb-10
          pb-4
          scroll-smooth
        "
      >
        {products_list.length > 0 ? (
          products_list.map((product) => (
            <div
              key={product._id || product.id}
              className="
                w-[160px]
                sm:w-[180px]
                md:w-[180px]
                lg:w-[220px]
                shrink-0
                transition-transform
                duration-300
                hover:scale-105
              "
            >
              <ProductsCard
                _id={product._id}
                imgSrc={
                  assets[product.img] ||
                  assets[product.image] ||
                  product.img ||
                  product.image
                }
                imgAlt={product.name}
                add={assets[product.add] || product.add}
                name={product.name}
                price={product.price}
              />

              <div className="px-2 mt-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-green-900 hover:bg-green-800 text-white font-bold py-2 rounded"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full text-center py-10">
            <p className="text-gray-500 text-lg">
              No products found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
