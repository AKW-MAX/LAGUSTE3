import { Link } from "react-router-dom";

export default function Buttons() {
  return (
    <>
      <Link to="AllProducts">
        <button
          className="
          bg-green-950
			px-3 py-1
			sm:px-4 sm:py-2
			md:px-5 md:py-2
			rounded-lg
			text-xs sm:text-sm md:text-base
			font-semibold
			hover:bg-green-800
            transition
			border border-white
          "
        >
          Shop Now
        </button>
      </Link>
    </>
  );
}