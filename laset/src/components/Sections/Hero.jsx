import Header from "../Layout/Header"
import Buttons from "../Common/Buttons"
import Navigation from "../Layout/Navigation"
import { assets } from "../../assets/assets.js"
import Starts from "./Starts"


export default function Hero() {
	return (
		<>
	    <div className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[650px] border border-green-700 mt-5">
			<img className="
			      w-full absolute h-full saturate-70
				  grayscale-25
				  object-cover"
			src = {assets.HeroPic} alt = "Tomatoes being harvested" />
			<Navigation />
			<div className="relative z-20 flex flex-col items-center justify-center h-full text-white px-4">
			  <Header />
			  <Buttons />	
			</div>
			<div className="absolute bottom-0 left-0 right-0 w-full sm:mt-10
			">
				<Starts />
			</div>
		</div>
			
        </>

	);
}

    
