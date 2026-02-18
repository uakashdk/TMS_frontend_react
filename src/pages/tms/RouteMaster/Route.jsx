import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Search, Plus } from "lucide-react";
import { getAllRoutes } from "../../../services/RouteService/RouteService";
import { useSelector } from "react-redux";
import PermissionGate from "../../../app/PermissionGate";
const Route = () => {
    const navigate = useNavigate();

    const [routes, setRoutes] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});

    const { user } = useSelector((state) => state.auth);
    const roles = user?.role;

    useEffect(() => {
        fetchRoutes();
    }, [search, page]);


    const fetchRoutes = async () => {
        const res = await getAllRoutes({
            search,
            page,
        });

        setRoutes(res.data.routes);
        setPagination(res.data.pagination);
    };

    const filteredRoutes = routes.filter((route) =>
        route.route_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-fleet-bg p-6">

            {/* ================= HEADER ================= */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-fleet-text-primary">
                    Route Master
                </h1>

                <PermissionGate permission="create_route">
                    <button
                        onClick={() => navigate("/add-route")}
                        className="flex items-center gap-2 rounded-md bg-fleet-primary px-4 py-2 text-sm font-medium text-white hover:bg-(--color-fleet-primary-dark)"
                    >
                        <Plus size={16} />
                        Add Route
                    </button>
               </PermissionGate>

            </div>

            {/* ================= CARD ================= */}
            <div className="rounded-lg bg-fleet-card shadow-sm border border-(--color-fleet-border)">

                {/* Search */}
                <div className="p-4 border-b border-(--color-fleet-border)">
                    <div className="w-72">
                        <input
                            type="text"
                            placeholder="Search route name"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1); // reset to page 1 on new search
                            }}
                            className="
    w-full rounded-md
    border border-(--color-fleet-border)
    bg-white px-3 py-2 text-sm
    focus:outline-none
    focus:border-fleet-primary
  "
                        />

                    </div>

                </div>

                {/* ================= TABLE ================= */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-fleet-table-header-bg text-(--color-fleet-table-header-text)">
                            <tr>
                                <th className="px-4 py-3 text-left">Route Name</th>
                                <th className="px-4 py-3 text-left">Source</th>
                                <th className="px-4 py-3 text-left">Destination</th>
                                <th className="px-4 py-3 text-left">Distance (KM)</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredRoutes.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-4 py-6 text-center text-fleet-text-muted"
                                    >
                                        No routes found
                                    </td>
                                </tr>
                            ) : (
                                filteredRoutes.map((route) => (
                                    <tr
                                        key={route.id}
                                        className="border-t border-(--color-fleet-border) hover:bg-fleet-table-row-hover"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {route.route_name}
                                        </td>
                                        <td className="px-4 py-3">{route.source_city}</td>
                                        <td className="px-4 py-3">{route.destination_city}</td>
                                        <td className="px-4 py-3">{route.distance_km}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-medium ${route.status
                                                    ? "bg-fleet-success-light text-fleet-success"
                                                    : "bg-slate-200 text-slate-600"
                                                    }`}
                                            >
                                                {route.status ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                        <PermissionGate permission="update_route">
                                            <button
                                                onClick={() => navigate(`/edit-route/${route.id}`)}
                                                className="text-fleet-primary hover:text-(--color-fleet-primary-dark)"
                                                title="Edit Route"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                        </PermissionGate>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ================= PAGINATION ================= */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-(--color-fleet-border) text-sm bg-[#FAFAFA]">

                    {/* Left info */}
                    <div className="text-fleet-text-secondary">
                        Showing page <b>{pagination.currentPage}</b> of{" "}
                        <b>{pagination.totalPages}</b>
                    </div>

                    {/* Right controls */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                            className="px-3 py-1 border rounded-md bg-white text-sm disabled:opacity-50"
                        >
                            Prev
                        </button>


                        {[...Array(pagination.totalPages || 0)].map((_, i) => {
                            const pageNo = i + 1;
                            return (
                                <button
                                    key={pageNo}
                                    onClick={() => setPage(pageNo)}
                                    className={`px-3 py-1 border rounded-md text-sm
        ${page === pageNo
                                            ? "bg-fleet-primary text-white border-fleet-primary"
                                            : "bg-white"
                                        }`}
                                >
                                    {pageNo}
                                </button>
                            );
                        })}


                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page === pagination.totalPages}
                            className="px-3 py-1 border rounded-md bg-white text-sm disabled:opacity-50"
                        >
                            Next
                        </button>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Route;
