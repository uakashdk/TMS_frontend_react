import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAllCompanies,
  getMyCompanies,
  getCompanyDetailsById,
  statusVerification,
  DeleteCompany,
} from "../../../services/companiesService/companiesService";

import { DocumentStatus } from "../../../services/document/DocumentService.js"

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [status, setStatus] = useState("PENDING");
  const [documents, setDocuments] = useState([]);
  const [baseURL, setBaseURL] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const role = user?.role;

  const navigate = useNavigate();

  useEffect(() => {
    if (!role) return;
    fetchCompanies();
  }, [role]);

  // ================= FETCH COMPANIES =================
  const fetchCompanies = async () => {
    setLoading(true);

    let response;
    if (role === "super-admin") {
      response = await getAllCompanies();
    } else if (role === "company-admin") {
      response = await getMyCompanies();
    }

    if (response?.success) {
      setCompanies(response.data || []);
    }

    setLoading(false);
  };

  // ================= FETCH SINGLE COMPANY =================
  const fetchCompany = async (companyId) => {
    const res = await getCompanyDetailsById(companyId);

    if (res?.success) {
      setCompanyDetails(res.data);
      setDocuments(res.documents || []);
      setBaseURL(res.URL);
      setStatus(res.data.status || "PENDING");
    }
  };


  // ================= DELETE HANDLER =================
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Do you really want to delete?"
    );

    if (confirmDelete) {
      await DeleteCompany(selectedCompanyId);
      setIsSidebarOpen(false);
      fetchCompanies();
    }
  };

  const handleDocumentStatusChange = async (documentId, newStatus) => {
    console.log("documentId===================>", documentId, "new status==================>", newStatus)
    await DocumentStatus(documentId, newStatus);

    // Update UI after success
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId ? { ...doc, status: newStatus } : doc
      )
    );
  };

  const confirmDeleteCompany = async () => {
    await DeleteCompany(selectedCompanyId);
    setIsDeleteModalOpen(false);
    setIsSidebarOpen(false);
    fetchCompanies();
  };



  return (
    <div className="min-h-screen bg-fleet-bg p-6">
      <div className="mx-auto max-w-7xl rounded-lg bg-fleet-card shadow-sm">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h1 className="text-lg font-semibold">Companies</h1>
            <p className="text-sm text-gray-500">
              Manage registered companies
            </p>
          </div>

          {role === "super-admin" && (
            <button
              onClick={() => navigate("/add-new-company")}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Company
            </button>
          )}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                {[
                  "Company Name",
                  "Company Code",
                  "Email",
                  "Contact Person",
                  "Status",
                  "Action",
                ].map((head) => (
                  <th key={head} className="px-6 py-3 text-left text-xs font-semibold">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    Loading...
                  </td>
                </tr>
              ) : companies.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    No companies found
                  </td>
                </tr>
              ) : (
                companies.map((company) => (
                  <tr key={company.id} className="border-t">
                    <td className="px-6 py-4">{company.name}</td>
                    <td className="px-6 py-4">{company.company_code}</td>
                    <td className="px-6 py-4">{company.company_email}</td>
                    <td className="px-6 py-4">
                      {company.contact_person || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {company.status}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      {role === "super-admin" && (
                        <button
                          onClick={() => {
                            setSelectedCompanyId(company.id);
                            setIsSidebarOpen(true);
                            fetchCompany(company.id);
                          }}
                          className="border px-2 py-1 rounded"
                        >
                          👁
                        </button>
                      )}

                      <button
                        onClick={() =>
                          navigate(`/update-company/${company.id}`)
                        }
                        className="border px-2 py-1 rounded"
                      >
                        ✏
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCompanyId(company.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="flex items-center gap-2 text-red-600"
                      >
                        🗑 Delete Company
                      </button>


                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-100 p-6 shadow-2xl border">
            <h3 className="text-lg font-semibold text-red-600 mb-3">
              Delete Company
            </h3>

            <p className="text-sm text-gray-700 mb-6">
              Do you really want to delete this company?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteCompany}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}





      {/* ================= SIDEBAR ================= */}
      {isSidebarOpen && companyDetails && (
        <div className="fixed top-0 right-0 h-full w-100 bg-white shadow-lg p-6 z-50">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Company Details</h2>
            <button onClick={() => setIsSidebarOpen(false)}>✖</button>
          </div>

          {/* DETAILS TABLE */}
          <table className="w-full text-sm mb-6">
            <tbody>
              <tr>
                <td className="font-medium">Company Name</td>
                <td>{companyDetails.name}</td>
              </tr>
              <tr>
                <td className="font-medium">Company Code</td>
                <td>{companyDetails.company_code}</td>
              </tr>
              <tr>
                <td className="font-medium">Address</td>
                <td>{companyDetails.address || "-"}</td>
              </tr>
            </tbody>
          </table>

          {/* DOCUMENTS TABLE */}
          {documents.length > 0 && (
            <div className="mt-6">
              <h3 className="text-md font-semibold mb-3">Company Documents</h3>

              <table className="w-full text-sm border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2 text-left">Entity Type</th>
                    <th className="border px-3 py-2 text-left">Document Group</th>
                    <th className="border px-3 py-2 text-left">URL</th>
                    <th className="border px-3 py-2 text-left">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {documents.map((doc) => {
                    const documentURL = `${baseURL}${doc.file_url}`;

                    return (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="border px-3 py-2">{doc.entity_type}</td>

                        <td className="border px-3 py-2">
                          {doc.document_group || "-"}
                        </td>

                        <td className="border px-3 py-2">
                          <a
                            href={documentURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View Document
                          </a>
                        </td>

                        <td className="border px-3 py-2">
                          <select
                            value={doc.status}
                            onChange={(e) =>
                              handleDocumentStatusChange(doc.id, e.target.value)
                            }
                            className="border rounded px-2 py-1"
                          >
                            <option value="PENDING">Pending</option>
                            <option value="VERIFIED">Verified</option>
                            <option value="REJECTED">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Companies;

