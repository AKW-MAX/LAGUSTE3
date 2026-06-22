import { Routes, Route } from "react-router-dom"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import HomePage from "./components/Sections/HomePage" 
import Footer from "./components/Layout/Footer"
import Hero from "./components/Sections/Hero"
import Starts from "./components/Sections/Starts"
import About from "./components/Sections/About"
import NewProducts from "./components/Sections/NewProducts"
import Features from "./components/Sections/Features"
import AllProducts from "./components/Sections/AllProducts"
import FeedBack from "./components/Sections/FeedBack"
import SignUp from "./components/Sections/SignUp"
import AllContacts from "./components/Sections/Contacts/AllContacts"
import Cart from "./components/Sections/Cart"
import { productsFetch } from "./Features/ProductsSlice"
import Register from "./components/Sections/Register"
import Login from "./components/Sections/Login"
import CheckOut from "./components/Sections/CheckOut"
import OrdersSuccess from "./components/Sections/OrdersSuccess"
import "./index.css"

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(productsFetch());
  }, [dispatch]);

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="Hero" element={<Hero />} />
          <Route path="About" element={<About />} />
          <Route path="Starts" element={<Starts />} />
          <Route path="New Products" element={<NewProducts />} />
          <Route path="Features" element={<Features />} />
          <Route path="AllProducts" element={<AllProducts />} />
          <Route path="Cart" element={<Cart />} />
          <Route path="FeedBack" element={<FeedBack />} />
          <Route path="SignUp" element={<SignUp />} />
          <Route path="AllContacts" element={<AllContacts />} />
          <Route path="Footer" element={<Footer />} />
          <Route path="Register" element={<Register />} />
          <Route path="Login" element={<Login />} />
          <Route path="CheckOut" element={<CheckOut />} />
          <Route path="/OrdersSuccess" element={<OrdersSuccess />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
