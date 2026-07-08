import { Link } from "react-router-dom";

export default function Buttons() {
  return (
    <>
      <Link to="AllProducts">
        <button
      className="
      lg:mt-20
    bg-green-950
			pl-4
      pr-4
      pb-2
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