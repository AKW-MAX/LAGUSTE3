import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { assets } from '../../assets/assets.js';

function Navigation() {
  const cart = useSelector((state) => state.cart);
  return (
    <div className="flex justify-between gap-2 text-center font-bold text-white p-4 w-full sticky top-0 z-50
    shadow-md bg bg-green-900
    ">
      <div className="flex justify-between items-center gap-4 w-full ml-11 mr-11 
                      flex-col sm:flex-row"> 
        {/* STACK on small screens */}

        <p className="ml-4">QualityFirst</p>

        <div className="flex justify-between items-center gap-4 ml-11 
                        flex-col sm:flex-row"> 
          {/* STACK on small screens */}
          <input type="text" placeholder="Search Items" className="bg-white text-green-700 border border-green-700 focus:outline-2 focus:outline-offset-1" />

          <Link to="/">
            <p className="hover:bg-green-900 focus:outline-2 focus:outline-offset-1 bg-green-700 active:bg-green-900 transition-15s">
              Home
            </p>
          </Link>

          <Link to="About">
            <p className="hover:bg-green-900 focus:outline-2 focus:outline-offset-1 bg-green-700 active:bg-green-900 transition-15s">
              About
            </p>
          </Link>

          <Link to="Features">
            <p className="hover:bg-green-900 focus:outline-2 focus:outline-offset-1 bg-green-700 active:bg-green-900 transition-15s">
              Features
            </p>
          </Link>

          <Link to="AllContacts">
            <p className="hover:bg-green-900 focus:outline-2 focus:outline-offset-1 bg-green-700 active:bg-green-950 transition-15s">
              Contacts
            </p>
          </Link>
            <div className="relative">
              <Link to="/Cart">
                <img
                  className="hover:bg-green-900 bg-green-700 md:w-4 lg:w-8 h-5 cursor-pointer"
                  src={assets.Cart}
                  alt="Cart icon"
                />

                <span className="
                  absolute 
                  -top-2 
                  -right-2 
                  bg-red-500 
                  text-white 
                  rounded-full 
                  w-5 
                  h-5 
                  text-xs 
                  flex 
                  items-center 
                  justify-center
                ">
                  {cart?.cartItems?.length || 0}
                </span>
              </Link>
            </div>
            <div>
              <Link to="Register">
              <button className="hover:bg-green-900 focus:outline-2 focus:outline-offset-1 bg-green-700 active:bg-green-950 transition-15s">
                Login/Register
              </button>
              </Link>
            </div>
            
        

        

        </div>
      </div>
    </div>
  );
}

export default Navigation;
