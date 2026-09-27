
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  geDriverDetailById,
  updateDriverById,
} from "../../../services/driverService/driverService";
import { uploadDocument } from "../../../services/document/DocumentService";
import { toast } from "react-hot-toast";
import UploadModal from "../../../component/common/UploadModal";

const UpdateDriver = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [editDocId, setEditDocId] = useState(null);
  const [apiUrl, setApiUrl] = useState("");

  // ============================================
  // DRIVER FORM DATA
  // ============================================

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

  const generateDriverCode = (phone, name) => {
    const phonePart = String(phone || "")
      .replace(/\D/g, "")
      .slice(0, 5);

    const namePart = String(name || "")
      .trim()
      .replace(/\s+/g, "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase();

    if (!phonePart || !namePart) {
      return "";
    }

    return `DRV-${phonePart}-${namePart}`;
  };

  // ============================================
  // DOCUMENT FORM
  // ============================================

  const [docForm, setDocForm] = useState({
    document_group: "",
    document_type: "",
    file: null,
  });

  // ============================================
  // FETCH DRIVER DETAILS
  // ============================================

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        setLoading(true);

        const res = await geDriverDetailById(id);

        if (!res?.success) {
          toast.error(res?.message || "Failed to fetch driver details");
          navigate("/drivers");
          return;
        }

        const admin = res.data?.admin || {};
        const driver = res.data?.driverProfile || {};

        setFormData({
          // ============================================
          // BASIC DETAILS
          // ============================================

          driver_code:
            driver?.driver_code ||
            generateDriverCode(
              driver?.phone_number || admin?.phone,
              driver?.name
            ),
          driver_category: driver?.driver_category || "",
          name: driver?.name || "",
          date_of_birth:
            driver?.date_of_birth?.split("T")[0] || "",

          // ============================================
          // IDENTITY
          // ============================================

          aadhaar_number: driver?.aadhaar_number || "",
          pan_number: driver?.pan_number || "",

          // ============================================
          // CONTACT
          // ============================================

          phone_number:
            driver?.phone_number || admin?.phone || "",

          home_phone_number:
            driver?.home_phone_number || "",

          email_address:
            driver?.email_address || admin?.email || "",

          password: "",

          // ============================================
          // ADDRESS
          // ============================================

          address_line_1:
            driver?.address_line_1 || "",

          address_line_2:
            driver?.address_line_2 || "",

          city_town_village_name:
            driver?.city_town_village_name || "",

          state_province_region_name:
            driver?.state_province_region_name || "",

          country_name:
            driver?.country_name || "India",

          pin_code:
            driver?.pin_code || "",

          // ============================================
          // LICENSE
          // ============================================

          driver_license_number:
            driver?.driver_license_number || "",

          license_issue_date:
            driver?.license_issue_date?.split("T")[0] || "",

          driver_license_expiry_date:
            driver?.driver_license_expiry_date?.split("T")[0] || "",

          // ============================================
          // OTHER
          // ============================================

          remarks:
            driver?.remarks || "",
        });

        setDocuments(res.documents || []);
        setApiUrl(res.api || "");
      } catch (error) {
        console.error("Fetch Driver Error:", error);

        toast.error(
          error?.response?.data?.message ||
          "Failed to fetch driver details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, [id, navigate]);

  // ============================================
  // HANDLE INPUT CHANGE
  // ============================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================
  // HANDLE DRIVER UPDATE
  // ============================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    // ============================================
    // BASIC VALIDATION
    // ============================================

    if (!formData.driver_category) {
      toast.error("Driver category is required");
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

    if (
      formData.home_phone_number &&
      !/^[0-9]{10}$/.test(formData.home_phone_number)
    ) {
      toast.error(
        "Home phone number must contain exactly 10 digits"
      );
      return;
    }

    if (
      formData.pin_code &&
      !/^[0-9]{6}$/.test(formData.pin_code)
    ) {
      toast.error("PIN code must contain exactly 6 digits");
      return;
    }

    if (
      formData.pan_number &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(
        formData.pan_number.toUpperCase()
      )
    ) {
      toast.error("Enter a valid PAN number");
      return;
    }

    if (
      formData.password &&
      /\s/.test(formData.password)
    ) {
      toast.error("Password must not contain spaces");
      return;
    }

    // ============================================
    // UPDATE
    // ============================================

    try {
      setSaving(true);

      const payload = {
        ...formData,

        driver_code:
          formData.driver_code || null,

        pan_number:
          formData.pan_number
            ? formData.pan_number.toUpperCase()
            : null,

        home_phone_number:
          formData.home_phone_number || null,

        email_address:
          formData.email_address || null,

        address_line_1:
          formData.address_line_1 || null,

        address_line_2:
          formData.address_line_2 || null,

        city_town_village_name:
          formData.city_town_village_name || null,

        state_province_region_name:
          formData.state_province_region_name || null,

        country_name:
          formData.country_name || null,

        pin_code:
          formData.pin_code || null,

        driver_license_number:
          formData.driver_license_number || null,

        license_issue_date:
          formData.license_issue_date || null,

        driver_license_expiry_date:
          formData.driver_license_expiry_date || null,

        remarks:
          formData.remarks || null,

        password:
          formData.password || undefined,
      };

      const res = await updateDriverById(payload, id);

      if (res?.success) {
        toast.success("Driver updated successfully");
      } else {
        toast.error(
          res?.message || "Failed to update driver"
        );
      }
    } catch (error) {
      console.error("Update Driver Error:", error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to update driver"
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // UPLOAD DOCUMENT
  // ============================================

  const handleUpload = async () => {
    if (
      !docForm.document_group ||
      !docForm.document_type ||
      !docForm.file
    ) {
      return toast.error("All fields are required");
    }

    try {
      const fd = new FormData();

      fd.append("entity_type", "Driver");
      fd.append("entity_id", id);
      fd.append(
        "document_group",
        docForm.document_group
      );
      fd.append(
        "document_type",
        docForm.document_type
      );
      fd.append("document", docForm.file);

      if (editDocId) {
        fd.append("document_id", editDocId);
      }

      const res = await uploadDocument(fd);

      if (res?.success) {
        toast.success("Document uploaded");

        setShowModal(false);
        setEditDocId(null);

        setDocForm({
          document_group: "",
          document_type: "",
          file: null,
        });

        const updated =
          await geDriverDetailById(id);

        setDocuments(updated?.documents || []);
      } else {
        toast.error(
          res?.message || "Failed to upload document"
        );
      }
    } catch (error) {
      console.error("Upload Document Error:", error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to upload document"
      );
    }
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgb(245,247,250)]">
        <p className="text-sm text-slate-500">
          Loading driver details...
        </p>
      </div>
    );
  }

  // ============================================
  // UI
  // ============================================

  return (
    <div className="min-h-screen bg-[rgb(245,247,250)] p-8">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Edit Driver
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Update driver information and documents
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2 rounded-xl text-sm font-medium text-white
          bg-linear-to-r from-fleet-primary to-fleet-accent
          shadow-md hover:scale-[1.02] transition"
        >
          Upload Document
        </button>

      </div>

      {/* ========================================
          DRIVER FORM
      ======================================== */}

      <form
        onSubmit={handleUpdate}
        className="bg-white rounded-2xl border border-slate-200 p-8 mb-10"
      >

        {/* ========================================
            BASIC DETAILS
        ======================================== */}

        <SectionTitle
          title="Basic Details"
          description="Driver's basic information"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

          <Field
            label="Driver Code"
            name="driver_code"
            value={formData.driver_code}
            onChange={handleChange}
            placeholder="Driver code"
            readOnly
          />

          <SelectField
            label="Driver Category"
            name="driver_category"
            value={formData.driver_category}
            onChange={handleChange}
            required
            options={[
              {
                value: "DRIVER_1",
                label: "Driver 1",
              },
              {
                value: "DRIVER_2",
                label: "Driver 2",
              },
              {
                value: "CLEANER",
                label: "Cleaner",
              },
              {
                value: "HELPER",
                label: "Helper",
              },
            ]}
          />

          <Field
            label="Driver Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter driver name"
            required
          />

          <DateField
            label="Date of Birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            max={
              new Date()
                .toISOString()
                .split("T")[0]
            }
            required
          />

        </div>

        {/* ========================================
            IDENTITY DETAILS
        ======================================== */}

        <SectionTitle
          title="Identity Details"
          description="Government identity information"
          className="mt-10"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

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
            style={{
              textTransform: "uppercase",
            }}
          />

        </div>

        {/* ========================================
            CONTACT DETAILS
        ======================================== */}

        <SectionTitle
          title="Contact Details"
          description="Driver contact and login information"
          className="mt-10"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

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
            label="New Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
          />

        </div>

        {/* ========================================
            ADDRESS
        ======================================== */}

        <SectionTitle
          title="Address"
          description="Driver's current residential address"
          className="mt-10"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

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

        {/* ========================================
            DRIVING LICENSE
        ======================================== */}

        <SectionTitle
          title="Driving License"
          description="License information"
          className="mt-10"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

          <Field
            label="License Number"
            name="driver_license_number"
            value={formData.driver_license_number}
            onChange={handleChange}
            placeholder="Enter license number"
          />

          <DateField
            label="License Issue Date"
            name="license_issue_date"
            value={formData.license_issue_date}
            onChange={handleChange}
            max={
              new Date()
                .toISOString()
                .split("T")[0]
            }
          />

          <DateField
            label="License Expiry Date"
            name="driver_license_expiry_date"
            value={
              formData.driver_license_expiry_date
            }
            onChange={handleChange}
            min={
              new Date()
                .toISOString()
                .split("T")[0]
            }
          />

        </div>

        {/* ========================================
            REMARKS
        ======================================== */}

        <SectionTitle
          title="Additional Information"
          description="Optional notes about the driver"
          className="mt-10"
        />

        <div className="mt-6">

          <label className="text-xs font-medium uppercase tracking-wide text-fleet-text-muted">
            Remarks
          </label>

          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Enter any additional remarks"
            rows={4}
            className="mt-2 w-full rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700
            border border-slate-200
            focus:outline-none focus:ring-0 focus:border-slate-300
            transition resize-none"
          />

        </div>

        {/* ========================================
            ACTION
        ======================================== */}

        <div className="flex justify-end gap-4 mt-10 pt-8 border-t border-slate-100">

          <button
            type="button"
            onClick={() => navigate("/drivers")}
            disabled={saving}
            className="h-11 px-7 rounded-xl
            border border-slate-200
            bg-white text-slate-600
            text-sm font-medium
            hover:bg-slate-50
            transition
            disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="h-11 px-8 rounded-xl
            bg-slate-900 text-white
            text-sm font-medium
            hover:bg-slate-800
            active:scale-[0.98]
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </form>

      {/* ========================================
          DOCUMENTS SECTION
      ======================================== */}

      <div className="mt-10">

        <div className="flex items-center justify-between mb-4">

          <h3 className="text-base font-semibold text-gray-800">

            Documents

            <span className="ml-2 text-xs font-medium text-gray-500">
              ({documents.length})
            </span>

          </h3>

        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">

          <table className="w-full text-sm">

            <thead className="bg-gray-50 border-b">

              <tr>

                <th className="px-5 py-3 text-left font-semibold text-gray-600">
                  Document Group
                </th>

                <th className="px-5 py-3 text-left font-semibold text-gray-600">
                  Document Type
                </th>

                <th className="px-5 py-3 text-left font-semibold text-gray-600">
                  Status
                </th>

                <th className="px-5 py-3 text-right font-semibold text-gray-600">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {documents.length === 0 && (
                <tr>

                  <td
                    colSpan="4"
                    className="px-5 py-10 text-center text-gray-400"
                  >
                    No documents uploaded yet
                  </td>

                </tr>
              )}

              {documents.map((doc) => (

                <tr
                  key={doc.id}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >

                  <td className="px-5 py-4 font-medium text-gray-800">
                    {doc.document_group}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {doc.document_type}
                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold
                      ${doc.status === "VERIFIED"
                          ? "bg-green-100 text-green-700"
                          : doc.status === "REJECTED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {doc.status}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex justify-end gap-4">

                      {/* VIEW */}

                      <button
                        type="button"
                        onClick={() =>
                          window.open(
                            `${apiUrl}${doc.file_url}`,
                            "_blank"
                          )
                        }
                        className="text-indigo-600 font-medium hover:text-indigo-800 transition"
                      >
                        View
                      </button>

                      {/* RE-UPLOAD */}

                      {doc.status === "rejected" && (

                        <button
                          type="button"
                          onClick={() => {

                            setEditDocId(doc.id);

                            setDocForm({
                              document_group:
                                doc.document_group,

                              document_type:
                                doc.document_type,

                              file: null,
                            });

                            setShowModal(true);
                          }}
                          className="text-red-600 font-medium hover:text-red-800 transition"
                        >
                          Re-Upload
                        </button>

                      )}

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* ========================================
          UPLOAD MODAL
      ======================================== */}

      {showModal && (

        <UploadModal
          docForm={docForm}
          setDocForm={setDocForm}
          onClose={() => {
            setShowModal(false);
            setEditDocId(null);

            setDocForm({
              document_group: "",
              document_type: "",
              file: null,
            });
          }}
          onSave={handleUpload}
          edit={!!editDocId}
        />

      )}

    </div>
  );
};

// ============================================
// SECTION TITLE
// ============================================

const SectionTitle = ({
  title,
  description,
  className = "",
}) => (
  <div
    className={`border-b border-slate-100 pb-3 ${className}`}
  >
    <h2 className="text-lg font-semibold text-fleet-text-primary">
      {title}
    </h2>

    <p className="mt-1 text-sm text-fleet-text-secondary">
      {description}
    </p>
  </div>
);

// ============================================
// FIELD
// ============================================

const Field = ({
  label,
  required = false,
  ...props
}) => (
  <div className="flex flex-col gap-1">

    <label className="text-xs font-medium uppercase tracking-wide text-fleet-text-muted">
      {label}

      {required && (
        <span className="ml-1 text-red-500">
          *
        </span>
      )}
    </label>

    <input
      {...props}
      required={required}
      className="h-11 rounded-xl bg-slate-50 px-4 text-sm text-slate-700
      border border-slate-200
      focus:outline-none focus:ring-0 focus:border-slate-300
      transition
      disabled:cursor-not-allowed
      disabled:opacity-60"
    />

  </div>
);

// ============================================
// SELECT FIELD
// ============================================

const SelectField = ({
  label,
  required = false,
  options = [],
  ...props
}) => (
  <div className="flex flex-col gap-1">

    <label className="text-xs font-medium uppercase tracking-wide text-fleet-text-muted">
      {label}

      {required && (
        <span className="ml-1 text-red-500">
          *
        </span>
      )}
    </label>

    <select
      {...props}
      required={required}
      className="h-11 rounded-xl bg-slate-50 px-4 text-sm text-slate-700
      border border-slate-200
      focus:outline-none focus:ring-0 focus:border-slate-300
      transition"
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

// ============================================
// DATE FIELD
// ============================================

const DateField = ({
  label,
  required = false,
  ...props
}) => (
  <div className="flex flex-col gap-1">

    <label className="text-xs font-medium uppercase tracking-wide text-fleet-text-muted">
      {label}

      {required && (
        <span className="ml-1 text-red-500">
          *
        </span>
      )}
    </label>

    <input
      type="date"
      {...props}
      required={required}
      className="h-11 rounded-xl bg-slate-50 px-4 text-sm text-slate-700
      border border-slate-200
      focus:outline-none focus:ring-0 focus:border-slate-300
      transition"
    />

  </div>
);

export default UpdateDriver;

