import Header from "../Layout/Header"
import Buttons from "../Common/Buttons"
import Navigation from "../Layout/Navigation"
import { assets } from "../../assets/assets.js"
import Starts from "./Starts"


export default function Hero() {
	return (
		<>
	    <div className="relative h-[400px] sm:h-[450px] md:h-[600px] lg:h-[650px]  border border-green-700">
			<img className="
			      w-full absolute h-full saturate-70
				  grayscale-25
				  object-cover"
			src = {assets.HeroPic} alt = "Tomatoes being harvested" />
			<Navigation />
			<div className="text-center relative text-white justify-center mt-20 sm:mt-0 md:mt-15">
				<Header />
				<Buttons />	
			</div>
			<div className="absolute bottom-0 left-0 right-0 w-full
			">
				<Starts />
			</div>
		</div>
			
        </>

	);
}

    
