import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  geDriverDetailById,
  updateDriverById
} from "../../../services/driverService/driverService";
import { uploadDocument } from "../../../services/document/DocumentService";
import { toast } from "react-hot-toast";
import UploadModal from "../../../component/common/UploadModal";

const UpdateDriver = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [editDocId, setEditDocId] = useState(null);
  const [apiUrl, setApiUrl] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email_address: "",
    driver_license_number: "",
    driver_license_expiry_date: ""
  });

  const [docForm, setDocForm] = useState({
    document_group: "",
    document_type: "",
    file: null
  });

  // 🔹 Fetch driver details
  useEffect(() => {
    const fetchDriver = async () => {
      const res = await geDriverDetailById(id);

      if (res?.success) {
        const admin = res.data.admin;
        const driver = res.data.driverProfile;

        setFormData({
          name: driver?.name || "",
          phone_number: driver?.phone_number || admin.phone || "",
          email_address: driver?.email_address || admin.email || "",
          driver_license_number: driver?.driver_license_number || "",
          driver_license_expiry_date:
            driver?.driver_license_expiry_date?.split("T")[0] || ""
        });

        setDocuments(res.documents || []);
        setApiUrl(res.api || "");
      }
      setLoading(false);
    };

    fetchDriver();
  }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await updateDriverById(formData, id);
    if (res?.success) toast.success("Driver updated successfully");
  };

  // 🔹 Upload Document
  const handleUpload = async () => {
    if (!docForm.document_group || !docForm.document_type || !docForm.file) {
      return toast.error("All fields are required");
    }

    const fd = new FormData();
    fd.append("entity_type", "Driver");
    fd.append("entity_id", id);
    fd.append("document_group", docForm.document_group);
    fd.append("document_type", docForm.document_type);
    fd.append("document", docForm.file);
    if (editDocId) fd.append("document_id", editDocId);

    const res = await uploadDocument(fd);
    if (res?.success) {
      toast.success("Document uploaded");
      setShowModal(false);
      setEditDocId(null);
      setDocForm({ document_group: "", document_type: "", file: null });

      const updated = await geDriverDetailById(id);
      setDocuments(updated?.documents || []);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[rgb(245,247,250)] p-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Edit Driver
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2 rounded-xl text-sm font-medium text-white
          bg-linear-to-r from-fleet-primary to-fleet-accent
          shadow-md hover:scale-[1.02] transition"
        >
          Upload Document
        </button>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleUpdate}
        className="bg-white rounded-2xl border border-slate-200 p-8 mb-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Driver Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">
              Driver Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter driver name"
              className="h-11 rounded-xl bg-slate-50 px-4 text-sm text-slate-700
          border border-slate-200
          focus:outline-none focus:ring-0 focus:border-slate-300
          transition"
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">
              Phone Number
            </label>
            <input
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="h-11 rounded-xl bg-slate-50 px-4 text-sm text-slate-700
          border border-slate-200
          focus:outline-none focus:ring-0 focus:border-slate-300
          transition"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">
              Email Address
            </label>
            <input
              name="email_address"
              value={formData.email_address}
              onChange={handleChange}
              placeholder="Enter email address"
              className="h-11 rounded-xl bg-slate-50 px-4 text-sm text-slate-700
          border border-slate-200
          focus:outline-none focus:ring-0 focus:border-slate-300
          transition"
            />
          </div>

          {/* License Number */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">
              License Number
            </label>
            <input
              name="driver_license_number"
              value={formData.driver_license_number}
              onChange={handleChange}
              placeholder="Enter license number"
              className="h-11 rounded-xl bg-slate-50 px-4 text-sm text-slate-700
          border border-slate-200
          focus:outline-none focus:ring-0 focus:border-slate-300
          transition"
            />
          </div>

          {/* License Expiry */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">
              License Expiry Date
            </label>
            <input
              type="date"
              name="driver_license_expiry_date"
              value={formData.driver_license_expiry_date}
              onChange={handleChange}
              className="h-11 rounded-xl bg-slate-50 px-4 text-sm text-slate-700
          border border-slate-200
          focus:outline-none focus:ring-0 focus:border-slate-300
          transition"
            />
          </div>

        </div>

        {/* ACTION */}
        <div className="flex justify-end mt-10">
          <button
            type="submit"
            className="h-11 px-8 rounded-xl
        bg-slate-900 text-white text-sm font-medium
        hover:bg-slate-800
        active:scale-[0.98]
        transition"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* DOCUMENT TABLE */}
      {/* DOCUMENTS SECTION */}
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

                      {/* VIEW BUTTON – ALWAYS */}
                      <button
                        onClick={() =>
                          window.open(`${apiUrl}${doc.file_url}`, "_blank")
                        }
                        className="text-indigo-600 font-medium hover:text-indigo-800 transition"
                      >
                        View
                      </button>
                      {/* RE-UPLOAD – ONLY IF REJECTED */}
                      {doc.status === "rejected" && (
                        <button
                          onClick={() => {
                            setEditDocId(doc.id);
                            setDocForm({
                              document_group: doc.document_group,
                              document_type: doc.document_type,
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


      {/* MODAL */}
      {showModal && (
        <UploadModal
          docForm={docForm}
          setDocForm={setDocForm}
          onClose={() => setShowModal(false)}
          onSave={handleUpload}
          edit={!!editDocId}
        />
      )}
    </div>
  );
};

export default UpdateDriver;
