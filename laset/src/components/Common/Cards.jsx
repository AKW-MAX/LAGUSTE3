
import ProductsCard from "../Common/ProductsCard";
import { useState } from "react";



const Cards =() =>{
    return (
        <div className="flex">
    
        
            <div>
            <ProductsCard
                imgSrc="src/assets/images/Malin.png" 
                add="src/assets/images/add.png"
                imgAlt="capsicum image" 
                name="Malin F1" />
             </div> 
             <div>  
            <ProductsCard
            imgSrc="src/assets/images/RedRiz.png" 
            add="src/assets/images/add.png"
                imgAlt="capsicum image" 
                name="Red Riz F1" /> 
            </div>
            <div>
            <ProductsCard
            imgSrc="src/assets/images/Twix.png" 
            add="src/assets/images/add.png"
                imgAlt="capsicum image" 
                name="Twiz F1" />
            </div> 
        
       
            
        </div>
    );
}

export default Cards;