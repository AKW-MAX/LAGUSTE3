import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer>
            <div className="font-sans text-white bg-green-950 
                            p-3 sm:p-3 md:p-3 lg:p-4">

                {/* Top icons and title */}
                <div className="flex justify-between items-center flex-wrap 
                                gap-2 sm:gap-2 md:gap-2 lg:gap-4 mt-1">

                    <h3 className="font-bold 
                                   text-sm sm:text-sm md:text-xs lg:text-lg">
                        QualityFirst
                    </h3>

                    <div className="flex items-center 
                                    gap-3 sm:gap-2 md:gap-2 lg:gap-4">

                        <Link to="/contacts">
                            <img className="w-4 md:w-3 lg:w-5" 
                                 src="/images/phone.png" alt="phone icon" />
                        </Link>

                        <Link to="/facebook">
                            <img className="w-4 md:w-3 lg:w-5" 
                                 src="/images/facebook.png" alt="facebook icon" />
                        </Link>

                        <Link to="/contacts">
                            <img className="w-4 md:w-3 lg:w-5" 
                                 src="/images/whatsapp.png" alt="whatsapp icon" />
                        </Link>

                    </div>
                </div>

                {/* Footer links grid - 5 columns on all screens */}
                <div className="grid grid-cols-5 
                                gap-2 sm:gap-2 md:gap-2 lg:gap-4 
                                px-1 sm:px-2 md:px-3 lg:px-6 
                                mt-3 border-t border-white/20">

                    <div className="text-[10px] sm:text-[11px] md:text-[10px] lg:text-sm">
                        <h5 className="font-semibold mt-3 lg:mt-6">Our Products</h5>
                        <p>Inseticides</p>
                        <p>Fungicides</p>
                        <p>Foliar Fertilizers</p>
                        <p>Public Health Products</p>
                    </div>

                    <div className="text-[10px] sm:text-[11px] md:text-[10px] lg:text-sm">
                        <h3 className="font-semibold mt-3 lg:mt-6">Our Services</h3>
                        <p>Agricultural Consultancy</p>
                        <p>Soil & Plant Tissue Analysis</p>
                        <p>Custom Formulations</p>
                        <p>Fumigation Services</p>
                    </div>

                    <div className="text-[10px] sm:text-[11px] md:text-[10px] lg:text-sm">
                        <h3 className="font-semibold mt-3 lg:mt-6">Resources</h3>
                        <p>Product Catalog</p>
                        <p>Popular Products</p>
                        <p>Blog Posts</p>
                    </div>

                    <div className="text-[10px] sm:text-[11px] md:text-[10px] lg:text-sm">
                        <h3 className="font-semibold mt-3 lg:mt-6">Company</h3>
                        <p>About Us</p>
                        <p>Contact Us</p>
                        <p>Privacy Policy</p>
                        <p>Terms of Service</p>
                    </div>

                    <div className="text-[10px] sm:text-[11px] md:text-[10px] lg:text-sm">
                        <h3 className="font-semibold mt-3 lg:mt-6">Why Choose Us?</h3>
                        <p>High Quality</p>
                        <p>Experienced Team</p>
                        <p>Customer Focus</p>
                        <p>Innovation</p>
                        <p>Sustainability</p>
                    </div>

                </div>

                {/* Bottom copyright */}
                <div className="text-center bg-green-950 
                                p-2 sm:p-2 md:p-2 lg:p-4
                                text-[10px] sm:text-[11px] md:text-[10px] lg:text-sm 
                                mt-3">
                    <p>© Agriventure Enterprises 2025 — All Rights Reserved</p>
                </div>

            </div>
        </footer>
    );
}

export default Footer;
