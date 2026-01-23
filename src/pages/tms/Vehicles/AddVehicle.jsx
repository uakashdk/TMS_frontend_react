import React, { useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createVehicle } from "../../../services/VehicleService/VehicleService";

const vehicleTypeOptions = [
    { value: "CONTAINER", label: "Container" },
    { value: "TRUCK", label: "Truck" },
    { value: "TRAILER", label: "Trailer" },
];

const fuelOptions = [
    { value: "DIESEL", label: "Diesel" },
    { value: "PETROL", label: "Petrol" },
    { value: "CNG", label: "CNG" },
];

const AddVehicle = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        vehicle_number: "",
        vehicle_type: null,
        capacity_weight_kg: "",
        capacity_volume_cbm: "",
        fuel_type: null,
        fitness_expiry_date: "",
    });

    const submitHandler = async (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            vehicle_type: form.vehicle_type?.value,
            fuel_type: form.fuel_type?.value,
        };

        await createVehicle(payload);
        toast.success("Vehicle added successfully");
        navigate("/vehicle");
    };
    const inputClass =
        "w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 bg-white " +
        "outline-none focus:outline-none focus:ring-0 focus:border-gray-200 " +
        "hover:border-gray-200 transition";


    return (
        <div className="min-h-screen bg-fleet-bg p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-[0_12px_32px_rgba(0,0,0,0.08)]">

                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-fleet-text-primary">
                        Add Vehicle
                    </h1>
                    <p className="text-sm text-fleet-text-secondary mt-1">
                        Add a new vehicle to your fleet
                    </p>
                </div>

                <form onSubmit={submitHandler} className="space-y-5">

                    <div>
                        <label className="text-sm text-gray-600">Vehicle Number</label>
                        <input
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm
      outline-none focus:outline-none focus:ring-0 focus:border-gray-300
      hover:border-gray-300"
                            placeholder="MH02AB2345"
                            value={form.vehicle_number}
                            onChange={(e) =>
                                setForm({ ...form, vehicle_number: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Vehicle Type</label>
                        <Select
                            options={vehicleTypeOptions}
                            value={form.vehicle_type}
                            onChange={(val) =>
                                setForm({ ...form, vehicle_type: val })
                            }
                            placeholder="Select vehicle type"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    border: "1px solid #d1d5db",
                                    boxShadow: "none",
                                    ":hover": { border: "1px solid #d1d5db" },
                                }),
                                indicatorSeparator: () => ({ display: "none" }),
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-600">Capacity (KG)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm
        outline-none focus:outline-none focus:ring-0 focus:border-gray-300
        hover:border-gray-300"
                                value={form.capacity_weight_kg}
                                onChange={(e) =>
                                    setForm({ ...form, capacity_weight_kg: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600">Volume (CBM)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm
        outline-none focus:outline-none focus:ring-0 focus:border-gray-300
        hover:border-gray-300"
                                value={form.capacity_volume_cbm}
                                onChange={(e) =>
                                    setForm({ ...form, capacity_volume_cbm: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-600">Fuel Type</label>
                            <Select
                                options={fuelOptions}
                                value={form.fuel_type}
                                onChange={(val) =>
                                    setForm({ ...form, fuel_type: val })
                                }
                                placeholder="Select fuel"
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        border: "1px solid #d1d5db",
                                        boxShadow: "none",
                                        ":hover": { border: "1px solid #d1d5db" },
                                    }),
                                    indicatorSeparator: () => ({ display: "none" }),
                                }}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600">Fitness Expiry</label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm
        outline-none focus:outline-none focus:ring-0 focus:border-gray-300
        hover:border-gray-300"
                                value={form.fitness_expiry_date}
                                onChange={(e) =>
                                    setForm({ ...form, fitness_expiry_date: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 text-sm border rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 text-sm rounded-lg bg-blue-600 text-white"
                        >
                            Save Vehicle
                        </button>
                    </div>

                </form>


            </div>
        </div>
    );
};

export default AddVehicle;
