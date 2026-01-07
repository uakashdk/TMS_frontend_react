import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { routes } from "./routes";
import PermissionGuard from "../gaurads/permissionGaurd";
import AppLayout from "../component/layout/AppLayout";

const AppRouter = () => {
  const { isAuthenticated, permissions } = useSelector((state) => state.auth);

  return (
    <Routes>
      {routes.map((route) => {
        if (route.public) return <Route key={route.path} path={route.path} element={route.element} />;

        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              <PermissionGuard
                isAuthenticated={isAuthenticated}
                permissions={permissions}
                required={route.permission}
              >
                <AppLayout>{route.element}</AppLayout>
              </PermissionGuard>
            }
          />
        );
      })}

      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="*"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
};

export default AppRouter;
