import { Link } from "react-router-dom";
import { assets } from "../../assets/assets.js";

export default function FeedBack() {
  return (
    <>
      <div
        className="
          w-full
          flex flex-row
          items-start
          gap-4
          mt-2 mb-2
          px-2 sm:px-4 md:px-6 lg:px-10
          py-4
          border border-green-700
          rounded-lg
          shadow-md
          overflow-hidden
        "
      >
        {/* Left Content */}
        <div className="flex-1 min-w-0">
          <h2
            className="
              font-extrabold
              text-lg sm:text-xl md:text-2xl lg:text-3xl
              pb-2
              text-green-900
            "
          >
            What People Are Saying About Us
          </h2>

          <div
            className="
              py-2 px-2 sm:px-3 md:px-4
              bg-white
              rounded-xl
              w-full
              max-w-[400px]
              shadow-lg
              flex flex-row
              items-center
              gap-3
              mt-4
            "
          >
            <img
              className="
                h-10 sm:h-12 md:h-14
                ml-1 sm:ml-2
                shrink-0
              "
              src={assets.womanImage}
              alt="Woman's icon"
            />

            <div className="min-w-0">
              <p className="font-semibold text-black text-sm sm:text-base">
                Mercy Chemilili
              </p>

              <p className="text-[10px] sm:text-xs mt-2 mb-2 text-gray-500">
                Farmer, Uasin Gishu county
              </p>

              <p className="text-black text-xs sm:text-sm md:text-base">
                "I absolutely love their products! It has changed my life for
                the better."
              </p>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div
            className="
              flex
              gap-4
              mt-4
              ml-8 sm:ml-16 md:ml-24 lg:ml-40
            "
          >
            <Link to="Allcomments">
              <img
                className="w-4 sm:w-5"
                src={assets.arrow2}
                alt="previous arrow"
              />
            </Link>

            <Link to="Allcomments">
              <img
                className="w-4 sm:w-5"
                src={assets.arrow}
                alt="next arrow"
              />
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="shrink-0 mt-2">
          <img
            className="
              w-[140px]
              sm:w-[220px]
              md:w-[320px]
              lg:w-[560px]
              h-[180px]
              sm:h-[220px]
              md:h-[260px]
              lg:h-[260px]
              rounded-lg
              object-cover
            "
            src={assets.feedbackPic}
            alt="farmer using a phone"
          />
        </div>
      </div>
    </>
  );
}





