import { useDispatch } from "react-redux";
import { addToCart } from "../../Features/CartSlice";
import ProductsCard from "../Common/ProductsCard";
import Cart from "../Sections/Cart";
import {useGetAllProductsQuery} from '../../Features/ProductsApi';
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets.js";
import {product_list} from "../../assets/assets.js";

export default function AllProducts() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {data, error, isLoading} = useGetAllProductsQuery();
    const products = Array.isArray(data) ? data : data?.value || [];
    const products_list = products.length > 0 ? products : product_list;

    const handleAddToCart = (product) => {
        const payload = {
            ...product,
            img: assets[product.img] || product.img,
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
                        <p>Failed to load products: {error?.data?.message || error?.message || 'Unknown error'}</p>
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
                    grid-cols-1 
                    sm:grid-cols-2 
                    md:grid-cols-3 
                    lg:grid-cols-6
                    place-items-center
                    gap-6 
                    px-2 sm:px-6 md:px-10 
                    mb-10 mt-10
                    ">
                    {product_list?.map((product) => (
                    <div key={product._id} className="
                        w-[90%] sm:w-full max-w-[260px] 
                        transition-transform duration-300 hover:scale-105 ">
                        <ProductsCard
                         _id={product._id}
                        imgSrc={assets[product.img] || product.img}
                        imgAlt={product.name}
                        add={assets[product.add] || product.add}
                        name={product.name}
                        price={product.price}  
                        />
                        
                            <div>
                                <button className="bg-green-900 hover:bg-green-750 text-white font-bold py-2 px-4 rounded ml-5"
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


