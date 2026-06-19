import ProductsCard from "../Common/ProductsCard";
import { Link } from 'react-router-dom';
import { assets } from "../../assets/assets.js";


export default function NewProducts() {
    return (
        <>
          

            <div className="flex flex-col lg:flex-row 
            items-start lg:items-center
             p-4 lg:p-4 relative mt-40
             border border-green-700 rounded-lg shadow-md overflow-hidden
             ">

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
                                src={assets.arrow}
                                alt="arrow icon"
                            />
                        </Link>
                    </div>
                </div>

                {/* Right Cards Section */}
                <div className="flex-2 w-full overflow-x-auto overflow-y-hidden hide-scrollbar ">
                    <div className="flex flex-nowrap text-center gap-4 pb-4 ">
                        <div className="cursor-pointer border-radius-2xl transition-transform duration-300 hover:scale-105 ">
                        <ProductsCard
                            imgSrc={assets.twix}
                            imgAlt="capsicum image"
                            add={assets.add}
                            name="Twix 10g"
                            price="sh600"
                        />
                        </div>
                        <div className="cursor-pointer border-radius-2xl transition-transform duration-300 hover:scale-105">
                        <ProductsCard
                            imgSrc={assets.redRiz}
                            imgAlt="capsicum image"
                            add={assets.add}
                            name="Red Riz 10g"
                            price="sh600"
                        />
                        </div>

                        <div className="cursor-pointer border-radius-2xl transition-transform duration-300 hover:scale-105">             
                            <ProductsCard
                            imgSrc={assets.malin}
                            imgAlt="capsicum image"
                            add={assets.add}
                            name="Malin 10g"
                            price="sh600"
                        />
                        </div>
                        
                        <div className="cursor-pointer border-radius-2xl transition-transform duration-300 hover:scale-105">
                        <ProductsCard
                            imgSrc={assets.bioenzyme}
                            imgAlt="Biozyme image"
                            add={assets.add}
                            name="Biozyme 100ml"
                            price="sh600"
                        />
                        </div>

                        <div className="cursor-pointer border-radius-2xl transition-transform duration-300 hover:scale-105">
                        <ProductsCard
                            imgSrc={assets.handspray}
                            imgAlt="Handspray image"
                            add={assets.add}
                            name="Handspray 2L"
                            price="sh600"
                        />
                        </div>

                        <div className="cursor-pointer border-radius-2xl transition-transform duration-300 hover:scale-105">
                        <ProductsCard
                            imgSrc={assets.kelpreal}
                            imgAlt="Kelpreal image"
                            add={assets.add}
                            name="Kelpreal 10g"
                            price="sh600"
                        />
                        </div>

                        <div className="cursor-pointer border-radius-2xl transition-transform duration-300 hover:scale-105">
                        <ProductsCard
                            imgSrc={assets.ferrari}
                            imgAlt="Ferrari image"
                            add={assets.add}
                            name="Ferrari 1L"
                            price="sh600"
                        />
                        </div>

                        <div className="cursor-pointer border-radius-2xl transition-transform duration-300 hover:scale-105">
                        <ProductsCard
                            imgSrc={assets.kelpreal}
                            imgAlt="Kelpreal image"
                            add={assets.add}
                            name="Kelpreal 10g"
                            price="sh600"
                        />
                        </div>

                        <div className="cursor-pointer border-radius-2xl transition-transform duration-300 hover:scale-105">
                        <ProductsCard
                            imgSrc={assets.ferrari}
                            imgAlt="Ferrari image"
                            add={assets.add}
                            name="Ferrari 1L"
                            price="sh600"
                        />
                        </div>

                    
                        <div className="cursor-pointer border-radius-2xl transition-transform duration-300 hover:scale-105">
                            <ProductsCard
                            imgSrc={assets.malin}
                            imgAlt="capsicum image"
                            add={assets.add}
                            name="Malin 10g"
                            price="sh600"
                            />
                        </div>

                        <div className="cursor-pointer border-radius-2xl transition-transform duration-300 hover:scale-105">

                            <ProductsCard
                            imgSrc={assets.malin}
                            imgAlt="capsicum image"
                            add={assets.add}
                            name="Malin 10g"
                            price="sh600"
                            />
                        </div>

                        <div className="cursor-pointer border-radius-2xl transition-transform duration-300 hover:scale-105">
                            <ProductsCard
                            imgSrc={assets.malin}
                            imgAlt="capsicum image"
                            add={assets.add}
                            name="Malin 10g"
                            price="sh600"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

