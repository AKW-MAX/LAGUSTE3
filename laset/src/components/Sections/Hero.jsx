import Header from "../Layout/Header"
import Buttons from "../Common/Buttons"
import Navigation from "../Layout/Navigation"


export default function Hero() {
	return (
		<>
	
	     <img className="
		 w-screen absolute h-150 saturate-70 sm:h-[32rem] md:h-[40rem] lg:h-[48rem] 
             grayscale-25
                    object-cover"
		  src = "/images/HeroPic.png" alt = "Tomatoes being harvested" />
		 <Navigation />
		     <div className="text-center relative text-white p-2 mt-25 ">
		<Header />
		<Buttons />	
		</div>
        </>

	);
}

    
