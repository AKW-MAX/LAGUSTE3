export default function Features() {
    return (
        <>
            

            <div
                className="
                    flex flex-col lg:flex-row
                    mt-5 p-4 
                    ml-4 sm:ml-8 lg:ml-11 
                    mb-10 
                    gap-8 lg:gap-0
                    items-center
                "
            >
                {/* Text Section */}
                <div className="text-justify max-w-xl">
                    <h2 className="font-extrabold text-2xl sm:text-3xl p-1 mt-2 mb-5 text-green-900">
                        Welcome to the Home of Agricultural <br className="hidden sm:block" />
                        Expertise at Its Finest
                    </h2>

                    <p className="text-sm sm:text-base leading-6 mt-2 mb-2 ">
                        We walk with you throughout your agricultural journey from start to 
                        finish offering quality and trusted expertise you can rely on. 
                        What makes us unique is the proven experience shared by over 10,000 
                        satisfied customers, our certified high-quality products, and our 
                        timely delivery across the country.
                    </p>

                    <p className="text-sm sm:text-base leading-6">
                        Our motto <strong>Quality First</strong> is not just a phrase we live by it. 
                        Because in agriculture, quality is what truly matters.
                    </p>
                </div>

                {/* Image Section */}
                <div className="flex-shrink-0">
                    <img
                        className="
                            w-64 sm:w-80 md:w-96 lg:w-120 
                            h-auto 
                            rounded-sm
                            shadow-md
                            mt-6 lg:mt-0
                            ml-15

                            transition-transform duration-300 ease-in-out
                            hover:scale-105 hover:shadow-lg
                            cursor-pointer
                        "
                        src="/images/FeaturesPic.png"
                        alt="farmers"
                    />
                </div>
            </div>
        </>
    );
}
