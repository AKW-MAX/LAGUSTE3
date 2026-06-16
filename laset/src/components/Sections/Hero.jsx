import Header from "../Layout/Header"
import Buttons from "../Common/Buttons"
import Navigation from "../Layout/Navigation"
import HeroPic from "../../assets/HeroPic.png"


export default function Hero() {
	return (
		<>
	
	     <img className="
		 w-screen absolute h-150 saturate-70 sm:h-128 md:h-160 lg:h-192 
             grayscale-25
                    object-cover"
		  src = {HeroPic} alt = "Tomatoes being harvested" />
		 <Navigation />
		     <div className="text-center relative text-white p-0 mt-25 ">
		<Header />
		<Buttons />	
		</div>
        </>

	);
}

    
