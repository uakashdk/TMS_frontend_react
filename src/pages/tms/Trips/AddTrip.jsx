import React, { useEffect, useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";

import { addTrip } from "../../../services/TripService/TripService";
import { getRouteDropdown } from "../../../services/RouteService/RouteService";
import { getJobDropdown } from "../../../services/jobService/JobService";
import { getAllVehicle } from "../../../services/VehicleService/VehicleService";
import { getAllDriver } from "../../../services/driverService/driverService";
import { getVehicleCurrentDriver, getcurrentDriverVehicle } from "../../../services/vehicleDriverAssigmentService/vehicleDriverService";
import { useNavigate } from "react-router-dom";

const selectStyles = {
    control: (base) => ({
        ...base,
        minHeight: 38,
        borderRadius: 8,
        borderColor: "var(--color-fleet-border)",
        boxShadow: "none",
        "&:hover": {
            borderColor: "var(--color-fleet-primary)",
        },
    }),
    option: (base, state) => ({
        ...base,
        fontSize: 13,
        backgroundColor: state.isFocused
            ? "var(--color-fleet-table-row-hover)"
            : "#fff",
        color: "var(--color-fleet-text-primary)",
    }),
};


const AddTrip = () => {
    const [loading, setLoading] = useState(false);

    const [jobs, setJobs] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedPrimaryDriver, setSelectedPrimaryDriver] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [isRouteLocked, setIsRouteLocked] = useState(false);

    const unitOptions = [
        { value: "LTR", label: "Liters (LTR)" },
        { value: "KG", label: "Kilograms (KG)" },
        { value: "TON", label: "Tons (TON)" },
    ];

    const Navigate = useNavigate();

    const [form, setForm] = useState({
        job_id: null,
        vehicle_id: null,
        primary_driver_id: null,
        secondary_driver_id: null,
        route_id: null,
        route_summary: "",
        total_distance_km: "",
        trip_start_date: "",
        expected_delivery_date: "",
        goods_qty: "",
        gooods_unit: unitOptions[0],
    });

    useEffect(() => {
        getJobDropdown().then(res => setJobs(res?.data || []));
        getAllVehicle().then(res => setVehicles(res?.data || []));
        getAllDriver().then(res => setDrivers(res?.data || []));
        getRouteDropdown().then(res => setRoutes(res?.data || []));
    }, []);


    const handleSubmit = async () => {
        try {
            setLoading(true);
            await addTrip(form);
            toast.success("Trip created successfully");
            Navigate("/trips");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const reactSelectStyle = {
        control: (base) => ({
            ...base,
            backgroundColor: "#f9fafb",
            border: "none",
            boxShadow: "none",
            minHeight: "38px",
        }),
        menu: (base) => ({
            ...base,
            zIndex: 20,
        }),
    };



    return (
        <div className="min-h-screen bg-fleet-bg p-6 space-y-6">

            <div>
                <h1 className="text-2xl font-semibold text-fleet-text-primary">
                    Add Trip
                </h1>
                <p className="text-sm text-fleet-text-secondary">
                    Create and assign a new trip
                </p>
            </div>
            <div className="bg-fleet-card rounded-xl shadow-sm border border-(--color-fleet-border)">

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    <div>
                        <label className="label">Job</label>
                        <Select
                            styles={selectStyles}
                            placeholder="Select job"
                            options={jobs.map(j => ({
                                value: j.id,
                                label: `${j.customer?.party_name} • ${j.pickup_location} → ${j.dropoff_location}`,
                                route: j.route, // 👈 IMPORTANT
                            }))}
                            onChange={(e) => {
                                // set job
                                setForm(prev => ({ ...prev, job_id: e?.value }));

                                // if job has route → auto select & lock
                                if (e?.route) {
                                    const routeOption = {
                                        value: e.route.id,
                                        label: e.route.route_name,
                                    };

                                    setSelectedRoute(routeOption);
                                    setIsRouteLocked(true);

                                    setForm(prev => ({
                                        ...prev,
                                        route_id: e.route.id,
                                        route_summary: e.route.route_name,
                                    }));

                                    // find distance from routes list
                                    const fullRoute = routes.find(r => r.id === e.route.id);
                                    if (fullRoute) {
                                        setForm(prev => ({
                                            ...prev,
                                            total_distance_km: fullRoute.distance_km,
                                        }));
                                    }
                                } else {
                                    // no route → allow manual selection
                                    setSelectedRoute(null);
                                    setIsRouteLocked(false);

                                    setForm(prev => ({
                                        ...prev,
                                        route_id: null,
                                        route_summary: "",
                                        total_distance_km: "",
                                    }));
                                }
                            }}
                        />

                    </div>
                    <div>
                        <label className="label">Vehicle</label>
                        <Select
                            styles={selectStyles}
                            placeholder="Select vehicle"
                            value={selectedVehicle}
                            options={vehicles.map(v => ({
                                value: v.id,
                                label: v.vehicle_number,
                            }))}
                            onChange={async (e) => {
                                setSelectedVehicle(e);
                                setForm(prev => ({ ...prev, vehicle_id: e?.value }));

                                if (!e?.value) return;

                                const res = await getVehicleCurrentDriver(e.value);

                                if (res?.drivers?.length > 0) {
                                    const driver = res.drivers[0]; // primary assigned driver

                                    const driverOption = {
                                        value: driver.driverId,
                                        label: driver.name,
                                    };

                                    setSelectedPrimaryDriver(driverOption);
                                    setForm(prev => ({
                                        ...prev,
                                        primary_driver_id: driver.driverId,
                                    }));
                                }
                            }}

                        />

                    </div>

                    <div>
                        <label className="label">Primary Driver</label>
                        <Select
                            styles={selectStyles}
                            placeholder="Select primary driver"
                            value={selectedPrimaryDriver}
                            options={drivers.map(d => ({
                                value: d.driverProfile?.id,
                                label: d.driverProfile?.name,
                            }))}
                            onChange={async (e) => {
                                setSelectedPrimaryDriver(e);
                                setForm(prev => ({ ...prev, primary_driver_id: e?.value }));

                                if (!e?.value) return;

                                const res = await getcurrentDriverVehicle(e.value);

                                if (res?.data?.vehicle) {
                                    const vehicle = res.data.vehicle;

                                    const vehicleOption = {
                                        value: vehicle.id,
                                        label: vehicle.vehicle_number,
                                    };

                                    setSelectedVehicle(vehicleOption);
                                    setForm(prev => ({ ...prev, vehicle_id: vehicle.id }));
                                }
                            }}
                        />


                    </div>

                    <div>
                        <label className="label">Secondary Driver</label>
                        <Select
                            styles={selectStyles}
                            placeholder="Optional"
                            options={drivers.map(d => ({
                                value: d.driverProfile?.id,
                                label: d.driverProfile?.name,
                            }))}
                            onChange={(e) =>
                                setForm({ ...form, secondary_driver_id: e?.value || null })
                            }
                        />
                    </div>


                    <div>
                        <label className="label">Goods Quantity</label>
                        <input
                            type="number"
                            className="input"
                            placeholder="Enter goods quantity"
                            value={form.goods_qty}
                            onChange={(e) =>
                                setForm({ ...form, goods_qty: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-500">
                            Quantity Unit
                        </label>
                        <Select
                            options={unitOptions}
                            value={unitOptions.find(u => u.value === form.gooods_unit)}
                            onChange={(val) =>
                                setForm(prev => ({ ...prev, gooods_unit: val?.value }))
                            }
                        />
                    </div>
                    <div>
                        <label className="label">Route</label>
                        <Select
                            styles={selectStyles}
                            placeholder="Select route"
                            value={selectedRoute}
                            isDisabled={isRouteLocked}   // 🔒 LOCKED
                            options={routes.map(r => ({
                                value: r.id,
                                label: `${r.source_city} → ${r.destination_city}`,
                                distance: r.distance_km,
                            }))}
                            onChange={(e) => {
                                setSelectedRoute(e);
                                setForm(prev => ({
                                    ...prev,
                                    route_id: e?.value,
                                    route_summary: e?.label,
                                    total_distance_km: e?.distance,
                                }));
                            }}
                        />

                    </div>

                    <div>
                        <label className="label">Total Distance (KM)</label>
                        <input
                            type="number"
                            className="input bg-slate-50"
                            value={form.total_distance_km}
                            disabled
                        />
                    </div>

                    <div>
                        <label className="label">Trip Start Date</label>
                        <input
                            type="date"
                            className="input"
                            onChange={(e) =>
                                setForm({ ...form, trip_start_date: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="label">Expected Delivery Date</label>
                        <input
                            type="date"
                            className="input"
                            onChange={(e) =>
                                setForm({ ...form, expected_delivery_date: e.target.value })
                            }
                        />
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-(--color-fleet-border) flex justify-end gap-3">
                    <button className="px-4 py-2 rounded-md border text-sm">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-5 py-2 bg-fleet-primary text-white rounded-md text-sm hover:bg-(--color-fleet-primary-dark)"
                    >
                        {loading ? "Creating..." : "Create Trip"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTrip;
