import ProductsCard from "../Common/ProductsCard";

export default function AllProducts() {
    return (
        <>
            <div className="mt-20 px-4 text-center">
                <h2 className="font-extrabold text-2xl text-green-900 mt-10">
                    Check Out Our Range of Products
                </h2>
                <p className="text-sm">
                    Explore our complete range of products, including the latest innovations and timeless classics.
                </p>
            </div>

            <div
                className="
                    grid 
                    grid-cols-1 
                    sm:grid-cols-2 
                    md:grid-cols-3 
                    lg:grid-cols-4
                    place-items-center
                    gap-6 
                    px-2 sm:px-6 md:px-10 
                    mb-10 mt-10
                "
            >
                <div className="w-[90%] sm:w-full max-w-[260px]">
                    <ProductsCard
                        imgSrc="/images/Kelpreal.png"
                        imgAlt="capsicum image"
                        add="/images/add.png"
                        name="Kelpreal 250ml"
                        price="sh600"
                    />
                </div>

                <div className="w-[90%] sm:w-full max-w-[260px]">
                    <ProductsCard
                        imgSrc="/images/Actellic.png"
                        add="/images/add.png"
                        imgAlt="Actellic image"
                        name="Actellic 1L"
                        price="sh6000"
                    />
                </div>

                <div className="w-[90%] sm:w-full max-w-[260px]">
                    <ProductsCard
                        imgSrc="/images/Atom.png"
                        add="/images/add.png"
                        imgAlt="Atom image"
                        name="Atom 1L"
                        price="sh1700"
                    />
                </div>

                <div className="w-[90%] sm:w-full max-w-[260px]">
                    <ProductsCard
                        imgSrc="/images/Bedlam.png"
                        add="/images/add.png"
                        imgAlt="Bedlam image"
                        name="Bedlam 50ml"
                        price="sh400"
                    />
                </div>

                <div className="w-[90%] sm:w-full max-w-[260px]">
                    <ProductsCard
                        imgSrc="/images/Dynamo.png"
                        add="/images/add.png"
                        imgAlt="Dynamo image"
                        name="Dynamo 100g"
                        price="sh900"
                    />
                </div>

                <div className="w-[90%] sm:w-full max-w-[260px]">
                    <ProductsCard
                        imgSrc="/images/Fendona.png"
                        add="/images/add.png"
                        imgAlt="Fendona image"
                        name="Fendona 250ml"
                        price="sh2200"
                    />
                </div>

                <div className="w-[90%] sm:w-full max-w-[260px]">
                    <ProductsCard
                        imgSrc="/images/Lancer.png"
                        add="/images/add.png"
                        imgAlt="Lancer image"
                        name="Lancer 1L"
                        price="sh2800"
                    />
                </div>

                <div className="w-[90%] sm:w-full max-w-[260px]">
                    <ProductsCard
                        imgSrc="/images/SpiderPlant.png"
                        add="/images/add.png"
                        imgAlt="SpiderPlant image"
                        name="Spider Plant 500g"
                        price="sh1900"
                    />
                </div>
            </div>
        </>
    );
}


