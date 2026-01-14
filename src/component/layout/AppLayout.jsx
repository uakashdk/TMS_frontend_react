import React from "react";
import { useSelector } from "react-redux";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

const AppLayout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const sidebarOpen = useSelector((state) => state.layout.sidebarOpen);

  if (!user) return <>{children}</>;

  return (
    <div className="flex h-screen overflow-hidden">

      {/* DESKTOP SIDEBAR */}
      <div
        className={`hidden md:flex bg-white  transition-all duration-300
        ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}
      >
        <AppSidebar />
      </div>

      {/* MOBILE SIDEBAR — ABOVE HEADER, LEFT, FULL HEIGHT */}
      <div
        className={`fixed top-0 left-0 z-999 h-screen w-64 bg-white shadow-xl
        transform transition-transform duration-300 md:hidden
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <AppSidebar />
      </div>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-998 bg-black/40 md:hidden" />
      )}

      {/* CONTENT */}
      <div className="flex flex-1 flex-col overflow-auto">
        <AppHeader />
        <main className="p-4">{children}</main>
      </div>

    </div>
  );
};

export default AppLayout;
