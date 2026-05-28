import { useState } from "react";
import axios from "axios";


export default function Register({ isOpen = true, setIsOpen = () => {} }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) =>{
        e.preventDefault();
        const formData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            confirm_password: confirmPassword,
        };

        axios.post("http://localhost:5000/register", formData)
        .then(response => {
            console.log("Registration successful:", response.data);

        })
        .catch(error => {
            console.error("Registration failed:", error);
        });
        
        setIsOpen(false);
    };

    return (
        <>
                     {/* Open register Button */}
    
    {/* register form */}
    <form onSubmit={handleSubmit} className={` fixed inset-0 flex-direction: column text-black text-align: center bg-white p-20 ml-0 mr-30 rounded bg-opacity-50 ${isOpen ? 'block' : 'hidden'}`}>
       <div>
            <h3 className="">Register</h3>
       </div>
        <div>
            <label>First Name</label>
            <input type="text" placeholder="First Name" className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
               onChange={e => setFirstName(e.target.value)}
            />
       </div>

        <div>
            <label>Last Name</label>
            <input type="text" placeholder="Last Name" className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
               onChange={e => setLastName(e.target.value)}
            />
        </div>

        <div>
            <label>Email</label>
            <input type="email" placeholder="Email" className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
               onChange={e => setEmail(e.target.value)}
            />
        </div>

        <div>
            <label>Password</label>
            <input type="password" placeholder="Password" className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
               onChange={e => setPassword(e.target.value)}
            />
        </div>

        <div>
            <label>Confirm Password</label>
            <input type="password" placeholder="Confirm Password" className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
               onChange={e => setConfirmPassword(e.target.value)}
            />
        </div>

        <div className="flex items-center gap-4">
            <button type="submit" className="bg-green-900 text-white px-4 py-2 w-50 rounded">Register</button>
        </div>
    </form>
    
                
    </>
    );
};
