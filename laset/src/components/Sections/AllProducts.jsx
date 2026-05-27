import { useDispatch } from "react-redux";
import { addToCart } from "../../Features/CartSlice";
import ProductsCard from "../Common/ProductsCard";
import Cart from "../Sections/Cart";
import {useGetAllProductsQuery} from '../../Features/ProductsApi';
import { useNavigate } from "react-router-dom";

export default function AllProducts() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {data, error, isLoading} = useGetAllProductsQuery();
    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
        navigate.push("/Cart");

    }
    
    return (
        <>  
            <div>
                {isLoading ? (
                    <p>Loading products...</p>
                ) : error ? (
                    <p>Failed to load products: {error?.data?.message || error?.message || 'Unknown error'}</p>
                ) : null}
            </div>
            
            <div className="mt-20 px-4 text-center">
                <h2 className="font-extrabold text-2xl text-green-900 mt-10">
                    Check Out Our Range of Products
                </h2>
                <p className="text-sm">
                    Explore our complete range of products, including the latest innovations and timeless classics.
                </p>
            </div>
            
            <Cart />

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
                {data?.map((product) => (
                    <div key={product.id} className="w-[90%] sm:w-full max-w-[260px]">
                        <ProductsCard
                            id={product.id}
                            imgSrc={product.img}
                            imgAlt={product.name}
                            add={product.add}
                            name={product.name}
                            price={product.price}  
                        />
                         <div>
                            <button className="bg-green-900 hover:bg-green-750 text-white font-bold py-2 px-4 rounded"
                             onClick={() => handleAddToCart(product)}>
                                Add to Cart
                            </button>
                         </div>
                    </div>
                ))}
            
            </div>
        </>
    );
}


