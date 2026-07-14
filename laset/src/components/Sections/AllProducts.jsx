import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useGetAllProductsQuery } from "../../Features/ProductsApi";
import { product_list, assets } from "../../assets/assets";
import ProductsCard from "../Common/ProductsCard";
import { addToCart } from "../../Features/CartSlice";

export default function AllProducts() {
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    data: apiData,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllProductsQuery();

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q")?.toLowerCase().trim() || "";

  const apiProducts = useMemo(() => {
    if (Array.isArray(apiData)) return apiData;
    if (Array.isArray(apiData?.products)) return apiData.products;
    return [];
  }, [apiData]);

  const source = apiProducts.length > 0 ? apiProducts : product_list;

  const productsList = useMemo(() => {
    const normalized = source.map((p) => ({
      _id: p._id || p.id,
      name: p.name || "",
      price: p.price ?? 0,
      imgSrc: assets[p.img] || assets[p.image] || p.img || p.image || "",
      add: assets[p.add] || p.add || "",
      category: p.category || "",
    }));

    if (!query) return normalized;

    return normalized.filter((p) => {
      const name = p.name.toLowerCase();
      const category = p.category.toLowerCase();
      return name.includes(query) || category.includes(query);
    });
  }, [source, query]);

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        _id: product._id,
        img: product.imgSrc,
        name: product.name,
        price: product.price,
      })
    );
  };

  if (isLoading) return <p className="text-center mt-8">Loading products...</p>;
  if (error && apiProducts.length === 0) {
    return (
      <div className="text-center mt-8">
        <p>Failed to load products.</p>
        <button onClick={refetch} className="mt-2 px-3 py-1 border rounded">
          Retry
        </button>
      </div>
    );
  }

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

      <div className="grid grid-rows-2 grid-flow-col overflow-x-auto overflow-y-hidden gap-3 sm:gap-5 md:gap-4 lg:gap-4 px-2 sm:px-6 md:px-10 mt-6 mb-10 pb-4 scroll-smooth">
        {productsList.length > 0 ? (
          productsList.map((product) => (
            <div
              key={product._id}
              className="w-[160px] sm:w-[180px] md:w-[180px] lg:w-[220px] shrink-0 transition-transform duration-300 hover:scale-105"
            >
              <ProductsCard
                _id={product._id}
                imgSrc={product.imgSrc}
                imgAlt={product.name}
                add={product.add}
                name={product.name}
                price={product.price}
              />
              <button
                onClick={() => handleAddToCart(product)}
                className="mt-2 w-full sm:w-36 xs:w-32 ml-3 sm:ml-2 rounded bg-green-900 px-2 py-2 text-sm font-semibold text-white hover:bg-green-800"
                aria-label={`Add ${product.name} to cart`}
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}
