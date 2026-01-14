import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addNewCompany } from "../../../services/companiesService/companiesService";
import toast from "react-hot-toast";

const AddNewCompany = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    company_code: "",
    company_email: "",
    address: "",
    contact_person: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const response = await addNewCompany(formData);
    setLoading(false);

    if (response?.success) {
      toast.success("Company created successfully");
      navigate("/companies");
    }
  };

  return (
    <div className="min-h-screen bg-fleet-bg p-6 flex justify-center">
      <div className="w-full max-w-3xl rounded-lg bg-fleet-card border border-fleet-border p-6">
        <h2 className="text-xl font-semibold text-fleet-text-primary mb-6">
          Add New Company
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company Name */}
          <div>
            <label className="block text-sm text-fleet-text-secondary mb-1">
              Company Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-fleet-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fleet-primary"
            />
          </div>

          {/* Company Code */}
          <div>
            <label className="block text-sm text-fleet-text-secondary mb-1">
              Company Code
            </label>
            <input
              type="text"
              name="company_code"
              value={formData.company_code}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-fleet-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fleet-primary"
            />
          </div>

          {/* Company Email */}
          <div>
            <label className="block text-sm text-fleet-text-secondary mb-1">
              Company Email
            </label>
            <input
              type="email"
              name="company_email"
              value={formData.company_email}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-fleet-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fleet-primary"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm text-fleet-text-secondary mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full rounded-md border border-fleet-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fleet-primary"
            />
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-sm text-fleet-text-secondary mb-1">
              Contact Person
            </label>
            <input
              type="text"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
              className="w-full rounded-md border border-fleet-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fleet-primary"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/companies")}
              className="rounded-md border border-fleet-border px-4 py-2 text-sm text-fleet-text-secondary hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-fleet-primary px-5 py-2 text-sm font-medium text-white hover:bg-fleet-primary-dark disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewCompany;
