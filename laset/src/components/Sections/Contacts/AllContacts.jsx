export default function Facebook() {
    return (
        <>
        <div>
            <p className="font-extrabold text-2xl sm:text-3xl mb-5 text-green-900 ml-11 p-4">Reach us on phone </p>
            <p className="font-semibold text-sm ml-11 p-4">0704519867</p>
            <img className="w-4 bg-white md:w-3 lg:w-5 ml-15" src="/images/phone.png" alt="phone icon" />
        </div>
        <div>
           <h2 className="font-extrabold text-2xl sm:text-3xl mb-5 text-green-900 ml-11 p-4">Reach us on WhatsApp</h2>
           <p className="font-semibold text-sm ml-11 p-4">+254704519867</p>
           <p>
                <a href="http://whatsapp.com/biz/0704519867">
                <img className="w-4 bg-white md:w-3 lg:w-5 ml-15 " src="/images/whatsapp.png" alt="whatsapp icon" /></a>
           </p>
        </div>
        <br />
        <div>
            <h2 className="font-extrabold text-2xl sm:text-3xl mb-5 text-green-900 ml-11 p-4">Reach us on facebook </h2>
            <p>
            <a href="https://www.facebook.com/profile.php?id=1000078224891871">
            <img className="w-4 bg-white md:w-3 lg:w-5 ml-15  " src="/images/facebook.png" /></a>
            </p>
            <p className="font-semibold text-sm ml-11 p-4">Agriventure Consultancy</p>
            
            
        </div>
        </>
    );
}