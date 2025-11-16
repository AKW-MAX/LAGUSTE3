import Buttons from "../Common/Buttons";

export default function SignUp() {
    return (
        <>
            <title>Sign up</title>

            <div className="relative flex flex-col sm:flex-row items-center sm:items-start p-4">

                {/* Image */}
                <img
                    className="w-48 h-40 sm:w-80 sm:h-64 mb-4 sm:mb-0 sm:mr-6"
                    src="/images/SignupPic.png"
                    alt="farmer images"
                />

                {/* Text Section */}
                <div className="text-white bg-green-900 p-4 rounded w-full sm:w-auto">
                    <h2 className="font-extrabold text-xl sm:text-2xl md:text-3xl mb-2 text-center sm:text-left">
                        Sign Up for Exclusive Offers
                    </h2>
                    <p className="font-semibold mb-4 text-sm sm:text-base md:text-lg text-center sm:text-left">
                        Join our community and stay updated on the latest products <br />and promotions!
                    </p>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="text-black text-center rounded-lg p-2 w-full sm:w-64 mb-4"
                    />
                    <div className="flex justify-center sm:justify-start mt-2">
                        <Buttons />
                    </div>
                </div>

            </div>
        </>
    );
}




