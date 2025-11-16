import Hero from "./Hero";
import Starts from "./Starts";
import About from "./About";
import NewProducts from "./NewProducts";
import Features from "./Features";
import AllProducts from "./AllProducts";
import FeedBack from "./FeedBack";
import SignUp from "./SignUp";
import Footer from "../Layout/Footer";

const HomePage =() =>{
    return (
        <div>
            <title>Home</title>


            <Hero />
            <Starts />
            <About />
            <NewProducts />
            <Features />
            <AllProducts/>
            <FeedBack />
            <SignUp />
            <Footer />
 
        </div>
    );
}

export default HomePage;