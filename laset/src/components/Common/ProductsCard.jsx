import { Link } from "react-router-dom";

const ProductsCard = ({ imgSrc, add, imgAlt, name, price }) => {
  return (
    <div className="w-44 sm:w-36 xs:w-32 ml-3 sm:ml-2 mt-5 mb-5 shadow-lg rounded-md">
      {/* Product Image */}
      <img 
        src={imgSrc} 
        alt={imgAlt} 
        className="w-full h-48 sm:h-40 xs:h-36 object-cover rounded-md" 
      />

      {/* Add to cart icon */}
      <Link to="Cart">
        <img 
          src={add} 
          alt="Add to cart" 
          className="w-8 sm:w-4 ml-auto mr-3 mt-2 cursor-pointer" 
        />
      </Link>

      {/* Product Name */}
      <div>
        <h3 className="text-center font-bold text-sm sm:text-xs xs:text-[10px] mt-1">{name}</h3>
      </div>

      {/* Price */}
      <div className="flex justify-center items-center gap-1 mt-1">
        <p className="font-semibold text-sm">{price}</p>
        <p className="line-through text-xs text-gray-400">{price}</p>
      </div>
    </div>
  );
};

export default ProductsCard;


