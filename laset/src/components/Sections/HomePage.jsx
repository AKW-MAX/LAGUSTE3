import { useEffect } from "react";
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
    useEffect(() => {
        document.title = "Agriventure Enterprise | Farm Inputs, Equipments, Seeds & Agro Supplies";
        const descriptionTag = document.querySelector('meta[name="description"]');
        if (descriptionTag) {
            descriptionTag.setAttribute(
                "content",
                "Shop quality farm inputs, crop protection products, seeds, and agro supplies at Agriventure Enterprise. Browse trusted products for modern farming."
            );
        } else {
            const meta = document.createElement("meta");
            meta.name = "description";
            meta.content = "Shop quality farm inputs, crop protection products, seeds, and agro supplies at Agriventure Enterprise. Browse trusted products for modern farming.";
            document.head.appendChild(meta);
        }
    }, []);

    return (
        <div>
           


            <Hero />
            <NewProducts />
            <AllProducts showSearchBar={false} />
            <FeedBack />
            <SignUp />
            <Footer />
 
        </div>
    );
}

export default HomePage;

