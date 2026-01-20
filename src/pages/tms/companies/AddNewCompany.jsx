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
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-8 flex justify-center items-start">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm border border-slate-200">

        {/* Header */}
        <div className="border-b border-slate-200 px-8 py-5">
          <h2 className="text-2xl font-semibold text-slate-800">
            Create New Company
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Company and Company Admin will be created together
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">

          {/* ================= COMPANY DETAILS ================= */}
          <div>
            <h3 className="text-lg font-medium text-slate-700 mb-4">
              Company Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Company Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input"
              />

              <input
                type="text"
                name="company_code"
                placeholder="Company Code"
                value={formData.company_code}
                onChange={handleChange}
                required
                className="input"
              />

              <input
                type="email"
                name="company_email"
                placeholder="Company Email"
                value={formData.company_email}
                onChange={handleChange}
                required
                className="input"
              />

              <input
                type="text"
                name="contact_person"
                placeholder="Contact Person"
                value={formData.contact_person}
                onChange={handleChange}
                className="input"
              />
            </div>

            <textarea
              name="address"
              placeholder="Company Address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="input mt-4"
            />
          </div>

          {/* ================= COMPANY ADMIN DETAILS ================= */}
          <div>
            <h3 className="text-lg font-medium text-slate-700 mb-4">
              Company Admin Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="Adminname"
                placeholder="Admin Name"
                value={formData.Adminname}
                onChange={handleChange}
                required
                className="input"
              />

              <input
                type="email"
                name="Adminemail"
                placeholder="Admin Email"
                value={formData.Adminemail}
                onChange={handleChange}
                required
                className="input"
              />

              <input
                type="text"
                name="Adminphone"
                placeholder="Admin Phone"
                value={formData.Adminphone}
                onChange={handleChange}
                className="input"
              />

              <input
                type="password"
                name="Adminpassword"
                placeholder="Admin Password"
                value={formData.Adminpassword}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            <p className="text-xs text-slate-500 mt-2">
              * This user will be created as <strong>Company Admin</strong> automatically.
            </p>
          </div>

          {/* ================= ACTIONS ================= */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate("/companies")}
              className="px-5 py-2 text-sm rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm rounded-md bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60"
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
