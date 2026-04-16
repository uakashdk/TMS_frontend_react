import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { routes } from "../../app/routes";
import { toggleSidebar } from "../../store/feature/layOut/layoutSlice";
import Logo from "../../assets/Logo.png";

const AppSidebar = () => {
  const dispatch = useDispatch();
  const { permissions } = useSelector((state) => state.auth);

  // Only show routes that user has permission
 const allowedRoutes = routes.filter(
  (route) =>
    route.permission &&
    permissions?.includes(route.permission) &&
    !route.hidden   // ✅ IMPORTANT
);

  // Optional: group routes by module
  const groupedRoutes = allowedRoutes.reduce((acc, route) => {
    const module = route.module || "General";
    if (!acc[module]) acc[module] = [];
    acc[module].push(route);
    return acc;
  }, {});

  return (
    <aside className="h-full w-64 flex flex-col bg-fleet-card border-r border-(--color-fleet-border)">
      
      {/* HEADER */}
      <div className="px-4 py-5 border-b border-(--color-fleet-border) flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-(--color-fleet-border)">
            <img src={Logo} alt="Fleetlio" className="w-full h-full object-contain" />
          </div>
          <span className="text-lg font-bold text-fleet-text-primary">Fleetlio</span>
        </div>
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="md:hidden text-lg text-fleet-text-muted"
        >
          ✕
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto py-4">
        {Object.entries(groupedRoutes).map(([module, moduleRoutes]) => (
          <div key={module} className="mb-4">
            {/* Module Name */}
            <div className="px-6 py-2 text-xs font-bold text-fleet-text-muted uppercase tracking-wider">
              {module}
            </div>

            {/* Module Routes */}
            <div className="flex flex-col">
              {moduleRoutes.map((route) => (
                <NavLink
                  key={route.path}
                  to={route.path}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3 px-6 py-3 rounded-lg text-sm transition
                    ${isActive
                      ? "bg-fleet-table-row-hover border-l-4 border-fleet-accent text-fleet-accent font-medium"
                      : "text-fleet-text-primary hover:bg-fleet-table-row-hover"
                    }
                  `
                  }
                >
                  {route.icon && <route.icon size={18} />}
                  <span className="truncate">{route.name || route.permission}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="px-6 py-3 border-t border-(--color-fleet-border) text-xs text-fleet-text-muted flex justify-center items-center">
        Fleetlio TMS
      </div>
    </aside>
  );
};

export default AppSidebar;
