import React from "react";
import { Navigate } from "react-router-dom";

const PermissionGuard = ({ isAuthenticated, permissions, required, children }) => {
  // 🔴 Not logged in
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // 🟡 Logged in but missing permission
  if (required && !permissions.includes(required)) return <Navigate to="/dashboard" replace />;

  return children; // ✅ Authorized
};

export default PermissionGuard;
