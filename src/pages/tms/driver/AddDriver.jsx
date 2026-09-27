
import React, { useState } from "react";
import { createNewDriver } from "../../../services/driverService/driverService";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddDriver = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Basic details
    driver_code: "",
    driver_category: "",
    name: "",
    date_of_birth: "",

    // Identity
    aadhaar_number: "",
    pan_number: "",

    // Contact
    phone_number: "",
    home_phone_number: "",
    email_address: "",
    password: "",

    // Address
    address_line_1: "",
    address_line_2: "",
    city_town_village_name: "",
    state_province_region_name: "",
    country_name: "India",
    pin_code: "",

    // License
    driver_license_number: "",
    license_issue_date: "",
    driver_license_expiry_date: "",

    // Other
    remarks: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: value,
      };

      // Auto-generate Driver Code
      if (name === "name" || name === "phone_number") {
        const phone = updatedData.phone_number
          .replace(/\D/g, "")
          .slice(0, 5);

        const firstName = updatedData.name
          .trim()
          .split(/\s+/)[0]
          .replace(/[^a-zA-Z]/g, "")
          .toUpperCase();

        if (phone.length === 5 && firstName.length > 0) {
          updatedData.driver_code = `DRV-${phone}-${firstName}`;
        } else {
          updatedData.driver_code = "";
        }
      }

      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ================================
    // REQUIRED FIELD CHECK
    // ================================

    if (!formData.driver_category) {
      toast.error("Please select driver category");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Driver name is required");
      return;
    }

    if (!formData.date_of_birth) {
      toast.error("Date of birth is required");
      return;
    }

    if (!/^[0-9]{12}$/.test(formData.aadhaar_number)) {
      toast.error("Enter a valid 12-digit Aadhaar number");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone_number)) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }

    // ================================
    // SUBMIT
    // ================================

    try {
      setLoading(true);

      const payload = {
        ...formData,

        driver_code: formData.driver_code || null,
        pan_number: formData.pan_number || null,
        home_phone_number: formData.home_phone_number || null,
        email_address: formData.email_address || null,

        address_line_1: formData.address_line_1 || null,
        address_line_2: formData.address_line_2 || null,
        city_town_village_name:
          formData.city_town_village_name || null,
        state_province_region_name:
          formData.state_province_region_name || null,
        country_name: formData.country_name || null,
        pin_code: formData.pin_code || null,

        driver_license_number:
          formData.driver_license_number || null,
        license_issue_date:
          formData.license_issue_date || null,
        driver_license_expiry_date:
          formData.driver_license_expiry_date || null,

        remarks: formData.remarks || null,
        password: formData.password || undefined,
      };

      const res = await createNewDriver(payload);

      if (res?.success) {
        toast.success("Driver added successfully");
        navigate("/drivers");
      } else {
        toast.error(res?.message || "Failed to create driver");
      }
    } catch (error) {
      console.error("Create Driver Error:", error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to create driver"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#EEF2F7] px-6 py-10">
      <div className="mx-auto w-full max-w-6xl rounded-2xl bg-fleet-card p-8 shadow-xl shadow-slate-200/60 md:p-10">

        {/* ================= HEADER ================= */}

        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-fleet-text-primary">
            Add Driver
          </h1>

          <p className="mt-2 text-sm text-fleet-text-secondary">
            Create and manage drivers in your fleet system
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* ================= BASIC DETAILS ================= */}

          <SectionTitle
            title="Basic Details"
            description="Enter the driver's basic information"
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            <SelectField
              label="Driver Category"
              name="driver_category"
              value={formData.driver_category}
              onChange={handleChange}
              required
              options={[
                { value: "DRIVER_1", label: "Driver 1" },
                { value: "DRIVER_2", label: "Driver 2" },
                { value: "CLEANER", label: "Cleaner" },
                { value: "HELPER", label: "Helper" },
              ]}
            />

            <div>
              <Label label="Driver Code" />

              <input
                type="text"
                name="driver_code"
                value={formData.driver_code}
                placeholder="Auto-generated"
                readOnly
                className="input bg-slate-50 cursor-not-allowed"
              />

              <p className="mt-1 text-xs text-slate-400">
                Automatically generated from mobile number and driver name
              </p>
            </div>
            <Field
              label="Driver Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter driver name"
              required
            />

            <div>
              <Label label="Date of Birth" required />

              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                required
                className="input"
              />
            </div>
          </div>

          {/* ================= IDENTITY ================= */}

          <SectionTitle
            title="Identity Details"
            description="Government identity information"
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            <Field
              label="Aadhaar Number"
              name="aadhaar_number"
              value={formData.aadhaar_number}
              onChange={handleChange}
              placeholder="12-digit Aadhaar number"
              maxLength={12}
              inputMode="numeric"
              required
            />

            <Field
              label="PAN Number"
              name="pan_number"
              value={formData.pan_number}
              onChange={handleChange}
              placeholder="ABCDE1234F"
              maxLength={10}
              style={{ textTransform: "uppercase" }}
            />
          </div>

          {/* ================= CONTACT ================= */}

          <SectionTitle
            title="Contact Details"
            description="Driver contact and login information"
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            <Field
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="10-digit phone number"
              maxLength={10}
              inputMode="numeric"
              required
            />

            <Field
              label="Home Phone Number"
              name="home_phone_number"
              value={formData.home_phone_number}
              onChange={handleChange}
              placeholder="Optional"
              maxLength={10}
              inputMode="numeric"
            />

            <Field
              label="Email Address"
              name="email_address"
              type="email"
              value={formData.email_address}
              onChange={handleChange}
              placeholder="driver@example.com"
            />

            <Field
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>

          {/* ================= ADDRESS ================= */}

          <SectionTitle
            title="Address"
            description="Driver's current residential address"
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            <Field
              label="Address Line 1"
              name="address_line_1"
              value={formData.address_line_1}
              onChange={handleChange}
              placeholder="House / Street / Area"
            />

            <Field
              label="Address Line 2"
              name="address_line_2"
              value={formData.address_line_2}
              onChange={handleChange}
              placeholder="Landmark / Locality"
            />

            <Field
              label="City / Town / Village"
              name="city_town_village_name"
              value={formData.city_town_village_name}
              onChange={handleChange}
              placeholder="Enter city"
            />

            <Field
              label="State"
              name="state_province_region_name"
              value={formData.state_province_region_name}
              onChange={handleChange}
              placeholder="Enter state"
            />

            <Field
              label="Country"
              name="country_name"
              value={formData.country_name}
              onChange={handleChange}
              placeholder="India"
            />

            <Field
              label="PIN Code"
              name="pin_code"
              value={formData.pin_code}
              onChange={handleChange}
              placeholder="6-digit PIN"
              maxLength={6}
              inputMode="numeric"
            />
          </div>

          {/* ================= LICENSE ================= */}

          <SectionTitle
            title="Driving License"
            description="License details are optional for Cleaner / Helper"
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            <Field
              label="License Number"
              name="driver_license_number"
              value={formData.driver_license_number}
              onChange={handleChange}
              placeholder="Enter license number"
            />

            <div>
              <Label label="License Issue Date" />

              <input
                type="date"
                name="license_issue_date"
                value={formData.license_issue_date}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                className="input"
              />
            </div>

            <div>
              <Label label="License Expiry Date" />

              <input
                type="date"
                name="driver_license_expiry_date"
                value={formData.driver_license_expiry_date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="input"
              />
            </div>
          </div>

          {/* ================= REMARKS ================= */}

          <SectionTitle
            title="Additional Information"
            description="Optional notes about the driver"
          />

          <div>
            <Label label="Remarks" />

            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Enter any additional remarks"
              rows={4}
              className="input resize-none"
            />
          </div>

          {/* ================= ACTIONS ================= */}

          <div className="flex justify-end gap-4 border-t border-slate-100 pt-8">

            <button
              type="button"
              onClick={() => navigate("/drivers")}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-7 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-fleet-primary to-fleet-accent px-8 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Driver"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

/* ============================================
   SECTION TITLE
============================================ */

const SectionTitle = ({ title, description }) => (
  <div className="border-b border-slate-100 pb-3">
    <h2 className="text-lg font-semibold text-fleet-text-primary">
      {title}
    </h2>

    <p className="mt-1 text-sm text-fleet-text-secondary">
      {description}
    </p>
  </div>
);

/* ============================================
   LABEL
============================================ */

const Label = ({ label, required }) => (
  <label className="text-xs font-medium uppercase tracking-wide text-fleet-text-muted">
    {label}

    {required && (
      <span className="ml-1 text-red-500">*</span>
    )}
  </label>
);

/* ============================================
   INPUT FIELD
============================================ */

const Field = ({
  label,
  required = false,
  ...props
}) => (
  <div>
    <Label
      label={label}
      required={required}
    />

    <input
      {...props}
      required={required}
      className="input"
    />
  </div>
);

/* ============================================
   SELECT FIELD
============================================ */

const SelectField = ({
  label,
  required = false,
  options = [],
  ...props
}) => (
  <div>
    <Label
      label={label}
      required={required}
    />

    <select
      {...props}
      required={required}
      className="input"
    >
      <option value="">
        Select {label}
      </option>

      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default AddDriver;

