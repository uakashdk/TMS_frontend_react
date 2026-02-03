import React, { useEffect, useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";

import { getAllVehicle } from "../../../services/VehicleService/VehicleService";
import { getAllDriver } from "../../../services/driverService/driverService";
import {
  createVehicleDriverAssignment,
  unAssignVehicleDriver,
  checkDriverAvailability,
  getVehicleCurrentDriver , // ✅ REQUIRED API
} from "../../../services/vehicleDriverAssigmentService/vehicleDriverService";

const VehicleDriverAssign = () => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const [assignmentId, setAssignmentId] = useState(null);
  const [startDateTime, setStartDateTime] = useState("");
  const [availability, setAvailability] = useState(null);

  const [loading, setLoading] = useState(false);


  useEffect(() => {
    loadVehicles();
    loadDrivers();
  }, []);

  const loadVehicles = async () => {
    const res = await getAllVehicle({ page: 1, limit: 50, search: "" });
    setVehicles(res?.data || []);
  };

  const loadDrivers = async () => {
    const res = await getAllDriver();
    setDrivers(res?.data || []);
  };


const handleVehicleChange = async (option) => {
  setSelectedVehicle(option);
  setSelectedDriver(null);
  setAssignmentId(null);
  setStartDateTime("");
  setAvailability(null);

  const res = await getVehicleCurrentDriver(option.value);
  if (res?.assigned && res.drivers?.length > 0) {
    const activeDriver = res.drivers[0];
    // 🔥 FIND DRIVER OPTION FROM EXISTING OPTIONS
    console.log("driver assignment======>",res?.drivers[0]?.assignment)
    setAssignmentId(res?.drivers[0]?.assignment)
    const matchedDriverOption = driverOptions.find(
      (opt) => opt.value === activeDriver.driverId
    );

    if (matchedDriverOption) {
      setSelectedDriver(matchedDriverOption);
      setAvailability({ available: false });
      setStartDateTime(activeDriver.startDateTime);
      console.log("type of assignmentId",typeof option.value)
      
    }
  }
};


  const handleDriverChange = async (option) => {
    setSelectedDriver(option);

    const res = await checkDriverAvailability(option.value);
    setAvailability(res?.data);
  };


  const handleAssign = async () => {
    if (!selectedVehicle || !selectedDriver) return;

    if (availability && !availability.available) {
      toast.error("Driver is already assigned");
      return;
    }

    setLoading(true);

    const res = await createVehicleDriverAssignment({
      vehicleId: selectedVehicle.value,
      driverId: selectedDriver.value,
      startDateTime: new Date().toISOString(),
    });

    toast.success(res?.data?.message || "Driver assigned successfully");

    setLoading(false);
    resetPage();
  };

  const handleUnAssign = async () => {
    if (!assignmentId) return;

    setLoading(true);
    const payload = {
        assignmentId:assignmentId
    }
    await unAssignVehicleDriver(payload);
    toast.success("Driver unassigned");

    setLoading(false);
    resetPage();
  };

  const resetPage = () => {
    loadVehicles();
    setSelectedVehicle(null);
    setSelectedDriver(null);
    setAssignmentId(null);
    setAvailability(null);
    setStartDateTime("");
  };


  const vehicleOptions = vehicles.map((v) => ({
    value: v.id,
    label: `${v.vehicle_number} • ${v.vehicle_type}`,
  }));

 const driverOptions = drivers
  .filter(d => d.driverProfile) // 🔥 only verified drivers
  .map(d => ({
    value: d.driverProfile.id,
    label: `${d.driverProfile.name} • ${d.driverProfile.driver_license_number}`,
  }));


  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Vehicle Driver Assignment
          </h1>
          <p className="text-gray-500 mt-1">
            Assign, update, or unassign drivers from vehicles
          </p>
        </div>

        {/* Vehicle */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-medium mb-2">Select Vehicle</h2>
          <Select
            options={vehicleOptions}
            value={selectedVehicle}
            onChange={handleVehicleChange}
            placeholder="Search vehicle..."
          />
        </div>

        {/* Driver */}
        {selectedVehicle && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-medium mb-2">Select Driver</h2>

            <Select
              options={driverOptions}
              value={selectedDriver}
              onChange={handleDriverChange}
              placeholder="Search driver..."
            />

            {startDateTime && (
              <p className="mt-3 text-sm text-gray-600">
                Assigned since:{" "}
                <span className="font-medium">
                  {new Date(startDateTime).toLocaleString()}
                </span>
              </p>
            )}

            {availability && (
              <p className="mt-3 text-sm font-medium">
                {availability.available ? (
                  <span className="text-green-600">✅ Driver available</span>
                ) : (
                  <span className="text-red-600">❌ Driver already assigned</span>
                )}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        {selectedVehicle && (
          <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-end gap-4">
            
            {assignmentId && (
              <button
                onClick={handleUnAssign}
                disabled={loading}
                className="px-6 py-2 rounded-xl bg-red-500 text-white-600 hover:bg-red-100"
              >
                Unassign
              </button>
            )}

            <button
              onClick={handleAssign}
              disabled={loading || (availability && !availability.available)}
              className="px-6 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-50"
            >
              {assignmentId ? "Reassign Driver" : "Assign Driver"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default VehicleDriverAssign;
