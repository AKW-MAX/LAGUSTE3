import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../Features/CartSlice";
import ProductsCard from "../Common/ProductsCard";
import Cart from "../Sections/Cart";
import { useGetAllProductsQuery } from '../../Features/ProductsApi';
import { useLocation, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets.js";
import { product_list } from "../../assets/assets.js";

export default function AllProducts() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const {data, error, isLoading} = useGetAllProductsQuery();
    const products = Array.isArray(data) ? data : data?.value || product_list;
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("q")?.toLowerCase().trim() || "";

    const products_list = useMemo(() => {
        const source = products.length > 0 ? products : product_list;
        if (!query) return source;
        return source.filter((product) => {
            const text = `${product.name || ""} ${product.category || ""}`.toLowerCase();
            return text.includes(query);
        });
    }, [products, query]);

    const handleAddToCart = (product) => {
        const payload = {
            ...product,
            img: assets[product.img] || assets[product.image] || product.img || product.image,
            add: assets[product.add] || product.add,
        };
        dispatch(addToCart(payload));
    }
    
    return (
        <> 
            <div className="border border-green-700 rounded-lg shadow-md overflow-hidden">
                <div>
                {isLoading ? (
                    <p>Loading products...</p>
                    ) : error ? (
                        <p className="text-red-600">Failed to load products from the API. Showing local data instead.</p>
                    ) : null}
                </div>
                
                <div className="mt-4 px-4 text-center">
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
                    grid-rows-2
                    grid-flow-col
                    overflow-x-auto
                    overflow-y-hidden
                    gap-2
                    sm:gap-5
                    md:gap-4
                    lg:gap-4
                    px-2 sm:px-6 md:px-10
                    mb-10 mt-10
                    pb-4
                    scroll-smooth
                    whitespace-nowrap
                    max-w-full
                    ">

                    {products_list?.map((product) => (
                    <div key={product._id} className="
                     w-[100px]
                     sm:w-[180px]
                     md:w-[180px]
                     lg:w-[220px]
                                    
                    transition-transform duration-300 hover:scale-105
                    shrink-0
    
       ">
                        <ProductsCard
                         _id={product._id}
                        imgSrc={assets[product.img] || assets[product.image] || product.img || product.image}
                        imgAlt={product.name}
                        add={assets[product.add] || product.add}
                        name={product.name}
                        price={product.price}  
                        />
                        
                            <div  className="px-1 sm:px-2 md:px-3">
                                <button className="bg-green-900 hover:bg-green-800 text-white font-bold py-2 px-4 rounded ml-5 sm:ml-2 md:ml-4 "
                                onClick={() => handleAddToCart(product)}>
                                    Add to Cart
                                </button>
                            </div>
                    </div>
                   ))}
            
                </div>
            </div>
        </>
    );
}


