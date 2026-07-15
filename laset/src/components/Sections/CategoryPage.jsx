import { useParams } from "react-router-dom";
import { useGetAllProductsQuery } from "../../Features/ProductsApi";
import ProductsCard from "../Common/ProductsCard";
import { assets, product_list, resolveImageSource } from "../../assets/assets.js";

const normalizeSlug = (slug) => slug.replace(/-/g, " ").toLowerCase();
const toSlug = (value) =>
  value
    ?.toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "") || "";

export default function CategoryPage() {
  const params = useParams();
  const rawSlug = params["*"] || "";
  const categorySlug = toSlug(rawSlug);
  const categoryName = normalizeSlug(rawSlug);
  const { data, error, isLoading } = useGetAllProductsQuery();
  const products = Array.isArray(data)
    ? data
    : Array.isArray(data?.products)
      ? data.products
      : data?.value || product_list;
  const filteredProducts = products.filter(
    (product) => product.category && toSlug(product.category) === categorySlug
  );

  return (
    <div className="px-4 py-6 sm:px-8">
      <h1 className="text-3xl font-bold text-green-900 mb-4">
        {categoryName ? `${categoryName.charAt(0).toUpperCase()}${categoryName.slice(1)}` : "Category"}
      </h1>
      <div className="text-sm text-gray-600 mb-3">
        <p>Raw slug: {rawSlug || "(empty)"}</p>
        <p>Category slug: {categorySlug || "(empty)"}</p>
        <p>Products count: {products.length}</p>
        <p>Filtered count: {filteredProducts.length}</p>
      </div>

      {isLoading ? (
        <p>Loading products...</p>
      ) : (
        <>
          {error && (
            <p className="text-red-600 mb-3">Failed to load products from the API. Using local data instead.</p>
          )}
          {filteredProducts.length === 0 ? (
            <p>No products found for this category.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div key={product._id} className="rounded-lg border border-green-700 p-2 shadow-sm">
                  <ProductsCard
                    _id={product._id}
                    imgSrc={resolveImageSource(product.img || product.image || "")}
                    imgAlt={product.name}
                    add={assets[product.add] || product.add}
                    name={product.name}
                    price={product.price}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
