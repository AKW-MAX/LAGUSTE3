import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useGetAllProductsQuery } from "../../Features/ProductsApi";
import {
  product_list,
  assets,
  resolveImageSource,
} from "../../assets/assets";
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

  const query =
    searchParams.get("q")?.toLowerCase().trim() || "";

  const apiProducts = useMemo(() => {
    if (Array.isArray(apiData)) {
      return apiData;
    }

    if (Array.isArray(apiData?.products)) {
      return apiData.products;
    }

    return [];
  }, [apiData]);

  const source =
    apiProducts.length > 0
      ? apiProducts
      : product_list;

  const productsList = useMemo(() => {
    const normalized = source.map((p) => ({
      _id: p._id || p.id,
      name: p.name || "",
      price: p.price ?? 0,

      imgSrc: resolveImageSource(
        p.img || p.image || ""
      ),

      add:
        assets[p.add] ||
        p.add ||
        "",

      category:
        p.category ||
        "Other",
    }));

    if (!query) {
      return normalized;
    }

    return normalized.filter((p) => {
      const name = p.name.toLowerCase();

      const category =
        p.category.toLowerCase();

      return (
        name.includes(query) ||
        category.includes(query)
      );
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

  /*
  ==========================================
  GROUP PRODUCTS BY CATEGORY
  ==========================================
  */

  const productsByCategory = useMemo(() => {
    return productsList.reduce(
      (groups, product) => {
        const category =
          product.category || "Other";

        if (!groups[category]) {
          groups[category] = [];
        }

        groups[category].push(product);

        return groups;
      },
      {}
    );
  }, [productsList]);

  /*
  ==========================================
  LOADING STATE
  ==========================================
  */

  if (isLoading) {
    return (
      <p className="mt-8 text-center">
        Loading products...
      </p>
    );
  }

  /*
  ==========================================
  ERROR STATE
  ==========================================
  */

  if (
    error &&
    apiProducts.length === 0
  ) {
    return (
      <div className="mt-8 text-center">

        <p>
          Failed to load products.
        </p>

        <button
          onClick={refetch}
          className="
            mt-2
            rounded
            border
            px-3
            py-1
          "
        >
          Retry
        </button>

      </div>
    );
  }

  return (
    <div className="
      overflow-hidden
      rounded-lg
      border
      border-green-700
      shadow-md
    ">

      {/* =====================================
          PAGE HEADER
      ====================================== */}

      <div className="
        mt-4
        px-4
        text-center
        sm:px-6
      ">

        <h2 className="
          mt-8
          text-2xl
          font-extrabold
          text-green-900
          sm:text-3xl
        ">
          Check Out Our Range of Products
        </h2>

        <p className="
          mx-auto
          mt-2
          max-w-2xl
          text-sm
          leading-6
          text-gray-600
          sm:text-base
        ">
          Explore our complete range of products,
          including the latest innovations and
          timeless classics.
        </p>

        {isFetching &&
          !isLoading && (
            <p className="
              mt-4
              text-gray-600
            ">
              Refreshing products...
            </p>
          )}

        {error && (
          <div className="mt-4">

            <p className="
              text-red-600
            ">
              Failed to load products from the API.
              Showing local products instead.
            </p>

            <button
              onClick={refetch}
              className="
                mt-2
                rounded
                bg-green-900
                px-4
                py-2
                text-white
                hover:bg-green-800
              "
            >
              Retry
            </button>

          </div>
        )}

      </div>

      {/* =====================================
          CATEGORY SECTIONS
      ====================================== */}

      <div className="
        mt-8
        space-y-10
      ">

        {Object.entries(
          productsByCategory
        ).map(
          ([
            category,
            products,
          ]) => (

            <section
              key={category}
            >

              {/* CATEGORY TITLE */}

              <div className="
                mb-3
                flex
                items-center
                justify-between
                px-4
                sm:px-6
                md:px-10
              ">

                <h3 className="
                  text-xl
                  font-bold
                  capitalize
                  text-green-900
                  sm:text-2xl
                  sticky
                  top-0
                  bg-gray-50
                  py-2
                  z-10
                ">
                  {category}
                </h3>

              </div>

              {/* CATEGORY SLIDER */}

              <div className="
                flex
                gap-4
                overflow-x-auto
                px-4
                pb-4
                scroll-smooth
                sm:gap-5
                sm:px-6
                md:px-10
              ">

                {products.map(
                  (product) => (

                    <div
                      key={
                        product._id
                      }
                      className="
                        w-40
                        shrink-0
                        sm:w-[180px]
                        md:w-[200px]
                        lg:w-[220px]
                      "
                    >

                      {/* PRODUCT CARD */}

                      <ProductsCard
                        _id={
                          product._id
                        }
                        imgSrc={
                          product.imgSrc
                        }
                        imgAlt={
                          product.name
                        }
                        add={
                          product.add
                        }
                        name={
                          product.name
                        }
                        price={
                          product.price
                        }
                      />

                      {/* ADD TO CART BUTTON */}

                      <button
                        onClick={() =>
                          handleAddToCart(
                            product
                          )
                        }
                        className="
                          mt-2
                          w-full
                          rounded
                          bg-green-900
                          px-2
                          py-2
                          text-sm
                          font-semibold
                          text-white
                          transition
                          hover:bg-green-800
                        "
                        aria-label={`Add ${product.name} to cart`}
                      >
                        Add to Cart
                      </button>

                    </div>

                  )
                )}

              </div>

            </section>

          )
        )}

      </div>

    </div>
  );
}