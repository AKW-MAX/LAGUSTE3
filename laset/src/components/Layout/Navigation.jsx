import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect, useRef } from "react";
import { assets } from "../../assets/assets.js";

const getInitials = (userData) => {
  if (!userData) return "U";

  const first = userData.first_name?.trim()?.[0] || "";
  const last = userData.last_name?.trim()?.[0] || "";
  const initials = `${first}${last}`.trim();

  return initials || userData.email?.[0]?.toUpperCase() || "U";
};

function Navigation() {
  const cart = useSelector((state) => state.cart);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      setUser(savedUser ? JSON.parse(savedUser) : null);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

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
      <div className="flex justify-between items-center w-full px-4 sm:px-8">
        {/* Logo */}
        <p className="text-l whitespace-nowrap">QualityFirst</p>

          <input type="text"
            placeholder="Search Items"
            className="
            bg-white text-green-700 border border-green-700
            focus:outline-2 focus:outline-offset-1
            px-2 py-1 rounded 
            flex-1 mx-2
            min-w-0
            "
          />
          <div className="relative flex flex-2 gap-2 md:hidden text-3xl 1g:hidden">
            <div className="relative">
              <Link to="/Cart">
                <img
                  className="hover:bg-green-800 bg-green-700 w-8 h-8 p-1 rounded cursor-pointer"
                  src={assets.Cart}
                  alt="Cart icon"
                />

                <span
                  className="
                    absolute -top-2 -right-2
                    bg-red-500 text-white rounded-full
                    w-5 h-5 text-xs flex
                    items-center justify-center
                  ">
                  {cart?.cartItems?.length || 0}
                </span>
              </Link>
            </div>

            <div>
          
            <Link to={user ? "/MyOrders" : "/Register"}>
              {user ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-green-900">
                  {getInitials(user)}
                </div>
              ) : (
                <img
                  src={assets.register}
                  alt="Register"
                  className="w-10 h-10"
                />
              )}
            </Link>
            </div>
          </div>

        {/* Hamburger Menu Button */}
        <button
          className="sm:hidden md:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Desktop Menu */}
        <div className="hidden sm:flex justify-between items-center gap-4">

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

          <div ref={menuRef} className="hidden lg:block relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="hover:bg-green-800 bg-green-700 px-3 py-1 rounded text-white" >
              Categories
            </button>

            {menuOpen && (
              <div className="absolute top-full left-0 mt-2 w-45 bg-white shadow-lg rounded-md z-50">
                <ul className="py-2 text-green-900">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Pesticides
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Fungicides
                  </li>
                  <li  className=" group relative px-4 py-2 hover:bg-gray-100 cursor-pointer ">
                    Fertilizer
                    <ul className="absolute top-0 left-full text-left
                        w-48 bg-white shadow-lg rounded-md
                        hidden group-hover:block z-50">
                      <li className="px-4 py-2 hover:bg-gray-100">Foliar Feed</li>
                      <li className="px-4 py-2 hover:bg-gray-100">Planting Fertilisers</li>
                      <li className="px-4 py-2 hover:bg-gray-100">Top-Dressing Fertilisers</li>
                      <li className="px-4 py-2 hover:bg-gray-100">compound fertilisers</li>
                    </ul>

                  </li>
                  <li className="group relative px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Vet Products
                    <ul className="absolute top-0 left-full text-left
                        w-48 bg-white shadow-lg rounded-md
                        hidden group-hover:block z-50">
                      <li className="px-4 py-2 hover:bg-gray-100">Dewormers</li>
                      <li className="px-4 py-2 hover:bg-gray-100">Suppliments</li>
                      <li className="px-4 py-2 hover:bg-gray-100">Ethicals</li>
                      <li className="px-4 py-2 hover:bg-gray-100">Disinfectants</li>
                      <li className="px-4 py-2 hover:bg-gray-100">Acaricides</li>
                      <li className="px-4 py-2 hover:bg-gray-100">Intramammary</li>
                      <li className="px-4 py-2 hover:bg-gray-100">Pet shampoos</li>
                    </ul>
                  </li>

                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Organic Products
                  </li>
                  <li className="group relative px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Equipments
                    <ul className="absolute top-0 left-full text-left
                        w-48 bg-white shadow-lg rounded-md
                        hidden group-hover:block z-50">
                      <li className="px-4 py-2 hover:bg-gray-100">Pigs</li>
                      <li className="px-4 py-2 hover:bg-gray-100">Chicken</li>
                      <li className="px-4 py-2 hover:bg-gray-100">Cattle</li>
                      <li className="px-4 py-2 hover:bg-gray-100">Pets</li>
                      <li className="px-4 py-2 hover:bg-gray-100">Fumigation</li>
                      <li className="px-4 py-2 hover:bg-gray-100">Farm</li>
                    </ul>
                  </li>

                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Agronomist Services
                  </li>

                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Vet Services
                  </li>

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
                src={assets.Cart}
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
                {cart?.cartItems?.length || 0}
              </span>
            </Link>
          </div>

          <div>
            <Link to={user ? "/MyOrders" : "/Register"}>
              {user ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-green-900">
                  {getInitials(user)}
                </div>
              ) : (
                <img
                  className="hover:bg-green-800 bg-green-700 w-8 h-8 p-1 rounded cursor-pointer"
                  src={assets.WomanImage}
                  alt="woman image"
                />
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      
      {menuOpen && (
        <div
            className="
            absolute top-full right-0
            w-30 bg-green-900
            flex flex-col items-left
            gap-1 py-4 sm:hidden
            shadow-lg">

            <Link to="/" onClick={() => setMenuOpen(false)}>
              <p className="hover:bg-green-800 bg-green-700 px-3 py-1 rounded">
                Home
              </p>
            </Link>

            <Link to="/About" onClick={() => setMenuOpen(false)}>
              <p className="hover:bg-green-800 bg-green-700 px-3 py-1 rounded">
                About
              </p>
            </Link>

            <Link to="/Features" onClick={() => setMenuOpen(false)}>
              <p className="hover:bg-green-800 bg-green-700 px-3 py-1 rounded">
                Features
              </p>
            </Link>

            <Link to="/AllContacts" onClick={() => setMenuOpen(false)}>
              <p className="hover:bg-green-800 bg-green-700 px-3 py-1 rounded">
                Contacts
              </p>
            </Link>

            <Link to="/Register" onClick={() => setMenuOpen(false)}>
              <button className="hover:bg-green-800 bg-green-700 px-3 py-1 rounded">
                Login/Register
              </button>
            </Link>

            <button className="hover:bg-green-800 bg-green-700 px-3 py-1 rounded">
                Categories
            </button>

        </div>
         
      )}
      
    </div>
  );
}

export default Navigation;