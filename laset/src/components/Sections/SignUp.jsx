import Buttons from "../Common/Buttons";

export default function SignUp() {
    return (
        <>
            <title>Sign up</title>

            <div className="relative">

                {/* Image */}
                <img
                    className="w-64 h-52 sm:w-80 sm:h-64 absolute p-6 left-0 sm:left-auto"
                    src="/images/SignupPic.png"
                    alt="farmer images"
                />

                {/* Text Section */}
                <div className="text-justify text-white bg-green-900 pr-4 pl-4 pb-12 pt-8 mt-4 sm:mt-4">
                    <h2 className="font-extrabold text-2xl mb-2 ml-0 sm:ml-150 mt-3 text-center sm:text-left">
                        Sign Up for Exclusive Offers
                    </h2>
                    <p className="font-semibold mb-1 ml-0 sm:ml-150 text-center sm:text-left">
                        Join our community and stay updated on the latest products <br />and promotions!
                    </p>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="text-black text-center rounded-lg pr-20 pb-2 ml-0 sm:ml-150 bg-white mt-4 w-full sm:w-64"
                    />
                    <div className="flex justify-center sm:justify-start mt-4">
                        <Buttons />
                    </div>
                </div>

            </div>
        </>
    );
}




