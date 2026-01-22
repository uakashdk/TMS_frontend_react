import React, { useEffect, useState } from "react";
import { Pencil, Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllDriver, geDriverDetailById } from "../../../services/driverService/driverService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DocumentUsers } from "../../../services/document/DocumentService";
import Select from "react-select";

const Driver = () => {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
  });
  const [openSidebar, setOpenSidebar] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [driverDetails, setDriverDetails] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [baseUrl, setBaseUrl] = useState("");


  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role;
  const navigate = useNavigate();

  const statusOptions = [
    { value: "pending", label: "Pending", color: "#F59E0B" },
    { value: "verified", label: "Verified", color: "#10B981" },
    { value: "rejected", label: "Rejected", color: "#EF4444" },
  ];

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchDrivers(search, page);
    }, 500);

    return () => clearTimeout(debounce);
  }, [search, page]);

  const fetchDrivers = async (searchText = "", pageNo = 1) => {
    try {
      const res = await getAllDriver(searchText, pageNo);

      setDrivers(res?.data || []);
      console.log("pageinition====>", res?.pagination)
      setPagination(res?.pagination || {});
    } catch (err) {
      console.error("Driver fetch failed", err);
      setDrivers([]);
    }
  };

  const openDriverSidebar = async (driverId) => {
    try {
      setOpenSidebar(true);
      setSelectedDriverId(driverId);

      const res = await geDriverDetailById(driverId);

      setDriverDetails(res?.data);
      setDocuments(res?.documents || []);
      setBaseUrl(res?.api || "");
    } catch (error) {
      console.error("Failed to load driver details", error);
    }
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      minHeight: 36,
      borderRadius: 10,
      borderColor: "#E5E7EB",
      boxShadow: "none",
      "&:hover": { borderColor: "#CBD5E1" },
    }),
    option: (base, state) => ({
      ...base,
      fontSize: 13,
      backgroundColor: state.isSelected
        ? state.data.color
        : state.isFocused
          ? "#F1F5F9"
          : "white",
      color: state.isSelected ? "white" : "#0F172A",
    }),
    singleValue: (base, state) => ({
      ...base,
      color: state.data.color,
      fontWeight: 600,
    }),
  };


  return (
    <div className="p-6 bg-fleet-bg min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-fleet-text-primary">
          Drivers
        </h1>

        {userRole === "operational-manager" && (
          <button
            onClick={() => navigate("/add-drivers")}
            className="px-4 py-2 rounded-md bg-fleet-primary text-white text-sm hover:bg-(--color-fleet-primary-dark)"
          >
            + Add Driver
          </button>
        )}
      </div>

      {/* SEARCH */}
      <div className="mb-6">
        <div className="relative w-80">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search drivers..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // reset page on search
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white shadow-sm
              focus:outline-none focus:ring-2 focus:ring-fleet-primary
              text-sm"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-xs uppercase tracking-wide text-slate-500">
              <th className="px-6 py-4 text-left">Driver</th>
              <th className="px-6 py-4 text-left">Role</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Company</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {drivers.map((driver) => (
              <tr
                key={driver.id}
                className="hover:bg-slate-50 transition"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">
                      {driver?.driverProfile?.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      ID #{driver.id}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-slate-700">Driver</td>

                <td className="px-6 py-4 text-slate-700">
                  {driver.email}
                </td>

                <td className="px-6 py-4 text-slate-700">
                  Company #{driver.company_id}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
                      ${driver.isVerifiedDriver
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                      }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${driver.isVerifiedDriver
                        ? "bg-green-600"
                        : "bg-red-600"
                        }`}
                    />
                    {driver.isVerifiedDriver ? "Verified" : "Not Verified"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">

                    {userRole === "operational-manager" && (
                      <button
                        title="Edit Driver"
                        onClick={() => navigate(`/edit-drivers/${driver?.id}`)}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                      >
                        <Pencil size={16} />
                      </button>
                    )}


                    <button
                      title="Verify Documents"
                      onClick={() => openDriverSidebar(driver.id)}
                      className="p-2 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700"
                    >
                      <Eye size={16} />
                    </button>


                  </div>
                </td>
              </tr>
            ))}

            {drivers.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-10 text-center text-slate-500"
                >
                  No drivers found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex items-center justify-between px-6 py-4 bg-white">
          <span className="text-sm text-slate-500">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <div className="flex gap-2">
            <button
              disabled={pagination.currentPage === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <p>{pagination.currentPage}</p>
            <button
              disabled={
                pagination.currentPage === pagination.totalPages
              }
              onClick={() => setPage((p) => p + 1)}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      {/* SIDEBAR OVERLAY */}
      {/* OVERLAY (starts BELOW header, never overlaps) */}
{/* OVERLAY */}
{openSidebar && (
  <div
    onClick={() => setOpenSidebar(false)}
    className="fixed inset-0 z-40 bg-black/30"
  />
)}

{/* SIDEBAR */}
<div
  className={`fixed top-0 right-0 z-50 h-screen w-105
  bg-white shadow-2xl
  transform transition-transform duration-300 ease-in-out
  ${openSidebar ? "translate-x-0" : "translate-x-full"}`}
>
  {/* HEADER */}
  <div className="flex items-center justify-between px-6 py-5 border-b">
    <h2 className="text-lg font-semibold text-gray-900">
      Driver Details
    </h2>

    <button
      onClick={() => setOpenSidebar(false)}
      className="text-gray-400 hover:text-gray-700"
    >
      ✕
    </button>
  </div>

  {/* CONTENT */}
  <div className="p-6 overflow-y-auto h-[calc(100vh-72px)]">

    {/* DRIVER INFO */}
    <div className="space-y-4 pb-6 border-b">
      <div>
        <p className="text-xs text-gray-400">Name</p>
        <p className="text-sm font-medium text-gray-900">
          {driverDetails?.driverProfile?.name || "N/A"}
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-400">Email</p>
        <p className="text-sm font-medium text-gray-900 break-all">
          {driverDetails?.admin?.email}
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-400">Phone</p>
        <p className="text-sm font-medium text-gray-900">
          {driverDetails?.admin?.phone}
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-400">Verification</p>
        <span
          className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold
          ${
            driverDetails?.admin?.isVerifiedDriver
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {driverDetails?.admin?.isVerifiedDriver ? "Verified" : "Not Verified"}
        </span>
      </div>
    </div>

    {/* DOCUMENTS */}
    <div className="pt-6 space-y-4">
      <h3 className="text-sm font-semibold text-gray-800">
        Documents ({documents.length})
      </h3>

      {documents.length === 0 && (
        <p className="text-sm text-gray-400">
          No documents uploaded
        </p>
      )}

      {documents.map((doc) => (
        <div
          key={doc.id}
          className="rounded-xl border border-gray-200 p-4 bg-gray-50"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {doc.document_group}
              </p>
              <p className="text-xs text-gray-400">
                {doc.document_type}
              </p>
            </div>

            <button
              onClick={() =>
                window.open(`${baseUrl}/${doc.file_url}`, "_blank")
              }
              className="text-indigo-600 text-xs font-medium hover:underline"
            >
              View
            </button>
          </div>

          {/* STATUS DROPDOWN */}
          <Select
            options={statusOptions}
            value={statusOptions.find(
              (o) => o.value === doc.status
            )}
            isSearchable={false}
            onChange={(opt) =>
              DocumentUsers(doc.id, opt.value)
            }
            className="text-sm"
          />
        </div>
      ))}
    </div>
  </div>
</div>




    </div>
  );
};

export default Driver;