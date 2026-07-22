import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import assets from "../../assets/assets.js";
import { parseStoredJson } from "../../utils/storage";

const getInitials = (userData) => {
  if (!userData) return "U";

  const first = userData.first_name?.trim()?.[0] || "";
  const last = userData.last_name?.trim()?.[0] || "";

  const initials = `${first}${last}`.trim();

  return (
    initials ||
    userData.email?.[0]?.toUpperCase() ||
    "U"
  );
};

const getApiBaseUrl = () => {
  if (window.location.hostname === "localhost") {
    return "http://localhost:5000";
  }

  return (
    import.meta.env.VITE_API_URL ||
    "https://agriventure-enterprise-backend.onrender.com"
  );
};

const getAvatarUrl = (userData) => {
  const image =
    userData?.profileImage ||
    userData?.profile_image ||
    userData?.avatar ||
    userData?.image ||
    "";

  if (!image || typeof image !== "string") {
    return null;
  }

  const trimmed = image.trim();

  if (!trimmed) {
    return null;
  }

  if (
    /^https?:\/\//i.test(trimmed) ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  const base = getApiBaseUrl();

  return `${base}${
    trimmed.startsWith("/") ? "" : "/"
  }${trimmed}`;
};

const categories = [
  {
    label: "Insecticides",
    href: "/category/insecticide",
  },
  {
    label: "Public Health Insecticides",
    href: "/category/public-health-insecticide",
  },
  {
    label: "Fungicides",
    href: "/category/fungicide",
  },
  {
    label: "Seeds",
    href: "/category/seeds",
  },
];

const nestedCategories = [
  {
    label: "Fertilizer",
    items: [
      {
        label: "Foliar Feed",
        href: "/category/foliar-feed",
      },
      {
        label: "Planting Fertilisers",
        href: "/category/fertilizer/planting-fertilisers",
      },
      {
        label: "Top-Dressing Fertilisers",
        href: "/category/fertilizer/top-dressing-fertilisers",
      },
      {
        label: "Compound Fertilisers",
        href: "/category/fertilizer/compound-fertilisers",
      },
    ],
  },

  {
    label: "Vet Products",
    items: [
      {
        label: "Dewormers",
        href: "/category/vet-products/dewormers",
      },
      {
        label: "Supplements",
        href: "/category/vet-products/supplements",
      },
      {
        label: "Ethicals",
        href: "/category/vet-products/ethicals",
      },
      {
        label: "Disinfectants",
        href: "/category/vet-products/disinfectants",
      },
      {
        label: "Acaricides",
        href: "/category/vet-products/acaricides",
      },
      {
        label: "Intramammary",
        href: "/category/vet-products/intramammary",
      },
      {
        label: "Pet shampoos",
        href: "/category/vet-products/pet-shampoos",
      },
    ],
  },

  {
    label: "Equipments",
    items: [
      {
        label: "Pigs",
        href: "/category/equipments/pigs",
      },
      {
        label: "Chicken",
        href: "/category/equipments/chicken",
      },
      {
        label: "Cattle",
        href: "/category/equipments/cattle",
      },
      {
        label: "Pets",
        href: "/category/equipments/pets",
      },
      {
        label: "Fumigation",
        href: "/category/equipments/fumigation",
      },
      {
        label: "Farm",
        href: "/category/equipments/farm",
      },
    ],
  },
];

function Navigation() {
  const cart = useSelector(
    (state) => state.cart
  );

  const totalQuantity =
    cart?.cartTotalQuantity ??
    cart?.cartTotalQuanty ??
    0;

  const [searchTerm, setSearchTerm] =
    useState("");

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [
    mobileCategoriesOpen,
    setMobileCategoriesOpen,
  ] = useState(false);

  const [
    openMobileCategoryGroup,
    setOpenMobileCategoryGroup,
  ] = useState(null);

  const [
    categoriesOpen,
    setCategoriesOpen,
  ] = useState(false);

  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileCategoriesRef = useRef(null);
  const buttonRef = useRef(null);

  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const avatarUrl = getAvatarUrl(user);

  const handleSearch = () => {
    const trimmed = searchTerm.trim();

    const query = trimmed
      ? `?q=${encodeURIComponent(trimmed)}`
      : "";

    navigate(`/AllProducts${query}`);
  };

  const toggleMobileCategoryGroup = (
    label
  ) => {
    setOpenMobileCategoryGroup((prev) =>
      prev === label ? null : label
    );
  };

  useEffect(() => {
    setUser(
      parseStoredJson("user", null)
    );
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoriesOpen &&
        menuRef.current &&
        !menuRef.current.contains(
          event.target
        ) &&
        !buttonRef.current?.contains(
          event.target
        )
      ) {
        setCategoriesOpen(false);
      }

      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(
          event.target
        ) &&
        !buttonRef.current?.contains(
          event.target
        )
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [
    categoriesOpen,
    mobileMenuOpen,
  ]);

  return (
    <div
      className="
        fixed
        top-0
        left-0
        z-50
        w-full
        bg-green-900
        p-2
        text-center
        font-bold
        text-white
        shadow-md
      "
    >

      <div className="
        flex
        w-full
        flex-col
        gap-2
        px-3
        sm:px-2
        lg:px-8
      ">

        {/* =========================
            TOP ROW
        ========================== */}

        <div className="
          flex
          w-full
          flex-wrap
          items-center
          justify-between
          gap-2
          md:flex-nowrap
        ">

          {/* LOGO */}

          <img
            className="
              h-12
              w-20
              cursor-pointer
              rounded
              p-1
              hover:bg-green-800
            "
            src={
              assets.AgriventureLogo ||
              assets.AgriventureLogo
            }
            alt="company logo"
          />

          {/* DESKTOP SEARCH */}

          <input
            type="text"
            placeholder="Search Items"
            className="
              mx-1
              hidden
              w-full
              flex-1
              rounded
              border
              border-green-700
              bg-white
              px-2
              py-1
              text-green-700
              focus:outline-2
              focus:outline-offset-1
              md:block
            "
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
          />

          {/* MOBILE ICONS */}

          <div className="
            relative
            flex
            items-center
            gap-2
            text-3xl
            md:hidden
          ">

            {/* CATEGORIES */}

            <button
              type="button"
              onClick={() => {
                setMobileCategoriesOpen(
                  (prev) => !prev
                );

                setMobileMenuOpen(false);
              }}
              className="
                rounded
                bg-green-700
                px-2
                py-1
                text-sm
                font-bold
                text-white
                hover:bg-green-800
              "
            >
              Categories
            </button>

            {/* CART */}

            <div className="relative">

              <Link to="/Cart">

                <img
                  className="
                    h-8
                    w-8
                    cursor-pointer
                    rounded
                    bg-green-700
                    p-1
                    hover:bg-green-800
                  "
                  src={
                    assets.Cart ||
                    assets.cart
                  }
                  alt="Cart icon"
                />

                <span className="
                  absolute
                  -right-2
                  -top-2
                  flex
                  h-5
                  w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-red-500
                  text-xs
                  text-white
                ">
                  {totalQuantity}
                </span>

              </Link>

            </div>

            {/* USER */}

            <div>

              <Link
                to={
                  user
                    ? "/MyOrders"
                    : "/Register"
                }
              >

                {user ? (

                  avatarUrl ? (

                    <img
                      src={avatarUrl}
                      alt="User avatar"
                      className="
                        h-10
                        w-10
                        rounded-full
                        border
                        border-white
                        object-cover
                      "
                    />

                  ) : (

                    <div className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      text-sm
                      font-bold
                      text-green-900
                    ">
                      {getInitials(user)}
                    </div>

                  )

                ) : (

                  <img
                    src={
                      assets.register ||
                      assets.SignupPic
                    }
                    alt="Register"
                    className="
                      h-10
                      w-10
                      cursor-pointer
                      rounded
                      bg-green-700
                      p-1
                      hover:bg-green-800
                    "
                  />

                )}

              </Link>

            </div>

          </div>

          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            ref={buttonRef}
            className="
              text-3xl
              md:hidden
            "
            onClick={() =>
              setMobileMenuOpen(
                (prev) => !prev
              )
            }
            aria-label={
              mobileMenuOpen
                ? "Close menu"
                : "Open menu"
            }
          >
            {mobileMenuOpen
              ? "✕"
              : "☰"}
          </button>

        </div>

        {/* MOBILE SEARCH */}

        <div className="w-full md:hidden">

          <input
            type="text"
            placeholder="Search Items"
            className="
              w-full
              rounded
              border
              border-green-700
              bg-white
              px-2
              py-1
              text-green-700
              focus:outline-2
              focus:outline-offset-1
            "
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
          />

        </div>

        {/* =========================
            MOBILE CATEGORIES
        ========================== */}

        {mobileCategoriesOpen && (

          <div
            ref={mobileCategoriesRef}
            className="
              mt-2
              w-full
              rounded
              bg-green-800
              p-2
              shadow-md
              md:hidden
            "
          >

            <div className="
              flex
              flex-col
              gap-1
            ">

              {categories.map(
                (category) => (

                  <Link
                    key={category.label}
                    to={category.href}
                    onClick={() => {
                      setMobileCategoriesOpen(
                        false
                      );

                      setOpenMobileCategoryGroup(
                        null
                      );
                    }}
                  >

                    <p className="
                      rounded
                      bg-green-900
                      px-3
                      py-1
                      text-sm
                      hover:bg-green-700
                    ">
                      {category.label}
                    </p>

                  </Link>

                )
              )}

              {nestedCategories.map(
                (category) => (

                  <div
                    key={category.label}
                    className="w-full"
                  >

                    <button
                      type="button"
                      onClick={() =>
                        toggleMobileCategoryGroup(
                          category.label
                        )
                      }
                      className="
                        flex
                        w-full
                        items-center
                        justify-between
                        rounded
                        bg-green-900
                        px-3
                        py-1
                        text-left
                        text-sm
                        hover:bg-green-700
                      "
                    >

                      <span>
                        {category.label}
                      </span>

                      <span>
                        {
                          openMobileCategoryGroup ===
                          category.label
                            ? "−"
                            : "+"
                        }
                      </span>

                    </button>

                    {openMobileCategoryGroup ===
                      category.label && (

                      <div className="
                        mt-1
                        flex
                        flex-col
                        gap-1
                        pl-3
                      ">

                        {category.items.map(
                          (item) => (

                            <Link
                              key={item.label}
                              to={item.href}
                              onClick={() => {
                                setMobileCategoriesOpen(
                                  false
                                );

                                setOpenMobileCategoryGroup(
                                  null
                                );
                              }}
                            >

                              <p className="
                                rounded
                                bg-green-900
                                px-3
                                py-1
                                text-xs
                                hover:bg-green-700
                              ">
                                {item.label}
                              </p>

                            </Link>

                          )
                        )}

                      </div>

                    )}

                  </div>

                )
              )}

            </div>

          </div>

        )}

        {/* =========================
            DESKTOP NAVIGATION
        ========================== */}

        <div className="
          hidden
          flex-wrap
          items-center
          justify-between
          gap-2
          md:flex
          lg:gap-4
        ">

          <Link to="/">
            <p className="
              rounded
              bg-green-700
              px-3
              py-1
              hover:bg-green-800
            ">
              Home
            </p>
          </Link>

          <Link to="/About">
            <p className="
              rounded
              bg-green-700
              px-3
              py-1
              hover:bg-green-800
            ">
              About
            </p>
          </Link>

          {/* =========================
              DESKTOP CATEGORIES
          ========================== */}

          <div
            ref={menuRef}
            className="
              relative
              hidden
              md:block
            "
          >

            <button
              type="button"
              onClick={() =>
                setCategoriesOpen(
                  (prev) => !prev
                )
              }
              className="
                rounded
                bg-green-700
                px-2
                py-1
                text-sm
                text-white
                hover:bg-green-800
                lg:px-3
                lg:text-base
              "
            >
              Categories
            </button>

            {categoriesOpen && (

              <div className="
                absolute
                left-0
                top-full
                z-100
                mt-2
                w-64
                rounded-md
                bg-white
                shadow-xl
              ">

                <ul className="
                  py-2
                  text-left
                  text-green-900
                ">

                  {/* MAIN CATEGORIES */}

                  {categories.map(
                    (category) => (

                      <li
                        key={category.label}
                        className="
                          px-4
                          py-2
                          text-sm
                          hover:bg-gray-100
                        "
                      >

                        <Link
                          to={category.href}
                          onClick={() =>
                            setCategoriesOpen(
                              false
                            )
                          }
                          className="
                            block
                            w-full
                          "
                        >
                          {category.label}
                        </Link>

                      </li>

                    )
                  )}

                  {/* NESTED CATEGORIES */}

                  {nestedCategories.map(
                    (category) => (

                      <li
                        key={category.label}
                        className="
                          group
                          relative
                          px-4
                          py-2
                          text-sm
                          hover:bg-gray-100
                        "
                      >

                        {/* CATEGORY NAME */}

                        <div className="
                          flex
                          cursor-pointer
                          items-center
                          justify-between
                          gap-4
                        ">

                          <span>
                            {category.label}
                          </span>

                          <span className="
                            text-gray-500
                          ">
                            →
                          </span>

                        </div>

                        {/* SUBMENU */}

                        <ul className="
                          absolute
                          left-full
                          top-0
                          z-110
                          hidden
                          min-w-60
                          rounded-md
                          bg-white
                          py-2
                          text-green-900
                          shadow-xl
                          group-hover:block
                        ">

                          {category.items.map(
                            (item) => (

                              <li
                                key={
                                  item.label
                                }
                                className="
                                  px-4
                                  py-2
                                  text-sm
                                  hover:bg-gray-100
                                "
                              >

                                <Link
                                  to={
                                    item.href
                                  }
                                  onClick={() =>
                                    setCategoriesOpen(
                                      false
                                    )
                                  }
                                  className="
                                    block
                                    w-full
                                  "
                                >
                                  {item.label}
                                </Link>

                              </li>

                            )
                          )}

                        </ul>

                      </li>

                    )
                  )}

                </ul>

              </div>

            )}

          </div>

          <Link to="/Features">
            <p className="
              rounded
              bg-green-700
              px-3
              py-1
              hover:bg-green-800
            ">
              Features
            </p>
          </Link>

          <Link to="/AllContacts">
            <p className="
              rounded
              bg-green-700
              px-3
              py-1
              hover:bg-green-800
            ">
              Contacts
            </p>
          </Link>

          <Link to="/MyOrders">
            <p className="
              rounded
              bg-green-700
              px-3
              py-1
              hover:bg-green-800
            ">
              My Orders
            </p>
          </Link>

          {/* CART */}

          <div className="relative">

            <Link to="/Cart">

              <img
                className="
                  h-8
                  w-8
                  cursor-pointer
                  rounded
                  bg-green-700
                  p-1
                  hover:bg-green-800
                "
                src={
                  assets.Cart ||
                  assets.cart
                }
                alt="Cart icon"
              />

              <span className="
                absolute
                -right-2
                -top-2
                flex
                h-5
                w-5
                items-center
                justify-center
                rounded-full
                bg-red-500
                text-xs
                text-white
              ">
                {totalQuantity}
              </span>

            </Link>

          </div>

          {/* USER */}

          <div>

            <Link
              to={
                user
                  ? "/MyOrders"
                  : "/Register"
              }
            >

              {user ? (

                avatarUrl ? (

                  <img
                    src={avatarUrl}
                    alt="User avatar"
                    className="
                      h-8
                      w-8
                      rounded-full
                      border
                      border-white
                      object-cover
                    "
                  />

                ) : (

                  <div className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-sm
                    font-bold
                    text-green-900
                  ">
                    {getInitials(user)}
                  </div>

                )

              ) : (

                <img
                  className="
                    h-8
                    w-8
                    cursor-pointer
                    rounded
                    bg-green-700
                    p-1
                    hover:bg-green-800
                  "
                  src={
                    assets.register ||
                    assets.SignupPic
                  }
                  alt="Register"
                />

              )}

            </Link>

          </div>

        </div>

      </div>

      {/* =========================
          MOBILE DROPDOWN MENU
      ========================== */}

      {mobileMenuOpen && (

        <div
          ref={mobileMenuRef}
          className="
            absolute
            right-0
            top-full
            flex
            w-48
            flex-col
            items-start
            gap-1
            bg-green-900
            py-4
            shadow-lg
            md:hidden
          "
        >

          <Link
            to="/"
            onClick={() =>
              setMobileMenuOpen(false)
            }
          >
            <p className="
              rounded
              bg-green-700
              px-3
              py-1
              hover:bg-green-800
            ">
              Home
            </p>
          </Link>

          <Link
            to="/About"
            onClick={() =>
              setMobileMenuOpen(false)
            }
          >
            <p className="
              rounded
              bg-green-700
              px-3
              py-1
              hover:bg-green-800
            ">
              About
            </p>
          </Link>

          <Link
            to="/Features"
            onClick={() =>
              setMobileMenuOpen(false)
            }
          >
            <p className="
              rounded
              bg-green-700
              px-3
              py-1
              hover:bg-green-800
            ">
              Features
            </p>
          </Link>

          <Link
            to="/AllContacts"
            onClick={() =>
              setMobileMenuOpen(false)
            }
          >
            <p className="
              rounded
              bg-green-700
              px-3
              py-1
              hover:bg-green-800
            ">
              Contacts
            </p>
          </Link>

          <Link
            to="/Register"
            onClick={() =>
              setMobileMenuOpen(false)
            }
          >
            <button className="
              rounded
              bg-green-700
              px-3
              py-1
              hover:bg-green-800
            ">
              Login/Register
            </button>
          </Link>
          <Link to="/MyOrders">
            <p className="
              rounded
              bg-green-700
              px-3
              py-1
              hover:bg-green-800
            ">
              My Orders
            </p>
          </Link>

        </div>

      )}

    </div>
  );
}

export default Navigation;