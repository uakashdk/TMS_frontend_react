import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";
import { userList, getUserDetailsById } from "../../../services/userService/userService";
// adjust path if needed
import { DocumentUsers } from "../../../services/document/DocumentService"
import Select from "react-select";
import { useSelector } from "react-redux";

const statusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "VERIFIED", label: "Verified" },
  { value: "REJECTED", label: "Rejected" },
];
const UserList = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [docForm, setDocForm] = useState({
    document_group: "",
    document_type: "",
    file: null,
  });
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [apiUrl, setApiUrl] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const roleColorMap = {
    "Company Admin": "bg-blue-100 text-blue-700",
    "Operational Manager": "bg-orange-100 text-orange-700",
    "Accounts Manager": "bg-green-100 text-green-700",
    "Support Manager": "bg-purple-100 text-purple-700",
    "Driver": "bg-emerald-100 text-emerald-700",
  };

  const canVerify =
    currentUserRole === "Company-Admin" ||
    currentUserRole === "super-admin";


  const fetchUsers = async (searchText = "", pageNo = 1) => {
    setLoading(true);

    const res = await userList(searchText, pageNo);

    if (res?.success) {
      setUsers(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    }

    setLoading(false);
  };



  useEffect(() => {
    fetchUsers(search, page);
  }, [search, page]);



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

  useEffect(() => {
    if (!selectedUserId) return;

    const fetchUserDetails = async () => {
      const res = await getUserDetailsById(selectedUserId);

      if (res?.success) {
        setUserDetails(res.data);
        setDocuments(res.documents || []);
        setApiUrl(res.api || "");
      }
    };

    fetchUserDetails();
  }, [selectedUserId]);


  return (
    <div className="min-h-screen bg-fleet-bg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-fleet-text-primary">
          User List
        </h1>

        <button
          onClick={() => navigate("/AddUser")}
          className="rounded-md bg-fleet-primary px-5 py-2 text-sm font-medium text-white hover:bg-(--color-fleet-primary-dark) transition"
        >
          + Add User
        </button>
      </div>
      <div className="mb-4">
        <div className="relative w-full max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m1.85-5.4a7.25 7.25 0 11-14.5 0 7.25 7.25 0 0114.5 0z"
            />
          </svg>

          <input
            type="text"
            placeholder="Search users by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
        w-full rounded-lg border border-(--color-fleet-border)
        bg-white py-2.5 pl-10 pr-4 text-sm
        text-fleet-text-primary
        placeholder:text-gray-400
        focus:border-fleet-primary
        focus:outline-none
        focus:ring-2 focus:ring-fleet-primary/20
        transition
      "
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-xl bg-fleet-card shadow-sm border border-(--color-fleet-border)">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-fleet-table-header-bg">
              <th className="px-4 py-3 text-left text-sm font-semibold text-(--color-fleet-table-header-text)">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-(--color-fleet-table-header-text)">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-(--color-fleet-table-header-text)">
                Phone Number
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-(--color-fleet-table-header-text)">
                Role
              </th>

              <th className="px-4 py-3 text-center text-sm font-semibold text-(--color-fleet-table-header-text)">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="4" className="py-6 text-center text-sm text-gray-500">
                  Loading users...
                </td>
              </tr>
            )}

            {!loading && users.length === 0 && (
              <tr>
                <td colSpan="4" className="py-6 text-center text-sm text-gray-500">
                  No users found
                </td>
              </tr>
            )}

            {!loading &&
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-(--color-fleet-border) hover:bg-fleet-table-row-hover transition"
                >
                  <td className="px-4 py-3 text-sm text-fleet-text-primary">
                    {user.username}
                  </td>

                  <td className="px-4 py-3 text-sm text-fleet-text-secondary">
                    {user.email}
                  </td>

                  <td className="px-4 py-3 text-sm text-fleet-text-secondary">
                    {user.phone}
                  </td>
                  <td className="px-4 py-3 text-sm text-fleet-text-primary">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.username}</span>

                      {user.role?.name && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${roleColorMap[user.role.name] || "bg-gray-100 text-gray-600"
                            }`}
                        >
                          {user.role.name}
                        </span>
                      )}
                    </div>
                  </td>


                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-3">
                      {/* View (sidebar later) */}
                      <button
                        title="View User"
                        className="rounded-md p-2 text-fleet-primary hover:bg-blue-50 transition"
                        onClick={() => setSelectedUserId(user.id)}

                      >
                        <Eye size={18} />
                      </button>



                      {/* Edit */}
                      <button
                        title="Edit User"
                        className="rounded-md p-2 text-fleet-accent hover:bg-orange-50 transition"
                        onClick={() => navigate(`/EditUser/${user.id}`)}
                      >
                        <Pencil size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Pagination (static for now) */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-(--color-fleet-border)">
          <p className="text-sm text-fleet-text-muted">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className={`px-3 py-1 text-sm border rounded-md ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-100"
                }`}
            >
              Prev
            </button>

            <button className="px-3 py-1 text-sm border rounded-md bg-fleet-primary text-white">
              {page}
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className={`px-3 py-1 text-sm border rounded-md ${page === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-slate-100"
                }`}
            >
              Next
            </button>
          </div>
        </div>

      </div>
      {selectedUserId && userDetails && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
          <div className="w-full max-w-md h-full bg-white shadow-2xl p-6 flex flex-col animate-slideInRight overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">User Details</h2>
              <button
                className="text-gray-500 hover:text-gray-900 transition"
                onClick={() => {
                  setSelectedUserId(null);
                  setUserDetails(null);
                  setDocuments([]);
                }}
              >
                ✕
              </button>
            </div>

            {/* User Info */}
            <div className="space-y-4 border-b border-gray-200 pb-4 mb-6">
              <div>
                <p className="text-xs text-gray-400">Name</p>
                <p className="text-sm font-medium text-gray-900">
                  {userDetails.username}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm font-medium text-gray-900">
                  {userDetails.email}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm font-medium text-gray-900">
                  {userDetails.phone}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Role</p>
                <span className="inline-block mt-1 rounded-full px-2 py-0.5 text-xs font-semibold bg-slate-100">
                  {userDetails.role?.name}
                </span>
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-800">
                Documents ({documents.length})
              </h3>

              {documents.length === 0 && (
                <p className="text-sm text-gray-400">No documents uploaded</p>
              )}

              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-xl border border-gray-200 p-4 bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {doc.document_type}
                      </p>
                      <p className="text-xs text-gray-400">
                        {doc.document_group}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        window.open(`${apiUrl}${doc.file_url}`, "_blank")
                      }
                      className="text-indigo-600 text-xs font-medium hover:underline"
                    >
                      View
                    </button>
                  </div>

                  {/* Status dropdown (only admin roles)
                  {canVerify && ( */}
                  <Select
                    options={statusOptions}
                    value={statusOptions.find(
                      (o) => o.value === doc.status
                    )}
                    onChange={async (opt) => {
                      await DocumentUsers(doc.id, opt.value);

                      // instant UI update
                      setDocuments((prev) =>
                        prev.map((d) =>
                          d.id === doc.id
                            ? { ...d, status: opt.value }
                            : d
                        )
                      );
                    }}
                    className="text-sm"
                  />
                  {/* )} */}

                  {/* {!canVerify && ( */}
                  <span className="inline-block mt-2 text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    {doc.status}
                  </span>
                  {/* )} */}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}



    </div>
  );
};

export default UserList;
