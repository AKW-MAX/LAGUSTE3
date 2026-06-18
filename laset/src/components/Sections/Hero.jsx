import Header from "../Layout/Header"
import Buttons from "../Common/Buttons"
import Navigation from "../Layout/Navigation"
import {assets} from "../../assets/assets.js"
import Starts from "./Starts"


export default function Hero() {
	return (
		<>
	
	     <img className="
		 w-screen absolute h-100 saturate-70 sm:h-128 md:h-160 lg:h-140
             grayscale-25
                    object-cover"
		  src = {assets.HeroPic} alt = "Tomatoes being harvested" />
		 <Navigation />
	    <div className="text-center relative text-white p-0 mt-25 ">
			<Header />
			<Buttons />	
	    </div>
		<div className="absolute bottom-0 left-0 right-0 w-full ">
			<Starts />
		</div>
		
        </>

	);
}

    
