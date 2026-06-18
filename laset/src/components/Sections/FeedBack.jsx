import { Link } from "react-router-dom";
import {assets} from "../../assets/assets.js";

export default function FeedBack() {
    return (
        <>
            

            <div className=" w-full flex flex-col lg:flex-row items-start gap-6 mt-2 mb-2 pl-10 pr-10
             border border-green-700 rounded-lg shadow-md overflow-hidden">

                {/* Left Content */}
                <div className="flex-1">
                    <h2 className="font-extrabold text-xl sm:text-2xl md:text-3xl pb-2 text-green-900">
                        What People Are Saying About Us
                    </h2>

                    <div className="py-2 px-2 sm:px-4 bg-white rounded-xl w-full sm:w-[350px] md:w-[400px] shadow-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
                        <img
                            className="h-12 mt-2 sm:ml-4"
                            src={assets.womanImage}
                            alt="Woman's icon"
                        />

                        <div className="p-2">
                            <p className="font-semibold text-black">Mercy Chemilili</p>
                            <p className="text-xs mt-2 mb-2 text-gray-500">Farmer, Uasin Gishu county</p>
                            <p className="pb-2 sm:pb-0 text-black">
                                "I absolutely love their products! It has changed my life for the better."
                            </p>
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="flex gap-4 ml-40 mt-4 justify-start sm:justify-start">
                        <Link to="Allcomments">
                            <img className="w-5" src={assets.arrow2} alt="arrow icon" />
                        </Link>
                        <Link to="Allcomments">
                            <img className="w-5" src={assets.arrow} alt="arrow icon" />
                        </Link>
                    </div>
                </div>

                {/* Right Image */}
               <div className="shrink-0 mt-4 lg:mt-0">
    
                    <img className="  sm:w-80 md:w-96 lg:w-[560px] h-64 sm:h-64 md:h-64 rounded-lg object-cover"
                    src={assets.feedbackPic}
                    alt="farmer using a phone" />
                
                </div>
            </div>
        </>
    );
}





