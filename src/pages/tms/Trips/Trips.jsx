import React, { useEffect, useState } from "react";
import Select from "react-select";
import { getTrips, changeTripStatus } from "../../../services/TripService/TripService";
import { getJobDropdown } from "../../../services/jobService/JobService";
import { getAllDriver } from "../../../services/driverService/driverService";
import { getAllVehicle } from "../../../services/VehicleService/VehicleService";
import { getRouteDropdown } from "../../../services/RouteService/RouteService";
import { Eye, Pencil, IndianRupee, Receipt } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Trips = () => {
  const [filters, setFilters] = useState({
    job_id: null,
    driver_id: null,
    vehicle_id: null,
    trip_status: "",
    start_date: "",
    end_date: "",
    search: "",
    page: 1,
  });

  const [searchParams] = useSearchParams();
  const [openTrip, setOpenTrip] = useState(null);
  const [newStatus, setNewStatus] = useState("");


  const [jobs, setJobs] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const { user } = useSelector((state) => state.auth);
  const roles = user?.role;

  const navigate = useNavigate();


  useEffect(() => {
    getRouteDropdown().then(res => {
      setRoutes(res?.data || []);
    });
  }, []);


  useEffect(() => {
    const jobIdFromUrl = searchParams.get("jobId");

    if (jobIdFromUrl) {
      setFilters(prev => ({
        ...prev,
        job_id: Number(jobIdFromUrl),
        page: 1,
      }));
    }
  }, []);


  const selectedJob = jobs.find(j => j.id === filters.job_id);


  useEffect(() => {
    if (roles === 'operational-manager' || roles === 'Company-Admin') {
      Promise.all([
        getJobDropdown(),
        getAllDriver(),
        getAllVehicle({ page: 1 }),
      ]).then(([jobRes, driverRes, vehicleRes]) => {
        setJobs(jobRes?.data || []);
        setDrivers(driverRes?.data || []);
        setVehicles(vehicleRes?.data || []);
      });
    }
  }, []);

  const getRouteName = (routeId) => {
    const route = routes.find(r => r.id === routeId);
    return route ? route.route_name : "—";
  };


  useEffect(() => {
    fetchTrips();
  }, [filters]);

  const fetchTrips = async () => {
    setLoading(true);
    const res = await getTrips(
      filters.job_id,
      filters.driver_id,
      filters.vehicle_id,
      filters.trip_status,
      filters.start_date,
      filters.end_date,
      filters.search,
      filters.page
    );
    setTrips(res?.data || []);
    setPagination(res?.pagination || {});

    setLoading(false);
  };

  const resetFilters = () => {
    setFilters({
      job_id: null,
      driver_id: null,
      vehicle_id: null,
      trip_status: "",
      start_date: "",
      end_date: "",
      search: "",
      page: 1,
    });
  };

  const getPaginationPages = (current, total) => {
    const pages = [];
    const visibleCount = 4;

    if (total <= visibleCount + 2) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    const start = Math.max(1, current - 1);
    const end = Math.min(total, start + visibleCount - 1);

    if (start > 1) pages.push("...");

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < total) {
      pages.push("...");
      pages.push(total);
    }

    return pages;
  };


  const statusStyle = {
    PLANNED: "bg-blue-50 text-blue-700 border-blue-200",
    RUNNING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    COMPLETED: "bg-green-50 text-green-700 border-green-200",
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "38px",
      borderRadius: "6px",
      borderColor: state.isFocused
        ? "var(--color-fleet-primary)"
        : "var(--color-fleet-border)",
      boxShadow: "none",
      "&:hover": {
        borderColor: "var(--color-fleet-primary)",
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? "var(--color-fleet-table-row-hover)"
        : "#fff",
      color: "var(--color-fleet-text-primary)",
      fontSize: "13px",
    }),
  };

  <style>
    {`.input {
  @apply w-full rounded-md border border-(--color-fleet-border)
  px-3 py-2 text-sm bg-white
  text-fleet-text-primary
  outline-none
  focus:outline-none
  focus:ring-0
  focus:border-fleet-primary
  transition;
}
  @keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.animate-slide-in-right {
  animation: slideInRight 0.25s ease-out;
}

`}
  </style>

  const handleChangeStatus = async () => {
    await changeTripStatus(openTrip.id, {
      status: newStatus,
    });

    setOpenTrip(null);
    fetchTrips();
  };

  const statusBadgeConfig = {
    PLANNED: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      dot: "bg-blue-500",
      label: "Planned",
    },
    STARTED: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-500",
      label: "Started",
    },
    COMPLETED: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
      label: "Completed",
    },
  };


  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-fleet-bg p-6 space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-fleet-text-primary">
            Trips
          </h1>
          <p className="text-sm text-fleet-text-secondary">
            Monitor, track and manage fleet trips
          </p>
        </div>
        {(roles === "operational-manager" || roles === "Company-Admin") && (
          <button
            onClick={() => navigate("/add-trip")}
            className="bg-fleet-primary text-white px-4 py-2 rounded-md text-sm hover:bg-(--color-fleet-primary-dark)">
            + Add Trip
          </button>
        )}
      </div>

      {/* ================= SEARCH PANEL ================= */}
      {(roles === "operational-manager" || roles === "Company-Admin") && (
        <div className="bg-fleet-card rounded-xl border border-(--color-fleet-border) shadow-sm">

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {/* Job */}
            <div>
              <label className="label">Job</label>
              <Select
                styles={selectStyles}
                placeholder="Select job"
                value={
                  selectedJob
                    ? {
                      value: selectedJob.id,
                      label: `${selectedJob.customer?.party_name} • ${selectedJob.pickup_location} → ${selectedJob.dropoff_location}`,
                    }
                    : null
                }
                options={jobs.map(j => ({
                  value: j.id,
                  label: `${j.customer?.party_name} • ${j.pickup_location} → ${j.dropoff_location}`,
                }))}
                onChange={(e) =>
                  setFilters({ ...filters, job_id: e?.value, page: 1 })
                }
              />

            </div>

            {/* Driver */}
            <div>
              <label className="label">Driver</label>
              <Select
                styles={selectStyles}
                placeholder="Select driver"
                options={drivers.map(d => ({
                  value: d.driverProfile?.id,
                  label: d.driverProfile?.name,
                }))}
                onChange={(e) => setFilters({ ...filters, driver_id: e?.value })}
              />
            </div>

            {/* Vehicle */}
            <div>
              <label className="label">Vehicle</label>
              <Select
                styles={selectStyles}
                placeholder="Select vehicle"
                options={vehicles.map(v => ({
                  value: v.id,
                  label: v.vehicle_number,
                }))}
                onChange={(e) => setFilters({ ...filters, vehicle_id: e?.value })}
              />
            </div>

            {/* Status */}
            <div>
              <label className="label">Trip Status</label>
              <select
                className="input"
                onChange={(e) =>
                  setFilters({ ...filters, trip_status: e.target.value })
                }
              >
                <option value="">All</option>
                <option value="PLANNED">Planned</option>
                <option value="STARTED">Started</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="label">Start Date</label>
              <input
                type="date"
                className="input"
                onChange={(e) =>
                  setFilters({ ...filters, start_date: e.target.value })
                }
              />
            </div>

            {/* End Date */}
            <div>
              <label className="label">End Date</label>
              <input
                type="date"
                className="input"
                onChange={(e) =>
                  setFilters({ ...filters, end_date: e.target.value })
                }
              />
            </div>

            {/* Search */}
            <div className="md:col-span-2">
              <label className="label">Search</label>
              <input
                type="text"
                placeholder="Search by route, driver or vehicle"
                className="input"
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
            </div>

            {/* Apply */}
            <div className="flex items-end">
              <button className="w-full bg-fleet-primary text-white px-4 py-2 rounded-md text-sm hover:bg-(--color-fleet-primary-dark)">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TABLE ================= */}
      <div className="bg-fleet-card rounded-xl shadow-sm overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-fleet-table-header-bg">
            <tr className="text-xs uppercase tracking-wide text-(--color-fleet-table-header-text)">
              <th className="px-5 py-4 text-left">Customer / Job</th>
              <th className="px-5 py-4 text-left">Trip Dates</th>
              <th className="px-5 py-4 text-left">Driver</th>
              <th className="px-5 py-4 text-left">Vehicle</th>
              <th className="px-5 py-4 text-left">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-slate-400">
                  Loading trips...
                </td>
              </tr>
            ) : trips.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-slate-400">
                  No trips found
                </td>
              </tr>
            ) : (
              trips.map(trip => (
                <tr
                  key={trip.id}
                  className="hover:bg-fleet-table-row-hover transition"
                >
                  <td className="px-5 py-4">
                    <div className="font-medium">
                      {trip.job?.customer?.party_name || "—"}
                    </div>
                    <div className="text-xs text-fleet-text-secondary">
                      {trip.route_summary || `${trip.job?.pickup_location} → ${trip.job?.dropoff_location}`}
                    </div>
                  </td>


                  <td className="px-5 py-4 text-xs text-fleet-text-secondary">
                    <div>Start: {trip.trip_start_date}</div>
                    <div>ETA: {trip.expected_delivery_date}</div>
                  </td>

                  <td className="px-5 py-4">
                    {trip.primaryDriver?.name || "—"}
                  </td>

                  <td className="px-5 py-4">
                    {trip.vehicle?.vehicle_number || "—"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full
      text-xs font-semibold border
      ${statusBadgeConfig[trip.trip_status]?.bg}
      ${statusBadgeConfig[trip.trip_status]?.text}
      ${statusBadgeConfig[trip.trip_status]?.border}
    `}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${statusBadgeConfig[trip.trip_status]?.dot}`}
                      />
                      {statusBadgeConfig[trip.trip_status]?.label || trip.trip_status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex gap-2">

                      {/* View Trip */}
                      {(roles === "operational-manager" || roles === "Company-Admin") && (
                        <button
                          onClick={() => {
                            setOpenTrip(trip);
                            setNewStatus(trip.trip_status);
                          }}
                          className="p-2 rounded-md hover:bg-blue-50 text-slate-500 hover:text-blue-600"
                          title="View Trip"
                        >
                          <Eye size={16} />
                        </button>
                      )}

                      {/* Trip Advance */}
                      {(roles === "Accounts-manager" || roles === "Company-Admin" || roles === "driver") && (
                        <>
                          <button
                            onClick={() => navigate(`/add-trip-advance/${trip.id}`)}
                            className="p-2 rounded-md hover:bg-amber-50 text-slate-500 hover:text-amber-600"
                            title="Trip Advance"
                          >
                            <IndianRupee size={16} />
                          </button>
                          <button
                            onClick={() => navigate(`/trip-expence/${trip.id}`)}
                            className="p-2 rounded-md hover:bg-purple-50 text-slate-500 hover:text-purple-600"
                            title="Trip Expense"
                          >
                            <Receipt size={16} />
                          </button>
                        </>
                      )}

                      {/* Trip Expense */}


                      {/* Edit Trip */}

                      {(roles === "operational-manager" || roles === "Company-Admin") && (
                        <button
                          onClick={() => navigate(`/update-trip/${trip.id}`)}
                          className="p-2 rounded-md hover:bg-green-50 text-slate-500 hover:text-green-600"
                          title="Edit Trip"
                        >
                          <Pencil size={16} />
                        </button>
                      )}


                    </div>
                  </td>


                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex justify-between items-center p-4 border-t bg-white">
          <span className="text-sm text-fleet-text-secondary">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={filters.page === 1}
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              className="px-3 py-1 rounded-md border text-sm disabled:opacity-40 hover:bg-gray-50"
            >
              Prev
            </button>

            {getPaginationPages(
              pagination.currentPage,
              pagination.totalPages
            ).map((p, i) =>
              p === "..." ? (
                <span key={i} className="px-2 text-gray-400">…</span>
              ) : (
                <button
                  key={i}
                  onClick={() => setFilters({ ...filters, page: p })}
                  className={`px-3 py-1 rounded-md text-sm border
            ${p === pagination.currentPage
                      ? "bg-fleet-primary text-white border-fleet-primary"
                      : "hover:bg-gray-50"
                    }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              disabled={filters.page === pagination.totalPages}
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              className="px-3 py-1 rounded-md border text-sm disabled:opacity-40 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>


      </div>
      {openTrip && (
        <div className="fixed inset-0 z-50 flex">

          {/* Overlay */}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setOpenTrip(null)}
          />

          {/* Drawer */}
          <div className="w-105 bg-white h-full shadow-xl animate-slide-in-right">

            {/* Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Trip Overview</h2>
                <p className="text-xs text-gray-500">
                  Trip ID #{openTrip.id}
                </p>
              </div>
              <button onClick={() => setOpenTrip(null)} className="text-gray-400 hover:text-black">✕</button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 text-sm">

              <div className="space-y-1">
                <p className="text-gray-500">Customer</p>
                <p className="font-medium">{openTrip.job?.customer?.party_name}</p>
              </div>

              <div className="space-y-1">
                <p className="text-gray-500">Route</p>
                <p className="font-medium">{openTrip.route_summary}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Driver</p>
                  <p className="font-medium">{openTrip.primaryDriver?.name || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Vehicle</p>
                  <p className="font-medium">{openTrip.vehicle?.vehicle_number || "—"}</p>
                </div>
              </div>

              {/* Status Change */}
              <div className="pt-4 border-t space-y-3">
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Change Trip Status
                </label>

                <select
                  className="input"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="PLANNED">Planned</option>
                  <option value="STARTED">Started</option>
                  <option value="COMPLETED">Completed</option>
                </select>

                <button
                  disabled={newStatus === openTrip.trip_status}
                  onClick={handleChangeStatus}
                  className={`w-full py-2 rounded-md text-sm text-white
                     ${newStatus === openTrip.trip_status
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-fleet-primary hover:opacity-90"
                    }`}
                >
                  Update Status
                </button>

              </div>

            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default Trips;
