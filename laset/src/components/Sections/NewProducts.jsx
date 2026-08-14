import ProductsCard from "../Common/ProductsCard";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useGetAllProductsQuery } from "../../Features/ProductsApi";
import { assets, resolveImageSource } from "../../assets/assets.js";

const isVisibleInNewProducts = (value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "1", "yes", "on"].includes(normalized)) {
      return true;
    }

    if (["false", "0", "no", "off", ""].includes(normalized)) {
      return false;
    }
  }

  return Boolean(value);
};

export default function NewProducts() {
  const { data } = useGetAllProductsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  const newProducts = useMemo(() => {
    const products = Array.isArray(data)
      ? data
      : Array.isArray(data?.products)
        ? data.products
        : data?.value || [];

    return products
      .filter((product) => isVisibleInNewProducts(product.showInNewProducts))
      .sort((a, b) => {
        const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return bTime - aTime;
      })
      .slice(0, 8)
      .map((product) => ({
        _id: product._id || product.id,
        img: resolveImageSource(product.img || product.image || ""),
        name: product.name || "Unnamed product",
        price: Number(product.price) || 0,
        description: product.description || "",
      }));
  }, [data]);

  return (
    <section
      className="
        mt-4
        w-full
        overflow-hidden
        rounded-lg
        border
        border-green-700
        p-3
        shadow-md
        sm:p-4
      "
    >
      <div
        className="
          flex
          flex-col
          gap-6
          lg:flex-row
          lg:items-center
        "
      >
        {/* LEFT TEXT SECTION */}

        <div
          className="
            w-full
            shrink-0
            text-center
            sm:text-left
            lg:w-[260px]
            xl:w-[300px]
          "
        >
          <h2
            className="
              mb-3
              text-2xl
              font-extrabold
              text-green-900
              sm:text-3xl
            "
          >
            New In Store With
            <br />
            Great Discounts!!
          </h2>

          <p
            className="
              mb-4
              text-sm
              text-gray-700
              sm:text-base
            "
          >
            Check out our latest additions to the collection!
          </p>

          <div
            className="
              flex
              items-center
              justify-center
              gap-2
              sm:justify-start
            "
          >
            <p className="font-semibold text-green-900">
              View All Products
            </p>

            <Link to="/AllProducts">
              <img
                className="
                  mt-1
                  w-5
                  transition-transform
                  hover:translate-x-1
                  sm:w-6
                "
                src={assets.arrow}
                alt="View all products"
              />
            </Link>
          </div>
        </div>

        {/* PRODUCTS SLIDER */}

        <div
          className="
            min-w-0
            flex-1
            overflow-x-auto
            overflow-y-hidden
            scroll-smooth
          "
        >
          <div
            className="
              flex
              w-max
              gap-2
              pb-4
              sm:gap-3
              md:gap-4
            "
          >
            {newProducts.map((product) => (
              <div
                key={product._id}
                className="
                  w-[120px]
                  shrink-0

                  sm:w-[140px]

                  md:w-[155px]

                  lg:w-[165px]

                  xl:w-[180px]

                  transition-transform
                  duration-300
                  hover:scale-105
                "
              >
                <ProductsCard
                  _id={product._id}
                  imgSrc={product.img}
                  imgAlt={product.name}
                  add={assets.add}
                  name={product.name}
                  price={product.price}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}