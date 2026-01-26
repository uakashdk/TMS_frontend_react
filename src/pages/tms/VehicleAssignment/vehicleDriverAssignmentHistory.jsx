import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Truck, User, History } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getAllVehicle } from "../../../services/VehicleService/VehicleService";
import {
  vehicleDriverAssignmentHistory,
} from "../../../services/vehicleDriverAssigmentService/vehicleDriverService";

const AssignmentHistory = () => {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    const res = await getAllVehicle({ page: 1, limit: 100, search: "" });
    setVehicles(res?.data || []);
  };

  const loadHistory = async (vehicleId) => {
    setLoading(true);
    try {
      const res = await vehicleDriverAssignmentHistory(vehicleId);
      setHistory(res?.history || []);
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleChange = (option) => {
    setSelectedVehicle(option);
    setHistory([]);
    loadHistory(option.value);
  };

  const vehicleOptions = vehicles.map((v) => ({
    value: v.id,
    label: `${v.vehicle_number} • ${v.vehicle_type}`,
  }));

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: "var(--color-fleet-bg)" }}
    >
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <History size={28} style={{ color: "var(--color-fleet-primary)" }} />
          <div>
            <h1
              className="text-3xl font-semibold"
              style={{ color: "var(--color-fleet-text-primary)" }}
            >
              Vehicle–Driver Assignment History
            </h1>
            <p
              className="text-sm"
              style={{ color: "var(--color-fleet-text-secondary)" }}
            >
              Select a vehicle to view its complete assignment timeline
            </p>
          </div>
        </div>

        {/* Vehicle Selector */}
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={{ backgroundColor: "var(--color-fleet-card)" }}
        >
          <h2 className="text-lg font-medium mb-2">Select Vehicle</h2>
          <Select
            options={vehicleOptions}
            value={selectedVehicle}
            onChange={handleVehicleChange}
            placeholder="Search vehicle number..."
          />
        </div>

        {/* History Table */}
        <div
          className="rounded-2xl shadow-sm overflow-hidden"
          style={{ backgroundColor: "var(--color-fleet-card)" }}
        >
          <table className="w-full text-sm">
            <thead
              style={{
                backgroundColor: "var(--color-fleet-table-header-bg)",
                color: "var(--color-fleet-table-header-text)",
              }}
            >
              <tr>
                <th className="px-6 py-4 text-left">Driver</th>
                <th className="px-6 py-4 text-left">Start Date</th>
                <th className="px-6 py-4 text-left">End Date</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {!selectedVehicle ? (
                <tr>
                  <td colSpan="5" className="px-6 py-6 text-center text-slate-500">
                    Please select a vehicle to view assignment history
                  </td>
                </tr>
              ) : loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-6 text-center text-slate-500">
                    Loading assignment history...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-6 text-center text-slate-500">
                    No assignment history found
                  </td>
                </tr>
              ) : (
                history.map((item, index) => (
                  <tr
                    key={`${item.driverId}-${index}`}
                    className="border-t"
                    style={{ borderColor: "var(--color-fleet-border)" }}
                  >
                    {/* Driver */}
                    <td className="px-6 py-4">
                      <p className="font-medium">{item.driverName}</p>
                      <p className="text-xs text-slate-500">
                        {item.phone}
                      </p>
                    </td>

                    {/* Start Date */}
                    <td className="px-6 py-4">
                      {new Date(item.startDateTime).toLocaleString()}
                    </td>

                    {/* End Date */}
                    <td className="px-6 py-4">
                      {item.endDateTime
                        ? new Date(item.endDateTime).toLocaleString()
                        : "—"}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: item.isActive
                            ? "var(--color-fleet-success-light)"
                            : "var(--color-fleet-warning)",
                          color: item.isActive
                            ? "var(--color-fleet-success)"
                            : "#000",
                        }}
                      >
                        {item.isActive ? "Active" : "Completed"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-4">

                        {/* Vehicle → Current Driver */}
                        <button
                          title="Vehicle Current Driver"
                          onClick={() =>
                            navigate(
                              `/Get-Vehicle-Current-Driver?vehicleId=${selectedVehicle.value}`
                            )
                          }
                          className="p-2 rounded-lg hover:bg-slate-100"
                          style={{ color: "var(--color-fleet-primary)" }}
                        >
                          <Truck size={18} />
                        </button>

                        {/* Driver → Current Vehicle */}
                        <button
                          title="Driver Current Vehicle"
                          onClick={() =>
                            navigate(
                              `/Get-current-Driver-Vehicle?driverId=${item.driverId}`
                            )
                          }
                          className="p-2 rounded-lg hover:bg-slate-100"
                          style={{ color: "var(--color-fleet-accent)" }}
                        >
                          <User size={18} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))

              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default AssignmentHistory;
