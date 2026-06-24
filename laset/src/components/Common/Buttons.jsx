import { Link } from "react-router-dom";

export default function Buttons() {
	return (
		<>
		  <Link to= "AllProducts">
            <button className="
			border border-solid rounded-lg bg-green-950
			 pr-7 pl-7 pb-2 ml-4 mr-4 mt-10
			 sm:mt-2
			 md:mt-5
			 font-sans
		    text-white font-semibold">Shop Now</button>
		  </Link>
		</>
    
	);
}