import { Routes, Route } from "react-router-dom"
import HomePage from "./components/Sections/HomePage" 
import Footer from "./components/Layout/Footer"
import Hero from "./components/Sections/Hero"
import Starts from "./components/Sections/Starts"
import About from "./components/Sections/About"
import NewProducts from "./components/Sections/NewProducts"
import Features from "./components/Sections/Features"
import AllProducts from "./components/Sections/AllProducts"
import CategoryPage from "./components/Sections/CategoryPage"
import ProductDetails from "./components/Sections/ProductDetails"
import FeedBack from "./components/Sections/FeedBack"
import SignUp from "./components/Sections/SignUp"
import AllContacts from "./components/Sections/Contacts/AllContacts"
import Cart from "./components/Sections/Cart"
import Register from "./components/Sections/Register"
import Login from "./components/Sections/Login"
import CheckOut from "./components/Sections/CheckOut"
import OrdersSuccess from "./components/Sections/OrdersSuccess"
import MyOrders from "./components/Sections/MyOrders"
import AdminLogin from "./components/Admin/AdminLogin";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Orders from "./components/Admin/Orders";
import Products from "./components/Admin/Products";
import AddProduct from "./components/Admin/AddProduct";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import LoginSelection from "./components/Sections/LoginSelection";
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
          <Route path="category/*" element={<CategoryPage />} />
          <Route path="product/:productId" element={<ProductDetails />} />
          <Route path="Cart" element={<Cart />} />
          <Route path="FeedBack" element={<FeedBack />} />
          <Route path="SignUp" element={<SignUp />} />
          <Route path="AllContacts" element={<AllContacts />} />
          <Route path="Footer" element={<Footer />} />
          <Route path="Register" element={<Register />} />
          <Route path="CheckOut" element={<ProtectedRoute><CheckOut /></ProtectedRoute>} />
          <Route path="/OrdersSuccess" element={<OrdersSuccess />} />
          <Route path="/login" element={<LoginSelection />} />
          <Route path="/login/customer" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/admin/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
          <Route path="/myorders" element={ <ProtectedRoute><MyOrders /></ProtectedRoute>}/>
        </Routes>
      </div>
    </>
  );
}

export default App;
