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
        _id: 1,
        image: assets.Omex500ml,
         add: "add",
        name: "Omex 500ml",
        description: "foliar fertilizer",
        price: 1000,
    },

    {
        _id: 2,
        image: assets.Reaper1l,
         add: "add",
        name: "Reaper 1L",
        description: "insecticide",
        price: 1500,
    },
    {
        _id: "3",
        image: assets.Actellic,
         add: "add",
        name: "Actellic 50EC 1L",
        description: "insecticide",
        price:  6000,
  },
    {   _id: "4",
        img: assets.Atom,
         add: "add",
        name: "Atom 1L",
        price: 1800,
        description: "insecticide",

  },
    {  _id: "5",
        img: assets.Bedlam,
         add: "add",
        name: "Bedlam 50ml",
        price: 400,
        description: "insecticide",
  },
    {   _id: "6",
        img: assets.Biozyme100ml,
         add: "add",
        name: "Biozyme 100ml",
        price: 600,
        description: "foliar fertilizer"
  },
    {   _id: "7",
        img: assets.Dynamo,
         add: "add",
        name: "Dynamo 100g", 
        price: 500,
        description: "insecticide"
  },
  {
    _id: "8",
    img: assets.Fendona,
     add: "add",
    name: "Fendona 500ml",
    price: 2500,
    description: "public health insecticide"
  },
  {
    _id: "9",
    img: assets.Ferrari1l,
     add: "add",
    name: "Ferrari 1L",
    price: 2000,
    description: "foliar fertilizer"
  },
  {
    _id: "10",
    img: assets.Handspray2l,
     add: "add",
    name: "Pressure Sprayer 2L",
    price: 600,
    description: "equipment"
  },
  {
    _id: "11",
    img: assets.Jamboclean1l,
     add: "add",
    name: "Jamboclean 1L",
    price: 2000,
    description: "foliar fertilizer"
  },
  {
    _id: "12",
    img: assets.Kayazinon1l,
     add: "add",
    name: "Kayazinon 1L",
    price: 3500,
    description: "insecticide"
  },
  {
    _id: "13",
    img: assets.Kelpreal,
     add: "add",
    name: "Kelpreal 1L",
    price: 3000,
  },
  {
    _id: "14",
    img: assets.Kungunil,
     add: "add",
    name: "Kungunil 1L",  
    price: 5500,
    description: "insecticide"
  },
  {
    _id: "15",
    img: assets.Lancer, 
     add: "add",
    name: "Lancer 1L",
    price: 3000,
    description: "insecticide"
  },
  {
    _id: "16",
    img: assets.Lavendertotal1l,
     add: "add",
    name: "Lavender Total 1L",
    price: 1800,
    description: "foliar fertilizer"

  },
  {
    _id: "17",
    img: assets.Malin,
     add: "add",
    name: "Malin 5g",
    price: 1000,
    description: "seeds"
  },
  {
    _id: "18",
    img: assets.Omex500ml,
     add: "add",
    name: "Omex 500ml",
    name: "Omex 500ml",
    price: 1300,
    description: "foliar fertilizer"
  },
  {
    _id: "19",
    img: assets.Optimizer,
     add: "add",
    name: "Optimizer 1L",
    price: 2500,
    description: "foliar fertilizer"
  },
  {
    _id: "20",
    img: assets.RedRiz,
     add: "add",
    name: "Red Riz 10g",
    price: 1000,
    description: "seeds"
  },
  {
    _id: "21",
    img: assets.Optimizer,
     add: "add",
    name: "Optimizer 1L",
    price: 2500,
    description: "foliar fertilizer"
  },
  {
    _id: "22",
    img: assets.RedRiz,
    name: "Red Riz 10g",
     add: "add",
    price: 1000,
    description: "seeds"
  },
  {
    _id: "23",
    img: assets.SpiderPlant,
     add: "add",
    name: "Spider Plant 500g",
    price: 1500,
    description: "seeds"
  },
  {
    _id: "24",
    img:assets.Twix,
    add: "add",
    name: "Twix 10g",
    price: 1000,
    description: "seeds"
  },
  
  

];

