import ProductsCard from "../Common/ProductsCard";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets.js";

export default function NewProducts() {
  const newProducts = [
    {
      _id: "1",
      img: assets.twix,
      name: "Twix 10g",
      price: 600,
    },
    {
      _id: "2",
      img: assets.redRiz,
      name: "Red Riz 10g",
      price: 600,
    },
    {
      _id: "3",
      img: assets.malin,
      name: "Malin 10g",
      price: 600,
    },
    {
      _id: "4",
      img: assets.bioenzyme,
      name: "Biozyme 100ml",
      price: 600,
    },
    {
      _id: "5",
      img: assets.handspray,
      name: "Handspray 2L",
      price: 600,
    },
    {
      _id: "6",
      img: assets.kelpreal,
      name: "Kelpreal 10g",
      price: 600,
    },
    {
      _id: "7",
      img: assets.ferrari,
      name: "Ferrari 1L",
      price: 600,
    },
    {
      _id: "8",
      img: assets.kelpreal,
      name: "Kelpreal 10g",
      price: 600,
    },
    {
      _id: "9",
      img: assets.ferrari,
      name: "Ferrari 1L",
      price: 600,
    },
   
  ];

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

            <Link to="/NewProducts">
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