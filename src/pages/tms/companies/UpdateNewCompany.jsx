import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCompanyDetailsById, updateExistingCompany } from "../../../services/companiesService/companiesService";
import { uploadDocument } from "../../../services/document/DocumentService";
import { Plus } from "lucide-react";

const UpdateNewCompany = () => {
  const { companyId } = useParams();

  const [company, setCompany] = useState({});
  const [documents, setDocuments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [apiBaseUrl, setApiBaseUrl] = useState("");

  const [docForm, setDocForm] = useState({
    document_group: "",
    document_type: "",
    file: null,
  });

  useEffect(() => {
    if (companyId) fetchCompany();
  }, [companyId]);

  const fetchCompany = async () => {
    const res = await getCompanyDetailsById(companyId);
    if (res?.success) {
      setCompany(res.data);
      setApiBaseUrl(res.URL);
      setDocuments(res.documents || []);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("entity_type", "COMPANY");
    formData.append("entity_id", companyId);
    formData.append("document_group", docForm.document_group);
    formData.append("document_type", docForm.document_type);
    formData.append("document", docForm.file);

    const res = await uploadDocument(formData);
    if (res?.success) {
      setShowModal(false);
      setDocForm({ document_group: "", document_type: "", file: null });
      fetchCompany();
    }
  };

  const handleCompanyChange = (field, value) => {
    setCompany((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!company.address || !company.contact_person) {
      toast.error("Address and Contact Person are required");
      return;
    }

    const payload = {
      address: company.address,
      contact_person: company.contact_person,
    };

    // ⚠️ documentId is required by your API
    // If not applicable, pass null or first document id
    const documentId = documents?.[0]?.id || 0;

    const res = await updateExistingCompany(
      payload,
      companyId,
      documentId
    );

    if (res?.success) {
      toast.success("Company updated successfully");
      fetchCompany();
    }
  };



  return (
    <div className="p-8 bg-[#f4f6fb] min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm p-8">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Company Details
          </h2>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800"
          >
            <Plus size={18} /> Add Document
          </button>
        </div>

        {/* ================= FORM ================= */}
        <div className="grid grid-cols-2 gap-6">
          <FormInput label="Company Name" value={company.name} disabled />
          <FormInput label="Email" value={company.company_email} disabled />
          <FormInput label="Company Code" value={company.company_code} disabled />
          <FormInput
            label="Contact Person"
            value={company.contact_person || ""}
            onChange={(e) =>
              handleCompanyChange("contact_person", e.target.value)
            }
          />

          <div className="col-span-2">
            <FormInput
              label="Address"
              value={company.address || ""}
              onChange={(e) =>
                handleCompanyChange("address", e.target.value)
              }
            />

          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveChanges}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm"
          >
            Save Changes
          </button>

        </div>

        {/* ================= DOCUMENT TABLE ================= */}
        <div className="mt-10">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Documents Submitted ({documents.length})
          </h3>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3 text-left">Group</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-400">
                      No documents uploaded
                    </td>
                  </tr>
                ) : (
                  documents.map((doc) => (
                    <tr key={doc.id} className="border-t">
                      <td className="p-3">{doc.document_group}</td>
                      <td className="p-3">{doc.document_type}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${doc.status === "VERIFIED"
                            ? "bg-green-100 text-green-500"
                            : "bg-yellow-100 text-yellow-500"
                            }`}
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {/* <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600"
                        >
                          View
                        </a> */}
                        {console.log("company url ========>", company.URL)}
                        <a
                          href={`${apiBaseUrl.replace(/\/+$/, "")}/${doc.file_url.replace(/^\/+/, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:underline"
                        >
                          View
                        </a>

                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-105 rounded-xl p-6 shadow-lg">
            <h3 className="text-sm font-semibold mb-4">Upload Document</h3>

            <div className="space-y-4">
              <FormInput
                placeholder="Document Group (ADDRESS / GST)"
                onChange={(e) =>
                  setDocForm({ ...docForm, document_group: e.target.value })
                }
              />
              <FormInput
                placeholder="Document Type"
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
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button
                onClick={handleUpload}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
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

export default UpdateNewCompany;

/* ================= REUSABLE INPUT ================= */
const FormInput = ({ label, disabled, ...props }) => (
  <div>
    {label && (
      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
    )}
    <input
      disabled={disabled}
      {...props}
      className={`w-full px-3 py-2 rounded-lg border 
        ${disabled ? "bg-gray-100 text-gray-500" : "bg-white"}
        focus:outline-none focus:ring-2 focus:ring-indigo-500`}
    />
  </div>
);
