import { Link } from 'react-router-dom';
import Facebook from '../Sections/Contacts/facebook';

function Footer() {
    return (
        <footer>
            <div className="font-sans text-white bg-green-950 p-4">
                {/* Top icons and title */}
                <div className="flex flex-wrap justify-between items-center gap-4 mr-11 mt-2">
                    <h3 className="ml-11 mt-4 mb-5 font-bold text-lg sm:text-base">QualityFirst</h3>
                    <Link to="Contacts">
                        <img className="w-5 mt-1 ml-20 sm:ml-4 bg-white" src="/images/phone.png" alt="phone icon" />
                    </Link>
                    <Link to="facebook">
                        <img className="w-5 mt-1 bg-white" src="/images/facebook.png" alt="facebook icon" />
                    </Link>
                    <Link to="contacts">
                        <img className="w-5 mt-1 bg-white mr-30 sm:mr-4" src="/images/whatsapp.png" alt="whatsapp icon" />
                    </Link>
                </div>

                {/* Footer links grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pl-4 pr-4 border-t mt-6">
                    <div>
                        <h5 className="font-semibold mt-6">Our Products</h5>
                        <p className="text-sm">Inseticides</p>
                        <p className="text-sm">Fungicides</p>
                        <p className="text-sm">Foliar Fertilizers</p>
                        <p className="text-sm">Public Health Products</p>
                    </div>

                    <div>
                        <h3 className="font-semibold mt-6">Our Services</h3>
                        <p className="text-sm">Agricultural Consultancy</p>
                        <p className="text-sm">Soil and Plant Tissue Analysis</p>
                        <p className="text-sm">Custom Formulation of Agrochemicals</p>
                        <p className="text-sm">Fumigation Services</p>
                    </div>

                    <div>
                        <h3 className="font-semibold mt-6">Resources</h3>
                        <p className="text-sm">Product Catalog</p>
                        <p className="text-sm">Most Popular Products</p>
                        <p className="text-sm">Blog post of our products</p>
                    </div>

                    <div>
                        <h3 className="font-semibold mt-6">Company</h3>
                        <p className="text-sm">About Us</p>
                        <p className="text-sm">Contact Us</p>
                        <p className="text-sm">Privacy Policy</p>
                        <p className="text-sm">Terms of Service</p>
                    </div>

                    <div>
                        <h3 className="font-semibold mt-6">Why Choose Us?</h3>
                        <p className="text-sm">High-Quality Products</p>
                        <p className="text-sm">Expertise and Experience</p>
                        <p className="text-sm">Customer-Centric Approach</p>
                        <p className="text-sm">Innovative Solutions</p>
                        <p className="text-sm">Sustainability Commitment</p>
                    </div>
                </div>

                {/* Bottom copyright */}
                <div className="text-center bg-green-950 p-4 text-white text-sm">
                    <p>© Agriventure Enterprises 2025- All Rights Reserved</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
