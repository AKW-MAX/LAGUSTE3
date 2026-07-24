import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets.js';


function Footer() {
    return (
        <footer>
            <div className="font-sans text-white bg-green-950 
                            p-3 sm:p-2 md:p-3 lg:p-4
                            border border-green-700 rounded-lg shadow-md overflow-hidden">

                {/* Top icons and title */}
                <div className="flex justify-between items-center ml-11 mr-20 flex-wrap 
                                gap-2 sm:gap-3 md:gap-2 lg:gap-4 mt-1">

                    <h3 className="font-bold 
                                   text-sm sm:text-sm md:text-xs lg:text-lg">
                        QualityFirst
                    </h3>

                    <div className="flex items-center 
                                    gap-3 sm:gap-3 md:gap-2 lg:gap-4">

                        <Link to="tel:0704519867">
                            <img className="w-4 bg-white md:w-3 lg:w-5 " 
                                 src={assets.phone} alt="phone icon" />
                        </Link>

                    
                        <a
                            href="https://web.facebook.com/profile.php?id=100078224891871"
                            target="_blank"
                            rel="noopener noreferrer"
                            >
                            <img className="w-4 bg-white md:w-3 lg:w-5" 
                                 src={assets.facebook} alt="facebook icon" />
                            </a>

                        <Link to="http://whatsapp.com/biz/0704519867">
                            <img className="w-4 bg-white md:w-3 lg:w-5" 
                                 src={assets.whatsapp} alt="whatsapp icon" />
                        </Link>

                    </div>
                </div>

                {/* Footer links grid - 5 columns on all screens */}
                <div className="grid grid-cols-5 
                                gap-2 sm:gap-1 md:gap-2 lg:gap-4 
                                px-1 sm:px-2 md:px-3 lg:px-6 
                                mt-3 border-t border-white/20">

                    <div className="text-[10px] sm:text-[8px] md:text-[10px] lg:text-sm">
                        <h5 className="font-semibold mt-3 lg:mt-6">Our Products</h5>
                        <Link to="AllProducts">
                        <p>Insecticides</p>
                        <p>Fungicides</p>
                        <p>Foliar Fertilizers</p>
                        <p>Public Health Products</p>
                        </Link>
                    </div>

                    <div className="text-[10px] sm:text-[8px] md:text-[10px] lg:text-sm">
                        <Link to="AllProducts">
                        <h3 className="font-semibold mt-3 lg:mt-6">Our Services</h3>
                        <p>Agricultural Consultancy</p>
                        <p>Soil & Plant Tissue Analysis</p>
                        <p>Custom Formulations</p>
                        <p>Fumigation Services</p>
                        </Link>
                    </div>

                    <div className="text-[10px] sm:text-[8px] md:text-[10px] lg:text-sm">
                        <h3 className="font-semibold mt-3 lg:mt-6">Resources</h3>
                        <Link to="NewProducts">
                        <p>Product Catalog</p>
                        <p>Popular Products</p>
                        <p>Blog Posts</p>
                        </Link>
                    </div>

                    <div className="text-[10px] sm:text-[11px] md:text-[10px] lg:text-sm">
                        <h3 className="font-semibold mt-3 lg:mt-6">Company</h3>
                        <Link to="About">
                        <p>About Us</p>
                        </Link>
                        <Link to="AllContacts">
                        <p>Contact Us</p>
                        </Link>
                        <Link to="PrivacyPolicy">
                        <p>Privacy Policy</p>
                        </Link>
                        <Link to="TermsOfService">
                        <p>Terms of Service</p>
                        </Link>
                    </div>

                    <div className="text-[10px] sm:text-[11px] md:text-[10px] lg:text-sm">
                        <h3 className="font-semibold mt-3 lg:mt-6">Why Choose Us?</h3>
                        <Link to="Features">
                        <p>High Quality</p>
                        <p>Experienced Team</p>
                        <p>Customer Focus</p>
                        <p>Innovation</p>
                        <p>Sustainability</p>
                        </Link>
                    </div>

                </div>

                {/* Bottom copyright */}
                <div className="text-center bg-green-950 
                                p-2 sm:p-2 md:p-2 lg:p-4
                                text-[10px] sm:text-[11px] md:text-[10px] lg:text-sm 
                                mt-3">
                    <p>© Agriventure Enterprise 2026 — All Rights Reserved</p>
                </div>

            </div>
        </footer>
    );
}

export default Footer;
