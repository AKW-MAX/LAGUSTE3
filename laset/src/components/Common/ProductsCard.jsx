import { useNavigate } from "react-router-dom";
import { addToCart } from "../../Features/CartSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";

const ProductsCard = ({ _id, imgSrc, add, imgAlt, name, price }) => {
   const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleAddToCart = () => {
    dispatch(addToCart({
      _id,
      img: imgSrc,
      name,
      price,
    }));
  };

  const handleImageClick = () => {
    navigate(`/product/${_id}`);
  };

  return (
    <div className="w-full sm:w-36 xs:w-32 ml-3 sm:ml-2 mt-5 mb-5 shadow-lg rounded-md border border-green-700">
      {/* Product Id */}
      <p className="hidden">{_id}</p>
      {/* Product Image */}
      <img 
        src={imgSrc}
        alt={imgAlt} 
        onClick={handleImageClick}
        className="w-full h-48 sm:h-40 xs:h-36 object-cover rounded-md cursor-pointer" 
      />

      {/* Add to cart icon */}
      <img
        src={add}
        alt="Add to cart"
        onClick={handleAddToCart}
        className="w-8 sm:w-4 ml-auto mr-3 mt-2 cursor-pointer"
      />

      {/* Product Name */}
      <div>
        <h3 className="text-center font-bold text-sm sm:text-xs xs:text-[10px] mt-1">{name}</h3>
      </div>

      {/* Price */}
      <div className="flex justify-center items-center gap-1 mt-1">
        <p className="font-semibold text-sm">Ksh {price}</p>
        <p className="line-through text-xs text-gray-400">{price}</p>
      </div>
    </div>
  );
};

export default ProductsCard;


