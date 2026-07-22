import { useParams } from "react-router-dom";
import { useGetAllProductsQuery } from "../../Features/ProductsApi";
import ProductsCard from "../Common/ProductsCard";
import {
  assets,
  product_list,
  resolveImageSource,
} from "../../assets/assets.js";
import {Link} from "react-router-dom";

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
    (product) =>
      product.category &&
      toSlug(product.category) === categorySlug
  );


  return (
    <div className="min-h-screen bg-gray-50 px-3 py-5 sm:px-6 md:px-8 lg:px-10">

      {/* Category Header */}
      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm sm:p-6 flex flex-col items-start gap-2">

        <h1 className="
          text-2xl
          font-bold
          capitalize
          text-green-900
          sm:text-3xl
          lg:text-4xl
        ">
          {categoryName
            ? `${categoryName.charAt(0).toUpperCase()}${categoryName.slice(1)}`
            : "Category"}
        </h1>

        <Link to="/" className="text-blue-700 underline text-sm">
          Back to Home
        </Link>
      

        <div className="mt-2 h-1 w-14 rounded-full bg-green-700 sm:w-16"></div>

      </div>

      {/* Loading */}
      {isLoading ? (

        <div className="rounded-xl bg-white p-8 text-center shadow-sm sm:p-10">
          <p className="text-gray-600">
            Loading products...
          </p>
        </div>

      ) : (

        <>

          {/* Error */}
          {error && (
            <div className="
              mb-6
              rounded-lg
              border
              border-yellow-200
              bg-yellow-50
              p-3
              text-sm
              text-yellow-800
              sm:p-4
            ">
              Failed to load products from the API.
              Using local data instead.
            </div>
          )}

          {/* No Products */}
          {filteredProducts.length === 0 ? (

            <div className="
              rounded-xl
              bg-white
              p-8
              text-center
              shadow-sm
              sm:p-10
            ">
              <p className="text-base text-gray-600 sm:text-lg">
                No products found for this category.
              </p>
            </div>

          ) : (

            /* Responsive Product Grid */
            <div className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-5
            ">

              {filteredProducts.map((product) => (

                <div
                  key={product._id}
                  className="
                    min-w-0
                    overflow-hidden
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    p-2
                    shadow-sm
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-lg
                  "
                >

                  <ProductsCard
                    _id={product._id}
                    imgSrc={resolveImageSource(
                      product.img ||
                      product.image ||
                      ""
                    )}
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
