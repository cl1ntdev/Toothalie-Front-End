import React, { useState, useEffect } from "react";
import { authenticateUser } from "@/API/AuthenticateUser";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const userInfoStr = localStorage.getItem("userInfo");
        if (!userInfoStr) throw new Error("No user info");

        const userInfo = JSON.parse(userInfoStr);
        console.log(userInfo)
        const token = userInfo?.token;
        if (!token) throw new Error("No token");

        const result = await authenticateUser(token);

        if (result.status === "ok") {
          setIsValid(true);
        } else {
          localStorage.removeItem("userInfo");
          setIsValid(false);
        }
      } catch {
        localStorage.removeItem("userInfo");
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  if (loading) return <div>Authenticating...</div>;

  if (!isValid) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
