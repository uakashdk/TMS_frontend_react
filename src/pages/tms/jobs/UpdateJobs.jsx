import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import toast from "react-hot-toast";

import { getJobById, UpdateJob } from "../../../services/jobService/JobService";
import { getPartyDropdown } from "../../../services/PartyModule/PartyService";
import { getRouteDropdown } from "../../../services/RouteService/RouteService";

/* -------------------- OPTIONS -------------------- */

const unitOptions = [
    { value: "Liters", label: "Liters" },
    { value: "KG", label: "Kilograms" },
    { value: "TON", label: "Tons" },
];

const goodsOptions = [
    { value: "Liquid Water Tank", label: "Liquid Water Tank" },
    { value: "Solid", label: "Solid" },
    { value: "Gas", label: "Gas" },
];

/* -------------------- REACT SELECT STYLE -------------------- */

const reactSelectStyle = {
    control: (base) => ({
        ...base,
        backgroundColor: "#f9fafb",
        border: "none",
        boxShadow: "none",
        minHeight: "40px",
        paddingLeft: "2px",
    }),
    placeholder: (base) => ({
        ...base,
        color: "#9ca3af",
        fontSize: "14px",
    }),
    singleValue: (base) => ({
        ...base,
        fontSize: "14px",
    }),
    menu: (base) => ({
        ...base,
        zIndex: 50,
    }),
};

/* -------------------- COMPONENT -------------------- */

