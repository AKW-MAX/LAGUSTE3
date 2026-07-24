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
import ProductDetails from "./components/Sections/ProductDetails.jsx"
import FeedBack from "./components/Sections/FeedBack"
import SignUp from "./components/Sections/SignUp"
import AllContacts from "./components/Sections/Contacts/AllContacts"
import Cart from "./components/Sections/Cart"
import Register from "./components/Sections/Register"
import Login from "./components/Sections/Login"
import CustomerForgotPassword from "./components/Sections/CustomerForgotPassword"
import CheckOut from "./components/Sections/CheckOut"
import OrdersSuccess from "./components/Sections/OrdersSuccess"
import MyOrders from "./components/Sections/MyOrders"
import AdminLogin from "./components/Admin/AdminLogin";
import AdminForgotPassword from "./components/Admin/AdminForgotPassword";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Orders from "./components/Admin/Orders.jsx";
import AdminInvoices from "./components/Admin/AdminInvoices.jsx";
import AdminReceipts from "./components/Admin/AdminReceipts.jsx";
import Products from "./components/Admin/Products.jsx";
import AddProduct from "./components/Admin/AddProduct.jsx";
import EditProduct from "./components/Admin/EditProduct.jsx";
import AddAdmin from "./components/Admin/AddAdmin.jsx";
import AdminActivity from "./components/Admin/AdminActivity.jsx";
import AdminPermissions from "./components/Admin/AdminPermissions.jsx";
import AdminAuditLogs from "./components/Admin/AdminAuditLogs.jsx";
import ProtectedRoute from "./components/Common/ProtectedRoute.jsx";
import LoginSelection from "./components/Sections/LoginSelection.jsx";
import PrivacyPolicy from "./components/Sections/Privacypolicy.jsx";
import TermsOfService from "./components/Sections/TermsOfservice.jsx";
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
          <Route path="NewProducts" element={<NewProducts />} />
          <Route path="Features" element={<Features />} />
          <Route path="AllProducts" element={<AllProducts />} />
          <Route path="category/*" element={<CategoryPage />} />
          <Route path="ProductDetails/:productId" element={<ProductDetails />} />
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
          <Route path="/forgot-password/customer" element={<CustomerForgotPassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/admin/invoices" element={<ProtectedRoute><AdminInvoices /></ProtectedRoute>} />
          <Route path="/admin/receipts" element={<ProtectedRoute><AdminReceipts /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/admin/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
          <Route path="/admin/edit-product/:id" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
          <Route path="/admin/add-admin" element={<ProtectedRoute><AddAdmin /></ProtectedRoute>} />
          <Route path="/admin/admin-permissions" element={<ProtectedRoute><AdminPermissions /></ProtectedRoute>} />
          <Route path="/admin/admin-activity" element={<ProtectedRoute><AdminActivity /></ProtectedRoute>} />
          <Route path="/admin/audit-logs" element={<ProtectedRoute><AdminAuditLogs /></ProtectedRoute>} />
          <Route path="/myorders" element={ <ProtectedRoute><MyOrders /></ProtectedRoute>}/>
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/TermsOfService" element={<TermsOfService />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
