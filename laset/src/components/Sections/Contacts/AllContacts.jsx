export default function Facebook() {
    return (
        <>
        <div>
            <h1 className="font-extrabold text-2xl sm:text-3xl mb-5 text-green-900 ml-11 p-4">CONTACT US</h1>
            <div className="flex items-center">
                <img className="w-4 bg-white md:w-3 lg:w-5 ml-15" src="/images/phone.png" alt="phone icon" />
                <p className="font-semibold text-2xl sm:text-3xl mb-5 text-green-900 ml-11 p-4">Reach us on phone </p>
            </div>
            <p className="font-semibold text-sm ml-30 p-4">0704519867</p>
        
        </div>
        <div>
            <div className="flex items-center">
                <p>
                <a href="http://whatsapp.com/biz/0704519867">
                    <img className="w-4 bg-white md:w-3 lg:w-5 ml-15 " src="/images/whatsapp.png" alt="whatsapp icon" /></a>
                </p>
           <h2 className="font-semibold text-2xl sm:text-3xl mb-5 text-green-900 ml-11 p-4">Reach us on WhatsApp</h2>
            </div>
           <p className="font-semibold text-sm ml-30 p-4">
                <a href="http://whatsapp.com/biz/0704519867">
                +254704519867</a>
            </p>
        
        </div>
        <br />
        <div>
            <div className="flex items-center">
                <p>
                    <a href="https://www.facebook.com/profile.php?id=1000078224891871">
                    <img className="w-4 bg-white md:w-3 lg:w-5 ml-15  " src="/images/facebook.png" /></a>
                </p>
            <h2 className="font-semibold text-2xl sm:text-3xl mb-5 text-green-900 ml-11 p-4">Reach us on facebook </h2>
            </div>
            <p className="font-semibold text-sm ml-30 p-4 flex items-center">
                <a href="https://www.facebook.com/profile.php?id=1000078224891871">
                Agriventure Consultancy</a>
            </p>
       
        </div>
        <div>
            <h2 className="font-semibold text-2xl sm:text-3xl mb-5 text-green-900 ml-11 p-4">Our Location</h2>
            <p className="font-semibold text-sm p-4 ml-11">Richmond House, Mfangano street,opp Quickmat Supermarket</p>
        </div>
        </>
    );
}