const UpdateJobs = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [partyOptions, setPartyOptions] = useState([]);
    const [jobs, setJobs] = useState([]);

    const [formData, setFormData] = useState({
        customer_id: null,
        job_id: null,
        job_date: "",
        goods_type: null,
        goods_quantity: "",
        quantity_units: null,
        pickup_location: "",
        dropoff_location: "",
        status: 1, // ✅ default active
        route_id: null
    });
    const [routeOptions, setRouteOptions] = useState([]);

    const JobId = useParams().id;

    console.log("JobId", JobId)
    /* -------------------- FETCH DATA -------------------- */

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobRes, partyRes, routeRes] = await Promise.all([
                    getJobById(id),
                    getPartyDropdown(),
                    getRouteDropdown(),
                ]);
                const parties =
                    partyRes?.data
                        ?.filter((p) => p.party_type === "client")
                        ?.map((p) => ({
                            value: p.party_id,
                            label: p.party_name,
                        })) || [];

                console.log("Filtered Parties:", parties); // Debug log

                const routes = routeRes?.data?.map(r => ({
                    value: r.id,
                    label: `${r.source_city} → ${r.destination_city}`,
                    distance: r.distance_km,
                }));

                setPartyOptions(parties);
                setRouteOptions(routes);

                const job = jobRes?.data;

                setJobs([job]);

                console.log("job.goods_type",job.goods_type)

                setFormData({
                    customer_id: parties.find(p => p.value === job.customer.id),
                    job_id: jobs.find(
                        j => j.id === Number(JobId)
                    )
                        ? {
                            value: Number(JobId),
                            label: `${job.customer?.party_name} • ${job.pickup_location} → ${job.dropoff_location}`,
                            route: job.route,
                        }
                        : null,
                    job_date: job.job_date?.slice(0, 10),
                    goods_type: goodsOptions.find(g => g.value === job.goods_type),
                    goods_quantity: job.goods_quantity,
                    quantity_units: unitOptions.find(u => u.value === job.quantity_units),
                    pickup_location: job.pickup_location,
                    dropoff_location: job.dropoff_location,
                    status: job.status ?? 1, // ✅ important
                    route_id: job.route.id,
                });

            } catch (err) {
                toast.error("Failed to load job details");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    /* -------------------- HANDLERS -------------------- */

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            job_date: formData.job_date,
            goods_type: formData.goods_type?.value,
            goods_quantity: formData.goods_quantity,
            quantity_units: formData.quantity_units?.value,
            pickup_location: formData.pickup_location,
            dropoff_location: formData.dropoff_location,
            status: formData.status, // ✅ added
            route_id: formData.route_id,
        };

        try {
            await UpdateJob(id, payload);
            toast.success("Job updated successfully");
            navigate("/jobs");
        } catch (err) {
            toast.error("Failed to update job");
        }
    };

    if (loading) {
        return (
            <div className="py-20 text-center text-gray-500">
                Loading job details...
            </div>
        );
    }

    const selectStyles = {
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
    }

    /* -------------------- UI -------------------- */

    return (
        <div className="max-w-5xl mx-auto">
            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-[--color-fleet-text-primary]">
                    Update Job
                </h1>
                <p className="text-sm text-[--color-fleet-text-secondary]">
                    Modify customer job and shipment details
                </p>
            </div>

            {/* FORM */}
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl px-8 py-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* CUSTOMER */}
                    <div>
                        <label className="text-xs font-medium text-gray-500">
                            Customer
                        </label>
                        <Select
                            options={partyOptions}
                            value={formData.customer_id}
                            isDisabled={true}   // ✅ disable dropdown
                            styles={{
                                ...reactSelectStyle,
                                control: (base) => ({
                                    ...base,
                                    backgroundColor: "#f3f4f6", // light disabled look
                                    cursor: "not-allowed",
                                }),
                            }}
                            className="mt-1"
                        />

                    </div>

                    <div>
                        <label className="label">Job</label>
                         {console.log("formdata job id====", formData.job_id)}
                        <Select
                            styles={selectStyles}
                            value={formData.job_id}
                            isDisabled={true}
                            placeholder="Select job"
                            options={jobs.map(j => ({
                                value: j.id,
                                label: `${j.customer?.party_name} • ${j.pickup_location} → ${j.dropoff_location}`,
                                route: j.route,
                            }))}
                        />
                    </div>
                    {/* Route */}
                    <div>
                        <label className="text-xs font-medium text-gray-500">
                            Route
                        </label>

                        <Select
                            options={routeOptions}
                            value={routeOptions.find(
                                opt => opt.value === formData.route_id
                            )}
                            onChange={(val) =>
                                handleChange("route_id", val?.value)
                            }
                            placeholder="Select route"
                            className="mt-1 text-sm"
                            styles={reactSelectStyle}
                        />
                    </div>


                    {/* JOB DATE */}
                    <div>
                        <label className="text-xs font-medium text-gray-500">
                            Job Date
                        </label>
                        <input
                            type="date"
                            value={formData.job_date}
                            onChange={(e) =>
                                handleChange("job_date", e.target.value)
                            }
                            className="w-full mt-1 bg-gray-50 px-3 py-2 rounded-md text-sm
                focus:outline-none focus:ring-2 focus:ring-[--color-fleet-primary]"
                        />
                    </div>
                    {/* STATUS */}
                    <div>
                        <label className="text-xs font-medium text-gray-500 block mb-2">
                            Job Status
                        </label>

                        <div className="flex items-center gap-6 text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    value={1}
                                    checked={formData.status === 1}
                                    onChange={() => handleChange("status", 1)}
                                />
                                Active
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    value={0}
                                    checked={formData.status === 0}
                                    onChange={() => handleChange("status", 0)}
                                />
                                Inactive
                            </label>
                        </div>
                    </div>


                    {/* GOODS TYPE */}
                    <div>
                        <label className="text-xs font-medium text-gray-500">
                            Goods Type
                        </label>
                        {console.log("formData.goods_type", formData.goods_type)}
                        <Select
                            options={goodsOptions}
                            value={formData.goods_type}
                            onChange={(val) => handleChange("goods_type", val)}
                            styles={reactSelectStyle}
                            className="mt-1"
                        />
                    </div>

                    {/* QUANTITY */}
                    <div>
                        <label className="text-xs font-medium text-gray-500">
                            Goods Quantity
                        </label>
                        <input
                            type="number"
                            value={formData.goods_quantity}
                            onChange={(e) =>
                                handleChange("goods_quantity", e.target.value)
                            }
                            className="w-full mt-1 bg-gray-50 px-3 py-2 rounded-md text-sm
                focus:outline-none focus:ring-2 focus:ring-[--color-fleet-primary]"
                        />
                    </div>

                    {/* UNIT */}
                    <div>
                        <label className="text-xs font-medium text-gray-500">
                            Quantity Unit
                        </label>
                        <Select
                            options={unitOptions}
                            value={formData.quantity_units}
                            onChange={(val) =>
                                handleChange("quantity_units", val)
                            }
                            styles={reactSelectStyle}
                            className="mt-1"
                        />
                    </div>

                    {/* PICKUP */}
                    <div>
                        <label className="text-xs font-medium text-gray-500">
                            Pickup Location
                        </label>
                        <input
                            type="text"
                            value={formData.pickup_location}
                            onChange={(e) =>
                                handleChange("pickup_location", e.target.value)
                            }
                            className="w-full mt-1 bg-gray-50 px-3 py-2 rounded-md text-sm
                focus:outline-none focus:ring-2 focus:ring-[--color-fleet-primary]"
                        />
                    </div>

                    {/* DROP */}
                    <div>
                        <label className="text-xs font-medium text-gray-500">
                            Drop-off Location
                        </label>
                        <input
                            type="text"
                            value={formData.dropoff_location}
                            onChange={(e) =>
                                handleChange("dropoff_location", e.target.value)
                            }
                            className="w-full mt-1 bg-gray-50 px-3 py-2 rounded-md text-sm
                focus:outline-none focus:ring-2 focus:ring-[--color-fleet-primary]"
                        />
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-4 mt-10">
                    <button
                        type="button"
                        onClick={() => navigate("/jobs")}
                        className="text-sm text-gray-600 hover:text-black"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="px-6 py-2 rounded-md bg-[hsl(208,79%,51%)]
              text-white text-sm hover:bg-[--color-fleet-primary-dark]"
                    >
                        Update Job
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateJobs;
