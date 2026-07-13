import { Link } from "react-router-dom";

export default function Buttons() {
  return (
    <>
      <Link to="AllProducts">
        <button
      className="
    bg-green-950
			pl-4 sm:pl-3
      pr-4 sm:pr-3
      pb-2 sm:pb-1
      pt-2 sm:pt-1
      m-4 sm:m-2
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