import React, { useEffect, useState } from "react";
import { createRateContract } from "../../../services/RateContract/RateContract";
import { getPartyDropdown } from "../../../services/PartyModule/PartyService";
import { getRouteDropdown } from "../../../services/RouteService/RouteService";
import { toast } from "react-hot-toast";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
const customSelectStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: "#f8fafc",
        border: "none",
        borderRadius: "12px",
        boxShadow: state.isFocused
            ? "0 0 0 2px #3b82f6"
            : "0 1px 2px rgba(0,0,0,0.05)",
        padding: "4px",
        transition: "all 0.2s ease",
        "&:hover": {
            backgroundColor: "#f1f5f9",
        },
    }),
    menu: (provided) => ({
        ...provided,
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? "#e2e8f0" : "white",
        color: "#1e293b",
        padding: "10px 14px",
        cursor: "pointer",
    }),
    placeholder: (provided) => ({
        ...provided,
        color: "#94a3b8",
    }),
};


const AddRateContract = () => {
    const [formData, setFormData] = useState({
        party_id: "",
        route_id: "",
        freight_basis: "PER_TRIP",
        rate: "",
        effective_from: "",
        effective_to: "",
    });

    const navigate = useNavigate();

    const [partyOptions, setPartyOptions] = useState([]);
    const [routeOptions, setRouteOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const partyRes = await getPartyDropdown();
                const routeRes = await getRouteDropdown();

                const parties = partyRes?.data
                    ?.filter((p) => p.party_type === "client")
                    .map((p) => ({
                        value: p.party_id,
                        label: p.party_name,
                    }));

                const routes = routeRes?.data?.map((r) => ({
                    value: r.id,
                    label: `${r.source_city} → ${r.destination_city}`,
                }));

                setPartyOptions(parties || []);
                setRouteOptions(routes || []);
            } catch (error) {
                toast.error("Failed to load dropdown data");
            }
        };

        fetchInitialData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.party_id) return "Please select a client";
        if (!formData.route_id) return "Please select a route";
        if (!formData.rate || formData.rate <= 0) return "Enter valid rate";
        if (!formData.effective_from) return "Select effective from date";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            toast.error(validationError);
            return;
        }

        try {
            setLoading(true);

            const payload = {
                ...formData,
                rate: Number(formData.rate),
                effective_to: formData.effective_to || null,
            };

            await createRateContract(payload);

            toast.success("Rate Contract Created Successfully");
            navigate("/rate-contract");
            setFormData({
                party_id: "",
                route_id: "",
                freight_basis: "PER_TRIP",
                rate: "",
                effective_from: "",
                effective_to: "",
            });
        } catch (error) {
            toast.error("Failed to create rate contract");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-slate-700 mb-6">
                    Add Rate Contract
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Client */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600">
                            Client
                        </label>

                        <Select
                            options={partyOptions}
                            styles={customSelectStyles}
                            placeholder="Select Client"
                            value={partyOptions.find(
                                (option) => option.value === formData.party_id
                            )}
                            onChange={(selected) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    party_id: selected?.value || "",
                                }))
                            }
                            isSearchable
                        />
                    </div>


                    {/* Route */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600">
                            Route
                        </label>

                        <Select
                            options={routeOptions}
                            styles={customSelectStyles}
                            placeholder="Select Route"
                            value={routeOptions.find(
                                (option) => option.value === formData.route_id
                            )}
                            onChange={(selected) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    route_id: selected?.value || "",
                                }))
                            }
                            isSearchable
                        />
                    </div>


                    {/* Freight Basis */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Freight Basis
                        </label>
                        <select
                            name="freight_basis"
                            value={formData.freight_basis}
                            onChange={handleChange}
                            className="w-full bg-slate-50 px-4 py-3 rounded-xl 
shadow-sm 
focus:outline-none 
focus:ring-2 focus:ring-blue-500 
transition-all duration-200 
text-slate-700 placeholder-slate-400"

                        >
                            <option value="PER_TRIP">Per Trip</option>
                            <option value="PER_TON">Per Ton</option>
                            <option value="PER_KM">Per KM</option>
                        </select>
                    </div>

                    {/* Rate */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Rate (₹)
                        </label>
                        <input
                            type="number"
                            name="rate"
                            value={formData.rate}
                            onChange={handleChange}
                            placeholder="Enter Rate"
                            className="w-full bg-slate-50 px-4 py-3 rounded-xl 
shadow-sm 
focus:outline-none 
focus:ring-2 focus:ring-blue-500 
transition-all duration-200 
text-slate-700 placeholder-slate-400"

                        />
                    </div>

                    {/* Effective From */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Effective From
                        </label>
                        <input
                            type="date"
                            name="effective_from"
                            value={formData.effective_from}
                            onChange={handleChange}
                            className="w-full bg-slate-50 px-4 py-3 rounded-xl 
shadow-sm 
focus:outline-none 
focus:ring-2 focus:ring-blue-500 
transition-all duration-200 
text-slate-700 placeholder-slate-400"

                        />
                    </div>

                    {/* Effective To */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Effective To (Optional)
                        </label>
                        <input
                            type="date"
                            name="effective_to"
                            value={formData.effective_to}
                            onChange={handleChange}
                            className="w-full bg-slate-50 px-4 py-3 rounded-xl 
shadow-sm 
focus:outline-none 
focus:ring-2 focus:ring-blue-500 
transition-all duration-200 
text-slate-700 placeholder-slate-400"

                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            className="px-5 py-2 rounded-lg bg-slate-200 hover:bg-slate-300"
                            onClick={() =>
                                setFormData({
                                    party_id: "",
                                    route_id: "",
                                    freight_basis: "PER_TRIP",
                                    rate: "",
                                    effective_from: "",
                                    effective_to: "",
                                })
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Create Contract"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRateContract;
