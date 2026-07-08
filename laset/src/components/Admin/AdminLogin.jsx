import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    async function login() {

        try {

            const res = await axios.post(

                `${import.meta.env.VITE_API_URL}/admin/login`,

                {
                    username,
                    password
                }

            );

            if (res.data.success) {

                localStorage.setItem("admin", "true");

                navigate("/admin/dashboard");

            }

        }

        catch {

            alert("Invalid login");

        }

    }

    return (

        <div className="max-w-md mx-auto mt-20">

            <h1 className="text-3xl font-bold mb-5">

                Admin Login

            </h1>

            <input
                className="border p-2 w-full mb-4"
                placeholder="Username"
                onChange={(e)=>setUsername(e.target.value)}
            />

            <input
                type="password"
                className="border p-2 w-full mb-4"
                placeholder="Password"
                onChange={(e)=>setPassword(e.target.value)}
            />

            <button
                onClick={login}
                className="bg-green-700 text-white px-5 py-2 rounded"
            >
                Login
            </button>

        </div>

    );

}