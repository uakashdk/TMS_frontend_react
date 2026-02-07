import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Search } from "lucide-react";
import Select from "react-select";

import { DocumentUsers } from "../../../services/document/DocumentService";
import {
  getAllVehicle,
  getVehicleDetailById,
} from "../../../services/VehicleService/VehicleService";

const Vehicle = () => {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const [openSidebar, setOpenSidebar] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [baseUrl, setBaseUrl] = useState("");

  const statusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "VERIFIED", label: "Verified" },
    { value: "REJECTED", label: "Rejected" },
  ];

  const openVehicleSidebar = async (vehicleId) => {
    try {
      setOpenSidebar(true);
      setSelectedVehicleId(vehicleId);

      const res = await getVehicleDetailById(vehicleId);

      setVehicleDetails(res?.data || null);
      setDocuments(res?.documents || []);
      setBaseUrl(res?.api || "");
    } catch (error) {
      console.error("Failed to load vehicle details", error);
    }
  };

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await getAllVehicle({ page, search });
      setVehicles(res?.data || []);
      setPagination(res?.pagination || {});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [page, search]);

  return (
    <div className="p-6 bg-fleet-bg min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-fleet-text-primary">
          Vehicle Management
        </h1>

        <button
          onClick={() => navigate("/Add-Vehicle")}
          className="px-5 py-2.5 rounded-lg bg-fleet-primary text-white text-sm font-medium shadow"
        >
          + Add Vehicle
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-6">
        <div className="relative w-85">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-fleet-text-muted"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search vehicle number"
            className="w-full h-11 pl-11 pr-4 rounded-xl bg-white text-sm shadow focus:outline-none"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-fleet-table-header-bg">
            <tr className="text-xs uppercase tracking-wide">
              <th className="px-6 py-4 text-left">Vehicle No</th>
              <th className="px-6 py-4 text-left">Type</th>
              <th className="px-6 py-4 text-left">Capacity</th>
              <th className="px-6 py-4 text-left">Fuel</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-10 text-center text-gray-500">
                  Loading vehicles...
                </td>
              </tr>
            ) : vehicles.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-10 text-center text-gray-500">
                  No vehicles found
                </td>
              </tr>
            ) : (
              vehicles.map((v) => (
                <tr
                  key={v.id}
                  className="border-b hover:bg-fleet-table-row-hover"
                >
                  <td className="px-5 py-4 font-medium">
                    {v.vehicle_number}
                  </td>
                  <td className="px-5 py-4">{v.vehicle_type}</td>
                  <td className="px-5 py-4">
                    {v.capacity_weight_kg} KG
                  </td>
                  <td className="px-5 py-4">{v.fuel_type}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => openVehicleSidebar(v.id)}
                        className="p-2 rounded-md bg-fleet-primary/10 text-fleet-primary"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/update-vehicle/${v.id}`)
                        }
                        className="p-2 rounded-md bg-fleet-accent/10 text-fleet-accent"
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

      {/* PAGINATION */}
      {pagination?.totalPages > 1 && (
        <div className="mt-6 flex justify-end">
          <div className="flex items-center gap-3 bg-white px-5 py-2 rounded-xl shadow">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 text-sm rounded-md border disabled:opacity-40"
            >
              Prev
            </button>

            <span className="text-sm font-medium">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              disabled={page === pagination.totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 text-sm rounded-md border disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* OVERLAY */}
      {openSidebar && (
        <div
          onClick={() => setOpenSidebar(false)}
          className="fixed inset-0 z-40 bg-black/30"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 right-0 z-50 h-screen w-105 bg-white shadow-2xl transform transition-transform duration-300 ${
          openSidebar ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="text-lg font-semibold">Vehicle Details</h2>
          <button onClick={() => setOpenSidebar(false)}>✕</button>
        </div>

        <div className="p-6 overflow-y-auto h-[calc(100vh-72px)]">
          {/* VEHICLE INFO */}
          <div className="space-y-4 pb-6 border-b">
            <Info label="Vehicle Number" value={vehicleDetails?.vehicle_number} />
            <Info label="Vehicle Type" value={vehicleDetails?.vehicle_type} />
            <Info label="Fuel Type" value={vehicleDetails?.fuel_type} />
            <Info
              label="Capacity"
              value={`${vehicleDetails?.capacity_weight_kg || 0} KG`}
            />
            <Info
              label="Fitness Expiry"
              value={vehicleDetails?.fitness_expiry_date?.slice(0, 10)}
            />
          </div>

          {/* DOCUMENTS */}
          <div className="pt-6 space-y-4">
            <h3 className="text-sm font-semibold">
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
                className="rounded-xl border p-4 bg-gray-50"
              >
                <div className="flex justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold">
                      {doc.document_group}
                    </p>
                    <p className="text-xs text-gray-400">
                      {doc.document_type}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      window.open(`${baseUrl}${doc.file_url}`, "_blank")
                    }
                    className="text-indigo-600 text-xs"
                  >
                    View
                  </button>
                </div>

                <Select
                  options={statusOptions}
                  value={statusOptions.find(
                    (o) => o.value === doc.status
                  )}
                  isSearchable={false}
                  onChange={(opt) =>
                    DocumentUsers(doc.id, opt.value)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400">{label}</p>
    <p className="text-sm font-medium">{value || "N/A"}</p>
  </div>
);

export default Vehicle;
