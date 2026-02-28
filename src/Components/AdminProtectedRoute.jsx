import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({children}){

    const isAdmin = localStorage.getItem("admin");

    return isAdmin ? children : <Navigate to="/admin/login"/>
}