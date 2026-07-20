import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect, useRef } from "react";
import assets from "../../assets/assets.js";
import { parseStoredJson } from "../../utils/storage";

const getInitials = (userData) => {
  if (!userData) return "U";

  const first = userData.first_name?.trim()?.[0] || "";
  const last = userData.last_name?.trim()?.[0] || "";
  const initials = `${first}${last}`.trim();

  return initials || userData.email?.[0]?.toUpperCase() || "U";
};

const getApiBaseUrl = () => {
  if (window.location.hostname === "localhost") {
    return "http://localhost:5000";
  }

  return import.meta.env.VITE_API_URL || "https://agriventure-enterprise-backend.onrender.com";
};

const getAvatarUrl = (userData) => {
  const image =
    userData?.profileImage ||
    userData?.profile_image ||
    userData?.avatar ||
    userData?.image ||
    "";

  if (!image || typeof image !== "string") return null;

  const trimmed = image.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:")) {
    return trimmed;
  }

  // supports values like "/uploads/x.png", "uploads/x.png", "images/x.png"
  const base = getApiBaseUrl();
  return `${base}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
};

const categories = [
  { label: "Insecticides", href: "/category/insecticide" },
  { label: "Public Health Insecticides", href: "/category/public-health-insecticide" },
  { label: "Equipment", href: "/category/equipment" },
  { label: "Seeds", href: "/category/seeds" },
];

const nestedCategories = [
  {
    label: "Fertilizer",
    items: [
      { label: "Foliar Feed", href: "/category/foliar-feed" },
      { label: "Planting Fertilisers", href: "/category/fertilizer/planting-fertilisers" },
      { label: "Top-Dressing Fertilisers", href: "/category/fertilizer/top-dressing-fertilisers" },
      { label: "Compound Fertilisers", href: "/category/fertilizer/compound-fertilisers" },
    ],
  },
  {
    label: "Vet Products",
    items: [
      { label: "Dewormers", href: "/category/vet-products/dewormers" },
      { label: "Supplements", href: "/category/vet-products/supplements" },
      { label: "Ethicals", href: "/category/vet-products/ethicals" },
      { label: "Disinfectants", href: "/category/vet-products/disinfectants" },
      { label: "Acaricides", href: "/category/vet-products/acaricides" },
      { label: "Intramammary", href: "/category/vet-products/intramammary" },
      { label: "Pet shampoos", href: "/category/vet-products/pet-shampoos" },
    ],
  },
  {
    label: "Equipments",
    items: [
      { label: "Pigs", href: "/category/equipments/pigs" },
      { label: "Chicken", href: "/category/equipments/chicken" },
      { label: "Cattle", href: "/category/equipments/cattle" },
      { label: "Pets", href: "/category/equipments/pets" },
      { label: "Fumigation", href: "/category/equipments/fumigation" },
      { label: "Farm", href: "/category/equipments/farm" },
    ],
  },
];

function Navigation() {
  const cart = useSelector((state) => state.cart);
  const totalQuantity = cart?.cartTotalQuantity ?? cart?.cartTotalQuanty ?? 0;
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [openMobileCategoryGroup, setOpenMobileCategoryGroup] = useState(null);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileCategoriesRef = useRef(null);
  const buttonRef = useRef(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const avatarUrl = getAvatarUrl(user);

  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    const query = trimmed ? `?q=${encodeURIComponent(trimmed)}` : "";
    navigate(`/AllProducts${query}`);
  };

  const toggleMobileCategoryGroup = (label) => {
    setOpenMobileCategoryGroup((prev) => (prev === label ? null : label));
  };

  useEffect(() => {
    setUser(parseStoredJson("user", null));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoriesOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current?.contains(event.target)
      ) {
        setCategoriesOpen(false);
      }

      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !buttonRef.current?.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [categoriesOpen, mobileMenuOpen]);

  return (
    <div
      className="
        flex justify-between items-center
        text-center font-bold text-white
        fixed top-0 left-0
        w-full
        z-50
        shadow-md bg-green-900
        p-2
      "
    >
      <div className="flex flex-col gap-2 w-full px-3 sm:px-2 lg:px-8">
        <div className="flex items-center justify-between w-full gap-2 flex-wrap md:flex-nowrap">
          {/* Logo */}
          <img className="hover:bg-green-800 w-20 h-12 p-1 rounded cursor-pointer"
          src={assets.AgriventureLogo || assets.AgriventureLogo}
          alt="company logo" />
         

          <input
            type="text"
            placeholder="Search Items"
            className="hidden md:block
              bg-white text-green-700 border border-green-700
              focus:outline-2 focus:outline-offset-1
              px-2 py-1 rounded
              flex-1 mx-1
              w-full
            "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
          />

          <div className="relative flex items-center gap-2 md:hidden text-3xl">
            <button
              type="button"
              onClick={() => {
                setMobileCategoriesOpen((prev) => !prev);
                setMobileMenuOpen(false);
              }}
              className="hover:bg-green-800 bg-green-700 px-2 py-1 rounded text-sm font-bold text-white"
            >
              Categories
            </button>

            <div className="relative">
              <Link to="/Cart">
                <img
                  className="hover:bg-green-800 bg-green-700 w-8 h-8 p-1 rounded cursor-pointer"
                  src={assets.Cart || assets.cart}
                  alt="Cart icon"
                />

                <span
                  className="
                    absolute -top-2 -right-2
                    bg-red-500 text-white rounded-full
                    w-5 h-5 text-xs flex
                    items-center justify-center
                  "
                >
                  {totalQuantity}
                </span>
              </Link>
            </div>

            <div>
              <Link to={user ? "/MyOrders" : "/Register"}>
                {user ? (
                  avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="User avatar"
                      className="h-10 w-10 rounded-full object-cover border border-white"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-green-900">
                      {getInitials(user)}
                    </div>
                  )
                ) : (
                  <img
                    src={assets.register || assets.SignupPic}
                    alt="Register"
                    className="hover:bg-green-800 bg-green-700 w-10 h-10 p-1 rounded cursor-pointer"
                  />
                )}
              </Link>
            </div>
          </div>

          <button
            type="button"
            ref={buttonRef}
            className="md:hidden text-3xl"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        <div className="w-full md:hidden">
          <input
            type="text"
            placeholder="Search Items"
            className="
              w-full
              bg-white text-green-700 border border-green-700
              focus:outline-2 focus:outline-offset-1
              px-2 py-1 rounded
            "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
        </div>

        {mobileCategoriesOpen && (
          <div
            ref={mobileCategoriesRef}
            className="w-full md:hidden mt-2 rounded bg-green-800 p-2 shadow-md"
          >
            <div className="flex flex-col gap-1">
              {categories.map((category) => (
                <Link
                  key={category.label}
                  to={category.href}
                  onClick={() => {
                    setMobileCategoriesOpen(false);
                    setOpenMobileCategoryGroup(null);
                  }}
                >
                  <p className="hover:bg-green-700 bg-green-900 px-3 py-1 rounded text-sm">
                    {category.label}
                  </p>
                </Link>
              ))}

              {nestedCategories.map((category) => (
                <div key={category.label} className="w-full">
                  <button
                    type="button"
                    onClick={() => toggleMobileCategoryGroup(category.label)}
                    className="w-full flex items-center justify-between hover:bg-green-700 bg-green-900 px-3 py-1 rounded text-left text-sm"
                  >
                    <span>{category.label}</span>
                    <span>{openMobileCategoryGroup === category.label ? "−" : "+"}</span>
                  </button>

                  {openMobileCategoryGroup === category.label && (
                    <div className="mt-1 flex flex-col gap-1 pl-3">
                      {category.items.map((item) => (
                        <Link
                          key={item.label}
                          to={item.href}
                          onClick={() => {
                            setMobileCategoriesOpen(false);
                            setOpenMobileCategoryGroup(null);
                          }}
                        >
                          <p className="hover:bg-green-700 bg-green-900 px-3 py-1 rounded text-xs">
                            {item.label}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="hidden md:flex justify-between items-center gap-2 lg:gap-4 flex-wrap">
          <Link to="/">
            <p className="hover:bg-green-800 bg-green-700 px-3 py-1 rounded">
              Home
            </p>
          </Link>

          <Link to="/About">
            <p className="hover:bg-green-800 bg-green-700 px-3 py-1 rounded">
              About
            </p>
          </Link>

          <div ref={menuRef} className="hidden md:block relative">
            <button
              onClick={() => setCategoriesOpen((prev) => !prev)}
              className="hover:bg-green-800 bg-green-700 px-2 lg:px-3 py-1 rounded text-white text-sm lg:text-base"
            >
              Categories
            </button>

            {categoriesOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                <ul className="py-2 text-green-900">
                  {categories.map((category) => (
                    <li key={category.label} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <Link to={category.href}>{category.label}</Link>
                    </li>
                  ))}

                  {nestedCategories.map((category) => (
                    <li key={category.label} className="group relative px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <span className="flex items-center justify-between">
                        {category.label}
                      </span>
                      <ul className="absolute top-0 left-full text-left w-48 bg-white shadow-lg rounded-md hidden group-hover:block z-50">
                        {category.items.map((item) => (
                          <li key={item.label} className="px-4 py-2 hover:bg-gray-100">
                            <Link to={item.href}>{item.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Link to="/Features">
            <p className="hover:bg-green-800 bg-green-700 px-3 py-1 rounded">
              Features
            </p>
          </Link>

          <Link to="/AllContacts">
            <p className="hover:bg-green-800 bg-green-700 px-3 py-1 rounded">
              Contacts
            </p>
          </Link>

          <Link to="/MyOrders">
            <p className="hover:bg-green-800 bg-green-700 px-3 py-1 rounded">
              My Orders
            </p>
          </Link>

          <div className="relative">
            <Link to="/Cart">
              <img
                className="hover:bg-green-800 bg-green-700 w-8 h-8 p-1 rounded cursor-pointer"
                src={assets.Cart || assets.cart}
                alt="Cart icon"
              />

              <span
                className="
                  absolute -top-2 -right-2
                  bg-red-500 text-white rounded-full
                  w-5 h-5 text-xs flex
                  items-center justify-center
                "
              >
                {totalQuantity}
              </span>
            </Link>
          </div>

          <div>
            <Link to={user ? "/MyOrders" : "/Register"}>
              {user ? (
                avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="User avatar"
                    className="h-8 w-8 rounded-full object-cover border border-white"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-green-900">
                    {getInitials(user)}
                  </div>
                )
              ) : (
                <img
                  className="hover:bg-green-800 bg-green-700 w-8 h-8 p-1 rounded cursor-pointer"
                  src={assets.register || assets.SignupPic}
                  alt="Register"
                />
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="
            absolute top-full right-0
            w-48 bg-green-900
            flex flex-col items-start
            gap-1 py-4 md:hidden
            shadow-lg"
        >
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            <p className="hover:bg-green-800 bg-green-700 px-3 py-1 rounded">
              Home
            </p>
          </Link>

          <Link to="/About" onClick={() => setMobileMenuOpen(false)}>
            <p className="hover:bg-green-800 bg-green-700 px-3 py-1 rounded">
              About
            </p>
          </Link>

          <Link to="/Features" onClick={() => setMobileMenuOpen(false)}>
            <p className="hover:bg-green-800 bg-green-700 px-3 py-1 rounded">
              Features
            </p>
          </Link>

          <Link to="/AllContacts" onClick={() => setMobileMenuOpen(false)}>
            <p className="hover:bg-green-800 bg-green-700 px-3 py-1 rounded">
              Contacts
            </p>
          </Link>

          <Link to="/Register" onClick={() => setMobileMenuOpen(false)}>
            <button className="hover:bg-green-800 bg-green-700 px-3 py-1 rounded">
              Login/Register
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Navigation;