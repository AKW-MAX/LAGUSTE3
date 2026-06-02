import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";



export default function Login({ isOpen = true, setIsOpen = () => {} }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) =>{
        e.preventDefault();
        const formData = {
            email: email,
            password: password,
        };

        axios.post("http://localhost:5000/login", formData)
        .then(response => {
            console.log("Login successful:", response.data);
            if(response.data.message === "Login successful") {
                setIsOpen(false);
                navigate("/"); // Redirect to home page on successful login
            }
        })
        .catch(error => {
            const message = error.response?.data?.message || error.message;
            console.error("Login failed:", error.response?.status, message);
        });
    };

    const handleClose = () => {
        setIsOpen(false);
        navigate("/");
    };

    return (
        <>
    {/* login form */}
    <form onSubmit={handleSubmit} className={` fixed inset-0 flex-direction: column text-black text-align: center bg-white p-20 ml-0 mr-30 rounded bg-opacity-50 ${isOpen ? 'block' : 'hidden'}`}>
       <div>
            <h3 className="">Login</h3>
       </div>

        <div>
            <label>Email</label>
            <input
               type="email"
               value={email}
               placeholder="Email"
               className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
               onChange={e => setEmail(e.target.value)}
            />
        </div>

        <div>
            <label>Password</label>
            <input
               type="password"
               value={password}
               placeholder="Password"
               className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
               onChange={e => setPassword(e.target.value)}
            />
        </div>

        <div>
            <button type="submit" className="bg-green-900 text-white px-4 py-2 rounded">Login</button>
            <button type="button" onClick={handleClose} className="bg-green-700 text-black px-4 py-2 m-5 rounded">Close</button>
        </div>
    </form>
                
        </>
    );
};
