import Buttons from "../Common/Buttons";

export default function SignUp() {
  return (
    <>
 

      <div className="bg-green-900 text-white p-6 flex items-center gap-4">

        {/* IMAGE - always on the left */}
        <div className="flex-shrink-0">
          <img
            className="
              w-40 h-32 
              sm:w-44 sm:h-36 
              md:w-52 md:h-40 
              lg:w-64 lg:h-52
            "
            src="/images/SignupPic.png"
            alt="Signup image"
          />
        </div>

        {/* TEXT - always on the right */}
        <div className="flex-grow">

          <h2 className="font-extrabold 
                         text-lg sm:text-xl md:text-2xl 
                         mb-2">
            Sign Up for Exclusive Offers
          </h2>

          <p className="font-semibold text-sm sm:text-base">
            Join our community and stay updated on the latest products <br />
            and promotions!
          </p>

          {/* Email + Button */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="text-black mt-10 bg-white rounded-lg p-2 
                         w-full sm:w-64"
            />
            <Buttons />
          </div>

        </div>
      </div>
    </>
  );
}

         




