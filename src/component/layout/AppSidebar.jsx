import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { routes } from "../../app/routes";
import { toggleSidebar } from "../../store/feature/layOut/layoutSlice";
import Logo from "../../assets/Logo.png";

const AppSidebar = () => {
  const dispatch = useDispatch();
  const { permissions } = useSelector((state) => state.auth);

  const allowedRoutes = routes.filter(
    (route) => route.permission && permissions?.includes(route.permission)
  );

  return (
<aside
  className="
    h-full w-64 shrink-0 flex flex-col
    bg-fleet-card
    border-r border-(--color-fleet-border)
  "
>
<div className="px-4 py-4 border-b border-(--color-fleet-border)">
  <div className="flex items-center justify-between">
    
    {/* LOGO + NAME */}
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full overflow-hidden border border-(--color-fleet-border)">
        <img
          src={Logo}
          alt="Fleetlio"
          className="w-full h-full object-contain"
        />
      </div>

      <span className="text-sm font-semibold text-fleet-text-primary">
        Fleetlio
      </span>
    </div>

    {/* MOBILE CLOSE BUTTON */}
    <button
      onClick={() => dispatch(toggleSidebar())}
      className="
        md:hidden
        text-lg
        text-fleet-text-muted
      "
    >
      ✕
    </button>

  </div>
</div>





  {/* NAV */}
  <nav className="flex-1 py-3">
    {allowedRoutes.map((route) => (
      <NavLink
        key={route.path}
        to={route.path}
        className={({ isActive }) =>
          `
          flex items-center justify-between
          px-6 py-2.5 text-sm
          ${
            isActive
              ? `
                text-fleet-accent
                bg-fleet-table-row-hover
                border-l-4 border-fleet-accent
                p-3
              `
              : `
                text-fleet-text-primary
                hover:bg-fleet-table-row-hover
                p-3
              `
          }
          `
        }
      >
        {/* LEFT TEXT */}
        <span>{route.permission}</span>

        {/* DASHBOARD BADGE */}
        {route.permission === "Dashboard" && (
          <span
            className="
              text-[10px] font-semibold
              px-2 py-0.5 rounded
              bg-fleet-accent
              text-white
            "
          >
            NEW
          </span>
        )}
      </NavLink>
    ))}
  </nav>

  {/* FOOTER */}
  <div className="px-6 py-3 border-t border-(--color-fleet-border) text-xs text-fleet-text-muted">
    Fleetlio TMS
  </div>
</aside>

  );
};

export default AppSidebar;
