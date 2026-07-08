import { Link } from "react-router-dom";

export default function AdminDashboard(){

    return(

        <div className="p-10">

            <h1 className="text-4xl font-bold mb-10">
                Admin Dashboard
            </h1>

            <div className="space-y-5">
            <Link to="/admin/orders">
              <button className="bg-green-700 text-white px-6 py-3 rounded">
                 Manage Orders
              </button>
            </Link>

            <br/>

            <Link to="/admin/products">
               <button className="bg-blue-700 text-white px-6 py-3 rounded">
                Manage Products
               </button>
            </Link>

            <br/>

            <Link to="/admin/add-product">
               <button className="bg-orange-600 text-white px-6 py-3 rounded">
                Add Product
               </button>
            </Link>

        </div>

        </div>

        )

        }