

const Cards = ({ imgSrc, imgAlt, name, price }) => {
  return (
    <div className="grid grid-cols-4  items-center">
      <div className="w-20 mt-5 mb-5 shadow-lg rounded-md">
        {/* Product Image */}
        <img 
          src={imgSrc} 
          alt={imgAlt} 
          className="h-20 rounded-md" 
        />
      </div>
        {/* Product Name */}
      <div>
        <h3 className="text-center font-thin text-xs mt-1">{name}</h3>
      </div>

        {/* Price */}
      <div className="flex justify-center items-center mt-1">
        <p className="font-thin text-xs">{price}</p>
      </div>
      
      <div className="justify-end items-center flex ">
        <span className="m-2 font-thin text-xs inline-block bg-white text-black p-2 rounded-4xl cursor-pointer">≤</span> 
        <span className="font-thin text-xs inline-block bg-transparent text-white p-2 rounded-4xl cursor-pointer">1</span>
        <span className="m-2 font-thin text-xs inline-block bg-white text-black p-2 rounded-4xl cursor-pointer">≥</span>
      </div>
    </div> 
  );
};

export default Cards;
