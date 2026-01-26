import React, { useEffect, useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";

import { getAllDriver } from "../../../services/driverService/driverService";
import { getcurrentDriverVehicle } from "../../../services/vehicleDriverAssigmentService/vehicleDriverService";

const DriverCurrentVehicle = () => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    const res = await getAllDriver();
    setDrivers(res?.data || []);
  };

  const handleDriverChange = async (option) => {
    setSelectedDriver(option);
    setAssignment(null);
    setLoading(true);

    try {
      const res = await getcurrentDriverVehicle(option.value);

      if (res?.success && res?.data) {
        setAssignment(res.data);
      } else {
        toast("Driver is not assigned to any vehicle", { icon: "ℹ️" });
      }
    } catch {
      toast.error("Failed to fetch driver assignment");
    } finally {
      setLoading(false);
    }
  };

  const driverOptions = drivers.map((d) => ({
    value: d.driverProfile.id,
    label: `${d.driverProfile.name} • ${d.driverProfile.driver_license_number}`,
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
            Driver Current Vehicle
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--color-fleet-text-secondary)" }}
          >
            View the currently assigned vehicle for a selected driver
          </p>
        </div>

        {/* Driver Selector */}
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={{ backgroundColor: "var(--color-fleet-card)" }}
        >
          <h2 className="text-lg font-medium mb-2">
            Select Driver
          </h2>

          <Select
            options={driverOptions}
            value={selectedDriver}
            onChange={handleDriverChange}
            placeholder="Search driver name or license..."
          />
        </div>

        {/* Assignment Info */}
        {selectedDriver && (
          <div
            className="rounded-2xl p-6 shadow-sm"
            style={{ backgroundColor: "var(--color-fleet-card)" }}
          >
            {loading ? (
              <p className="text-sm text-slate-500">
                Loading assignment...
              </p>
            ) : assignment ? (
              <>
                <h2 className="text-lg font-medium mb-4">
                  Assigned Vehicle
                </h2>

                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-slate-500">Vehicle Number</p>
                    <p className="font-medium">
                      {assignment.vehicle.vehicle_number}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Vehicle Type</p>
                    <p className="font-medium">
                      {assignment.vehicle.vehicle_type}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Assigned Since</p>
                    <p className="font-medium">
                      {new Date(assignment.startDateTime).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Status</p>
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: "var(--color-fleet-success-light)",
                        color: "var(--color-fleet-success)",
                      }}
                    >
                      On Duty
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
                This driver is currently not assigned to any vehicle.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default DriverCurrentVehicle;
