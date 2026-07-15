import { useNavigate } from "react-router-dom";
import { addToCart } from "../../Features/CartSlice";
import { useDispatch } from "react-redux";
import { assets, resolveImageSource } from "../../assets/assets.js";

const FALLBACK_PLUS_ICON =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="#166534">
      <circle cx="12" cy="12" r="10" fill="#dcfce7"/>
      <path d="M12 7v10M7 12h10" stroke="#166534" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  `);

const ProductsCard = ({ _id, imgSrc, add, imgAlt, name, price }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        _id,
        img: imgSrc,
        name,
        price,
      })
    );
  };

  const handleImageClick = () => {
    navigate(`/product/${_id}`);
  };

  const addIconSrc =
    resolveImageSource((typeof add === "string" && add.trim()) || "") ||
    assets?.add_icon_green ||
    assets?.add_icon ||
    FALLBACK_PLUS_ICON;

  const safeImageSrc = resolveImageSource(imgSrc || "");

  return (
    <div className="w-full sm:w-36 xs:w-32 ml-3 sm:ml-2 mt-5 mb-5 shadow-lg rounded-md border border-green-700">
      <p className="hidden">{_id}</p>

      <img
        src={safeImageSrc}
        alt={imgAlt}
        onClick={handleImageClick}
        className="w-full h-48 sm:h-40 xs:h-36 object-cover rounded-md cursor-pointer"
      />

      <img
        src={addIconSrc}
        alt="Add to cart"
        onClick={handleAddToCart}
        onError={(e) => {
          e.currentTarget.src = FALLBACK_PLUS_ICON;
        }}
        className="block w-8 h-8 sm:w-6 sm:h-6 ml-auto mr-3 mt-2 cursor-pointer"
      />

      <div>
        <h3 className="text-center font-bold text-sm sm:text-xs xs:text-[10px] mt-1">{name}</h3>
      </div>

      <div className="flex justify-center items-center gap-1 mt-1">
        <p className="font-semibold text-sm">Ksh {price}</p>
        <p className="line-through text-xs text-gray-400">{price}</p>
      </div>
    </div>
  );
};

export default ProductsCard;


