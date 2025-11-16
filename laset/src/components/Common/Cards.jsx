
import ProductsCard from "../Common/ProductsCard";
import { useState } from "react";



const Cards =() =>{
    return (
        <div className="flex">
    
        
            <div>
            <ProductsCard
                imgSrc="/images/Malin.png" 
                add="/images/add.png"
                imgAlt="capsicum image" 
                name="Malin F1" />
             </div> 
             <div>  
            <ProductsCard
            imgSrc="/images/RedRiz.png" 
            add="/images/add.png"
                imgAlt="capsicum image" 
                name="Red Riz F1" /> 
            </div>
            <div>
            <ProductsCard
            imgSrc="/images/Twix.png" 
            add="/images/add.png"
                imgAlt="capsicum image" 
                name="Twiz F1" />
            </div> 
        
       
            
        </div>
    );
}

export default Cards;