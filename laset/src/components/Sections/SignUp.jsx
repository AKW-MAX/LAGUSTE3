import Buttons from "../Common/Buttons";

export default function SignUp() {
    return (
        <>
            <title>Sign up</title>

            <div className="relative">
                {/* Image */}
                <img
                    className="w-80 h-64 absolute p-6 ml-11 sm:w-64 sm:h-52 md:w-72 md:h-60 lg:w-80 lg:h-64"
                    src="src/assets/images/SignupPic.png"
                    alt="farmer images"
                />

                {/* Text Section */}
                <div className="text-justify text-white bg-green-900 pr-4 pl-4 pb-12 pt-8 mt-4 sm:mt-6 md:mt-8 lg:mt-4">
                    <h2 className="font-extrabold text-2xl mb-2 ml-150 sm:ml-4 md:ml-20 lg:ml-150 mt-3">
                        Sign Up for Exclusive Offers
                    </h2>
                    <p className="font-semibold mb-1 ml-150 sm:ml-4 md:ml-20 lg:ml-150">
                        Join our community and stay updated on the latest products <br />and promotions!
                    </p>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="text-black text-center rounded-lg pr-20 pb-2 ml-150 sm:ml-4 md:ml-20 lg:ml-150 bg-white mt-4 w-64 sm:w-48 md:w-60 lg:w-64"
                    />
                    <Buttons />
                </div>
            </div>
        </>
    );
}



