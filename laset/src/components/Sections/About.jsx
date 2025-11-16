export default function About() {
    return (
        <>
            <title>About</title>

            <section 
                className="
                    w-full 
                    py-10 
                    px-4 sm:px-10 lg:px-20 
                    bg-gradient-to-b from-green-50 to-white
                    flex flex-col lg:flex-row 
                    items-center lg:items-start 
                    gap-10 mr-11
                "
            >
                {/* Image */}
                <div className="flex-shrink-0">
                    <img
                        className="
                            rounded-sm grayscale-25 shadow-md
                            w-48 sm:w-64 md:w-80 lg:w-130
                            h-auto
                        "
                        src="src/assets/images/AboutPic.png"
                        alt="A happy farmer smiling in the field"
                    />
                </div>

                {/* Text Content */}
                <article className="max-w-2xl">
                    <h1 className="font-extrabold text-2xl sm:text-3xl mb-5 text-green-900">
                        Agriventure Enterprise — A Solution For All Your Farming Needs
                    </h1>

                    <p className="text-base leading-6 mb-5">
                        Agriventure Enterprise is a dynamic, farmer-centric agricultural company 
                        dedicated to providing easy access to reliable farming solutions.  
                        From planting to harvesting, we bring expert guidance and high-quality 
                        agricultural products right to your fingertips.
                    </p>

                    <ul className="list-disc pl-5 space-y-3">
                        <li className="font-semibold text-green-900">
                            Agricultural Consultation Services
                        </li>
                        <p className="text-base leading-6">
                            Our team of agronomy experts offers top-notch consultation to help 
                            you improve your farming experience throughout every stage — from 
                            land preparation to harvesting.
                        </p>
                        <p className="text-base leading-6">
                            We also provide professional fumigation services for tackling 
                            stubborn household and farm pests safely and effectively.
                        </p>

                        <li className="font-semibold text-green-900">
                            Agricultural Products
                        </li>
                        <p className="text-base leading-6">
                            We supply high-yield seed varieties, quality and affordable fertilizers, 
                            approved fungicides, reliable farm equipment, and safe public-health insecticides — 
                            all chosen to help farmers achieve healthy and abundant harvests.
                        </p>
                    </ul>
                </article>
            </section>
        </>
    );
}
