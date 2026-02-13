import { Routes, Route } from "react-router-dom"
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
import "./index.css"

function App() {
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
        </Routes>
      </div>
    </>
  );
}

export default App;
