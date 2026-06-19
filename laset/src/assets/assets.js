import AboutPic from "./AboutPic.png";
import ActellicPic from "./Actellic.png";
import add from "./add.png";
import Arrow from "./arrow.png";
import Arrow2 from "./arrow2.png";
import Atom from "./Atom.png";
import Bedlam from "./Bedlam.png";
import Biozyme100ml from "./Biozyme100ml.png";
import Cart from "./Cart.png";
import Dynamo from "./Dynamo.png";
import facebook from "./facebook.png";
import FeaturesPic from "./FeaturesPic.png";
import FeedbackPic from "./FeedbackPic.png";
import Fendona from "./Fendona.png";
import Ferrari1l from "./Ferrari1l.png";
import Handspray2l from "./Handspray2l.png";
import HeroPic from "./HeroPic.png";
import instagram from "./instagram.png";
import Jamboclean1l from "./Jamboclean1l.png";
import Kayazinon1l from "./Kayazinon1l.png";
import Kelpreal from "./Kelpreal.png";
import Kungunil from "./Kungunil.png";
import Lancer from "./Lancer.png";
import Malin from "./Malin.png";
import Lavendertotal1l from "./Lavendertotal1l.png";
import Omex500ml from "./Omex500ml.png";
import Optimizer from "./Optimizer.png";
import phone from "./phone.png";
import Reaper1l from "./Reaper1l.png";
import RedRiz from "./RedRiz.png";
import SignupPic from "./SignupPic.png";
import Twix from "./Twix.png";
import whatsapp from "./whatsapp.png";
import WomanImage from "./WomanImage.png";
import SpiderPlant from "./SpiderPlant.png";
import Actellic from "./Actellic.png";

export const assets = {
    AboutUsPic: AboutPic,
    Actellic,
    add,
    Arrow,
    Arrow2,
    Atom,
    Bedlam,
    Biozyme100ml,
    Cart,
    Dynamo,
    facebook,
    FeaturesPic,
    FeedbackPic,
    Fendona,
    Ferrari1l,
    Handspray2l,
    HeroPic,
    instagram,
    Jamboclean1l,
    Kayazinon1l,
    Kelpreal,
    Kungunil,
    Lancer,
    Malin,
    Lavendertotal1l,
    Omex500ml,
    Optimizer,
    phone,
    Reaper1l,
    RedRiz,
    SignupPic,
    Twix,
    whatsapp,
    WomanImage,
    SpiderPlant
}

// lowercase aliases for components that reference assets with lowercased keys
assets.aboutPic = AboutPic;
assets.featuresPic = FeaturesPic;
assets.feedbackPic = FeedbackPic;
assets.twix = Twix;
assets.redRiz = RedRiz;
assets.malin = Malin;
assets.bioenzyme = Biozyme100ml;
assets.handspray = Handspray2l;
assets.kelpreal = Kelpreal;
assets.ferrari = Ferrari1l;
assets.arrow = Arrow;
assets.arrow2 = Arrow2;
assets.womanImage = WomanImage;
assets.signupPic = SignupPic;
assets.cart = Cart;
assets.spiderPlant = SpiderPlant;
assets.actellic = Actellic;
assets.Phone = phone;

export default assets;
export const product_list = [
    {
        id: 1,
        name: "Omex 500ml",
        description: "foliar fertilizer",
        price: 1000,
        image: assets.Omex500ml
    },

    {
        id: 2,
        name: "Reaper 1L",
        description: "insecticide",
        price: 1500,
        image: assets.Reaper1l
    },
    {
        id: "3",
        name: "Actellic 50EC 1L",
        description: "insecticide",
        price: "Ksh 6000",
        image: assets.Actellic
  },
    {   id: "4",
        img: "assets.Atom",
        name: "Atom 1L",
        price: "Ksh 1800",
        description: "insecticide",

  },
    {  id: "5",
        img: "assets.Bedlam",
        name: "Bedlam 50ml",
        price: "Ksh 400",
        description: "insecticide",
  },
    {   id: "6",
        img: "assets.Biozyme100ml",
        name: "Biozyme 100ml",
        price: "Ksh 600",
        description: "foliar fertilizer"
  },
    {   id: "7",
        img: "assets.Dynamo",
        name: "Dynamo 100g", 
        price: "Ksh 500",
        description: "insecticide"
  },
  {
    id: "8",
    img: "assets.Fendona",
    name: "Fendona 500ml",
    price: "Ksh 2500",
    description: "public health insecticide"
  },
  {
    id: "9",
    img: "assets.Ferrari1l",
    name: "Ferrari 1L",
    price: "Ksh 2000" ,
    description: "foliar fertilizer"
  },
  {
    id: "10",
    img: "assets.Handspray2l",
    name: "Pressure Sprayer 2L",
    price: "Ksh 600",
    description: "equipment"
  },
  {
    id: "11",
    img: "assets.Jamboclean1l",
    name: "Jamboclean 1L",
    price: "Ksh 2000",
    description: "foliar fertilizer"
  },
  {
    id: "12",
    img: "assets.Kayazinon1l",
    name: "Kayazinon 1L",
    price: "Ksh 3500",
    description: "insecticide"
  },
  {
    id: "13",
    img: "Kelpreal",
    name: "Kelpreal 1L",
    price: "Ksh 3000"
  },
  {
    id: "14",
    img: "assets.Kungunil",
    name: "Kungunil 1L",  
    price: "Ksh 5500",
    description: "insecticide"
  },
  {
    id: "15",
    img: "assets.Lancer", 
    name: "Lancer 1L",
    price: "Ksh 3000",
    description: "insecticide"
  },
  {
    id: "16",
    img: "assets.Lavendertotal1l",
    name: "Lavender Total 1L",
    price: "Ksh 1800",
    description: "foliar fertilizer"

  },
  {
    id: "17",
    img: "assets.Malin",
    name: "Malin 5g",
    price: "Ksh 1000",
    description: "seeds"
  },
  {
    id: "18",
    img: "assets.Omex500ml",
    name: "Omex 500ml",
    name: "Omex 500ml",
    price: "Ksh 1300",
    description: "foliar fertilizer"
  },
  {
    id: "19",
    img: "assets.Optimizer",
    name: "Optimizer 1L",
    price: "Ksh 2500",
    description: "foliar fertilizer"
  },
  {
    id: "20",
    img: "assets.RedRiz",
    name: "Red Riz 10g",
    price: "Ksh 1000",
    description: "seeds"
  },
  {
    id: "20",
    img: "assets.Optimizer",
    name: "Optimizer 1L",
    price: "Ksh 2500",
    description: "foliar fertilizer"
  },
  {
    id: "20",
    img: "assets.RedRiz",
    name: "Red Riz 10g",
    price: "Ksh 1000",
    description: "seeds"
  },
  {
    id: "21",
    img: "assets.SpiderPlant",
    name: "Spider Plant 500g",
    price: "Ksh 1500",
    description: "seeds"
  },
  {
    id: "22",
    img: "assets.Twix",
    name: "Twix 10g",
    price: "Ksh 1000",
    description: "snack"
  },
  
  

];

