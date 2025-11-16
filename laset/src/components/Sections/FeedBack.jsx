import { Link } from "react-router-dom";

export default function FeedBack() {
    return (
        <>
            <title>Feed back</title>

            <div className="p-4 ml-4 sm:ml-8 lg:ml-11 mt-5 relative flex flex-col lg:flex-row items-start gap-6">

                {/* Left Content */}
                <div className="flex-1">
                    <h2 className="font-extrabold text-2xl pb-2 text-green-900">
                        What People Are Saying About Us
                    </h2>

                    <div className="py-2 px-2 bg-white rounded-xl w-full sm:w-90 shadow-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
                        <img
                            className="h-12 mt-2 ml-0 sm:ml-4"
                            src="src/assets/images/WomanImage.png"
                            alt="Woman's icon"
                        />

                        <div className="p-2">
                            <p className="font-semibold text-black-600">Mercy Chemilili</p>
                            <p className="text-xs mt-2 mb-2 text-black-500">Farmer, Uasin Gishu county</p>
                            <p className="pb-2 sm:pb-10 text-black-600">
                                "I absolutely love their products! It has changed my life for the better."
                            </p>
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="flex gap-4 mt-4 ml-30">
                        <Link to="Allcommen">
                            <img className="w-5 mt-1" src="src/assets/images/arrow2.png" alt="arrow icon" />
                        </Link>
                        <Link to="Allcomments">
                            <img className="w-5 mt-1" src="src/assets/images/arrow.png" alt="arrow icon" />
                        </Link>
                    </div>
                </div>

                {/* Right Image */}
                <div className="flex-shrink-0">
                    <img
                        className="w-64 sm:w-80 md:w-96 lg:w-140 h-80 rounded-lg"
                        src="src/assets/images/FeedbackPic.png"
                        alt="farmer using a phone"
                    />
                </div>
            </div>
        </>
    );
}




