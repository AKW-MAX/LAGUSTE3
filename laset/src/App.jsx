import {BrowserRouter, Routes, Route} from "react-router-dom"
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
import Navigation from "./components/Layout/Navigation"
import "./index.css"



  function App() {
  return (
    <>
      <div>
        <Routes>
        <Route index element={<HomePage />} />
        </Routes>
        <Routes>
        <Route path="Hero" element={<Hero />} />
        </Routes>
        <Routes>
          <Route path="About" element={<About />} />
        </Routes>
        <Routes>
          <Route path="Starts" element={<Starts />} />
        </Routes>
        <Routes>
          <Route path="New Products" element={<NewProducts />} />
        </Routes>
        <Routes>
          <Route path="Features" element={<Features />} /> 
        </Routes>
          <Routes>
          <Route path="AllProducts" element={<AllProducts />} />
        </Routes>
        <Routes>
          <Route path="FeedBack" element={<FeedBack />} />
        </Routes>
        <Routes>
          <Route path="SignUp" element={<SignUp />} />
        </Routes>
          <Routes>
           <Route path="Footer" element={<Footer />} />
        </Routes>
          
              
       </div>
      
    </>
  );
}

export default App;
