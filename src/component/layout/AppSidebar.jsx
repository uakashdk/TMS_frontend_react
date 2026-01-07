import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { routes } from "../../app/routes";
import { toggleSidebar } from "../../store/feature/layOut/layoutSlice";
import Logo from "../../assets/Logo2.png";

const AppSidebar = () => {
  const dispatch = useDispatch();
  const { permissions } = useSelector((state) => state.auth);

  const allowedRoutes = routes.filter(
    (route) => route.permission && permissions?.includes(route.permission)
  );

  return (
  <aside className=" h-full w-64 flex-col bg-white shadow-md">

  {/* ===== LOGO AREA ===== */}
 <div className="relative flex items-center justify-center px-6 py-6">
  <img
    src={Logo}
    alt="Fleetlio"
    className="h-26 w-auto object-contain"
  />

  {/* Mobile Close */}
  <button
    onClick={() => dispatch(toggleSidebar())}
    className="absolute right-4 text-2xl md:hidden text-slate-500 hover:text-slate-800 transition"
  >
    ✕
  </button>
</div>


  <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
    {allowedRoutes.map((route) => (
      <NavLink
        key={route.path}
        to={route.path}
        onClick={() => dispatch(toggleSidebar())}
        className={({ isActive }) =>
          `block rounded-md px-4 py-2 text-sm font-medium transition
          ${
            isActive
              ? "text-orange-600 bg-slate-100"
              : "text-slate-800 hover:text-orange-500 hover:bg-slate-50"
          }`
        }
      >
        {route.permission}
      </NavLink>
    ))}
  </nav>

</aside>

  );
};

export default AppSidebar;
