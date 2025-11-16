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

          <Link to="Contacts">
            <p className="hover:bg-green-900 focus:outline-2 focus:outline-offset-1 bg-green-700 active:bg-green-950 transition-15s">
              Contacts
            </p>
          </Link>

        </div>
      </div>
    </div>
  );
}

export default Navigation;
