import React, { useEffect, useState } from "react";
import { Eye, Pencil, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllParties } from "../../../services/PartyModule/PartyService";
import PartyGSTSidebar from "../../../component/common/PartyGstSidebar";
import ReactPaginate from "react-paginate";


const Party = () => {
    const navigate = useNavigate();

    const [parties, setParties] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);

    const [selectedParty, setSelectedParty] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);

    // 🔹 Fetch parties
    const fetchParties = async () => {
        setLoading(true);
        const res = await getAllParties({ search, page });
        if (res?.success) {
            setParties(res.data);
            setPagination(res.pagination);
        }
        setLoading(false);
    };

    // 🔹 API hit on search + page change
    useEffect(() => {
        const delay = setTimeout(() => {
            fetchParties();
        }, 400); // debounce

        return () => clearTimeout(delay);
    }, [search, page]);

    return (
        <div className="p-6 bg-fleet-bg min-h-screen">
            {/* ================= HEADER ================= */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold text-fleet-text-primary">
                    Parties
                </h1>

                <button
                    onClick={() => navigate("/add-party")}
                    className="flex items-center gap-2 bg-fleet-primary text-white px-4 py-2 rounded-md text-sm hover:bg-(--color-fleet-primary-dark)"
                >
                    <Plus size={16} />
                    Add Party
                </button>
            </div>

            {/* ================= SEARCH ================= */}
            <div className="mb-4 flex items-center gap-2 max-w-sm">
                <Search size={16} className="text-slate-500" />
                <input
                    type="text"
                    placeholder="Search party by name..."
                    value={search}
                    onChange={(e) => {
                        setPage(1);
                        setSearch(e.target.value);
                    }}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm
             focus:outline-none focus:border-slate-400"
                />

            </div>

            {/* ================= TABLE ================= */}

            <div className="bg-white rounded-md overflow-hidden no-header-border">
                <table className="w-full text-sm border-collapse">
                    <thead className="bg-fleet-table-header-bg text-(--color-fleet-table-header-text) border-b-0">
                        <tr className="border-b-0">
                            <th className="px-4 py-2 text-left font-medium border-b-0">#</th>
                            <th className="px-4 py-2 text-left font-medium border-b-0">Party Name</th>
                            <th className="px-4 py-2 text-left font-medium border-b-0">Type</th>
                            <th className="px-4 py-2 text-left font-medium border-b-0">Contact</th>
                            <th className="px-4 py-2 text-left font-medium border-b-0">Phone</th>
                            <th className="px-4 py-2 text-left font-medium border-b-0">Status</th>
                            <th className="px-4 py-2 text-center font-medium border-b-0">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="px-4 py-6 text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : parties.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="px-4 py-6 text-center text-slate-500"
                                >
                                    No parties found
                                </td>
                            </tr>
                        ) : (
                            parties.map((party, index) => (
                                <tr
                                    key={party.id}
                                    className="border-t hover:bg-fleet-table-row-hover"
                                >
                                    {/* Serial Number */}
                                    <td className="px-4 py-3 text-slate-500">
                                        {(page - 1) * 10 + index + 1}
                                    </td>

                                    <td className="px-4 py-3">{party.party_name}</td>
                                    <td className="px-4 py-3 capitalize">
                                        {party.party_type}
                                    </td>
                                    <td className="px-4 py-3">
                                        {party.contact_person}
                                    </td>
                                    <td className="px-4 py-3">
                                        {party.phone_number}
                                    </td>

                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${party.is_active
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {party.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => {
                                                    setSelectedParty(party);
                                                    setShowSidebar(true);
                                                }}
                                                className="text-slate-600 hover:text-fleet-primary"
                                            >
                                                <Eye size={16} />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/edit-party/${party.id}`
                                                    )
                                                }
                                                className="text-slate-600 hover:text-fleet-accent"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>


            {/* ================= PAGINATION ================= */}
            <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
                {/* Left info */}
                <span>
                    Showing page {pagination?.currentPage || 1} of{" "}
                    {pagination?.totalPages || 1}
                </span>

                {/* Right pagination */}
                <div className="flex items-center gap-3">
                    {/* Prev */}
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="hover:text-slate-900 disabled:opacity-40"
                    >
                        ‹ Prev
                    </button>

                    {/* Page numbers */}
                    <div className="flex items-center gap-2">
                        {Array.from(
                            { length: pagination?.totalPages || 1 },
                            (_, i) => i + 1
                        )
                            .slice(
                                Math.max(0, page - 2),
                                Math.min(pagination?.totalPages || 1, page + 1)
                            )
                            .map((p) => (
                                <span
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`cursor-pointer px-1
                            ${page === p
                                            ? "text-slate-900 font-semibold underline underline-offset-4"
                                            : "hover:text-slate-900"
                                        }`}
                                >
                                    {p}
                                </span>
                            ))}
                    </div>

                    {/* Next */}
                    <button
                        onClick={() =>
                            setPage((p) =>
                                p < (pagination?.totalPages || 1) ? p + 1 : p
                            )
                        }
                        disabled={page >= (pagination?.totalPages || 1)}
                        className="hover:text-slate-900 disabled:opacity-40"
                    >
                        Next ›
                    </button>
                </div>
            </div>






            {/* ================= GST SIDEBAR ================= */}
            {showSidebar && (
                <PartyGSTSidebar
                    party={selectedParty}
                    onClose={() => setShowSidebar(false)}
                />
            )}
        </div>
    );
};

export default Party;
