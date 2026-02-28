import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {

    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = (e)=>{
        e.preventDefault();

        // Hardcoded Admin Credentials
        if(username === "admin" && password === "admin123"){
            localStorage.setItem("admin","true");
            navigate("/admin/dashboard");
        }
        else{
            alert("Invalid Credentials");
        }
    }

    return (

        <div className="h-screen flex items-center justify-center bg-gradient-to-r from-indigo-700 to-purple-700">

            <form onSubmit={handleLogin}
            className="bg-white p-8 rounded-xl shadow-xl w-[350px]">

                <h1 className="text-2xl font-bold text-center mb-6">
                    Admin Login
                </h1>

                <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                className="w-full mb-4 p-3 border rounded-lg"
                />

                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="w-full mb-4 p-3 border rounded-lg"
                />

                <button
                className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700">

                    Login
                </button>

            </form>

        </div>
    )
}