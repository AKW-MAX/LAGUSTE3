import { useParams } from "react-router-dom";
import { useGetAllProductsQuery } from "../../Features/ProductsApi";
import ProductsCard from "../Common/ProductsCard";
import { assets } from "../../assets/assets.js";

const normalizeSlug = (slug) => slug.replace(/-/g, " ").toLowerCase();

export default function CategoryPage() {
  const params = useParams();
  const rawSlug = params["*"] || params.slug || "";
  const categoryName = normalizeSlug(rawSlug.split("/").pop() || "");
  const { data, error, isLoading } = useGetAllProductsQuery();
  const products = Array.isArray(data) ? data : data?.value || [];
  const filteredProducts = products.filter(
    (product) =>
      product.category &&
      product.category.toString().toLowerCase() === categoryName
  );

  return (
    <div className="px-4 py-6 sm:px-8">
      <h1 className="text-3xl font-bold text-green-900 mb-4">
        {categoryName ? `${categoryName.charAt(0).toUpperCase()}${categoryName.slice(1)}` : "Category"}
      </h1>

      {isLoading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-red-600">Failed to load products.</p>
      ) : filteredProducts.length === 0 ? (
        <p>No products found for this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div key={product._id} className="rounded-lg border border-green-700 p-2 shadow-sm">
              <ProductsCard
                _id={product._id}
                imgSrc={assets[product.img] || assets[product.image] || product.img || product.image}
                imgAlt={product.name}
                add={assets[product.add] || product.add}
                name={product.name}
                price={product.price}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
