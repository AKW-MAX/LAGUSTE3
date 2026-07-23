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

const ProductsCard = ({
  _id,
  imgSrc,
  add,
  imgAlt,
  name,
  price,
}) => {
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
    resolveImageSource(
      (typeof add === "string" && add.trim()) || ""
    ) ||
    assets?.add_icon_green ||
    assets?.add_icon ||
    FALLBACK_PLUS_ICON;

  const safeImageSrc =
    resolveImageSource(imgSrc || "");

  return (
    <div className="
      w-full
      overflow-hidden
      rounded-lg
      border
      border-green-700
      bg-white
      shadow-sm
    ">

      {/* Small Product Image */}
      <div className="
        flex
        h-24
        w-full
        items-center
        justify-center
        bg-gray-50
        sm:h-28
        md:h-32
      ">

        <img
          src={safeImageSrc}
          alt={imgAlt}
          onClick={handleImageClick}
          className="
            h-full
            w-full
            cursor-pointer
            object-contain
            p-1
          "
        />

      </div>

      {/* Add Icon */}
      <div className="
        flex
        justify-end
        px-2
        pt-1
      ">

        <img
          src={addIconSrc}
          alt="Add to cart"
          onClick={handleAddToCart}
          onError={(e) => {
            e.currentTarget.src =
              FALLBACK_PLUS_ICON;
          }}
          className="
            h-5
            w-5
            cursor-pointer
            sm:h-6
            sm:w-6
          "
        />

      </div>

      {/* Product Name */}
      <h3 className="
        line-clamp-2
        px-2
        text-center
        text-base
        font-bold
        leading-4
        sm:text-base
        sm:leading-5
        md:text-lg
        md:leading-6
      ">
        {name}
      </h3>

      {/* Price */}
      <p className="
        mb-2
        mt-1
        text-center
        text-xs
        font-semibold
      ">
        Ksh {price}
      </p>

    </div>
  );
};

export default ProductsCard;

