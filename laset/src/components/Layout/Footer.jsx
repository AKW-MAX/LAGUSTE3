import { Link } from 'react-router-dom';
import Facebook from '../Sections/Contacts/facebook';

function Footer() {
    return (
        <footer>
            <div className="font-sans text-white bg-green-950 p-4">

                {/* Top icons and title */}
                <div className="flex justify-between items-center flex-wrap gap-4 mt-2">

                    <h3 className="font-bold text-lg sm:text-base md:text-sm w-auto text-left 
                                   md:text-sm md:truncate">
                        QualityFirst
                    </h3>

                    <div className="flex gap-4 md:gap-2 items-center mr-11">

                        <Link to="Contacts">
                            <img className="w-5 md:w-4" src="/images/phone.png" alt="phone icon" />
                        </Link>

                        <Link to="facebook">
                            <img className="w-5 md:w-4" src="/images/facebook.png" alt="facebook icon" />
                        </Link>

                        <Link to="contacts">
                            <img className="w-5 md:w-4" src="/images/whatsapp.png" alt="whatsapp icon" />
                        </Link>

                    </div>
                </div>

                {/* Footer links grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-3 md:gap-2 px-2 sm:px-4 md:px-6 mt-6 border-t">

                    <div className="text-sm sm:text-xs md:text-[12px]">
                        <h5 className="font-semibold mt-6">Our Products</h5>
                        <p>Inseticides</p>
                        <p>Fungicides</p>
                        <p>Foliar Fertilizers</p>
                        <p>Public Health Products</p>
                    </div>

                    <div className="text-sm sm:text-xs md:text-[12px]">
                        <h3 className="font-semibold mt-6">Our Services</h3>
                        <p>Agricultural Consultancy</p>
                        <p>Soil and Plant Tissue Analysis</p>
                        <p>Custom Formulation of Agrochemicals</p>
                        <p>Fumigation Services</p>
                    </div>

                    <div className="text-sm sm:text-xs md:text-[12px]">
                        <h3 className="font-semibold mt-6">Resources</h3>
                        <p>Product Catalog</p>
                        <p>Most Popular Products</p>
                        <p>Blog post of our products</p>
                    </div>

                    <div className="text-sm sm:text-xs md:text-[12px]">
                        <h3 className="font-semibold mt-6">Company</h3>
                        <p>About Us</p>
                        <p>Contact Us</p>
                        <p>Privacy Policy</p>
                        <p>Terms of Service</p>
                    </div>

                    <div className="text-sm sm:text-xs md:text-[12px]">
                        <h3 className="font-semibold mt-6">Why Choose Us?</h3>
                        <p>High-Quality Products</p>
                        <p>Expertise and Experience</p>
                        <p>Customer-Centric Approach</p>
                        <p>Innovative Solutions</p>
                        <p>Sustainability Commitment</p>
                    </div>

                </div>

                {/* Bottom copyright */}
                <div className="text-center bg-green-950 p-4 text-white text-sm sm:text-xs md:text-[12px] mt-4">
                    <p>© Agriventure Enterprises 2025- All Rights Reserved</p>
                </div>

            </div>
        </footer>
    );
}

export default Footer;


