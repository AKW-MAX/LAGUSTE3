import { Link } from "react-router-dom";

export default function Buttons() {
  return (
    <>
      <Link to="AllProducts">
        <button
      className="
     bg-green-950
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