import React, { useEffect, useState } from "react";
import { GetAllJobs } from "../../../services/jobService/JobService";
import {
    Plus,
    Pencil,
    Truck,
    Search,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const JobList = () => {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
    });
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => state.auth);
    const roles = user?.role;

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await GetAllJobs(search, page, 10);
            setJobs(res?.data || []);
            setPagination(res?.pagination || {});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [page, search]);

    return (
        <div className="p-6 bg-[--color-fleet-bg] min-h-screen">

            {/* ================= HEADER ================= */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-semibold text-[--color-fleet-text-primary]">
                        Jobs
                    </h1>
                    <p className="text-sm text-[--color-fleet-text-secondary]">
                        Manage customer jobs and related trips
                    </p>
                </div> 
                 {console.log("roles=======>",roles)}

                {["operational-manager", "support-manager"].includes(roles) && (
                    <button
                        onClick={() => navigate("/add-jobs")}
                        className="flex items-center gap-2 px-4 py-2
      bg-[rgb(255,183,77)] text-white rounded-lg
      hover:bg-[--color-fleet-primary-dark] transition"
                    >
                        <Plus size={16} />
                        <span className="text-sm font-medium">Add Job</span>
                    </button>
                )}


            </div>

            {/* ================= SEARCH ================= */}
            <div className="mb-6">
                <div className="relative w-80">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search jobs..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white shadow-sm
                       focus:outline-none focus:ring-2
                       focus:ring-[--color-fleet-primary]
                       text-sm"
                    />
                </div>
            </div>

            {/* ================= TABLE ================= */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                        <tr className="text-xs uppercase tracking-wide text-slate-500">
                            <th className="px-6 py-4 text-left">Customer</th>
                            <th className="px-6 py-4 text-left">Goods</th>
                            <th className="px-6 py-4 text-left">Quantity</th>
                            <th className="px-6 py-4 text-left">Route</th>
                            <th className="px-6 py-4 text-left">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                                    Loading jobs...
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            jobs.map((job) => (
                                <tr
                                    key={job.id}
                                    className="hover:bg-slate-50 transition"
                                >
                                    {/* CUSTOMER */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-900">
                                                {job.customer?.party_name}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                Job #{job.id}
                                            </span>
                                        </div>
                                    </td>

                                    {/* GOODS */}
                                    <td className="px-6 py-4 text-slate-700">
                                        {job.goods_type}
                                    </td>

                                    {/* QUANTITY */}
                                    <td className="px-6 py-4 text-slate-700">
                                        {job.goods_quantity} {job.quantity_units}
                                    </td>

                                    {/* ROUTE */}
                                    <td className="px-6 py-4 text-slate-700 max-w-xs truncate">
                                        {job.pickup_location} → {job.dropoff_location}
                                    </td>

                                    {/* STATUS */}
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1
                                     px-3 py-1 rounded-full text-xs font-medium
                                     bg-yellow-50 text-yellow-700">
                                            {job.jobs_status}
                                        </span>
                                    </td>

                                    {/* ACTIONS */}
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                          {["operational-manager", "support-manager"].includes(roles) && (
                                            <button
                                                title="Edit Job"
                                                onClick={() => navigate(`/update-jobs/${job.id}`)}
                                                className="p-2 rounded-lg bg-green-100
                                      hover:bg-green-200 text-green-700"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                          )}


                                            <button
                                                title="View Trips"
                                                onClick={() => navigate(`/trips?jobId=${job.id}`)}
                                                className="p-2 rounded-lg bg-blue-100
                                   hover:bg-blue-200 text-blue-700"
                                            >
                                                <Truck size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                        {!loading && jobs.length === 0 && (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-6 py-10 text-center text-slate-500"
                                >
                                    No jobs found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* ================= PAGINATION ================= */}
                <div className="flex items-center justify-between px-6 py-4 bg-white">
                    <span className="text-sm text-slate-500">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>

                    <div className="flex gap-2 items-center">
                        <button
                            disabled={pagination.currentPage === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="p-2 rounded-lg bg-slate-100
                         hover:bg-slate-200 disabled:opacity-40"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <span className="text-sm">{pagination.currentPage}</span>

                        <button
                            disabled={pagination.currentPage === pagination.totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="p-2 rounded-lg bg-slate-100
                         hover:bg-slate-200 disabled:opacity-40"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobList;
