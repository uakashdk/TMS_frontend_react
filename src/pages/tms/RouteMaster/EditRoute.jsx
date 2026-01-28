import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  editRoute,
  getRouteById,
} from "../../../services/RouteService/RouteService";

const EditRoute = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [formData, setFormData] = useState({
    route_name: "",
    source_city: "",
    destination_city: "",
    distance_km: "",
    estimated_travel_time_minutes: "",
    status: true,
  });

  useEffect(() => {
    fetchRouteDetails();
  }, []);

  const fetchRouteDetails = async () => {
    try {
      const res = await getRouteById(id);
      setFormData({
        route_name: res.data.route_name,
        source_city: res.data.source_city,
        destination_city: res.data.destination_city,
        distance_km: res.data.distance_km,
        estimated_travel_time_minutes:
          res.data.estimated_travel_time_minutes,
        status: res.data.status,
      });
    } catch (error) {
      navigate(-1);
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await editRoute(id, {
        ...formData,
        distance_km: Number(formData.distance_km),
        estimated_travel_time_minutes: Number(
          formData.estimated_travel_time_minutes
        ),
      });

      toast.success("Route updated successfully");
      navigate("/routes");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-fleet-text-secondary">
        Loading route details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#F8FAFC] to-[#EEF2F7] px-6 py-10">

      {/* Page Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-semibold text-fleet-text-primary">
          Edit Route
        </h1>
        <p className="text-fleet-text-secondary mt-2">
          Update route details and operational status
        </p>
      </div>

      {/* Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">

          {/* Route Info */}
          <Section title="Route Information">
            <ModernInput
              label="Route Name"
              name="route_name"
              value={formData.route_name}
              onChange={handleChange}
            />
          </Section>

          {/* Cities */}
          <Section title="Cities">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ModernInput
                label="Source City"
                name="source_city"
                value={formData.source_city}
                onChange={handleChange}
              />
              <ModernInput
                label="Destination City"
                name="destination_city"
                value={formData.destination_city}
                onChange={handleChange}
              />
            </div>
          </Section>

          {/* Metrics */}
          <Section title="Route Metrics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ModernInput
                label="Distance (KM)"
                name="distance_km"
                type="number"
                value={formData.distance_km}
                onChange={handleChange}
              />
              <ModernInput
                label="Estimated Time (Minutes)"
                name="estimated_travel_time_minutes"
                type="number"
                value={formData.estimated_travel_time_minutes}
                onChange={handleChange}
              />
            </div>
          </Section>

          {/* Status */}
          <Section title="Status">
            <StatusToggle
              enabled={formData.status}
              onChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            />
          </Section>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-lg border bg-white hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg text-white font-medium
                         bg-fleet-primary hover:bg-(--color-fleet-primary-dark)
                         shadow-md disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Route"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoute;


const Section = ({ title, children }) => (
  <div>
    <h2 className="text-lg font-semibold text-fleet-text-primary mb-4">
      {title}
    </h2>
    {children}
  </div>
);

const ModernInput = ({
  label,
  name,
  value,
  onChange,
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
      required
      className="
        w-full rounded-xl border border-slate-300
        px-4 py-3 text-sm
        focus:outline-none focus:border-fleet-primary
        focus:ring-1 focus:ring-fleet-primary
      "
    />
  </div>
);

const StatusToggle = ({ enabled, onChange }) => (
  <div className="flex items-center gap-4">
    <span className="text-sm text-fleet-text-secondary">
      {enabled ? "Active" : "Inactive"}
    </span>

    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full
        transition ${
          enabled ? "bg-fleet-primary" : "bg-slate-300"
        }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition
          ${enabled ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  </div>
);

