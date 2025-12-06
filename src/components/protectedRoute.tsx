import React, { useState, useEffect } from "react";
import { authenticateUser } from "@/API/AuthenticateUser";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [hasRole, setHasRole] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const userInfoStr = localStorage.getItem("userInfo");
        if (!userInfoStr) throw new Error("No user info");

        const userInfo = JSON.parse(userInfoStr);
        const token = userInfo?.token;
        if (!token) throw new Error("No token");

        // 🔥 Validate token on backend
        const result = await authenticateUser(token);

        if (result.status === "ok") {
          setIsValid(true);

          const userRoles = result.user.roles || [];

          // 🔥 Check if user has ANY required role
          const allowed = allowedRoles.length === 0 
            ? true 
            : userRoles.some(r => allowedRoles.includes(r));

          setHasRole(allowed);
        } else {
          localStorage.removeItem("userInfo");
          setIsValid(false);
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem("userInfo");
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [allowedRoles]);

  if (loading) return <div>Authenticating...</div>;
  if (!isValid) return <Navigate to="/login" replace />;

  // 🔥 If the user is authenticated but doesn't have the correct role
  if (!hasRole) return <Navigate to="/unauthorized" replace />;

  return <>{children}</>;
}
