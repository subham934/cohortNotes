import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";


const Protected = ({ children }) => {
    // The Protected component expects children. Any element we wrap inside Protected can only be rendered if the user is logged in.

  const { user, loading } = useAuth();


   if (loading) {
    return <h1>Loading...</h1>;
  }


  if (!user) {
    return <Navigate to="/login" />
  }

 

  return children;
};

export default Protected;
