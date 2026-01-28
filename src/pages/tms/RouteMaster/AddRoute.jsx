import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addRoute } from "../../../services/RouteService/RouteService";
import toast from "react-hot-toast";

const AddRoute = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    route_name: "",
    source_city: "",
    destination_city: "",
    distance_km: "",
    estimated_travel_time_minutes: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addRoute({
        ...formData,
        distance_km: Number(formData.distance_km),
        estimated_travel_time_minutes: Number(
          formData.estimated_travel_time_minutes
        ),
      });

      toast.success("Route created successfully");
      navigate("/routes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#F8FAFC] to-[#EEF2F7] px-6 py-10">

      {/* Page Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-semibold text-fleet-text-primary">
          Create Route
        </h1>
        <p className="text-fleet-text-secondary mt-2">
          Define a new transport route for operations & billing
        </p>
      </div>

      {/* Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200">

        <form onSubmit={handleSubmit} className="p-8 space-y-8">

          {/* Section: Route Info */}
          <div>
            <h2 className="text-lg font-semibold text-fleet-text-primary mb-4">
              Route Information
            </h2>

            <div className="space-y-5">
              <ModernInput
                label="Route Name"
                name="route_name"
                placeholder="Mumbai → Punjab"
                value={formData.route_name}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Section: Cities */}
          <div>
            <h2 className="text-lg font-semibold text-fleet-text-primary mb-4">
              Cities
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ModernInput
                label="Source City"
                name="source_city"
                placeholder="Mumbai"
                value={formData.source_city}
                onChange={handleChange}
              />

              <ModernInput
                label="Destination City"
                name="destination_city"
                placeholder="Punjab"
                value={formData.destination_city}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Section: Metrics */}
          <div>
            <h2 className="text-lg font-semibold text-fleet-text-primary mb-4">
              Route Metrics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ModernInput
                label="Distance (KM)"
                name="distance_km"
                type="number"
                placeholder="566"
                value={formData.distance_km}
                onChange={handleChange}
              />

              <ModernInput
                label="Estimated Time (Minutes)"
                name="estimated_travel_time_minutes"
                type="number"
                placeholder="720"
                value={formData.estimated_travel_time_minutes}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-lg text-sm border bg-white hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg text-sm font-medium text-white
                         bg-fleet-primary hover:bg-(--color-fleet-primary-dark)
                         shadow-md disabled:opacity-60"
            >
              {loading ? "Saving..." : "Create Route"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoute;

const ModernInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="
        w-full rounded-xl border border-slate-300
        bg-white px-4 py-3 text-sm
        focus:outline-none focus:border-fleet-primary
        focus:ring-1 focus:ring-fleet-primary
        transition
      "
    />
  </div>
);

