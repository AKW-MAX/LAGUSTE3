import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <div className="flex justify-between gap-2 text-center font-bold text-white relative p-4 mt-2 mb-2">
      <div className="flex justify-between items-center gap-4 w-full ml-11 mr-11 
                      flex-col sm:flex-row"> 
        {/* STACK on small screens */}

        <p className="ml-4">QualityFirst</p>

        <div className="flex justify-between items-center gap-4 ml-11 
                        flex-col sm:flex-row"> 
          {/* STACK on small screens */}

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
            <div>
              <img className="relative hover:bg-green-900 focus:outline-2 focus:outline-offset-1 bg-green-700 active:bg-green-950 transition-15s md:w-4 lg:w-8 h-5 " 
              src="/images/Cart.png" alt="Cart icon" />
              <span className="absolute top-1/2 right-20px bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">0</span>
            </div>
            
        

        

        </div>
      </div>
    </div>
  );
}

export default Navigation;
