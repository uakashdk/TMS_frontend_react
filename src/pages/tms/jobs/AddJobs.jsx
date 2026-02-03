import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AddJob } from "../../../services/jobService/JobService";
import { getPartyDropdown } from "../../../services/PartyModule/PartyService";

const unitOptions = [
    { value: "LTR", label: "Liters (LTR)" },
    { value: "KG", label: "Kilograms (KG)" },
    { value: "TON", label: "Tons (TON)" },
];

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


const goodsOptions = [
    { value: "liquid", label: "Liquid" },
    { value: "solid", label: "Solid" },
    { value: "gas", label: "Gas" },
];

const AddJobs = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        customer_id: null,
        job_date: "",
        goods_type: null,
        goods_quantity: "",
        quantity_units: unitOptions[0],
        pickup_location: "",
        dropoff_location: "",
    });
    const [partyOptions, setPartyOptions] = useState([]);


    useEffect(() => {
        const fetchParties = async () => {
            const res = await getPartyDropdown();

            const options = res?.data
                ?.filter((party) => party.party_type === "client")
                .map((party) => ({
                    value: party.party_id,   // ✅ send party_id
                    label: party.party_name,
                }));

            setPartyOptions(options || []);



            setPartyOptions(options || []);
        };

        fetchParties();
    }, []);


    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            customer_id: formData.customer_id,
            job_date: formData.job_date,
            goods_type: formData.goods_type?.value,
            goods_quantity: formData.goods_quantity,
            quantity_units: formData.quantity_units?.value,
            pickup_location: formData.pickup_location,
            dropoff_location: formData.dropoff_location,
        };

        try {
            await AddJob(payload);
            toast.success("Job created successfully");
            navigate("/jobs");
        } catch (err) { }
    };

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-[--color-fleet-text-primary]">
                    Create Job
                </h1>
                <p className="text-sm text-[--color-fleet-text-secondary]">
                    Enter shipment and pickup–drop details
                </p>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl px-8 py-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Customer ID */}
                    <div>
                        <label className="text-xs font-medium text-gray-500">
                            Customer
                        </label>

                        <Select
                            options={partyOptions}
                            value={partyOptions.find(
                                (opt) => opt.value === formData.customer_id
                            )}
                            onChange={(val) =>
                                handleChange("customer_id", val?.value)
                            }
                            placeholder="Select customer"
                            className="mt-1 text-sm"
                            styles={reactSelectStyle}
                        />

                    </div>


                    {/* Job Date */}
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

                    {/* Goods Type */}
                    <div>
                        <label className="text-xs font-medium text-gray-500">
                            Goods Type
                        </label>
                        <Select
                            options={goodsOptions}
                            value={formData.goods_type}
                            onChange={(val) => handleChange("goods_type", val)}
                            placeholder="Select goods type"
                            className="mt-1 text-sm"
                            styles={reactSelectStyle}
                        />
                    </div>

                    {/* Quantity */}
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
                            placeholder="Enter quantity"
                            className="w-full mt-1 bg-gray-50 px-3 py-2 rounded-md text-sm
                         focus:outline-none focus:ring-2 focus:ring-[--color-fleet-primary]"
                        />
                    </div>

                    {/* Unit */}
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
                            className="mt-1 text-sm"
                            styles={reactSelectStyle}
                        />
                    </div>

                    {/* Pickup */}
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
                            placeholder="Pickup city"
                            className="w-full mt-1 bg-gray-50 px-3 py-2 rounded-md text-sm
                         focus:outline-none focus:ring-2 focus:ring-[--color-fleet-primary]"
                        />
                    </div>

                    {/* Drop */}
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
                            placeholder="Drop city"
                            className="w-full mt-1 bg-gray-50 px-3 py-2 rounded-md text-sm
                         focus:outline-none focus:ring-2 focus:ring-[--color-fleet-primary]"
                        />
                    </div>
                </div>

                {/* Actions */}
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
                        className="px-6 py-2 rounded-md bg-[rgb(30,136,229)] text-white text-sm hover:bg-[--color-fleet-primary-dark]"
                    >
                        Create Job
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddJobs;
