"use client";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();

  const { user, loading } = useAuth();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Loading State
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-lg font-semibold">Loading...</h1>
      </div>
    );
  }



  return children;
};

export default ProtectedRoute;