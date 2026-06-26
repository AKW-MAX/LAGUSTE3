import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { assets } from "../../assets/assets.js";

function Navigation() {
  const cart = useSelector((state) => state.cart);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="
        flex justify-between items-center
        text-center font-bold text-white
        fixed top-0 left-0
        w-full
        z-50
        shadow-md bg-green-900
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
          
            <Link to="/Register">
              <img
              className="hover:bg-green-800 bg-green-700 w-8 h-8 p-1 rounded cursor-pointer"
              src={assets.WomanImage}
              alt="woman image"
              />
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
            shadow-lg
          "
          >

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
        </div>
         
      )}
      
    </div>
  );
}

export default Navigation;