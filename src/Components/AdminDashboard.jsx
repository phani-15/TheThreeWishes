import React from "react";
import { useNavigate } from "react-router-dom";
import AddParticipant from "./AddParticipant";

export default function AdminDashboard(){

    const navigate = useNavigate();

    const logout = ()=>{

        localStorage.removeItem("admin");
        navigate("/admin/login");

    }

    return(

        <div className="min-h-screen bg-gray-100">

            <div className="bg-indigo-700 text-white p-4 flex justify-between">

                <h1 className="text-xl font-bold">
                    Admin Dashboard
                </h1>

                <button
                onClick={logout}
                className="bg-red-500 px-4 py-1 rounded">

                    Logout

                </button>

            </div>


            <div className="p-10">

                <AddParticipant/>

            </div>

        </div>

    )
}