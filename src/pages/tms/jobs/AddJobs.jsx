import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AddJob } from "../../../services/jobService/JobService";
import { getPartyDropdown } from "../../../services/PartyModule/PartyService";
import { getRouteDropdown } from "../../../services/RouteService/RouteService";
import { getAllRateContract } from "../../../services/RateContract/RateContract";
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
    route_id: null,
    is_party_advance_required: false,
    rate_contract_id: null,
    rate_type: "",
    rate_value: "",
    freight_amount: 0,
    freight_basis_value: "",

  });
  const [partyOptions, setPartyOptions] = useState([]);
  const [routeOptions, setRouteOptions] = useState([]);
  const [rateContractOptions, setRateContractOptions] = useState([]);

  useEffect(() => {
    const fetchRateContracts = async () => {
      try {
        if (!formData.customer_id || !formData.route_id) {
          setRateContractOptions([]);

          setFormData((prev) => ({
            ...prev,
            rate_contract_id: null,
            rate_type: "",
            rate_value: "",
            freight_amount: 0,
            freight_basis_value: "",
          }));

          return;
        }

        const res = await getAllRateContract({
          party_id: formData.customer_id,
          route_id: formData.route_id,
          page: 1,
          limit: 100,
        });

        const contracts =
          res?.data?.map((rc) => ({
            value: rc.id,
            label: `${rc.freight_basis} - ₹${rc.rate}`,
            rate: rc.rate,
            freight_basis: rc.freight_basis,
            freight_basis_value: rc.freight_basis_value,
            effective_from: rc.effective_from,
            effective_to: rc.effective_to,
          })) || [];

        setRateContractOptions(contracts);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load rate contracts");
        setRateContractOptions([]);
      }
    };

    fetchRateContracts();
  }, [formData.customer_id, formData.route_id]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const partyRes = await getPartyDropdown();
      const routeRes = await getRouteDropdown();

      const parties = partyRes?.data
        ?.filter(p => p.party_type === "client")
        .map(p => ({
          value: p.party_id,
          label: p.party_name,
        }));

      const routes = routeRes?.data?.map(r => ({
        value: r.id,
        label: `${r.source_city} → ${r.destination_city}`,
        distance: r.distance_km,
      }));

      setPartyOptions(parties || []);
      setRouteOptions(routes || []);
    };

    fetchInitialData();
  }, []);


  const handleChange = (name, value) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (
        name === "customer_id" ||
        name === "route_id"
      ) {
        updated.rate_contract_id = null;
        updated.rate_type = "";
        updated.rate_value = "";
        updated.freight_amount = 0;
        updated.freight_basis_value = "";
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.customer_id) {
    return toast.error("Please select client");
  }

  if (!formData.route_id) {
    return toast.error("Please select route");
  }

  if (!formData.rate_contract_id) {
    return toast.error("Please select rate contract");
  }

  const payload = {
    customer_id: formData.customer_id,
    job_date: formData.job_date,

    goods_type: formData.goods_type?.value,
    goods_quantity: Number(formData.goods_quantity || 0),
    quantity_units: formData.quantity_units?.value,

    pickup_location: formData.pickup_location,
    dropoff_location: formData.dropoff_location,

    route_id: formData.route_id,

    is_party_advance_required:
      formData.is_party_advance_required,

    rate_contract_id: formData.rate_contract_id,

    rate_type: formData.rate_type,
    rate_value: Number(formData.rate_value || 0),

    freight_basis_value: Number(
      formData.freight_basis_value || 0
    ),

    freight_amount: Number(
      formData.freight_amount || 0
    ),
  };

  try {
    await AddJob(payload);

    toast.success(
      "Job created successfully"
    );

    navigate("/jobs");
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Create New Job
        </h1>
        <p className="text-slate-500 mt-1">
          Create shipment request and assign commercial details
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Basic Details */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Client
              </label>

              <Select
                options={partyOptions}
                value={partyOptions.find(
                  x => x.value === formData.customer_id
                )}
                onChange={(val) =>
                  handleChange(
                    "customer_id",
                    val?.value
                  )
                }
                styles={reactSelectStyle}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Job Date
              </label>

              <input
                type="date"
                value={formData.job_date}
                onChange={(e) =>
                  handleChange(
                    "job_date",
                    e.target.value
                  )
                }
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Route Details */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">
            Route Information
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Route
              </label>

              <Select
                options={routeOptions}
                value={routeOptions.find(
                  x => x.value === formData.route_id
                )}
                onChange={(val) =>
                  handleChange(
                    "route_id",
                    val?.value
                  )
                }
                styles={reactSelectStyle}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Pickup Location
              </label>

              <input
                type="text"
                value={formData.pickup_location}
                onChange={(e) =>
                  handleChange(
                    "pickup_location",
                    e.target.value
                  )
                }
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Drop Location
              </label>

              <input
                type="text"
                value={formData.dropoff_location}
                onChange={(e) =>
                  handleChange(
                    "dropoff_location",
                    e.target.value
                  )
                }
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Commercial Details */}
        {formData.customer_id &&
          formData.route_id && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">
                Commercial Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Rate Contract
                  </label>

                  <Select
                    options={rateContractOptions}
                    value={rateContractOptions.find(
                      x =>
                        x.value ===
                        formData.rate_contract_id
                    )}
                    onChange={(selected) => {
                      if (!selected) return;

                      setFormData((prev) => ({
                        ...prev,
                        rate_contract_id:
                          selected.value,
                        rate_type:
                          selected.freight_basis,
                        rate_value:
                          selected.rate,
                        freight_basis_value:
                          selected.freight_basis_value ||
                          1,
                        freight_amount:
                          selected.rate,
                      }));
                    }}
                    styles={reactSelectStyle}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Rate Type
                  </label>

                  <input
                    value={formData.rate_type}
                    readOnly
                    className="w-full h-11 px-4 rounded-xl border bg-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Rate Value
                  </label>

                  <input
                    value={formData.rate_value}
                    readOnly
                    className="w-full h-11 px-4 rounded-xl border bg-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Freight Amount
                  </label>

                  <input
                    value={formData.freight_amount}
                    readOnly
                    className="w-full h-11 px-4 rounded-xl border bg-green-50 font-semibold text-green-700"
                  />
                </div>
              </div>
            </div>
          )}

        {/* Shipment Details */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">
            Shipment Details
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Goods Type
              </label>

              <Select
                options={goodsOptions}
                value={formData.goods_type}
                onChange={(val) =>
                  handleChange("goods_type", val)
                }
                styles={reactSelectStyle}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Quantity
              </label>

              <input
                type="number"
                value={formData.goods_quantity}
                onChange={(e) =>
                  handleChange(
                    "goods_quantity",
                    e.target.value
                  )
                }
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Unit
              </label>

              <Select
                options={unitOptions}
                value={formData.quantity_units}
                onChange={(val) =>
                  handleChange(
                    "quantity_units",
                    val
                  )
                }
                styles={reactSelectStyle}
              />
            </div>
          </div>
        </div>

        {/* Advance */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Advance Requirement
          </h2>

          <div className="flex gap-8">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={
                  formData.is_party_advance_required
                }
                onChange={() =>
                  handleChange(
                    "is_party_advance_required",
                    true
                  )
                }
              />
              Yes
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={
                  !formData.is_party_advance_required
                }
                onChange={() =>
                  handleChange(
                    "is_party_advance_required",
                    false
                  )
                }
              />
              No
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/jobs")}
            className="px-6 py-3 rounded-xl border border-slate-300"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Create Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddJobs;
