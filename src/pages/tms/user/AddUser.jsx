import React, { useEffect, useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import {
  getAllRoles,
  createNewUser,
} from "../../../services/userService/userService";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: null,
  });

  const navigate = useNavigate();

  /* ================= Fetch Roles ================= */
  useEffect(() => {
    const fetchRoles = async () => {
      const res = await getAllRoles();
      if (res?.success) {
        setRoles(
          res.data.map((r) => ({
            label: r.name,
            value: r.id,
          }))
        );
      }
    };
    fetchRoles();
  }, []);

  /* ================= Input Change ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= Validation ================= */
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!formData.password.trim()) {
      toast.error("Password is required");
      return false;
    }

    if (!formData.role) {
      toast.error("Please select a role");
      return false;
    }

    return true;
  };

  /* ================= Submit ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const res = await createNewUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role.value, // send only ID
    });
        
    setLoading(false);


    if (res?.success) {
      toast.success("User created successfully");
      navigate("/user")
    }
  };

  const isDisabled =
    loading ||
    !formData.name ||
    !formData.email ||
    !formData.password ||
    !formData.role;

  return (
    <div className="min-h-screen bg-fleet-bg flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-fleet-border p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-fleet-text-primary">
            Create User
          </h1>
          <p className="text-sm text-fleet-text-secondary mt-1">
            Add a new user and assign a role
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />

          {/* Role Select */}
          <div>
            <label className="block text-sm font-medium text-fleet-text-primary mb-1">
              User Role
            </label>

            <Select
              options={roles}
              value={formData.role}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  role: selected,
                }))
              }
              placeholder="Select role"
              isSearchable={false}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isDisabled}
            className="w-full rounded-lg bg-fleet-primary py-2.5 text-white font-medium
            hover:bg-fleet-primary-dark transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ================= Reusable Input ================= */
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-fleet-text-primary mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full rounded-lg border border-fleet-border px-3 py-2 text-sm
      focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-fleet-primary"
    />
  </div>
);

export default AddUser;
