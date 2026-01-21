import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-hot-toast";

import {
  getUserDetailsById,
  UpdateUserById,
  getAllRoles,
} from "../../../services/userService/userService";

import { uploadDocument } from "../../../services/document/DocumentService"

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: null,
  });

  const [documents, setDocuments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editDocId, setEditDocId] = useState(null);
  const [apiUrl, setApiUrl] = useState("");

  const [docForm, setDocForm] = useState({
    document_group: "",
    document_type: "",
    file: null,
  });

  /* ================= LOAD ROLES ================= */
  useEffect(() => {
    const loadRoles = async () => {
      const res = await getAllRoles();
      const roleArray =
        Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];

      setRoles(
        roleArray.map((r) => ({
          value: r.id,
          label: r.name,
        }))
      );
    };
    loadRoles();
  }, []);

  /* ================= LOAD USER DETAILS + DOCUMENTS ================= */
  useEffect(() => {
    if (!userId || roles.length === 0) return;

    const loadUser = async () => {
      setLoading(true);

      const res = await getUserDetailsById(userId);

      const user = res?.data;
      const docs = res?.documents || [];
      const api = res?.api || "";

      if (user) {
        setFormData({
          name: user.username || "",
          email: user.email || "",
          phone: user.phone || "",
          password: "",
          role: roles.find((r) => r.value === user.role_id) || null,
        });

        setDocuments(docs);   // ✅ correct
        setApiUrl(api);       // ✅ store api url
      }

      setLoading(false);
    };

    loadUser();
  }, [userId, roles]);


  /* ================= INPUT HANDLER ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  /* ================= SUBMIT USER ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.role
    ) {
      return toast.error("All fields are required");
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role.value,
    };

    const res = await UpdateUserById(payload, userId);
    if (res) {
      toast.success("User updated");
      navigate("/users");
    }
  };

  /* ================= UPLOAD / REUPLOAD DOCUMENT ================= */
  const handleUpload = async () => {
    if (!docForm.document_group || !docForm.document_type || !docForm.file) {
      return toast.error("All fields are required");
    }

    const fd = new FormData();
    fd.append("entity_type", "USER");
    fd.append("entity_id", userId);
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

      const updated = await getUserDetailsById(userId);
      setDocuments(updated?.documents || []);
    }
  };

  return (
    <div className="min-h-screen bg-fleet-bg p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">Edit User</h2>
            <p className="text-sm text-gray-500">Update user & documents</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-fleet-primary text-white px-4 py-2 rounded-md text-sm"
          >
            Upload Document
          </button>
        </div>

        {/* ================= USER FORM ================= */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="input" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
          <input className="input" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          <input className="input" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
          <input className="input" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />

          <Select
            options={roles}
            value={formData.role}
            onChange={(v) => setFormData((p) => ({ ...p, role: v }))}
            placeholder="Select Role"
          />

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate(-1)} className="border px-4 py-2 rounded-md">
              Cancel
            </button>
            <button type="submit" className="bg-fleet-primary text-white px-5 py-2 rounded-md">
              Update User
            </button>
          </div>
        </form>

        {/* ================= DOCUMENT TABLE ================= */}
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
                          onClick={() =>
                            window.open(`${apiUrl}${doc.file_url}`, "_blank")
                          }
                          className="text-indigo-600 font-medium hover:text-indigo-800 transition"
                        >
                          View
                        </button>

                        {/* EDIT (REJECTED ONLY) */}
                        {doc.status === "REJECTED" && (
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

      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-96 rounded-xl p-6">
            <h3 className="font-semibold mb-4">
              {editDocId ? "Re-Upload Document" : "Upload Document"}
            </h3>

            <input
              className="input mb-3"
              placeholder="Document Group"
              value={docForm.document_group}
              onChange={(e) =>
                setDocForm({ ...docForm, document_group: e.target.value })
              }
            />
            <input
              className="input mb-3"
              placeholder="Document Type"
              value={docForm.document_type}
              onChange={(e) =>
                setDocForm({ ...docForm, document_type: e.target.value })
              }
            />
            <input
              type="file"
              onChange={(e) =>
                setDocForm({ ...docForm, file: e.target.files[0] })
              }
            />

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button
                onClick={handleUpload}
                className="bg-fleet-primary text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditUser;
