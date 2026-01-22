import React, { useState } from "react";
import { createNewDriver } from "../../../services/driverService/driverService";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const AddDriver = () => {
  const [formData, setFormData] = useState({
    name: "",
    passowrd: "",
    phone_number: "",
    email_address: "",
    driver_license_number: "",
    driver_license_expiry_date: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await createNewDriver(formData);
    if (res?.success){
      navigate("/drivers")
       toast.success("Driver added successfully");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
      bg-linear-to-br from-[rgb(245,247,250)] to-[#EEF2F7] px-6">

      <div className="w-full max-w-4xl rounded-2xl
        bg-fleet-card
        shadow-xl shadow-slate-200/60 p-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight
            text-fleet-text-primary">
            Add Driver
          </h1>
          <p className="mt-2 text-sm
            text-fleet-text-secondary">
            Create and manage drivers in your fleet system
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">

            <Field
              label="Driver Name"
              placeholder="Anivarya Dubey"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <Field
              label="Phone Number"
              placeholder="9075982315"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
            />

            <Field
              label="Email Address"
              placeholder="driver@email.com"
              name="email_address"
              value={formData.email_address}
              onChange={handleChange}
            />

            <Field
              label="Password"
              type="password"
              placeholder="••••••••"
              name="passowrd"
              value={formData.passowrd}
              onChange={handleChange}
            />

            <Field
              label="License Number"
              placeholder="UP2838AnniA"
              name="driver_license_number"
              value={formData.driver_license_number}
              onChange={handleChange}
            />

            <div>
              <label className="text-xs font-medium uppercase tracking-wide
                text-fleet-text-muted">
                License Expiry
              </label>
              <input
                type="date"
                name="driver_license_expiry_date"
                value={formData.driver_license_expiry_date}
                onChange={handleChange}
                className="input mt-2"
              />
            </div>
          </div>

          {/* CTA */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="rounded-xl px-8 py-3 text-sm font-medium text-white
              bg-linear-to-r
              from-fleet-primary
              to-fleet-accent
              shadow-lg shadow-blue-500/30
              hover:scale-[1.02]
              active:scale-[0.98]
              transition-all"
            >
              Save Driver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDriver;

/* Small reusable field */
const Field = ({ label, ...props }) => (
  <div>
    <label className="text-xs font-medium uppercase tracking-wide text-fleet-text-muted">
      {label}
    </label>
    <input
      {...props}
      className="
        w-full
        mt-2
        rounded-xl
        bg-white
        px-4
        py-3
        text-sm
        text-fleet-text-primary
        shadow-sm
        border-0
        outline-none
        ring-0
        focus:ring-0
        focus:ring-offset-0
        focus:outline-none
        focus:shadow-md
        transition
      "
    />
  </div>
);

