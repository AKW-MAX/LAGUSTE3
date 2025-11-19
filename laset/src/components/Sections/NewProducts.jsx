import Cards from "../Common/Cards";
import { Link } from 'react-router-dom';

export default function NewProducts() {
    return (
        <>
          

            <div className="flex flex-col lg:flex-row items-start lg:items-center p-4 lg:p-4">

                {/* Left Text Section */}
                <div className="flex-1 mb-10 lg:mb-0 lg:mr-0 ml-6 sm:ml-11 text-center sm:text-left">
                    <h2 className="font-extrabold text-2xl lg:text-3xl mb-5 lg:mb-8 text-green-900">
                        New In Store With<br />Great Discounts!!
                    </h2>

                    <p className="text-sm lg:text-base mb-5 lg:mb-8">
                        Check out our latest additions to the collection!
                    </p>

                    <div className="flex items-center justify-center sm:justify-start gap-2 lg:gap-4">
                        <p className="text-green-900 font-semibold">View All Products</p>
                        <Link to="NewProducts">
                            <img
                                className="w-5 lg:w-6 mt-1 lg:mt-0"
                                src="/images/arrow.png"
                                alt="arrow icon"
                            />
                        </Link>
                    </div>
                </div>

                {/* Right Cards Section */}
                <div className="flex-1 w-full lg:w-0 overflow-x-auto">
                    <Cards />
                </div>

            </div>
        </>
    );
}

