import React, { useEffect, useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";

import { getAllVehicle } from "../../../services/VehicleService/VehicleService";
import { getVehicleCurrentDriver } from "../../../services/vehicleDriverAssigmentService/vehicleDriverService";

const VehicleCurrentDriver = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [driverInfo, setDriverInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    const res = await getAllVehicle({ page: 1, limit: 50, search: "" });
    setVehicles(res?.data || []);
  };

  const handleVehicleChange = async (option) => {
    setSelectedVehicle(option);
    setDriverInfo(null);
    setLoading(true);

    try {
      const res = await getVehicleCurrentDriver(option.value);

      if (res?.assigned && res?.drivers?.length > 0) {
        console.log("i am in assigned",res.drivers[0])
        setDriverInfo(res.drivers[0]);
      } else {
        toast("No driver currently assigned", { icon: "ℹ️" });
      }
    } finally {
      setLoading(false);
    }
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
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1
            className="text-3xl font-semibold"
            style={{ color: "var(--color-fleet-text-primary)" }}
          >
            Vehicle Current Driver
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--color-fleet-text-secondary)" }}
          >
            View the currently assigned driver for a selected vehicle
          </p>
        </div>

        {/* Vehicle Selector */}
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={{ backgroundColor: "var(--color-fleet-card)" }}
        >
          <h2 className="text-lg font-medium mb-2">
            Select Vehicle
          </h2>

          <Select
            options={vehicleOptions}
            value={selectedVehicle}
            onChange={handleVehicleChange}
            placeholder="Search vehicle number..."
          />
        </div>

        {/* Driver Info */}
        {selectedVehicle && (
          <div
            className="rounded-2xl p-6 shadow-sm"
            style={{ backgroundColor: "var(--color-fleet-card)" }}
          >
            {loading ? (
              <p className="text-sm text-slate-500">Loading assignment...</p>
            ) : driverInfo ? (
              <>
                <h2 className="text-lg font-medium mb-4">
                  Assigned Driver
                </h2>

                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-slate-500">Driver Name</p>
                    <p className="font-medium">
                      {driverInfo.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">License Number</p>
                    <p className="font-medium">
                      {driverInfo.licenseNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Assigned Since</p>
                    <p className="font-medium">
                      {new Date(driverInfo.startDateTime).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Status</p>
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor:
                          "var(--color-fleet-success-light)",
                        color: "var(--color-fleet-success)",
                      }}
                    >
                      Active Assignment
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div
                className="text-sm rounded-lg p-4"
                style={{
                  backgroundColor: "var(--color-fleet-table-row-hover)",
                  color: "var(--color-fleet-text-secondary)",
                }}
              >
                No active driver assignment for this vehicle.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default VehicleCurrentDriver;
